import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { categoryId, baseXp } = await req.json();

    if (!categoryId || typeof baseXp !== "number" || baseXp < 1) {
      return NextResponse.json({ error: "Valid categoryId and baseXp required" }, { status: 400 });
    }

    const updated = await prisma.category.update({
      where: { id: categoryId },
      data: { baseXp },
    });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: "UPDATED_CATEGORY_BASE_XP",
        targetEntity: "category",
        targetId: categoryId,
        payload: JSON.stringify({ categoryName: updated.name, newBaseXp: baseXp }),
      },
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (error) {
    console.error("Admin Category update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
