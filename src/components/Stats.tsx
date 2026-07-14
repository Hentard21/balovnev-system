"use client";

import { useRef, useEffect, useState, useCallback, type MouseEvent } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
} from "framer-motion";

// ─── Данные ─────────────────────────────────────────────────────────────────
const STATS = [
  {
    numeric: 3,
    suffix: "×",
    label: "Чемпион России по пляжному бодибилдингу",
  },
  {
    numeric: 10,
    suffix: "+",
    label: "Лет тренерского стажа и научной практики",
  },
  {
    numeric: 150,
    suffix: "+",
    label: "Довольных клиентов и подготовленных атлетов",
  },
];

// ─── Хук: анимированный счётчик ─────────────────────────────────────────────
function useAnimatedCounter(
  target: number,
  started: boolean,
  duration = 2.2
): number {
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 40, damping: 20 });
  const rounded = useTransform(spring, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!started) return;
    const controls = animate(motionVal, target, {
      duration,
      ease: [0.22, 0.61, 0.36, 1],
    });
    return () => controls.stop();
  }, [started, target, duration, motionVal]);

  useEffect(() => {
    const unsub = rounded.on("change", setDisplay);
    return unsub;
  }, [rounded]);

  return display;
}

// ─── Компонент: Bento-карточка с Spotlight ──────────────────────────────────
function BentoCard({
  numeric,
  suffix,
  label,
  started,
}: (typeof STATS)[number] & { started: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState({ x: 50, y: 50, active: false });
  const count = useAnimatedCounter(numeric, started);

  // ── Spotlight: трекинг мыши ───────────────────────────────────────────
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpot({ x, y, active: true });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setSpot((s) => ({ ...s, active: false }));
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="glass-card rounded-2xl sm:rounded-3xl px-4 sm:px-8 py-5 sm:py-8 flex flex-col justify-between gap-2 sm:gap-3 relative overflow-hidden"
      style={{ minHeight: 140 }}
    >
      {/* Spotlight свечение */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        animate={
          spot.active
            ? {
                background: `radial-gradient(400px circle at ${spot.x}% ${spot.y}%, rgb(249 115 22 / 0.10), transparent 50%)`,
                opacity: 1,
              }
            : { opacity: 0 }
        }
        transition={{ duration: 0.25 }}
      />

      {/* Счётчик */}
      <motion.span
        className="text-3xl sm:text-6xl font-bold tracking-tight text-accent-gradient block"
        initial={{ opacity: 0, y: 20 }}
        animate={started ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {count}
        {suffix}
      </motion.span>

      {/* Лейбл */}
      <motion.span
        className="text-xs sm:text-base leading-snug"
        style={{ color: "var(--color-txt-2)" }}
        initial={{ opacity: 0, y: 10 }}
        animate={started ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      >
        {label}
      </motion.span>
    </div>
  );
}

// ─── Основная секция ────────────────────────────────────────────────────────
export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-120px 0px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-10 sm:py-20"
      style={{ background: "var(--color-surface)" }}
    >
      {/* Разделители */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "var(--color-rim)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "var(--color-rim)" }} />

      {/* Фоновое свечение */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgb(249 115 22 / 0.03) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {STATS.map((s) => (
            <BentoCard key={s.label} {...s} started={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
