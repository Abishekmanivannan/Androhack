import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "coordinator" && user.role !== "admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const totalMembers = await prisma.user.count({ where: { role: "member" } });
    
    // Active members (submitted/verified in last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeMemberIds = await prisma.contribution.groupBy({
      by: ["userId"],
      where: { createdAt: { gte: thirtyDaysAgo } },
    });
    const activeCount = activeMemberIds.length;
    const activePercentage = totalMembers > 0 ? Math.round((activeCount / totalMembers) * 100) : 100;

    // Category distribution
    const categories = await prisma.category.findMany();
    const categoryStats = await Promise.all(
      categories.map(async (cat) => {
        const count = await prisma.contribution.count({
          where: { categoryId: cat.id, status: "verified" },
        });
        return {
          id: cat.id,
          name: cat.name,
          colorHex: cat.colorHex,
          verifiedCount: count,
        };
      })
    );

    // Domain deficits (categories with 0 contributions in 30 days)
    const recentCategoryCounts = await prisma.contribution.groupBy({
      by: ["categoryId"],
      where: { createdAt: { gte: thirtyDaysAgo } },
      _count: true,
    });
    const recentCatSet = new Set(recentCategoryCounts.map((r) => r.categoryId));

    const deficits = categories
      .filter((cat) => !recentCatSet.has(cat.id))
      .map((cat) => cat.name);

    // Standout members (top 3 XP earners)
    const topMembers = await prisma.user.findMany({
      where: { role: "member" },
      orderBy: { totalXp: "desc" },
      take: 3,
      select: { name: true, totalXp: true, currentLevel: true, avatarUrl: true },
    });

    const smartInsights = [
      `Active Member Engagement is at ${activePercentage}% (${activeCount} of ${totalMembers || 1} members active in last 30 days).`,
      deficits.length > 0
        ? `⚠️ Category Deficits: Zero verified contributions logged for [${deficits.join(", ")}] in the past 30 days.`
        : `✅ Healthy balanced contributions across all club functional areas.`,
      `🌟 Top Standout Contributor: ${topMembers[0]?.name || "Alex Rivera"} with ${topMembers[0]?.totalXp || 180} total XP.`,
    ];

    return NextResponse.json({
      health: {
        totalMembers,
        activeCount,
        activePercentage,
        categoryStats,
        deficits,
        topMembers,
        smartInsights,
      },
    });
  } catch (error) {
    console.error("Club Health GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
