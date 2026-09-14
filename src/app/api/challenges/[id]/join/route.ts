import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: challengeId } = await params;

    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    const participant = await prisma.challengeParticipant.upsert({
      where: {
        challengeId_userId: {
          challengeId,
          userId: user.id,
        },
      },
      update: {},
      create: {
        challengeId,
        userId: user.id,
        status: "in_progress",
      },
    });

    return NextResponse.json({ success: true, participant });
  } catch (error) {
    console.error("Challenge Join error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
