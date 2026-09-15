import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const filterInactive = searchParams.get("inactive") === "true";

    const members = await prisma.user.findMany({
      where: {
        OR: query
          ? [
              { name: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
              { department: { contains: query, mode: "insensitive" } },
              { skills: { hasSome: [query] } },
            ]
          : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        avatarUrl: true,
        skills: true,
        totalXp: true,
        currentLevel: true,
        portfolioPublic: true,
        createdAt: true,
        streak: { select: { currentStreak: true, lastActivityAt: true } },
        _count: { select: { contributions: { where: { status: "verified" } } } },
      },
      orderBy: { totalXp: "desc" },
    });

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const result = members.map((m) => {
      const isInactive = !m.streak?.lastActivityAt || new Date(m.streak.lastActivityAt) < thirtyDaysAgo;
      return {
        ...m,
        isInactive,
      };
    });

    const finalMembers = filterInactive ? result.filter((m) => m.isInactive) : result;

    return NextResponse.json({ members: finalMembers });
  } catch (error) {
    console.error("Members GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
