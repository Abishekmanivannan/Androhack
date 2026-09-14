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

    const { id: eventId } = await params;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const participant = await prisma.eventParticipant.upsert({
      where: {
        eventId_userId: {
          eventId,
          userId: user.id,
        },
      },
      update: {
        status: "attended",
        checkedInAt: new Date(),
      },
      create: {
        eventId,
        userId: user.id,
        status: "attended",
        checkedInAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, participant });
  } catch (error) {
    console.error("Event check-in error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
