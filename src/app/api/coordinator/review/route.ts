import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkAndAwardBadges, calculateLevel } from "@/lib/gamification";

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

      // 1. Update contribution status
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

      // 2. Create audit XP Transaction
      await prisma.xpTransaction.create({
        data: {
          userId: contribution.userId,
          amount: xpToAward,
          reason: `Verified Contribution: "${contribution.title}"`,
          contributionId: contribution.id,
        },
      });

      // 3. Update User total XP and recalculate level
      const currentXp = contribution.user.totalXp + xpToAward;
      const newLevel = calculateLevel(currentXp);

      const updatedUser = await prisma.user.update({
        where: { id: contribution.userId },
        data: {
          totalXp: currentXp,
          currentLevel: newLevel,
        },
      });

      // 4. Update User Activity Streak
      const existingStreak = await prisma.userStreak.findUnique({
        where: { userId: contribution.userId },
      });

      let currentStreak = existingStreak?.currentStreak || 0;
      let longestStreak = existingStreak?.longestStreak || 0;
      const now = new Date();

      if (!existingStreak?.lastActivityAt) {
        currentStreak = 1;
      } else {
        const daysDiff = Math.floor((now.getTime() - existingStreak.lastActivityAt.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff === 1) {
          currentStreak += 1;
        } else if (daysDiff > 1) {
          currentStreak = 1;
        }
      }
      longestStreak = Math.max(longestStreak, currentStreak);

      await prisma.userStreak.upsert({
        where: { userId: contribution.userId },
        update: { currentStreak, longestStreak, lastActivityAt: now },
        create: { userId: contribution.userId, currentStreak, longestStreak, lastActivityAt: now },
      });

      // 5. Update Challenge Progress
      const activeChallenges = await prisma.challengeParticipant.findMany({
        where: { userId: contribution.userId, status: "in_progress" },
        include: { challenge: true },
      });

      for (const cp of activeChallenges) {
        const nextCount = cp.currentCount + 1;
        const nextXp = cp.currentXp + xpToAward;
        const isCompleted = nextCount >= cp.challenge.targetCount || nextXp >= cp.challenge.targetXp;

        await prisma.challengeParticipant.update({
          where: { id: cp.id },
          data: {
            currentCount: nextCount,
            currentXp: nextXp,
            status: isCompleted ? "completed" : "in_progress",
            completedAt: isCompleted ? new Date() : null,
          },
        });

        if (isCompleted && cp.challenge.bonusXp > 0) {
          await prisma.xpTransaction.create({
            data: {
              userId: contribution.userId,
              amount: cp.challenge.bonusXp,
              reason: `Challenge Completed Bonus: "${cp.challenge.title}"`,
            },
          });
          await prisma.user.update({
            where: { id: contribution.userId },
            data: { totalXp: { increment: cp.challenge.bonusXp } },
          });
        }
      }

      // 6. Check & Award Badges
      const newBadges = await checkAndAwardBadges(contribution.userId);

      // 7. Send Notification
      await prisma.notification.create({
        data: {
          userId: contribution.userId,
          type: "contribution_approved",
          title: "Contribution Verified! 🎉",
          message: `Your contribution "${contribution.title}" was approved (+${xpToAward} XP).`,
          linkUrl: "/dashboard",
        },
      });

      // 8. Create Audit Log
      await prisma.auditLog.create({
        data: {
          actorId: coordinator.id,
          action: "APPROVED_CONTRIBUTION",
          targetEntity: "contribution",
          targetId: contribution.id,
          payload: JSON.stringify({ xpAwarded: xpToAward, newBadges, newLevel }),
        },
      });

      return NextResponse.json({
        success: true,
        status: "verified",
        xpAwarded: xpToAward,
        newBadges,
        userTotalXp: updatedUser.totalXp,
        currentLevel: newLevel,
        currentStreak,
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

      await prisma.notification.create({
        data: {
          userId: contribution.userId,
          type: "clarification_requested",
          title: "Clarification Requested 💬",
          message: `Coordinator requested details on "${contribution.title}": ${reviewerNotes}`,
          linkUrl: "/contributions",
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

      await prisma.notification.create({
        data: {
          userId: contribution.userId,
          type: "contribution_rejected",
          title: "Contribution Status Update",
          message: `Your contribution "${contribution.title}" was marked as rejected: ${reviewerNotes || "See reviewer notes."}`,
          linkUrl: "/contributions",
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
