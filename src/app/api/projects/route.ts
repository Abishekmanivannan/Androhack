import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, avatarUrl: true, department: true, currentLevel: true },
            },
          },
        },
        _count: {
          select: { contributions: true, members: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Projects GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "coordinator" && user.role !== "admin")) {
      return NextResponse.json({ error: "Forbidden: Coordinator permissions required" }, { status: 403 });
    }

    const { name, description, githubUrl, requiredSkills } = await req.json();

    if (!name || !description) {
      return NextResponse.json({ error: "Name and description are required" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        githubUrl: githubUrl ? githubUrl.trim() : null,
        requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      },
    });

    // Add creator as lead
    await prisma.projectMember.create({
      data: {
        projectId: project.id,
        userId: user.id,
        role: "lead",
      },
    });

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error("Projects POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
