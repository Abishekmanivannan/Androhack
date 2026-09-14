import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkAndAwardBadges } from "@/lib/gamification";

export async function POST(req: Request) {
  try {
    const coordinator = await getCurrentUser();
    if (!coordinator || (coordinator.role !== "coordinator" && coordinator.role !== "admin")) {
      return NextResponse.json({ error: "Forbidden: Coordinator access required" }, { status: 403 });
    }

    const { contributionId, action, pointsAwarded, reviewerNotes } = await req.json();

    if (!contributionId || !["approve", "clarification", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action parameters" }, { status: 400 });
    }

    const contribution = await prisma.contribution.findUnique({
      where: { id: contributionId },
      include: { user: true, category: true },
    });

    if (!contribution) {
      return NextResponse.json({ error: "Contribution not found" }, { status: 404 });
    }

    if (action === "approve") {
      const xpToAward = typeof pointsAwarded === "number" ? pointsAwarded : contribution.category.baseXp;

      await prisma.contribution.update({
        where: { id: contributionId },
        data: {
          status: "verified",
          pointsAwarded: xpToAward,
          reviewerId: coordinator.id,
          reviewerNotes: reviewerNotes || "Approved",
          verifiedAt: new Date(),
        },
      });

      // Update user total XP
      const updatedUser = await prisma.user.update({
        where: { id: contribution.userId },
        data: {
          totalXp: { increment: xpToAward },
        },
      });

      // Check and award badges
      const newBadges = await checkAndAwardBadges(contribution.userId);

      // Audit Log
      await prisma.auditLog.create({
        data: {
          actorId: coordinator.id,
          action: "APPROVED_CONTRIBUTION",
          targetEntity: "contribution",
          targetId: contribution.id,
          payload: JSON.stringify({ xpAwarded: xpToAward, newBadges }),
        },
      });

      return NextResponse.json({
        success: true,
        status: "verified",
        xpAwarded: xpToAward,
        newBadges,
        userTotalXp: updatedUser.totalXp,
      });
    } else if (action === "clarification") {
      if (!reviewerNotes) {
        return NextResponse.json(
          { error: "Clarification notes are required when requesting details" },
          { status: 400 }
        );
      }

      await prisma.contribution.update({
        where: { id: contributionId },
        data: {
          status: "clarification",
          reviewerId: coordinator.id,
          reviewerNotes,
        },
      });

      await prisma.clarificationMessage.create({
        data: {
          contributionId,
          senderId: coordinator.id,
          message: reviewerNotes,
        },
      });

      await prisma.auditLog.create({
        data: {
          actorId: coordinator.id,
          action: "REQUESTED_CLARIFICATION",
          targetEntity: "contribution",
          targetId: contribution.id,
          payload: JSON.stringify({ question: reviewerNotes }),
        },
      });

      return NextResponse.json({ success: true, status: "clarification" });
    } else if (action === "reject") {
      await prisma.contribution.update({
        where: { id: contributionId },
        data: {
          status: "rejected",
          reviewerId: coordinator.id,
          reviewerNotes: reviewerNotes || "Rejection reason specified",
        },
      });

      await prisma.auditLog.create({
        data: {
          actorId: coordinator.id,
          action: "REJECTED_CONTRIBUTION",
          targetEntity: "contribution",
          targetId: contribution.id,
          payload: JSON.stringify({ reason: reviewerNotes }),
        },
      });

      return NextResponse.json({ success: true, status: "rejected" });
    }
  } catch (error) {
    console.error("Coordinator Review error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
