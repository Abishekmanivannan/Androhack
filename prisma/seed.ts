import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding ClubConnect database with authentic demo member profiles...");

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
  console.log("Categories seeded...");

  // Fetch category records for reference
  const techCat = await prisma.category.findUnique({ where: { name: "Technical" } });
  const designCat = await prisma.category.findUnique({ where: { name: "Design" } });
  const eventCat = await prisma.category.findUnique({ where: { name: "Event" } });
  const mktCat = await prisma.category.findUnique({ where: { name: "Marketing" } });
  const sponsorCat = await prisma.category.findUnique({ where: { name: "Sponsorship" } });
  const mediaCat = await prisma.category.findUnique({ where: { name: "Media" } });
  const leadCat = await prisma.category.findUnique({ where: { name: "Leadership" } });

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

  // 4. Password Hash (Default: "password123")
  const passwordHash = bcrypt.hashSync("password123", 6);

  // 5. Seed Demo Users (12 Specific Profiles + Admin)
  const usersToSeed = [
    {
      email: "abishek@club.org",
      name: "Abishek Manivannan",
      role: "member",
      department: "Computer Science & Engineering",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abishek&backgroundColor=b6e3f4",
      skills: ["TypeScript", "React", "Next.js", "Node.js", "Prisma", "PostgreSQL", "Docker", "System Design"],
      totalXp: 580,
      currentLevel: "Tier 5: Elite Architect",
      portfolioPublic: true,
      streak: 9,
    },
    {
      email: "ashwin@club.org",
      name: "Ashwin Kumar",
      role: "member",
      department: "Artificial Intelligence & Data Science",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ashwin&backgroundColor=c0aede",
      skills: ["Python", "PyTorch", "FastAPI", "Machine Learning", "Scikit-Learn", "Vector DBs"],
      totalXp: 420,
      currentLevel: "Tier 4: Core Member",
      portfolioPublic: true,
      streak: 7,
    },
    {
      email: "sujai@club.org",
      name: "Sujai Sundar",
      role: "member",
      department: "Computer Science & Engineering",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sujai&backgroundColor=d1d4f9",
      skills: ["React Native", "Flutter", "TypeScript", "GraphQL", "Firebase", "TailwindCSS"],
      totalXp: 390,
      currentLevel: "Tier 4: Core Member",
      portfolioPublic: true,
      streak: 5,
    },
    {
      email: "naresh@club.org",
      name: "Naresh Raja",
      role: "member",
      department: "Information Technology",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Naresh&backgroundColor=ffd5dc",
      skills: ["Kubernetes", "Docker", "AWS", "CI/CD", "Terraform", "Linux", "Prometheus"],
      totalXp: 350,
      currentLevel: "Tier 4: Core Member",
      portfolioPublic: true,
      streak: 6,
    },
    {
      email: "nithesh@club.org",
      name: "Nithesh R",
      role: "member",
      department: "Cybersecurity & Info Assurance",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nithesh&backgroundColor=ffdfbf",
      skills: ["Network Security", "Penetration Testing", "Rust", "C++", "OAuth2", "Cryptography"],
      totalXp: 310,
      currentLevel: "Tier 4: Core Member",
      portfolioPublic: true,
      streak: 4,
    },
    {
      email: "varsha@club.org",
      name: "Varsha Srinivasan",
      role: "member",
      department: "Design & Interactive Media",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Varsha&backgroundColor=ffd5dc",
      skills: ["Figma", "UI/UX Design", "Design Systems", "Prototyping", "Motion Design", "TailwindCSS"],
      totalXp: 460,
      currentLevel: "Tier 4: Core Member",
      portfolioPublic: true,
      streak: 8,
    },
    {
      email: "dheeraj@club.org",
      name: "Dheeraj Krishna",
      role: "member",
      department: "Computer Science",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dheeraj&backgroundColor=c0aede",
      skills: ["Go", "PostgreSQL", "Redis", "gRPC", "Distributed Systems", "Microservices"],
      totalXp: 330,
      currentLevel: "Tier 4: Core Member",
      portfolioPublic: true,
      streak: 5,
    },
    {
      email: "jerome@club.org",
      name: "Jerome Fernandez",
      role: "member",
      department: "Information Technology",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jerome&backgroundColor=b6e3f4",
      skills: ["React", "Three.js", "Framer Motion", "Canvas", "WebGL", "Next.js"],
      totalXp: 280,
      currentLevel: "Tier 3: Active Contributor",
      portfolioPublic: true,
      streak: 3,
    },
    {
      email: "aniruthan@club.org",
      name: "Aniruthan S",
      role: "coordinator",
      department: "Management Studies & Tech Operations",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aniruthan&backgroundColor=d1d4f9",
      skills: ["Project Management", "Event Ops", "Logistics", "Sponsorship", "Mentorship"],
      totalXp: 520,
      currentLevel: "Club Leader",
      portfolioPublic: true,
      streak: 11,
    },
    {
      email: "vignesh@club.org",
      name: "Vignesh K",
      role: "member",
      department: "Electrical & Electronics Engineering",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vignesh&backgroundColor=ffdfbf",
      skills: ["C++", "Arduino", "ESP32", "Embedded Systems", "PCB Design", "Robotics"],
      totalXp: 290,
      currentLevel: "Tier 3: Active Contributor",
      portfolioPublic: true,
      streak: 4,
    },
    {
      email: "dinesh@club.org",
      name: "Dinesh Karthik",
      role: "member",
      department: "Communication & Visual Arts",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dinesh&backgroundColor=b6e3f4",
      skills: ["Video Editing", "Content Strategy", "After Effects", "Copywriting", "Branding"],
      totalXp: 230,
      currentLevel: "Tier 2: Active Member",
      portfolioPublic: true,
      streak: 2,
    },
    {
      email: "ram@club.org",
      name: "Ram Prakash",
      role: "member",
      department: "Computer Science & Engineering",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ram&backgroundColor=c0aede",
      skills: ["C++", "Java", "Algorithms", "Data Structures", "Competitive Coding", "Python"],
      totalXp: 370,
      currentLevel: "Tier 4: Core Member",
      portfolioPublic: true,
      streak: 6,
    },
    {
      email: "admin@club.org",
      name: "Admin User",
      role: "admin",
      department: "Club Governance",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=b6e3f4",
      skills: ["Governance", "RBAC", "Analytics", "Security Auditing"],
      totalXp: 990,
      currentLevel: "Club Leader",
      portfolioPublic: true,
      streak: 15,
    },
  ];

  const createdUsersMap = new Map<string, any>();

  for (const u of usersToSeed) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        role: u.role,
        department: u.department,
        avatarUrl: u.avatarUrl,
        skills: u.skills,
        totalXp: u.totalXp,
        currentLevel: u.currentLevel,
        portfolioPublic: u.portfolioPublic,
      },
      create: {
        email: u.email,
        passwordHash,
        name: u.name,
        role: u.role,
        department: u.department,
        avatarUrl: u.avatarUrl,
        skills: u.skills,
        totalXp: u.totalXp,
        currentLevel: u.currentLevel,
        portfolioPublic: u.portfolioPublic,
      },
    });

    createdUsersMap.set(u.email, user);

    // Seed User Streak
    await prisma.userStreak.upsert({
      where: { userId: user.id },
      update: {
        currentStreak: u.streak,
        longestStreak: u.streak + 3,
        lastActivityAt: new Date(),
      },
      create: {
        userId: user.id,
        currentStreak: u.streak,
        longestStreak: u.streak + 3,
        lastActivityAt: new Date(),
      },
    });
  }
  console.log("Users and streaks seeded successfully...");

  const abishek = createdUsersMap.get("abishek@club.org");
  const ashwin = createdUsersMap.get("ashwin@club.org");
  const sujai = createdUsersMap.get("sujai@club.org");
  const naresh = createdUsersMap.get("naresh@club.org");
  const nithesh = createdUsersMap.get("nithesh@club.org");
  const varsha = createdUsersMap.get("varsha@club.org");
  const dheeraj = createdUsersMap.get("dheeraj@club.org");
  const jerome = createdUsersMap.get("jerome@club.org");
  const aniruthan = createdUsersMap.get("aniruthan@club.org");
  const vignesh = createdUsersMap.get("vignesh@club.org");
  const dinesh = createdUsersMap.get("dinesh@club.org");
  const ram = createdUsersMap.get("ram@club.org");

  // Assign Badges to Users
  const allBadges = await prisma.badge.findMany();
  for (const b of allBadges) {
    if (abishek) {
      await prisma.userBadge.upsert({
        where: { userId_badgeId: { userId: abishek.id, badgeId: b.id } },
        update: {},
        create: { userId: abishek.id, badgeId: b.id },
      });
    }
    if (varsha && (b.name === "First Steps" || b.name === "Century Club" || b.name === "Core Member")) {
      await prisma.userBadge.upsert({
        where: { userId_badgeId: { userId: varsha.id, badgeId: b.id } },
        update: {},
        create: { userId: varsha.id, badgeId: b.id },
      });
    }
    if (ashwin && (b.name === "First Steps" || b.name === "Code Contributor" || b.name === "Core Member")) {
      await prisma.userBadge.upsert({
        where: { userId_badgeId: { userId: ashwin.id, badgeId: b.id } },
        update: {},
        create: { userId: ashwin.id, badgeId: b.id },
      });
    }
  }

  // 6. Seed Projects
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
      name: "Campus Event Radar & Mobile App",
      description: "Interactive real-time map & mobile scanner for student organization workshops & hackathons.",
      status: "active",
      githubUrl: "https://github.com/clubconnect/campus-radar",
      requiredSkills: ["Figma", "UI Design", "React Native", "Python"],
    },
  });

  const aiAssistantProject = await prisma.project.upsert({
    where: { id: "p0000000-0000-0000-0000-000000000003" },
    update: {},
    create: {
      id: "p0000000-0000-0000-0000-000000000003",
      name: "Campus AI Student Assistant",
      description: "LLM RAG system for instant student club query resolution and automated contribution indexing.",
      status: "active",
      githubUrl: "https://github.com/clubconnect/campus-ai",
      requiredSkills: ["Python", "PyTorch", "FastAPI", "Vector DBs"],
    },
  });

  // Assign Project Members
  const projectAssignments = [
    { project: clubConnectProject, user: abishek, role: "Lead Systems Architect" },
    { project: clubConnectProject, user: dheeraj, role: "Backend Engineer" },
    { project: clubConnectProject, user: jerome, role: "Frontend Developer" },
    { project: clubConnectProject, user: naresh, role: "DevOps Engineer" },

    { project: campusEventFinder, user: varsha, role: "Lead UI/UX Designer" },
    { project: campusEventFinder, user: sujai, role: "Mobile App Developer" },
    { project: campusEventFinder, user: vignesh, role: "Hardware Integration Lead" },
    { project: campusEventFinder, user: dinesh, role: "Media & Branding Lead" },

    { project: aiAssistantProject, user: ashwin, role: "AI/ML Engineer" },
    { project: aiAssistantProject, user: nithesh, role: "Security Auditor" },
    { project: aiAssistantProject, user: ram, role: "Algorithm Engineer" },
  ];

  for (const pa of projectAssignments) {
    if (pa.user) {
      await prisma.projectMember.upsert({
        where: { projectId_userId: { projectId: pa.project.id, userId: pa.user.id } },
        update: { role: pa.role },
        create: { projectId: pa.project.id, userId: pa.user.id, role: pa.role },
      });
    }
  }

  // 7. Seed Events
  const fallHackathon = await prisma.event.upsert({
    where: { id: "e0000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "e0000000-0000-0000-0000-000000000001",
      title: "Annual Fall Hackathon 2026",
      description: "48-hour build sprint with $5,000 in prizes across 4 tracks.",
      eventDate: new Date(Date.now() + 86400000 * 7),
      location: "Innovation Hub Main Auditorium",
      categoryId: eventCat?.id,
      baseXp: 50,
      status: "upcoming",
    },
  });

  const nextjsWorkshop = await prisma.event.upsert({
    where: { id: "e0000000-0000-0000-0000-000000000002" },
    update: {},
    create: {
      id: "e0000000-0000-0000-0000-000000000002",
      title: "Hands-on Next.js 15 & Prisma Masterclass",
      description: "Deep dive into App Router, Server Actions, and Supabase integration.",
      eventDate: new Date(Date.now() - 86400000 * 3),
      location: "CS Lab 302",
      categoryId: techCat?.id,
      baseXp: 30,
      status: "completed",
    },
  });

  // Event Participants
  for (const u of [abishek, ashwin, sujai, varsha, ram, jerome]) {
    if (u) {
      await prisma.eventParticipant.upsert({
        where: { eventId_userId: { eventId: fallHackathon.id, userId: u.id } },
        update: {},
        create: { eventId: fallHackathon.id, userId: u.id, status: "registered" },
      });

      await prisma.eventParticipant.upsert({
        where: { eventId_userId: { eventId: nextjsWorkshop.id, userId: u.id } },
        update: {},
        create: { eventId: nextjsWorkshop.id, userId: u.id, status: "attended", checkedInAt: new Date(Date.now() - 86400000 * 3) },
      });
    }
  }

  // 8. Seed Verified Contributions for All 12 Profiles
  const sampleContributions = [
    // Abishek
    {
      user: abishek,
      category: techCat,
      project: clubConnectProject,
      title: "Implemented OAuth2 Auth Flow & Session Management",
      description: "Added Google and GitHub OAuth support with JWT session cookies and middleware route protection.",
      projectName: "ClubConnect Platform V2",
      type: "github",
      url: "https://github.com/clubconnect/core/pull/42",
      xp: 40,
      notes: "Clean implementation with robust test coverage and session security!",
    },
    {
      user: abishek,
      category: techCat,
      project: clubConnectProject,
      title: "Built Real-Time Verification Audit Engine",
      description: "Designed high-performance verification queue and automated XP distribution triggers.",
      projectName: "ClubConnect Platform V2",
      type: "github",
      url: "https://github.com/clubconnect/core/pull/89",
      xp: 50,
      notes: "Architecturally sound event-driven verification flow.",
    },

    // Ashwin
    {
      user: ashwin,
      category: techCat,
      project: aiAssistantProject,
      title: "Fine-Tuned LLM Model for Student Query Resolution",
      description: "Trained RAG pipeline using PyTorch and FastAPI to answer student club inquiries instantly.",
      projectName: "Campus AI Student Assistant",
      type: "github",
      url: "https://github.com/clubconnect/campus-ai/pull/12",
      xp: 45,
      notes: "Impressive accuracy on campus-specific query benchmarks!",
    },
    {
      user: ashwin,
      category: techCat,
      project: aiAssistantProject,
      title: "Optimized Vector Search Indexing Pipeline",
      description: "Configured Qdrant vector database with HNSW indexing for sub-10ms similarity queries.",
      projectName: "Campus AI Student Assistant",
      type: "github",
      url: "https://github.com/clubconnect/campus-ai/pull/19",
      xp: 40,
      notes: "Significant latency reduction verified in benchmark tests.",
    },

    // Sujai
    {
      user: sujai,
      category: techCat,
      project: campusEventFinder,
      title: "Built Cross-Platform Mobile Attendance QR Scanner",
      description: "Developed React Native mobile view with camera QR code scanning and real-time check-in sync.",
      projectName: "Campus Event Radar & Mobile App",
      type: "github",
      url: "https://github.com/clubconnect/campus-radar/pull/34",
      xp: 45,
      notes: "Smooth scanning UI and solid offline fallback capabilities!",
    },

    // Naresh
    {
      user: naresh,
      category: techCat,
      project: clubConnectProject,
      title: "Automated GitHub Actions CI/CD Build & Deployment Pipeline",
      description: "Configured multi-stage Docker build workflow with automated ESLint and Prisma migration checks.",
      projectName: "ClubConnect Platform V2",
      type: "github",
      url: "https://github.com/clubconnect/core/pull/15",
      xp: 40,
      notes: "Reduced deployment time from 15 minutes to under 2 minutes!",
    },

    // Nithesh
    {
      user: nithesh,
      category: techCat,
      project: aiAssistantProject,
      title: "Audited Auth Endpoints & Fixed JWT Injection Vulnerabilities",
      description: "Performed penetration testing and secured authorization middleware against token tampering.",
      projectName: "Campus AI Student Assistant",
      type: "github",
      url: "https://github.com/clubconnect/core/pull/58",
      xp: 45,
      notes: "Critical security patch executed flawlessly!",
    },

    // Varsha
    {
      user: varsha,
      category: designCat,
      project: clubConnectProject,
      title: "Designed ClubConnect Glassmorphism UI & Component System",
      description: "Created full dark-mode Figma design system with glassmorphic cards, badges, and responsive layouts.",
      projectName: "ClubConnect Platform V2",
      type: "figma",
      url: "https://figma.com/file/clubconnect-v2-system",
      xp: 50,
      notes: "Stunning visual design that wows everyone!",
    },
    {
      user: varsha,
      category: designCat,
      project: campusEventFinder,
      title: "Created Interactive Campus Event Radar Figma Design Assets",
      description: "Designed interactive map markers, event details drawer, and user profile badges.",
      projectName: "Campus Event Radar & Mobile App",
      type: "figma",
      url: "https://figma.com/file/campus-event-radar",
      xp: 45,
      notes: "High fidelity prototypes with pixel-perfect details.",
    },

    // Dheeraj
    {
      user: dheeraj,
      category: techCat,
      project: clubConnectProject,
      title: "Designed Distributed Redis Caching for Leaderboard Queries",
      description: "Implemented high-performance Redis cache layer reducing SQL database load by 85%.",
      projectName: "ClubConnect Platform V2",
      type: "github",
      url: "https://github.com/clubconnect/core/pull/91",
      xp: 40,
      notes: "Substantial performance gains under heavy concurrent load.",
    },

    // Jerome
    {
      user: jerome,
      category: techCat,
      project: clubConnectProject,
      title: "Implemented Canvas Confetti & Micro-Interaction Animations",
      description: "Added celebratory particle effects on contribution verification and level-ups.",
      projectName: "ClubConnect Platform V2",
      type: "github",
      url: "https://github.com/clubconnect/core/pull/62",
      xp: 35,
      notes: "Great delight factor for club members!",
    },

    // Aniruthan
    {
      user: aniruthan,
      category: eventCat,
      project: null,
      title: "Organized 48-Hour Fall Hackathon 2026 for 300+ Participants",
      description: "Coordinated logistics, venue setup, judge panels, and participant onboarding for campus hackathon.",
      projectName: "Annual Fall Hackathon 2026",
      type: "google_drive",
      url: "https://drive.google.com/file/d/hackathon-ops-2026",
      xp: 60,
      notes: "Outstanding event execution and flawless coordination!",
    },
    {
      user: aniruthan,
      category: sponsorCat,
      project: null,
      title: "Secured $5,000 Tech Sponsorships from Cloud Partners",
      description: "Pitched club initiatives to industry sponsors to fund hackathon prize pools.",
      projectName: "Club Sponsorship Drive",
      type: "google_drive",
      url: "https://drive.google.com/file/d/sponsorship-agreements",
      xp: 50,
      notes: "Key financial backing secured for club activities.",
    },

    // Vignesh
    {
      user: vignesh,
      category: techCat,
      project: campusEventFinder,
      title: "Built ESP32 Hardware NFC Scanner for Event Check-ins",
      description: "Programmed ESP32 microcontrollers with RFID/NFC readers to scan student ID cards at event doors.",
      projectName: "Campus Event Radar & Mobile App",
      type: "github",
      url: "https://github.com/clubconnect/hardware-kiosk",
      xp: 45,
      notes: "Hardware integration verified live at CS workshop!",
    },

    // Dinesh
    {
      user: dinesh,
      category: mediaCat,
      project: campusEventFinder,
      title: "Produced 4K Video Trailer & Promo Teaser for Hackathon 2026",
      description: "Filmed, edited, and sound-engineered promotional video generating 2,500+ student views.",
      projectName: "Annual Fall Hackathon 2026",
      type: "youtube",
      url: "https://youtube.com/watch?v=clubconnect-promo",
      xp: 40,
      notes: "High production quality and creative storytelling!",
    },

    // Ram
    {
      user: ram,
      category: techCat,
      project: clubConnectProject,
      title: "Created 20 Original Algorithmic Problems for CodeSprint 2026",
      description: "Authored competitive programming problems with complete test suites and solution explanations.",
      projectName: "CodeSprint 2026",
      type: "github",
      url: "https://github.com/clubconnect/problem-bank",
      xp: 45,
      notes: "Challenging and well-crafted problem set!",
    },
  ];

  for (const c of sampleContributions) {
    if (c.user && c.category) {
      const existing = await prisma.contribution.findFirst({
        where: { userId: c.user.id, title: c.title },
      });

      if (!existing) {
        const createdContrib = await prisma.contribution.create({
          data: {
            userId: c.user.id,
            categoryId: c.category.id,
            projectId: c.project?.id || null,
            title: c.title,
            description: c.description,
            projectEventName: c.projectName,
            evidenceType: c.type,
            evidenceUrl: c.url,
            status: "verified",
            pointsAwarded: c.xp,
            reviewerId: aniruthan?.id || abishek?.id,
            reviewerNotes: c.notes,
            verifiedAt: new Date(Date.now() - Math.floor(Math.random() * 5 * 86400000)),
          },
        });

        await prisma.xpTransaction.create({
          data: {
            userId: c.user.id,
            amount: c.xp,
            reason: `Verified Contribution: "${c.title}"`,
            contributionId: createdContrib.id,
          },
        });
      }
    }
  }

  // 9. Seed Announcements
  await prisma.announcement.create({
    data: {
      authorId: aniruthan?.id || abishek.id,
      title: "🚀 Welcome to ClubConnect V2!",
      content: "We have officially launched the new contribution tracking & recognition portal. Submit your PRs, event logistics, and design assets to earn XP and level up!",
      targetRole: "all",
      isPinned: true,
    },
  });

  await prisma.announcement.create({
    data: {
      authorId: aniruthan?.id || abishek.id,
      title: "🏆 Fall Hackathon 2026 Team Registration Live",
      content: "Team registrations for the 48-hour Fall Hackathon are now live! Check out the Events tab to register your team.",
      targetRole: "all",
      isPinned: false,
    },
  });

  // 10. Seed Notifications for Demo User
  if (abishek) {
    await prisma.notification.create({
      data: {
        userId: abishek.id,
        type: "contribution_approved",
        title: "Contribution Verified! 🎉",
        message: 'Your contribution "Implemented OAuth2 Auth Flow & Session Management" was verified (+40 XP).',
        linkUrl: "/dashboard",
        isRead: false,
      },
    });

    await prisma.notification.create({
      data: {
        userId: abishek.id,
        type: "challenge_update",
        title: "Streak Milestone! ⚡",
        message: "You have reached a 9-day active contribution streak! Keep it up!",
        linkUrl: "/achievements",
        isRead: false,
      },
    });
  }

  console.log("Database successfully seeded with 12 authentic demo member profiles!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
