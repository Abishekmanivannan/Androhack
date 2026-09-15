import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { department, skills, portfolioPublic, avatarUrl } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        department: typeof department === "string" ? department.trim() : undefined,
        skills: Array.isArray(skills) ? skills.map((s: string) => s.trim()) : undefined,
        portfolioPublic: typeof portfolioPublic === "boolean" ? portfolioPublic : undefined,
        avatarUrl: typeof avatarUrl === "string" ? avatarUrl.trim() : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        avatarUrl: true,
        skills: true,
        portfolioPublic: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Profile PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
