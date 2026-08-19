"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { asset } from "@/lib/config";
import MediaLightbox from "@/components/MediaLightbox";

const ACHIEVEMENTS = [
  {
    src: "/media/awards/02-trophies-collection-documentary.webp",
    title: "Коллекция соревновательных наград",
    meta: "Кубки, медали и статуэтки",
    alt: "Коллекция кубков, медалей и статуэток Игоря Баловнева",
    width: 928,
    height: 1216,
    featured: true,
  },
  {
    src: "/media/awards/05-absolute-champion-diploma-front.webp",
    title: "Абсолютный чемпион",
    meta: "Чемпионат России · 2024",
    alt: "Диплом Игоря Баловнева как абсолютного чемпиона России по пляжному бодибилдингу в 2024 году",
    width: 1000,
    height: 1400,
    featured: false,
  },
  {
    src: "/media/awards/06-best-athlete-plaque-front.webp",
    title: "Лучший спортсмен",
    meta: "Командная награда · 2025",
    alt: "Наградная плакетка Игорю Баловневу Лучший спортсмен за весенний сезон 2025 года",
    width: 1000,
    height: 1320,
    featured: false,
  },
  {
    src: "/media/awards/07-siberian-power-diploma-front.webp",
    title: "Первое место",
    meta: "Siberian Power Show · Красноярск",
    alt: "Диплом Игоря Баловнева за первое место на Siberian Power Show в Красноярске",
    width: 1000,
    height: 1405,
    featured: false,
  },
  {
    src: "/media/awards/08-russia-cup-diploma-front.webp",
    title: "Кубок России",
    meta: "Абсолютная категория · 2025",
    alt: "Диплом Игоря Баловнева на Кубке России по бодибилдингу в абсолютной категории в 2025 году",
    width: 1000,
    height: 1380,
    featured: false,
  },
] as const;

type Achievement = (typeof ACHIEVEMENTS)[number];

export default function Achievements() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const [selected, setSelected] = useState<Achievement | null>(null);
  const closeLightbox = useCallback(() => setSelected(null), []);

  return (
    <section ref={ref} id="achievements" className="relative overflow-hidden py-14 sm:py-28">
      <div
        className="pointer-events-none absolute right-[-12%] top-1/4 h-[480px] w-[480px] rounded-full"
        aria-hidden="true"
        style={{ background: "radial-gradient(circle, rgb(249 115 22 / 0.055) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <motion.div
          className="mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="mb-3 flex items-center gap-3 sm:mb-4">
            <span className="h-px max-w-[40px] flex-1" style={{ background: "var(--color-accent)" }} />
            <span
              className="text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--color-accent)" }}
            >
              Достижения
            </span>
          </div>
          <h2 className="max-w-2xl text-2xl font-bold leading-[1.15] sm:text-4xl">
            Опыт, подтверждённый <span className="text-accent-gradient">соревновательными результатами</span>
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed sm:text-base" style={{ color: "var(--color-txt-2)" }}>
            Оригинальные награды и документы. Каждый диплом можно открыть и рассмотреть в полном размере.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {ACHIEVEMENTS.map((achievement, index) => (
            <motion.article
              key={achievement.src}
              className={`glass-card overflow-hidden rounded-2xl ${achievement.featured ? "col-span-2 lg:row-span-2" : ""}`}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08 + index * 0.07, ease: [0.23, 1, 0.32, 1] }}
            >
              <button
                type="button"
                onClick={() => setSelected(achievement)}
                className="group block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-orange-500"
                aria-label={`Открыть документ: ${achievement.title}`}
              >
                <span
                  className={`relative block overflow-hidden bg-[#0c0f13] ${achievement.featured ? "aspect-[3/4] lg:aspect-auto lg:h-[calc(100%-85px)] lg:min-h-[650px]" : "aspect-[5/7]"}`}
                >
                  <Image
                    src={asset(achievement.src)}
                    alt={achievement.alt}
                    width={achievement.width}
                    height={achievement.height}
                    sizes={achievement.featured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 50vw, 25vw"}
                    // Featured — фотография трофеев: object-cover, чтобы заполнить
                    // карточку без тёмных полос. Дипломы/плакетки — документы:
                    // object-contain, чтобы не срезать текст награды.
                    className={`h-full w-full transition duration-500 group-hover:scale-[1.02] ${
                      achievement.featured ? "object-cover" : "object-contain"
                    }`}
                  />
                  <span className="absolute bottom-3 right-3 flex min-h-11 items-center rounded-full border border-white/15 bg-black/75 px-4 text-xs font-semibold text-white backdrop-blur-sm">
                    Рассмотреть
                  </span>
                </span>
              </button>
              <div className="border-t px-3 py-3 sm:px-5 sm:py-4" style={{ borderColor: "var(--color-rim)" }}>
                <h3 className="text-sm font-bold sm:text-base lg:text-lg" style={{ color: "var(--color-txt-1)" }}>
                  {achievement.title}
                </h3>
                <p className="mt-1 text-xs" style={{ color: "var(--color-txt-2)" }}>
                  {achievement.meta}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <MediaLightbox
        open={selected !== null}
        src={selected ? asset(selected.src) : ""}
        alt={selected?.alt ?? ""}
        title={selected?.title ?? ""}
        width={selected?.width ?? 1000}
        height={selected?.height ?? 1400}
        onClose={closeLightbox}
      />
    </section>
  );
}
