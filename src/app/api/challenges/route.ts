import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const challenges = await prisma.challenge.findMany({
      include: {
        category: true,
        participants: {
          where: { userId: user.id },
        },
        _count: {
          select: { participants: true },
        },
      },
      orderBy: { endDate: "asc" },
    });

    return NextResponse.json({ challenges });
  } catch (error) {
    console.error("Challenges GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "coordinator" && user.role !== "admin")) {
      return NextResponse.json({ error: "Forbidden: Coordinator permissions required" }, { status: 403 });
    }

    const { title, description, categoryId, targetCount, targetXp, bonusXp, startDate, endDate } = await req.json();

    if (!title || !description || !startDate || !endDate) {
      return NextResponse.json({ error: "Title, description, start date, and end date are required" }, { status: 400 });
    }

    const challenge = await prisma.challenge.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        categoryId: categoryId || null,
        targetCount: typeof targetCount === "number" ? targetCount : 1,
        targetXp: typeof targetXp === "number" ? targetXp : 100,
        bonusXp: typeof bonusXp === "number" ? bonusXp : 50,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    return NextResponse.json({ success: true, challenge });
  } catch (error) {
    console.error("Challenges POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
