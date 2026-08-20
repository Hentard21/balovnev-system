import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireTrainer } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const trainer = await requireTrainer();
  if (!trainer) return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });

  const { id } = await params;
  const client = await prisma.user.findUnique({
    where: { id, role: "CLIENT" },
    include: {
      measurements: {
        orderBy: { createdAt: "asc" },
        include: { photos: true },
      },
    },
  });

  if (!client) return NextResponse.json({ error: "Не найдено" }, { status: 404 });

  return NextResponse.json(client);
}
