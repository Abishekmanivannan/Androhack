import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "coordinator" && user.role !== "admin")) {
      return NextResponse.json({ error: "Forbidden: Coordinator access required" }, { status: 403 });
    }

    const pendingQueue = await prisma.contribution.findMany({
      where: {
        status: { in: ["pending", "clarification"] },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            department: true,
            totalXp: true,
            currentLevel: true,
          },
        },
        category: true,
        clarificationMessages: {
          include: {
            sender: {
              select: { name: true, role: true, avatarUrl: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ queue: pendingQueue });
  } catch (error) {
    console.error("Coordinator Queue GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
