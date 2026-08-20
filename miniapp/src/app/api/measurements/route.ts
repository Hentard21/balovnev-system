import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { savePhoto } from "@/lib/storage";

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const measurements = await prisma.measurement.findMany({
    where: { clientId: user.id },
    orderBy: { createdAt: "desc" },
    include: { photos: true },
  });

  return NextResponse.json(measurements);
}

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const form = await req.formData();

  const weightRaw = form.get("weightKg");
  const waterRaw = form.get("waterMl");
  const wellbeingRaw = form.get("wellbeing");
  const supplementsRaw = form.get("supplements");
  const anabolicsRaw = form.get("anabolics");
  const noteRaw = form.get("note");

  const wellbeingValues = ["GREAT", "GOOD", "OK", "BAD", "TERRIBLE"];
  const wellbeing =
    typeof wellbeingRaw === "string" && wellbeingValues.includes(wellbeingRaw)
      ? (wellbeingRaw as "GREAT" | "GOOD" | "OK" | "BAD" | "TERRIBLE")
      : null;

  const measurement = await prisma.measurement.create({
    data: {
      clientId: user.id,
      weightKg: weightRaw ? Number(weightRaw) : null,
      waterMl: waterRaw ? Number(waterRaw) : null,
      wellbeing,
      supplements: typeof supplementsRaw === "string" && supplementsRaw ? supplementsRaw : null,
      anabolics: typeof anabolicsRaw === "string" && anabolicsRaw ? anabolicsRaw : null,
      note: typeof noteRaw === "string" && noteRaw ? noteRaw : null,
    },
  });

  const files = form.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  for (const file of files) {
    const relPath = await savePhoto(file, user.id, measurement.id);
    await prisma.photo.create({ data: { measurementId: measurement.id, path: relPath } });
  }

  const full = await prisma.measurement.findUnique({
    where: { id: measurement.id },
    include: { photos: true },
  });

  return NextResponse.json(full, { status: 201 });
}
