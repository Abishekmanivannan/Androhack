import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "all-time"; // "weekly", "monthly", "semester", "all-time", "most-improved"

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        department: true,
        totalXp: true,
        currentLevel: true,
        userBadges: {
          include: { badge: true },
        },
        contributions: {
          where: { status: "verified" },
          select: {
            pointsAwarded: true,
            verifiedAt: true,
          },
        },
      },
    });

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const semesterStart = new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000);

    const leaderboard = users.map((u) => {
      let filteredXp = u.totalXp;
      let velocityDelta = 0;

      if (period === "weekly") {
        filteredXp = u.contributions
          .filter((c) => c.verifiedAt && new Date(c.verifiedAt) >= oneWeekAgo)
          .reduce((sum, c) => sum + c.pointsAwarded, 0);
      } else if (period === "monthly") {
        filteredXp = u.contributions
          .filter((c) => c.verifiedAt && new Date(c.verifiedAt) >= oneMonthAgo)
          .reduce((sum, c) => sum + c.pointsAwarded, 0);
      } else if (period === "semester") {
        filteredXp = u.contributions
          .filter((c) => c.verifiedAt && new Date(c.verifiedAt) >= semesterStart)
          .reduce((sum, c) => sum + c.pointsAwarded, 0);
      } else if (period === "most-improved") {
        const recentXp = u.contributions
          .filter((c) => c.verifiedAt && new Date(c.verifiedAt) >= oneWeekAgo)
          .reduce((sum, c) => sum + c.pointsAwarded, 0);
        const previousXp = u.contributions
          .filter(
            (c) =>
              c.verifiedAt &&
              new Date(c.verifiedAt) >= twoWeeksAgo &&
              new Date(c.verifiedAt) < oneWeekAgo
          )
          .reduce((sum, c) => sum + c.pointsAwarded, 0);
        velocityDelta = recentXp - previousXp;
        filteredXp = velocityDelta;
      }

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        avatarUrl: u.avatarUrl,
        department: u.department,
        totalXp: u.totalXp,
        periodXp: filteredXp,
        velocityDelta,
        currentLevel: u.currentLevel,
        badgeCount: u.userBadges.length,
        verifiedCount: u.contributions.length,
      };
    });

    leaderboard.sort((a, b) => b.periodXp - a.periodXp);

    return NextResponse.json({ period, leaderboard });
  } catch (error) {
    console.error("Leaderboard GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
