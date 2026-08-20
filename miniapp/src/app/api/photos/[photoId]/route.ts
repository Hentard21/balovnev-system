import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { resolvePhotoPath } from "@/lib/storage";

const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ photoId: string }> }
) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const { photoId } = await params;
  const photo = await prisma.photo.findUnique({
    where: { id: photoId },
    include: { measurement: true },
  });
  if (!photo) return NextResponse.json({ error: "Не найдено" }, { status: 404 });

  const owns = photo.measurement.clientId === user.id;
  const isTrainer = user.role === "TRAINER";
  if (!owns && !isTrainer) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const absPath = resolvePhotoPath(photo.path);
  if (!absPath) return NextResponse.json({ error: "Некорректный путь" }, { status: 400 });

  try {
    const buffer = await readFile(absPath);
    const ext = photo.path.split(".").pop() ?? "";
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": MIME_BY_EXT[ext] ?? "application/octet-stream",
        "Cache-Control": "private, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Файл не найден" }, { status: 404 });
  }
}
