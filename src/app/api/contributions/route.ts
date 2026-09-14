import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const categoryId = searchParams.get("categoryId");

    const whereClause: Record<string, unknown> = { userId: user.id };
    if (status && status !== "all") whereClause.status = status;
    if (categoryId && categoryId !== "all") whereClause.categoryId = categoryId;

    const contributions = await prisma.contribution.findMany({
      where: whereClause,
      include: {
        category: true,
        reviewer: {
          select: { name: true, email: true, role: true },
        },
        clarificationMessages: {
          include: {
            sender: {
              select: { name: true, role: true, avatarUrl: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ contributions });
  } catch (error) {
    console.error("Contributions GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      categoryId,
      title,
      description,
      projectEventName,
      evidenceType,
      evidenceUrl,
      isDraft,
    } = await req.json();

    if (!categoryId || !title || !description || !evidenceUrl) {
      return NextResponse.json(
        { error: "Category, Title, Description, and Evidence URL are required" },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 400 });
    }

    const status = isDraft ? "draft" : "pending";
    const suggestedPoints = category.baseXp;

    const contribution = await prisma.contribution.create({
      data: {
        userId: user.id,
        categoryId,
        title: title.trim(),
        description: description.trim(),
        projectEventName: (projectEventName || "General Activity").trim(),
        evidenceType: evidenceType || "url",
        evidenceUrl: evidenceUrl.trim(),
        status,
        pointsAwarded: suggestedPoints,
      },
      include: { category: true },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: isDraft ? "CREATED_DRAFT" : "SUBMITTED_CONTRIBUTION",
        targetEntity: "contribution",
        targetId: contribution.id,
        payload: JSON.stringify({ title, category: category.name }),
      },
    });

    return NextResponse.json({ success: true, contribution });
  } catch (error) {
    console.error("Contributions POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
