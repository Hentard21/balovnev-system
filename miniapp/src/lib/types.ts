export interface PhotoDto {
  id: string;
  path: string;
}

export interface MeasurementDto {
  id: string;
  weightKg: number | null;
  waterMl: number | null;
  wellbeing: "GREAT" | "GOOD" | "OK" | "BAD" | "TERRIBLE" | null;
  supplements: string | null;
  anabolics: string | null;
  note: string | null;
  createdAt: string;
  photos: PhotoDto[];
}

export interface ClientSummaryDto {
  id: string;
  firstName: string;
  lastName: string | null;
  username: string | null;
  photoUrl: string | null;
  measurementsCount: number;
  lastMeasurement: MeasurementDto | null;
}

export interface ClientDetailDto {
  id: string;
  firstName: string;
  lastName: string | null;
  username: string | null;
  photoUrl: string | null;
  measurements: MeasurementDto[];
}

export function parseTags(json: string | null): string[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}
