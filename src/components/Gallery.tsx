"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { asset } from "@/lib/config";

// ─── Фото для галереи ──────────────────────────────────────────────────────
const GALLERY_PHOTOS = [
  {
    src: "/photo2/posing-angle1.jpg",
    alt: "Стадионная постановка - угол 1",
    size: "large",
  },
  {
    src: "/photo2/posing-angle2.jpg",
    alt: "Стадионная постановка - угол 2",
    size: "small",
  },
  {
    src: "/photo2/posing-angle3.jpg",
    alt: "Стадионная постановка - угол 3",
    size: "small",
  },
  {
    src: "/photo2/training-gym.jpg",
    alt: "Тренировка в спортзале",
    size: "large",
  },
  {
    src: "/photo2/posing-angle4.jpg",
    alt: "Стадионная постановка - угол 4",
    size: "small",
  },
  {
    src: "/photo2/posing-angle5.jpg",
    alt: "Стадионная постановка - угол 5",
    size: "small",
  },
];

// ─── Компонент галереи ─────────────────────────────────────────────────────
export default function Gallery() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={ref}
      className="relative py-14 sm:py-28 overflow-hidden"
      id="gallery"
    >
      {/* Фоновое свечение */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-1/2 h-[500px]"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgb(249 115 22 / 0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Заголовок */}
        <motion.div
          className="mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px flex-1 max-w-[40px]" style={{ background: "var(--color-accent)" }} />
            <span
              className="text-xs font-semibold tracking-[0.18em] uppercase"
              style={{ color: "var(--color-accent)" }}
            >
              Галерея
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-[1.15] max-w-3xl">
            От тренировки до{" "}
            <span className="text-accent-gradient">соревновательной сцены</span>
          </h2>

          <p
            className="text-base leading-relaxed max-w-2xl"
            style={{ color: "var(--color-txt-2)" }}
          >
            Полный цикл подготовки: интенсивная работа в зале, детальная отработка
            позирования и пиковая форма на сцене.
          </p>
        </motion.div>

        {/* Масонри-галерея */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 auto-rows-max">
          {GALLERY_PHOTOS.map((photo, idx) => (
            <motion.div
              key={idx}
              className={`relative overflow-hidden rounded-xl sm:rounded-2xl glass-card ${
                photo.size === "large"
                  ? "col-span-2 sm:col-span-2 lg:col-span-2 lg:row-span-2"
                  : "col-span-1"
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: idx * 0.08,
                ease: "easeOut",
              }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Фото */}
              <div
                className={`relative ${
                  photo.size === "large"
                    ? "aspect-[4/3] sm:aspect-[4/3] lg:aspect-[1/1.2]"
                    : "aspect-[3/4] sm:aspect-[3/4]"
                } overflow-hidden`}
              >
                <img
                  src={asset(photo.src)}
                  alt={photo.alt}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                />

                {/* Оверлей с градиентом */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
                  aria-hidden="true"
                />

                {/* Блик */}
                <div
                  className="absolute inset-0 pointer-events-none overflow-hidden"
                  aria-hidden="true"
                >
                  <div
                    className="absolute inset-y-0 w-[30%] -skew-x-[25deg]"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, rgb(255 255 255 / 0.08) 40%, rgb(255 255 255 / 0.14) 50%, rgb(255 255 255 / 0.08) 60%, transparent 100%)",
                      animation: "galleryGlare 4s ease-in-out infinite",
                      left: "-40%",
                    }}
                  />
                </div>

                {/* Анимация блика */}
                <style>{`
                  @keyframes galleryGlare {
                    0%   { left: -40%; }
                    55%  { left: 120%; }
                    100% { left: 120%; }
                  }
                `}</style>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
