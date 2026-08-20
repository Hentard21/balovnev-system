"use client";

import { useState } from "react";
import { MeasurementDto, parseTags } from "@/lib/types";
import { wellbeingMeta } from "@/components/WellbeingPicker";
import { PhotoLightbox } from "@/components/PhotoLightbox";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
}

export function MeasurementCard({ m, previous }: { m: MeasurementDto; previous?: MeasurementDto }) {
  const mood = wellbeingMeta(m.wellbeing);
  const supplements = parseTags(m.supplements);
  const anabolics = parseTags(m.anabolics);
  const delta = m.weightKg != null && previous?.weightKg != null ? m.weightKg - previous.weightKg : null;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-start justify-between">
        <span className="text-xs" style={{ color: "var(--color-txt-3)" }}>
          {formatDate(m.createdAt)}
        </span>
        {mood && <span className="text-xl leading-none">{mood.emoji}</span>}
      </div>

      <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        {m.weightKg != null && (
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-2xl" style={{ color: "var(--color-txt-1)" }}>
              {m.weightKg} кг
            </span>
            {delta != null && (
              <span
                className="text-xs"
                style={{ color: delta > 0 ? "var(--color-warn)" : delta < 0 ? "var(--color-good)" : "var(--color-txt-3)" }}
              >
                {delta > 0 ? "+" : ""}
                {delta.toFixed(1)}
              </span>
            )}
          </div>
        )}
        {m.waterMl != null && (
          <span className="text-sm" style={{ color: "var(--color-txt-2)" }}>
            💧 {(m.waterMl / 1000).toFixed(1)} л
          </span>
        )}
      </div>

      {(supplements.length > 0 || anabolics.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {supplements.map((s, i) => (
            <span
              key={`s-${i}`}
              className="rounded-full border px-2.5 py-0.5 text-[11px]"
              style={{ borderColor: "var(--color-rim)", color: "var(--color-txt-2)" }}
            >
              {s}
            </span>
          ))}
          {anabolics.map((a, i) => (
            <span
              key={`a-${i}`}
              className="rounded-full border px-2.5 py-0.5 text-[11px]"
              style={{ borderColor: "rgb(234 179 8 / 0.35)", background: "rgb(234 179 8 / 0.08)", color: "var(--color-warn)" }}
            >
              ⚠ {a}
            </span>
          ))}
        </div>
      )}

      {m.note && (
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-txt-2)" }}>
          {m.note}
        </p>
      )}

      {m.photos.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {m.photos.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setLightboxIndex(i)}
              className="shrink-0 rounded-lg"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/photos/${p.id}`}
                alt="Фото замера"
                className="h-16 w-16 rounded-lg object-cover"
                style={{ border: "1px solid var(--color-rim)" }}
              />
            </button>
          ))}
        </div>
      )}

      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={m.photos}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
