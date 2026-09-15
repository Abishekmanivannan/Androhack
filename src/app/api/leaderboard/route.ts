import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const timeframe = searchParams.get("timeframe") || "alltime"; // weekly, monthly, semester, alltime
    const category = searchParams.get("category") || "all";
    const mode = searchParams.get("mode") || "standard"; // standard, most_improved

    let startDate: Date | null = null;
    const now = new Date();

    if (timeframe === "weekly") {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeframe === "monthly") {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (timeframe === "semester") {
      startDate = new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000);
    }

    if (mode === "most_improved") {
      // 30-day velocity comparison
      const period1Start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const period2Start = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          department: true,
          totalXp: true,
          currentLevel: true,
        },
      });

      const p1Transactions = await prisma.xpTransaction.findMany({
        where: { createdAt: { gte: period1Start } },
      });

      const p2Transactions = await prisma.xpTransaction.findMany({
        where: { createdAt: { gte: period2Start, lt: period1Start } },
      });

      const mostImproved = users.map((u) => {
        const currentPeriodXp = p1Transactions
          .filter((t) => t.userId === u.id)
          .reduce((sum, t) => sum + t.amount, 0);

        const priorPeriodXp = p2Transactions
          .filter((t) => t.userId === u.id)
          .reduce((sum, t) => sum + t.amount, 0);

        const delta = currentPeriodXp - priorPeriodXp;

        return {
          ...u,
          currentPeriodXp,
          priorPeriodXp,
          delta,
        };
      });

      mostImproved.sort((a, b) => b.delta - a.delta);

      return NextResponse.json({ leaderboard: mostImproved, mode: "most_improved" });
    }

    // Standard Leaderboard
    if (timeframe === "alltime" && category === "all") {
      const leaderboard = await prisma.user.findMany({
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
          _count: {
            select: { contributions: { where: { status: "verified" } } },
          },
        },
        orderBy: { totalXp: "desc" },
        take: 50,
      });

      return NextResponse.json({ leaderboard, mode: "standard", timeframe });
    }

    // Timeframe or Category filtered aggregation
    const whereClause: Record<string, unknown> = {};
    if (startDate) whereClause.createdAt = { gte: startDate };
    if (category !== "all") {
      const cat = await prisma.category.findUnique({ where: { name: category } });
      if (cat) {
        whereClause.contribution = { categoryId: cat.id };
      }
    }

    const txs = await prisma.xpTransaction.findMany({
      where: whereClause,
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
            userBadges: { include: { badge: true } },
          },
        },
      },
    });

    const xpMap = new Map<string, { user: unknown; periodXp: number }>();
    for (const t of txs) {
      const existing = xpMap.get(t.userId);
      if (existing) {
        existing.periodXp += t.amount;
      } else {
        xpMap.set(t.userId, { user: t.user, periodXp: t.amount });
      }
    }

    const aggregated = Array.from(xpMap.values())
      .map((item) => ({
        ...(item.user as Record<string, unknown>),
        periodXp: item.periodXp,
      }))
      .sort((a, b) => b.periodXp - a.periodXp);

    return NextResponse.json({ leaderboard: aggregated, mode: "standard", timeframe, category });
  } catch (error) {
    console.error("Leaderboard GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
