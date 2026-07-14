"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ─── Данные ─────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    id: "mini-app",
    label: "Умный Telegram Mini App",
    title: "Личный кабинет в твоем кармане",
    desc: "Раз в неделю бот напоминает о сдаче отчета. Заполнение веса, объемов, потребления воды и текущего стека БАД-ов занимает ровно 1 минуту через интуитивный интерфейс прямо внутри Telegram. Ни один параметр не потеряется.",
  },
  {
    id: "ai-health",
    label: "ИИ-скрининг здоровья",
    title: "Автоматический парсинг анализов",
    desc: "Уникальный медицинский модуль на базе ИИ. Просто загружаешь PDF с анализами крови (Инвитро, Гемотест). Нейросеть мгновенно оцифровывает маркеры здоровья, строит интерактивные графики динамики и подсвечивает тренеру малейшие отклонения от нормы.",
  },
  {
    id: "video-review",
    label: "Контроль техники 24/7",
    title: "Видеоразбор биомеханики",
    desc: "Отправляй видео выполнения упражнений прямо в систему. Игорь лично разбирает углы, векторы нагрузки и траекторию движений, корректируя твою технику на ходу, как если бы он стоял рядом с тобой в зале.",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Микро-анимация 1: Имитация чата в Telegram Mini App
// ═══════════════════════════════════════════════════════════════════════════
function MiniAppAnimation({ active }: { active: boolean }) {
  const messages = [
    { from: "bot", text: "Привет! Пришло время отчёта. Заполни 4 поля ниже.", delay: 0 },
    { from: "user", text: "Вес: 82.4 кг", delay: 1.2 },
    { from: "user", text: "Объём талии: 78 см", delay: 1.8 },
    { from: "bot", text: "✅ Принято! Следующий отчёт через неделю.", delay: 2.6 },
  ];

  return (
    <div className="flex flex-col gap-1.5 min-h-[100px]">
      <AnimatePresence>
        {active &&
          messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.from === "bot" ? -16 : 16, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: msg.delay, duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
              className={`flex ${msg.from === "bot" ? "justify-start" : "justify-end"}`}
            >
              <span
                className="text-[10px] leading-relaxed px-2.5 py-1.5 rounded-2xl max-w-[85%]"
                style={{
                  background:
                    msg.from === "bot"
                      ? "var(--color-rim)"
                      : "var(--color-accent-dim)",
                  color:
                    msg.from === "bot"
                      ? "var(--color-txt-2)"
                      : "var(--color-accent)",
                  border:
                    msg.from === "bot"
                      ? "1px solid var(--color-rim)"
                      : "1px solid var(--color-rim-accent)",
                }}
              >
                {msg.text}
              </span>
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Микро-анимация 2: Сканирование и график (ИИ-анализы)
// ═══════════════════════════════════════════════════════════════════════════
function AIHealthAnimation({ active }: { active: boolean }) {
  const [phase, setPhase] = useState<"scanning" | "chart">("scanning");

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setPhase("chart"), 2200);
    return () => clearTimeout(t);
  }, [active]);

  // Симулированные строки «сканирования»
  const scanLines = [
    "WBC  7.2 ×10⁹/L  …норма",
    "RBC  5.1 ×10¹²/L  …норма",
    "HGB  155  g/L  …норма",
    "GLU  4.8 mmol/L  …норма",
    "CRP  0.3 mg/L  …▼ низкий",
  ];

  return (
    <div className="min-h-[100px]">
      <AnimatePresence mode="wait">
        {phase === "scanning" && active ? (
          <motion.div
            key="scan"
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-1"
          >
            {scanLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.25, duration: 0.35 }}
                className="flex items-center gap-2"
              >
                {/* Полоска прогресса */}
                <motion.span
                  className="h-1 rounded-full flex-shrink-0"
                  style={{ background: "var(--color-accent)" }}
                  initial={{ width: 0 }}
                  animate={{ width: 28 + i * 6 }}
                  transition={{ delay: i * 0.25 + 0.15, duration: 0.6 }}
                />
                <span
                  className="text-[10px] font-mono leading-tight"
                  style={{ color: "var(--color-txt-2)" }}
                >
                  {line}
                </span>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Интерактивный график */
          <motion.div
            key="chart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-2"
          >
            <div className="flex items-end gap-1.5 h-[72px]">
              {[35, 52, 44, 68, 56, 80, 72, 95].map((val, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-t-sm"
                  style={{
                    background:
                      "linear-gradient(to top, var(--color-accent), var(--color-accent-light))",
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${val}%` }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                />
              ))}
            </div>
            {/* Горизонтальная ось */}
            <div
              className="h-px w-full"
              style={{ background: "var(--color-rim)" }}
            />
            <div className="flex justify-between">
              {["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг"].map((m) => (
                <span
                  key={m}
                  className="text-[9px]"
                  style={{ color: "var(--color-txt-3)" }}
                >
                  {m}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Микро-анимация 3: Видеоразбор (контроль техники)
// ═══════════════════════════════════════════════════════════════════════════
function VideoReviewAnimation({ active }: { active: boolean }) {
  return (
    <div className="relative min-h-[100px] flex items-center justify-center">
      {/* Экран телефона */}
      <motion.div
        className="relative w-[76px] h-[100px] rounded-xl overflow-hidden"
        style={{ background: "var(--color-deep)", border: "1px solid var(--color-rim)" }}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={active ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Силуэтная фигура */}
        <motion.div
          className="absolute inset-x-2 top-3 bottom-10 rounded-lg"
          style={{ background: "var(--color-rim)" }}
          animate={
            active
              ? { opacity: [0.3, 0.7, 0.3], scale: [1, 1.02, 1] }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Мишень-перекрестие */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={active ? { opacity: [0.3, 0.9, 0.3] } : {}}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            viewBox="0 0 24 24"
            style={{ color: "var(--color-accent)" }}
          >
            <circle cx="12" cy="12" r="8" />
            <line x1="12" y1="4" x2="12" y2="8" />
            <line x1="12" y1="16" x2="12" y2="20" />
            <line x1="4" y1="12" x2="8" y2="12" />
            <line x1="16" y1="12" x2="20" y2="12" />
          </svg>
        </motion.div>

        {/* Треугольник Play */}
        <motion.div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: "var(--color-accent)" }}
          animate={active ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <svg className="w-2 h-2" fill="#0b0d10" viewBox="0 0 10 12">
            <path d="M0 0v12l10-6z" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Размытый фон за телефоном */}
      <motion.div
        className="absolute inset-0 rounded-3xl"
        style={{ background: "var(--color-accent-dim)" }}
        animate={active ? { opacity: [0.3, 0.6, 0.3] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Фабрика анимации по ID
// ═══════════════════════════════════════════════════════════════════════════
function FeatureAnimation({ id, active }: { id: string; active: boolean }) {
  switch (id) {
    case "mini-app":
      return <MiniAppAnimation active={active} />;
    case "ai-health":
      return <AIHealthAnimation active={active} />;
    case "video-review":
      return <VideoReviewAnimation active={active} />;
    default:
      return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Основная секция
// ═══════════════════════════════════════════════════════════════════════════
export default function Ecosystem() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <section
      ref={ref}
      id="ecosystem"
      className="relative py-14 sm:py-28 overflow-hidden"
      style={{ background: "var(--color-surface)" }}
    >
      {/* Линии */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "var(--color-rim)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "var(--color-rim)" }} />

      {/* Фоновое свечение */}
      <div
        className="pointer-events-none absolute right-[-10%] top-[30%] w-[450px] h-[450px] rounded-full"
        aria-hidden="true"
        style={{ background: "radial-gradient(circle, rgb(249 115 22 / 0.04) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Шапка */}
        <motion.div
          className="mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p
            className="text-xs font-semibold tracking-[0.18em] uppercase mb-3"
            style={{ color: "var(--color-accent)" }}
          >
            Технологии на службе вашего тела
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold leading-[1.15] max-w-xl">
            Забудь про Excel-таблицы и&nbsp;потерянные чаты в мессенджерах
          </h2>
        </motion.div>

        {/* Карточки */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.id}
              className="glass-card rounded-2xl p-6 flex flex-col gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.12, ease: "easeOut" }}
            >
              {/* Анимированная иллюстрация */}
              <div className="overflow-hidden">
                <FeatureAnimation id={f.id} active={inView} />
              </div>

              {/* Текст */}
              <div>
                <p
                  className="text-[10px] font-semibold tracking-[0.15em] uppercase mb-1.5"
                  style={{ color: "var(--color-accent)" }}
                >
                  {f.label}
                </p>
                <h3
                  className="font-semibold text-base mb-2"
                  style={{ color: "var(--color-txt-1)" }}
                >
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-txt-2)" }}>
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
