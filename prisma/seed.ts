import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding expanded ClubConnect database...");

  // 1. Seed Categories
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

  // 2. Seed Badges
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
    {
      name: "Master Mentor",
      description: "Mentored 3 or more junior club members.",
      iconKey: "users",
      criteriaType: "count_category",
      criteriaThreshold: 3,
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

  // 3. Seed Achievements
  const achievementsData = [
    { title: "Streak Master", description: "Maintained a 7-day contribution streak", iconKey: "flame", bonusXp: 50 },
    { title: "Polyglot Engineer", description: "Contributed code across 3 different tech stacks", iconKey: "cpu", bonusXp: 40 },
    { title: "Hackathon Hero", description: "Earned top XP during the Fall Hackathon", iconKey: "trophy", bonusXp: 75 },
    { title: "Community Pillar", description: "Submitted verified contributions in 4 different categories", iconKey: "heart", bonusXp: 60 },
  ];

  for (const ach of achievementsData) {
    const existing = await prisma.achievement.findFirst({ where: { title: ach.title } });
    if (!existing) {
      await prisma.achievement.create({ data: ach });
    }
  }

  // 4. Password Hash
  const passwordHash = await bcrypt.hash("password123", 10);

  // 5. Seed Users
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
      skills: ["TypeScript", "React", "Next.js", "UI Design", "TailwindCSS"],
      totalXp: 220,
      currentLevel: "Active Member",
      portfolioPublic: true,
    },
  });

  const mayaMember = await prisma.user.upsert({
    where: { email: "maya@club.org" },
    update: {},
    create: {
      email: "maya@club.org",
      passwordHash,
      name: "Maya Patel",
      role: "member",
      department: "Data Science",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
      skills: ["Python", "SQL", "Machine Learning", "Figma"],
      totalXp: 340,
      currentLevel: "Tier 4: Core Member",
      portfolioPublic: true,
    },
  });

  const davidMember = await prisma.user.upsert({
    where: { email: "david@club.org" },
    update: {},
    create: {
      email: "david@club.org",
      passwordHash,
      name: "David Kim",
      role: "member",
      department: "Design & Media",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      skills: ["Figma", "UI Design", "Branding", "Video Editing"],
      totalXp: 150,
      currentLevel: "Active Member",
      portfolioPublic: true,
    },
  });

  const elenaMember = await prisma.user.upsert({
    where: { email: "elena@club.org" },
    update: {},
    create: {
      email: "elena@club.org",
      passwordHash,
      name: "Elena Rostova",
      role: "member",
      department: "Electrical Engineering",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
      skills: ["C++", "Embedded Systems", "Hardware", "Robotics"],
      totalXp: 90,
      currentLevel: "Tier 1: Newcomer",
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
      skills: ["Project Management", "Event Ops", "Mentorship"],
      totalXp: 520,
      currentLevel: "Club Leader",
      portfolioPublic: true,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@club.org" },
    update: {},
    create: {
      email: "admin@club.org",
      passwordHash,
      name: "Admin User",
      role: "admin",
      department: "Club Governance",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
      skills: ["Governance", "RBAC", "Analytics"],
      totalXp: 990,
      currentLevel: "Club Leader",
      portfolioPublic: true,
    },
  });

  // 6. Seed Streaks
  const users = [alexMember, mayaMember, davidMember, elenaMember, sarahCoordinator, adminUser];
  for (const u of users) {
    await prisma.userStreak.upsert({
      where: { userId: u.id },
      update: {},
      create: {
        userId: u.id,
        currentStreak: u.email === "alex@club.org" ? 4 : u.email === "maya@club.org" ? 7 : 2,
        longestStreak: u.email === "maya@club.org" ? 12 : 5,
        lastActivityAt: new Date(),
      },
    });
  }

  // 7. Seed Projects
  const clubConnectProject = await prisma.project.upsert({
    where: { id: "p0000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "p0000000-0000-0000-0000-000000000001",
      name: "ClubConnect Platform V2",
      description: "Building the next-gen contribution & recognition engine for university clubs.",
      status: "active",
      githubUrl: "https://github.com/clubconnect/core",
      requiredSkills: ["TypeScript", "React", "Next.js", "Prisma", "PostgreSQL"],
    },
  });

  const campusEventFinder = await prisma.project.upsert({
    where: { id: "p0000000-0000-0000-0000-000000000002" },
    update: {},
    create: {
      id: "p0000000-0000-0000-0000-000000000002",
      name: "Campus Event Radar",
      description: "Interactive real-time map showing upcoming student organization workshops & hackathons.",
      status: "active",
      githubUrl: "https://github.com/clubconnect/campus-radar",
      requiredSkills: ["Figma", "UI Design", "React", "Python"],
    },
  });

  // Assign Project Members
  await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: clubConnectProject.id, userId: alexMember.id } },
    update: {},
    create: { projectId: clubConnectProject.id, userId: alexMember.id, role: "lead_developer" },
  });

  await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: clubConnectProject.id, userId: mayaMember.id } },
    update: {},
    create: { projectId: clubConnectProject.id, userId: mayaMember.id, role: "backend_engineer" },
  });

  await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: campusEventFinder.id, userId: davidMember.id } },
    update: {},
    create: { projectId: campusEventFinder.id, userId: davidMember.id, role: "lead_designer" },
  });

  // 8. Seed Events
  const techCategory = await prisma.category.findUnique({ where: { name: "Technical" } });
  const eventCategory = await prisma.category.findUnique({ where: { name: "Event" } });
  const designCategory = await prisma.category.findUnique({ where: { name: "Design" } });

  const fallHackathon = await prisma.event.upsert({
    where: { id: "e0000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "e0000000-0000-0000-0000-000000000001",
      title: "Annual Fall Hackathon 2026",
      description: "48-hour build sprint with $5,000 in prizes across 4 tracks.",
      eventDate: new Date(Date.now() + 86400000 * 7),
      location: "Innovation Hub Main Auditorium",
      categoryId: eventCategory?.id,
      baseXp: 50,
      status: "upcoming",
    },
  });

  const reactWorkshop = await prisma.event.upsert({
    where: { id: "e0000000-0000-0000-0000-000000000002" },
    update: {},
    create: {
      id: "e0000000-0000-0000-0000-000000000002",
      title: "Hands-on Next.js 15 & Prisma Masterclass",
      description: "Deep dive into App Router, Server Actions, and Supabase integration.",
      eventDate: new Date(Date.now() - 86400000 * 3),
      location: "CS Lab 302",
      categoryId: techCategory?.id,
      baseXp: 30,
      status: "completed",
    },
  });

  // Event Participants
  await prisma.eventParticipant.upsert({
    where: { eventId_userId: { eventId: fallHackathon.id, userId: alexMember.id } },
    update: {},
    create: { eventId: fallHackathon.id, userId: alexMember.id, status: "registered" },
  });

  await prisma.eventParticipant.upsert({
    where: { eventId_userId: { eventId: reactWorkshop.id, userId: alexMember.id } },
    update: {},
    create: { eventId: reactWorkshop.id, userId: alexMember.id, status: "attended", checkedInAt: new Date(Date.now() - 86400000 * 3) },
  });

  // 9. Seed Challenges
  const streakChallenge = await prisma.challenge.upsert({
    where: { id: "c0000000-0000-0000-0000-000000000010" },
    update: {},
    create: {
      id: "c0000000-0000-0000-0000-000000000010",
      title: "7-Day Contribution Streak",
      description: "Submit at least 1 verified contribution every day for 7 consecutive days.",
      targetCount: 7,
      targetXp: 150,
      bonusXp: 75,
      startDate: new Date(Date.now() - 86400000 * 10),
      endDate: new Date(Date.now() + 86400000 * 20),
      isActive: true,
    },
  });

  const techSprintChallenge = await prisma.challenge.upsert({
    where: { id: "c0000000-0000-0000-0000-000000000011" },
    update: {},
    create: {
      id: "c0000000-0000-0000-0000-000000000011",
      title: "Technical Code Sprint 2026",
      description: "Earn 100 Technical category XP by contributing PRs and bug fixes.",
      categoryId: techCategory?.id,
      targetCount: 3,
      targetXp: 100,
      bonusXp: 50,
      startDate: new Date(Date.now() - 86400000 * 5),
      endDate: new Date(Date.now() + 86400000 * 15),
      isActive: true,
    },
  });

  // Challenge Participants
  await prisma.challengeParticipant.upsert({
    where: { challengeId_userId: { challengeId: streakChallenge.id, userId: alexMember.id } },
    update: {},
    create: { challengeId: streakChallenge.id, userId: alexMember.id, currentCount: 4, currentXp: 90, status: "in_progress" },
  });

  await prisma.challengeParticipant.upsert({
    where: { challengeId_userId: { challengeId: techSprintChallenge.id, userId: alexMember.id } },
    update: {},
    create: { challengeId: techSprintChallenge.id, userId: alexMember.id, currentCount: 2, currentXp: 60, status: "in_progress" },
  });

  // 10. Seed Announcements
  await prisma.announcement.create({
    data: {
      authorId: sarahCoordinator.id,
      title: "🚀 Welcome to ClubConnect V2!",
      content: "We have officially launched the new contribution tracking & recognition portal. Submit your PRs, event logistics, and design assets to earn XP and level up!",
      targetRole: "all",
      isPinned: true,
    },
  });

  await prisma.announcement.create({
    data: {
      authorId: sarahCoordinator.id,
      title: "🏆 Fall Hackathon 2026 Registrations Open",
      content: "Team registrations for the 48-hour Fall Hackathon are now live! Check out the Events tab to register your team.",
      targetRole: "all",
      isPinned: false,
    },
  });

  // 11. Seed Notifications
  await prisma.notification.create({
    data: {
      userId: alexMember.id,
      type: "contribution_approved",
      title: "Contribution Verified! 🎉",
      message: 'Your contribution "Implemented OAuth2 Auth Flow" was approved by Sarah Chen (+30 XP).',
      linkUrl: "/dashboard",
      isRead: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: alexMember.id,
      type: "challenge_update",
      title: "Challenge Progress Update ⚡",
      message: 'You are 4/7 days into the "7-Day Contribution Streak" challenge!',
      linkUrl: "/achievements",
      isRead: false,
    },
  });

  // 12. Seed Historical Contributions & XP Transactions
  if (techCategory && alexMember) {
    const existingC1 = await prisma.contribution.findFirst({
      where: { userId: alexMember.id, title: "Implemented OAuth2 Auth Flow" },
    });

    if (!existingC1) {
      const c1 = await prisma.contribution.create({
        data: {
          userId: alexMember.id,
          categoryId: techCategory.id,
          projectId: clubConnectProject.id,
          title: "Implemented OAuth2 Auth Flow",
          description: "Added Google and GitHub OAuth support with JWT session cookies and middleware route protection.",
          projectEventName: "ClubConnect Platform V2",
          evidenceType: "github",
          evidenceUrl: "https://github.com/clubconnect/core/pull/42",
          status: "verified",
          pointsAwarded: 30,
          reviewerId: sarahCoordinator.id,
          reviewerNotes: "Excellent PR with clean code and high test coverage!",
          verifiedAt: new Date(Date.now() - 86400000 * 4),
        },
      });

      await prisma.xpTransaction.create({
        data: {
          userId: alexMember.id,
          amount: 30,
          reason: 'Verified Contribution: "Implemented OAuth2 Auth Flow"',
          contributionId: c1.id,
        },
      });
    }
  }

  if (designCategory && davidMember) {
    const d1 = await prisma.contribution.create({
      data: {
        userId: davidMember.id,
        categoryId: designCategory.id,
        projectId: campusEventFinder.id,
        title: "Campus Radar UI/UX Design System",
        description: "Created complete dark mode component library & responsive design system in Figma.",
        projectEventName: "Campus Event Radar",
        evidenceType: "figma",
        evidenceUrl: "https://figma.com/file/campus-radar-system",
        status: "verified",
        pointsAwarded: 45,
        reviewerId: sarahCoordinator.id,
        reviewerNotes: "Stunning visual design system!",
        verifiedAt: new Date(Date.now() - 86400000 * 2),
      },
    });

    await prisma.xpTransaction.create({
      data: {
        userId: davidMember.id,
        amount: 45,
        reason: 'Verified Contribution: "Campus Radar UI/UX Design System"',
        contributionId: d1.id,
      },
    });
  }

  console.log("Database seeded successfully with rich demo data!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
