"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// ─── Шаги работы ─────────────────────────────────────────────────────────────
const STEPS = [
  {
    num: "01",
    title: "Заявка и знакомство",
    desc: "Оставляешь заявку на сайте или пишешь напрямую. Игорь связывается, обсуждаете цели, опыт и состояние здоровья.",
  },
  {
    num: "02",
    title: "Анкета и анализы",
    desc: "Заполняешь подробную анкету, при необходимости сдаёшь базовые анализы крови — ИИ-модуль оцифрует их автоматически.",
  },
  {
    num: "03",
    title: "Персональный план",
    desc: "Получаешь тренировочную программу и стратегию питания, построенные под твой график, инвентарь и восстановление.",
  },
  {
    num: "04",
    title: "Еженедельные отчёты",
    desc: "Раз в неделю бот напоминает сдать отчёт: вес, объёмы, самочувствие. Заполнение — 1 минута прямо в Telegram.",
  },
  {
    num: "05",
    title: "Корректировки и результат",
    desc: "Игорь анализирует динамику, корректирует нагрузку и питание. Ты видишь прогресс на графиках и идёшь к пиковой форме.",
  },
];

// ─── Компонент ──────────────────────────────────────────────────────────────
export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <section
      ref={ref}
      id="how-it-works"
      className="relative py-14 sm:py-28 overflow-hidden"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "var(--color-rim)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "var(--color-rim)" }} />

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
            Как проходит работа
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold leading-[1.15] max-w-xl">
            От заявки до формы —{" "}
            <span className="text-accent-gradient">5 понятных шагов</span>
          </h2>
        </motion.div>

        {/* Шаги */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              className="glass-card rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: "easeOut" }}
            >
              {/* Номер */}
              <span
                className="text-3xl font-bold tracking-tight"
                style={{
                  background: "linear-gradient(135deg, #f97316 0%, #fb923c 60%, #f97316 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  opacity: 0.9,
                }}
              >
                {step.num}
              </span>

              <div>
                <h3 className="font-semibold text-sm mb-1.5" style={{ color: "var(--color-txt-1)" }}>
                  {step.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--color-txt-2)" }}>
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
