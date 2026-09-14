import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const members = await prisma.user.findMany({
      select: { id: true, name: true, skills: true },
    });

    const projects = await prisma.project.findMany({
      select: { id: true, name: true, requiredSkills: true },
    });

    const skillCounts: Record<string, number> = {};
    const skillMembers: Record<string, string[]> = {};

    for (const m of members) {
      for (const skill of m.skills) {
        const cleanSkill = skill.trim();
        skillCounts[cleanSkill] = (skillCounts[cleanSkill] || 0) + 1;
        if (!skillMembers[cleanSkill]) skillMembers[cleanSkill] = [];
        skillMembers[cleanSkill].push(m.name);
      }
    }

    // Identify required skills in projects vs supply in members
    const projectSkillCounts: Record<string, number> = {};
    for (const p of projects) {
      for (const s of p.requiredSkills) {
        const cleanSkill = s.trim();
        projectSkillCounts[cleanSkill] = (projectSkillCounts[cleanSkill] || 0) + 1;
      }
    }

    const skillMatrix = Object.keys(skillCounts).map((skill) => ({
      skill,
      memberCount: skillCounts[skill],
      members: skillMembers[skill],
      projectDemandCount: projectSkillCounts[skill] || 0,
      isGap: (projectSkillCounts[skill] || 0) > skillCounts[skill],
    }));

    skillMatrix.sort((a, b) => b.memberCount - a.memberCount);

    return NextResponse.json({ skillMatrix });
  } catch (error) {
    console.error("Skill Matrix GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
