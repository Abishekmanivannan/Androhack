import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "coordinator" && user.role !== "admin")) {
      return NextResponse.json({ error: "Forbidden: Coordinator access required" }, { status: 403 });
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const totalMembers = await prisma.user.count();
    const activeStreaks = await prisma.userStreak.findMany({
      where: { lastActivityAt: { gte: thirtyDaysAgo } },
    });

    const activeMembersCount = activeStreaks.length;
    const inactiveMembersCount = Math.max(0, totalMembers - activeMembersCount);
    const activityRate = totalMembers > 0 ? Math.round((activeMembersCount / totalMembers) * 100) : 0;

    // Contributions breakdown
    const totalContributions = await prisma.contribution.count();
    const verifiedContributions = await prisma.contribution.count({ where: { status: "verified" } });
    const pendingContributions = await prisma.contribution.count({ where: { status: "pending" } });
    const rejectedContributions = await prisma.contribution.count({ where: { status: "rejected" } });

    // Category distribution
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { contributions: true } },
      },
    });

    const categoryDistribution = categories.map((c) => ({
      name: c.name,
      colorHex: c.colorHex,
      count: c._count.contributions,
      percentage: totalContributions > 0 ? Math.round((c._count.contributions / totalContributions) * 100) : 0,
    }));

    // XP Trend over last 30 days
    const recentXpTxs = await prisma.xpTransaction.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
    });
    const totalXp30Days = recentXpTxs.reduce((sum, t) => sum + t.amount, 0);

    // Natural Language Insights
    const insights: string[] = [];
    if (activityRate > 60) {
      insights.push(`High engagement: ${activityRate}% of club members have submitted contributions in the past 30 days.`);
    } else {
      insights.push(`Participation alert: Only ${activityRate}% of members were active in the last 30 days. ${inactiveMembersCount} members are currently inactive.`);
    }

    const topCategory = [...categoryDistribution].sort((a, b) => b.count - a.count)[0];
    if (topCategory && topCategory.count > 0) {
      insights.push(`Dominant category: "${topCategory.name}" accounts for ${topCategory.percentage}% of all verified contributions.`);
    }

    if (pendingContributions > 0) {
      insights.push(`Queue status: ${pendingContributions} contribution(s) are currently awaiting review in the coordinator queue.`);
    } else {
      insights.push(`Queue status: The verification queue is currently empty.`);
    }

    // Calculated Health Score (0 - 100)
    const healthScore = Math.min(100, Math.round(activityRate * 0.5 + (verifiedContributions / (totalContributions || 1)) * 50));

    return NextResponse.json({
      healthScore,
      totalMembers,
      activeMembersCount,
      inactiveMembersCount,
      activityRate,
      totalContributions,
      verifiedContributions,
      pendingContributions,
      rejectedContributions,
      categoryDistribution,
      totalXp30Days,
      insights,
    });
  } catch (error) {
    console.error("Coordinator Health GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
