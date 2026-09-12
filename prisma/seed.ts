import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding ClubConnect database...");

  // Seed Categories
  const categoriesData = [
    { name: "Technical", baseXp: 30, colorHex: "#6366F1" },
    { name: "Design", baseXp: 15, colorHex: "#EC4899" },
    { name: "Event", baseXp: 40, colorHex: "#F59E0B" },
    { name: "Marketing", baseXp: 15, colorHex: "#10B981" },
    { name: "Mentoring", baseXp: 20, colorHex: "#8B5CF6" },
    { name: "Leadership", baseXp: 50, colorHex: "#EF4444" },
    { name: "Sponsorship", baseXp: 40, colorHex: "#06B6D4" },
    { name: "Media", baseXp: 20, colorHex: "#3B82F6" },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: { baseXp: cat.baseXp, colorHex: cat.colorHex },
      create: cat,
    });
  }

  // Seed Badges
  const badgesData = [
    {
      name: "First Steps",
      description: "Submitted and verified your first contribution!",
      iconKey: "award",
      criteriaType: "xp_threshold",
      criteriaThreshold: 10,
    },
    {
      name: "Code Contributor",
      description: "Pushed verified technical code or PR to the club repository.",
      iconKey: "code",
      criteriaType: "count_category",
      criteriaThreshold: 1,
    },
    {
      name: "Event Architect",
      description: "Successfully lead or organized a campus event.",
      iconKey: "calendar",
      criteriaType: "count_category",
      criteriaThreshold: 1,
    },
    {
      name: "Century Club",
      description: "Crossed the 100 Total XP contribution milestone.",
      iconKey: "zap",
      criteriaType: "xp_threshold",
      criteriaThreshold: 100,
    },
    {
      name: "Core Member",
      description: "Achieved Tier 4 Core Member standing in the club.",
      iconKey: "shield-check",
      criteriaType: "xp_threshold",
      criteriaThreshold: 300,
    },
  ];

  for (const badge of badgesData) {
    const existing = await prisma.badge.findFirst({
      where: { name: badge.name },
    });
    if (!existing) {
      await prisma.badge.create({ data: badge });
    }
  }

  // Password for demo accounts
  const passwordHash = await bcrypt.hash("password123", 10);

  // Seed Users
  const alexMember = await prisma.user.upsert({
    where: { email: "alex@club.org" },
    update: {},
    create: {
      email: "alex@club.org",
      passwordHash,
      name: "Alex Rivera",
      role: "member",
      department: "Computer Science",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      skills: JSON.stringify(["TypeScript", "React", "Next.js", "UI Design"]),
      totalXp: 180,
      currentLevel: "Active Member",
      portfolioPublic: true,
    },
  });

  const sarahCoordinator = await prisma.user.upsert({
    where: { email: "coordinator@club.org" },
    update: {},
    create: {
      email: "coordinator@club.org",
      passwordHash,
      name: "Sarah Chen",
      role: "coordinator",
      department: "Information Technology",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      skills: JSON.stringify(["Project Management", "Event Ops", "Mentorship"]),
      totalXp: 520,
      currentLevel: "Club Leader",
      portfolioPublic: true,
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@club.org" },
    update: {},
    create: {
      email: "admin@club.org",
      passwordHash,
      name: "Admin User",
      role: "admin",
      department: "Club Governance",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
      skills: JSON.stringify(["Governance", "RBAC", "Analytics"]),
      totalXp: 990,
      currentLevel: "Club Leader",
      portfolioPublic: true,
    },
  });

  // Seed Sample Initial Contributions for Alex
  const techCategory = await prisma.category.findUnique({
    where: { name: "Technical" },
  });
  const eventCategory = await prisma.category.findUnique({
    where: { name: "Event" },
  });

  if (techCategory && alexMember) {
    const existingContrib = await prisma.contribution.findFirst({
      where: { userId: alexMember.id, title: "Implemented OAuth2 Auth Flow" },
    });

    if (!existingContrib) {
      const c1 = await prisma.contribution.create({
        data: {
          userId: alexMember.id,
          categoryId: techCategory.id,
          title: "Implemented OAuth2 Auth Flow",
          description:
            "Added Google and GitHub OAuth support with JWT session cookies and middleware route protection.",
          projectEventName: "ClubConnect Core App",
          evidenceType: "github",
          evidenceUrl: "https://github.com/clubconnect/core/pull/42",
          status: "verified",
          pointsAwarded: 30,
          reviewerId: sarahCoordinator.id,
          reviewerNotes: "Excellent PR with clean code and high test coverage!",
          verifiedAt: new Date(),
        },
      });

      // Award badge to Alex
      const firstBadge = await prisma.badge.findFirst({
        where: { name: "First Steps" },
      });
      if (firstBadge) {
        await prisma.userBadge.upsert({
          where: {
            userId_badgeId: {
              userId: alexMember.id,
              badgeId: firstBadge.id,
            },
          },
          update: {},
          create: {
            userId: alexMember.id,
            badgeId: firstBadge.id,
          },
        });
      }
    }
  }

  if (eventCategory && alexMember) {
    const pendingContrib = await prisma.contribution.findFirst({
      where: { userId: alexMember.id, title: "Hackathon Logistics Lead" },
    });

    if (!pendingContrib) {
      await prisma.contribution.create({
        data: {
          userId: alexMember.id,
          categoryId: eventCategory.id,
          title: "Hackathon Logistics Lead",
          description:
            "Coordinated venue, catering, and sponsor booths for 150+ hackathon attendees.",
          projectEventName: "Annual Fall Hackathon 2026",
          evidenceType: "url",
          evidenceUrl: "https://drive.google.com/file/d/hackathon-ops-report",
          status: "pending",
          pointsAwarded: 40,
        },
      });
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
