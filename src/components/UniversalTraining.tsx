"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { asset } from "@/lib/config";

// ─── Видео-слот с тонировкой и бликом ───────────────────────────────────────
// Видео не грузятся при открытии страницы (preload="none") и стартуют только
// когда карточка попадает во вьюпорт — экономим ~20 МБ трафика на мобильных.
function VideoSlot({
  src,
  title,
  label,
  desc,
  direction,
  objectPosition = "50% 50%",
}: {
  src: string;
  title: string;
  label: string;
  desc: string;
  direction: "left" | "right";
  /** Точка кадрирования для object-cover — по умолчанию центр. */
  objectPosition?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { margin: "100px 0px" });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (inView) {
      // play() может отклониться до взаимодействия — глушим ошибку
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [inView]);

  return (
    <motion.div
      ref={wrapRef}
      className="glass-card rounded-3xl overflow-hidden flex flex-col"
      initial={{ opacity: 0, x: direction === "left" ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: direction === "left" ? 0.15 : 0.25, ease: "easeOut" }}
    >
      {/* Видеоплеер с тонировкой и бликом */}
      <div className="relative aspect-[4/3] overflow-hidden" style={{ background: "var(--color-card)" }}>
        <video
          ref={videoRef}
          src={asset(src)}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition }}
        />

        {/* Тонировка: лёгкое затемнение снизу для читаемости, без глухой пелены */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgb(11 13 16 / 0.35) 0%, transparent 40%)",
          }}
        />

        {/* Блик: диагональная полоса, бесконечно скользящая */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="absolute inset-y-0 w-[30%] -skew-x-[25deg]"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgb(255 255 255 / 0.08) 40%, rgb(255 255 255 / 0.14) 50%, rgb(255 255 255 / 0.08) 60%, transparent 100%)",
              animation: "videoGlare 3.5s ease-in-out infinite",
              left: "-40%",
            }}
          />
        </div>

        {/* Анимация блика */}
        <style>{`
          @keyframes videoGlare {
            0%   { left: -40%; }
            55%  { left: 120%; }
            100% { left: 120%; }
          }
        `}</style>
      </div>

      {/* Текст */}
      <div className="p-5 sm:p-6 flex flex-col gap-2">
        <span
          className="text-[10px] font-semibold tracking-[0.15em] uppercase"
          style={{ color: "var(--color-accent)" }}
        >
          {label}
        </span>
        <h3 className="text-lg font-bold" style={{ color: "var(--color-txt-1)" }}>
          {title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-txt-2)" }}>
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Основная секция ────────────────────────────────────────────────────────
export default function UniversalTraining() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <section ref={ref} id="training" className="relative py-14 sm:py-28 overflow-hidden">
      {/* Фоновое свечение */}
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-[500px]"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgb(249 115 22 / 0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Заголовок */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold leading-[1.15] max-w-2xl">
            Экспертный тренинг{" "}
            <span className="text-accent-gradient">без ограничений</span>
          </h2>
        </motion.div>

        {/* Двухколоночный грид */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          <VideoSlot
            src="/video/girls-training.mp4"
            label="Женское направление"
            title="Идеальные пропорции"
            desc="Создание идеальных пропорций: акцентированная проработка ягодичных мышц, плоский живот и тонус без перетренированности. Научный подход к женской биомеханике и гормональному фону."
            direction="left"
          />

          <VideoSlot
            src="/video/man-training.mp4"
            label="Мужское направление"
            title="Сила и эстетика"
            desc="Построение V-образного силуэта: широчайшие мышцы спины, дельты, рельефный пресс. Система тренировок, по которой готовятся чемпионы страны — адаптированная под твой уровень и график."
            direction="right"
          />
        </div>

        {/* Дополнительный ряд видео - работа с клиентами */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <VideoSlot
            src="/video/IMG_0442.mp4"
            label="Техника выполнения"
            title="Базовые упражнения"
            desc="Детальный разбор биомеханики выполнения упражнений со сложной техникой. Правильная траектория и амплитуда движений для максимальной эффективности и безопасности."
            direction="left"
            // Кадр по умолчанию (центр) обрезает голову — в этом ролике
            // смещаем точку кадрирования выше, к лицу
            objectPosition="50% 15%"
          />

          <VideoSlot
            src="/video/IMG_1978.mp4"
            label="Работа с клиентом"
            title="Персональная коррекция"
            desc="Live-тренировка с корректировкой техники в реальном времени. Видеоразбор ошибок и их исправление для достижения лучших результатов и предотвращения травм."
            direction="right"
          />

          <VideoSlot
            src="/video/IMG_2022.mp4"
            label="Прогрессия нагрузки"
            title="Методология тренировок"
            desc="Система постепенного увеличения нагрузки, адаптированная под индивидуальные способности. Управление восстановлением и оптимизация тренировочного цикла для максимального результата."
            direction="left"
          />
        </div>
      </div>
    </section>
  );
}
