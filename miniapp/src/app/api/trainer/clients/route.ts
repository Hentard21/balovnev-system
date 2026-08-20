import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireTrainer } from "@/lib/auth";

export async function GET() {
  const trainer = await requireTrainer();
  if (!trainer) return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });

  const clients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    orderBy: { createdAt: "desc" },
    include: {
      measurements: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      _count: { select: { measurements: true } },
    },
  });

  return NextResponse.json(
    clients.map((c) => ({
      id: c.id,
      firstName: c.firstName,
      lastName: c.lastName,
      username: c.username,
      photoUrl: c.photoUrl,
      measurementsCount: c._count.measurements,
      lastMeasurement: c.measurements[0] ?? null,
    }))
  );
}
