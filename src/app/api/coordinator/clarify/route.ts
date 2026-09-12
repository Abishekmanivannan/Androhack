import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { contributionId, message } = await req.json();

    if (!contributionId || !message || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const contribution = await prisma.contribution.findUnique({
      where: { id: contributionId },
    });

    if (!contribution) {
      return NextResponse.json({ error: "Contribution not found" }, { status: 404 });
    }

    const newMessage = await prisma.clarificationMessage.create({
      data: {
        contributionId,
        senderId: user.id,
        message: message.trim(),
      },
      include: {
        sender: {
          select: { name: true, role: true, avatarUrl: true },
        },
      },
    });

    // If member replied, set status back to pending for review
    if (user.role === "member" && contribution.status === "clarification") {
      await prisma.contribution.update({
        where: { id: contributionId },
        data: { status: "pending" },
      });
    }

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Clarify endpoint error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
