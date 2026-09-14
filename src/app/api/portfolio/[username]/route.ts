import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const decodedIdentifier = decodeURIComponent(username).toLowerCase();

    // Match by user ID, email prefix, or full name match
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: decodedIdentifier },
          { email: { startsWith: decodedIdentifier } },
          { name: { contains: decodedIdentifier } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        avatarUrl: true,
        skills: true,
        totalXp: true,
        currentLevel: true,
        portfolioPublic: true,
        createdAt: true,
        userBadges: {
          include: { badge: true },
        },
        contributions: {
          where: { status: "verified" },
          include: { category: true },
          orderBy: { verifiedAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    if (!user.portfolioPublic) {
      return NextResponse.json({ error: "This portfolio is set to private" }, { status: 403 });
    }

    let parsedSkills: string[] = [];
    try {
      parsedSkills = JSON.parse(user.skills || "[]");
    } catch {
      parsedSkills = [];
    }

    return NextResponse.json({
      portfolio: {
        ...user,
        skills: parsedSkills,
      },
    });
  } catch (error) {
    console.error("Public Portfolio GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
