"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type MediaLightboxProps = {
  open: boolean;
  src: string;
  alt: string;
  title: string;
  width: number;
  height: number;
  onClose: () => void;
};

export default function MediaLightbox({
  open,
  src,
  alt,
  title,
  width,
  height,
  onClose,
}: MediaLightboxProps) {
  const previousFocus = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previousFocus.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="relative flex max-h-full max-w-6xl flex-col overflow-hidden rounded-2xl border bg-[#0b0d10] shadow-2xl"
        style={{ borderColor: "var(--color-rim-accent)" }}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Закрыть изображение"
          className="absolute right-3 top-3 z-10 flex size-11 items-center justify-center rounded-full border border-white/15 bg-black/75 text-2xl text-white shadow-lg transition hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
        >
          <span aria-hidden="true">×</span>
        </button>

        <div className="flex min-h-0 items-center justify-center overflow-auto bg-black/40">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes="(max-width: 768px) 94vw, 85vw"
            className="h-auto max-h-[82vh] w-auto max-w-[94vw] object-contain"
          />
        </div>

        <p className="border-t border-white/10 px-4 py-3 pr-16 text-sm text-white sm:text-base">
          {title}
        </p>
      </div>
    </div>
  );
}
