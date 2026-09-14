import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const events = await prisma.event.findMany({
      include: {
        category: true,
        participants: {
          include: {
            user: {
              select: { id: true, name: true, avatarUrl: true },
            },
          },
        },
        _count: {
          select: { participants: true, contributions: true },
        },
      },
      orderBy: { eventDate: "asc" },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Events GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "coordinator" && user.role !== "admin")) {
      return NextResponse.json({ error: "Forbidden: Coordinator permissions required" }, { status: 403 });
    }

    const { title, description, eventDate, location, categoryId, baseXp } = await req.json();

    if (!title || !description || !eventDate) {
      return NextResponse.json({ error: "Title, description, and date are required" }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        eventDate: new Date(eventDate),
        location: location ? location.trim() : "Campus Main",
        categoryId: categoryId || null,
        baseXp: typeof baseXp === "number" ? baseXp : 40,
      },
    });

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error("Events POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
