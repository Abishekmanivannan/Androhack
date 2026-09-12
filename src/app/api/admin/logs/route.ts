import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const logs = await prisma.auditLog.findMany({
      include: {
        actor: {
          select: { name: true, email: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("Admin Audit Logs GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
