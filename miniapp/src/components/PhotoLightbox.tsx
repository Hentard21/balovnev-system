"use client";

import { useEffect } from "react";
import { PhotoDto } from "@/lib/types";

export function PhotoLightbox({
  photos,
  index,
  onIndexChange,
  onClose,
}: {
  photos: PhotoDto[];
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}) {
  // Разрешаем нативный pinch-zoom только пока лайтбокс открыт — в остальном
  // приложении масштабирование выключено (viewport userScalable: false),
  // чтобы случайные жесты не ломали интерфейс.
  useEffect(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    const original = meta?.getAttribute("content") ?? null;
    meta?.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=4, user-scalable=yes");
    return () => {
      if (meta && original) meta.setAttribute("content", original);
    };
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndexChange((index + 1) % photos.length);
      if (e.key === "ArrowLeft") onIndexChange((index - 1 + photos.length) % photos.length);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index, photos.length, onIndexChange, onClose]);

  const photo = photos[index];
  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/95"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top)+12px)]">
        <span className="text-sm" style={{ color: "var(--color-txt-3)" }}>
          {photos.length > 1 ? `${index + 1} / ${photos.length}` : ""}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full text-xl"
          style={{ background: "var(--color-surface)", color: "var(--color-txt-1)" }}
          aria-label="Закрыть"
        >
          ×
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-auto p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/api/photos/${photo.id}`}
          alt="Фото замера"
          className="max-h-full max-w-full touch-pinch-zoom select-none object-contain"
          onClick={(e) => e.stopPropagation()}
        />

        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onIndexChange((index - 1 + photos.length) % photos.length);
              }}
              className="absolute left-2 flex h-10 w-10 items-center justify-center rounded-full text-xl"
              style={{ background: "var(--color-surface)", color: "var(--color-txt-1)" }}
              aria-label="Предыдущее фото"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onIndexChange((index + 1) % photos.length);
              }}
              className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-full text-xl"
              style={{ background: "var(--color-surface)", color: "var(--color-txt-1)" }}
              aria-label="Следующее фото"
            >
              ›
            </button>
          </>
        )}
      </div>

      {photos.length > 1 && (
        <div className="flex justify-center gap-1.5 pb-[calc(env(safe-area-inset-bottom)+16px)]">
          {photos.map((p, i) => (
            <span
              key={p.id}
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: i === index ? "var(--color-accent)" : "var(--color-rim)" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
