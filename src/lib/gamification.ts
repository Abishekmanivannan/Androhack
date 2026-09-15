import { prisma } from "./prisma";

export function getTierFromXp(xp: number): {
  levelName: string;
  tierNumber: number;
  currentXp: number;
  minXp: number;
  maxXp: number;
  progressPercent: number;
} {
  if (xp < 51) {
    return {
      levelName: "Newcomer",
      tierNumber: 1,
      currentXp: xp,
      minXp: 0,
      maxXp: 50,
      progressPercent: Math.min(100, Math.round((xp / 50) * 100)),
    };
  } else if (xp < 151) {
    return {
      levelName: "Contributor",
      tierNumber: 2,
      currentXp: xp,
      minXp: 51,
      maxXp: 150,
      progressPercent: Math.min(100, Math.round(((xp - 50) / 100) * 100)),
    };
  } else if (xp < 301) {
    return {
      levelName: "Active Member",
      tierNumber: 3,
      currentXp: xp,
      minXp: 151,
      maxXp: 300,
      progressPercent: Math.min(100, Math.round(((xp - 150) / 150) * 100)),
    };
  } else if (xp < 501) {
    return {
      levelName: "Core Member",
      tierNumber: 4,
      currentXp: xp,
      minXp: 301,
      maxXp: 500,
      progressPercent: Math.min(100, Math.round(((xp - 300) / 200) * 100)),
    };
  } else {
    return {
      levelName: "Club Leader",
      tierNumber: 5,
      currentXp: xp,
      minXp: 500,
      maxXp: 1000,
      progressPercent: 100,
    };
  }
}

export function calculateLevel(xp: number): string {
  return getTierFromXp(xp).levelName;
}

export async function checkAndAwardBadges(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userBadges: true,
      contributions: {
        where: { status: "verified" },
        include: { category: true },
      },
    },
  });

  if (!user) return [];

  const existingBadgeIds = new Set(user.userBadges.map((ub) => ub.badgeId));
  const allBadges = await prisma.badge.findMany();

  const newlyUnlocked: string[] = [];

  for (const badge of allBadges) {
    if (existingBadgeIds.has(badge.id)) continue;

    let unlocked = false;

    if (badge.criteriaType === "xp_threshold") {
      if (user.totalXp >= badge.criteriaThreshold) {
        unlocked = true;
      }
    } else if (badge.criteriaType === "count_category") {
      const verifiedCount = user.contributions.length;
      if (verifiedCount >= badge.criteriaThreshold) {
        unlocked = true;
      }
    } else if (badge.criteriaType === "streak") {
      if (user.contributions.length >= badge.criteriaThreshold) {
        unlocked = true;
      }
    }

    if (unlocked) {
      await prisma.userBadge.create({
        data: {
          userId,
          badgeId: badge.id,
        },
      });
      newlyUnlocked.push(badge.name);
    }
  }

  // Update user current level
  const tierInfo = getTierFromXp(user.totalXp);
  if (user.currentLevel !== tierInfo.levelName) {
    await prisma.user.update({
      where: { id: userId },
      data: { currentLevel: tierInfo.levelName },
    });
  }

  return newlyUnlocked;
}
