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
    const mode = searchParams.get("mode"); // heatmap, feed

    if (mode === "heatmap") {
      // 1-year contribution heatmap daily counts
      const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
      const userContribs = await prisma.contribution.findMany({
        where: {
          userId: user.id,
          createdAt: { gte: oneYearAgo },
        },
        select: { createdAt: true, status: true, pointsAwarded: true },
      });

      const countsByDate: Record<string, { count: number; points: number }> = {};
      for (const c of userContribs) {
        const dateStr = c.createdAt.toISOString().split("T")[0];
        if (!countsByDate[dateStr]) {
          countsByDate[dateStr] = { count: 0, points: 0 };
        }
        countsByDate[dateStr].count += 1;
        if (c.status === "verified") {
          countsByDate[dateStr].points += c.pointsAwarded;
        }
      }

      return NextResponse.json({ heatmap: countsByDate });
    }

    // Recognition Feed (Recent verified contributions, badge unlocks, project joins)
    const verifiedContribs = await prisma.contribution.findMany({
      where: { status: "verified" },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true, department: true } },
        category: true,
        project: { select: { name: true } },
      },
      orderBy: { verifiedAt: "desc" },
      take: 20,
    });

    const recentBadges = await prisma.userBadge.findMany({
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
        badge: true,
      },
      orderBy: { unlockedAt: "desc" },
      take: 10,
    });

    const feed = [
      ...verifiedContribs.map((c) => ({
        id: `contrib-${c.id}`,
        type: "contribution_verified",
        user: c.user,
        title: c.title,
        description: c.description,
        category: c.category.name,
        colorHex: c.category.colorHex,
        xpAwarded: c.pointsAwarded,
        projectName: c.project?.name || c.projectEventName,
        timestamp: c.verifiedAt || c.createdAt,
      })),
      ...recentBadges.map((b) => ({
        id: `badge-${b.id}`,
        type: "badge_unlocked",
        user: b.user,
        title: `Unlocked "${b.badge.name}" Badge!`,
        description: b.badge.description,
        category: "Achievement",
        colorHex: "#F59E0B",
        xpAwarded: b.badge.criteriaThreshold,
        projectName: null,
        timestamp: b.unlockedAt,
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({ feed });
  } catch (error) {
    console.error("Activity GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
