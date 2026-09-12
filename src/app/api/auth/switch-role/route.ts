import { NextResponse } from "next/server";
import { getCurrentUser, signUserToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { targetRole } = await req.json();
    if (!["member", "coordinator", "admin"].includes(targetRole)) {
      return NextResponse.json({ error: "Invalid role target" }, { status: 400 });
    }

    const currentUser = await getCurrentUser();
    
    // Find or switch demo user for target role
    let user = currentUser;
    if (currentUser) {
      user = await prisma.user.update({
        where: { id: currentUser.id },
        data: { role: targetRole },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          department: true,
          avatarUrl: true,
          skills: true,
          totalXp: true,
          currentLevel: true,
          portfolioPublic: true,
          createdAt: true,
        },
      });
    } else {
      // Find seed user for this role
      const seedEmail =
        targetRole === "coordinator"
          ? "coordinator@club.org"
          : targetRole === "admin"
          ? "admin@club.org"
          : "alex@club.org";
      
      const seedUser = await prisma.user.findUnique({
        where: { email: seedEmail },
      });

      if (seedUser) {
        user = seedUser;
      }
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const token = signUserToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({ success: true, user });
    response.cookies.set("clubconnect_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Role switch error:", error);
    return NextResponse.json({ error: "Failed to switch role" }, { status: 500 });
  }
}
