"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ─── Вопросы-ответы ──────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: "Подойдёт ли ведение новичку без опыта?",
    a: "Да. Программа строится от твоего текущего уровня: сначала ставим технику базовых движений через видеоразборы, затем постепенно повышаем нагрузку. Большинство учеников начинали не с соревновательных амбиций, а с цели «привести себя в форму».",
  },
  {
    q: "Что если у меня нет тренажёрного зала?",
    a: "План адаптируется под доступный инвентарь: домашние тренировки с гантелями и резиной, турники или минимальный набор оборудования. При первой возможности программа масштабируется под полноценный зал.",
  },
  {
    q: "Как проходит еженедельная отчётность?",
    a: "Раз в неделю Telegram-бот напоминает сдать отчёт: вес, объёмы, потребление воды, самочувствие и фото формы. Заполнение занимает около минуты. Все данные сохраняются и превращаются в графики динамики — ничего не теряется в переписках.",
  },
  {
    q: "Зачем нужны анализы крови и обязательно ли их сдавать?",
    a: "Анализы — не обязательное условие, но сильная рекомендация. Они показывают дефициты и особенности организма, которые влияют на восстановление и прогресс. Загружаешь PDF из лаборатории — ИИ-модуль оцифровывает маркеры и подсвечивает тренеру отклонения. Это информационный разбор, а не медицинская диагностика.",
  },
  {
    q: "Как происходит оплата и можно ли прекратить ведение?",
    a: "Оплата помесячная, 100% предоплата за расчётный период. Ведение можно приостановить или прекратить в любой момент — деньги за неиспользованный период возвращаются по условиям оферты.",
  },
  {
    q: "Сколько времени занимает связь с тренером?",
    a: "На форматах персонального ведения у тебя прямой чат с Игорем: ответы на вопросы — в течение рабочего дня, разборы видео техники — в течение 1–2 дней. Это личное ведение, а не автоответы ассистентов.",
  },
];

// ─── Один вопрос (аккордеон) ─────────────────────────────────────────────────
function FaqItem({
  item,
  open,
  onToggle,
}: {
  item: (typeof FAQ_ITEMS)[number];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="glass-card rounded-2xl overflow-hidden transition-colors"
      style={open ? { borderColor: "var(--color-rim-accent)" } : undefined}
    >
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left"
      >
        <span className="text-sm sm:text-base font-semibold" style={{ color: "var(--color-txt-1)" }}>
          {item.q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
          style={{
            background: "var(--color-accent-dim)",
            border: "1px solid var(--color-rim-accent)",
            color: "var(--color-accent)",
          }}
          aria-hidden="true"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <p
              className="px-5 sm:px-6 pb-5 text-sm leading-relaxed"
              style={{ color: "var(--color-txt-2)" }}
            >
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Секция ──────────────────────────────────────────────────────────────────
export default function FAQ() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      ref={ref}
      id="faq"
      className="relative py-14 sm:py-28 overflow-hidden"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "var(--color-rim)" }} />

      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8">
        {/* Шапка */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p
            className="text-xs font-semibold tracking-[0.18em] uppercase mb-3"
            style={{ color: "var(--color-accent)" }}
          >
            FAQ
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold leading-[1.15]">
            Частые <span className="text-accent-gradient">вопросы</span>
          </h2>
        </motion.div>

        {/* Аккордеон */}
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        >
          {FAQ_ITEMS.map((item, i) => (
            <FaqItem
              key={item.q}
              item={item}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
