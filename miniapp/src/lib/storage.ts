import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

// Каталог с фото замеров — вне public/, доступ только через
// авторизованный API-роут (см. app/api/photos/[...path]/route.ts),
// т.к. это чувствительные данные (фото тела клиента).
export const UPLOADS_DIR = path.join(process.cwd(), "uploads");

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
};

export async function savePhoto(
  file: File,
  clientId: string,
  measurementId: string
): Promise<string> {
  const ext = EXT_BY_MIME[file.type] ?? "jpg";
  const filename = `${crypto.randomUUID()}.${ext}`;
  const relPath = path.posix.join(clientId, measurementId, filename);

  const absDir = path.join(UPLOADS_DIR, clientId, measurementId);
  await mkdir(absDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(absDir, filename), buffer);

  return relPath;
}

/** Резолвит относительный путь из БД в абсолютный, не выпуская за пределы UPLOADS_DIR. */
export function resolvePhotoPath(relPath: string): string | null {
  const abs = path.join(UPLOADS_DIR, relPath);
  if (!abs.startsWith(UPLOADS_DIR + path.sep)) return null;
  return abs;
}
