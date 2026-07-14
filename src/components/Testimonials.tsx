"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// ═════════════════════════════════════════════════════════════════════════════
// ⚠️ ЗАГЛУШКИ: замените на реальные отзывы учеников (текст, имя, цель,
// результат) с их письменного согласия. Фото «до/после» можно добавить
// в поле photo — сейчас вместо фото показываются инициалы.
// ═════════════════════════════════════════════════════════════════════════════
const TESTIMONIALS = [
  {
    name: "Алексей К.",
    goal: "Подготовка к первым соревнованиям",
    result: "−9 кг жира · 6 месяцев",
    text:
      "Пришёл с обычной «качалочной» формой, через полгода вышел на сцену и взял топ-5 в дебюте. Еженедельные отчёты в боте дисциплинируют лучше любого мотивационного видео.",
  },
  {
    name: "Мария С.",
    goal: "Форма после декрета",
    result: "−12 кг · 8 месяцев",
    text:
      "Больше всего боялась, что придётся жить на грече и куриной грудке. Оказалось, питание подстраивается под мою жизнь, а не наоборот. Разбор анализов показал, что нужно чинить железо — и энергия вернулась.",
  },
  {
    name: "Дмитрий В.",
    goal: "Пиковая форма «для себя»",
    result: "+7 кг мышечной массы · 1 год",
    text:
      "Тренируюсь 15 лет, думал что всё знаю. Игорь за первый месяц нашёл три ошибки в технике, которые годами тормозили прогресс жима. Видеоразборы — самая ценная часть ведения.",
  },
];

// ─── Карточка отзыва ─────────────────────────────────────────────────────────
function TestimonialCard({
  t,
  index,
  inView,
}: {
  t: (typeof TESTIMONIALS)[number];
  index: number;
  inView: boolean;
}) {
  const initials = t.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <motion.figure
      className="glass-card rounded-2xl p-6 flex flex-col gap-4"
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.15 + index * 0.12, ease: "easeOut" }}
    >
      {/* Результат-бейдж */}
      <span
        className="self-start text-[10px] font-semibold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full"
        style={{
          background: "var(--color-accent-dim)",
          border: "1px solid var(--color-rim-accent)",
          color: "var(--color-accent)",
        }}
      >
        {t.result}
      </span>

      {/* Текст */}
      <blockquote className="text-sm leading-relaxed flex-1" style={{ color: "var(--color-txt-2)" }}>
        «{t.text}»
      </blockquote>

      {/* Автор */}
      <figcaption className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: "var(--color-rim)" }}>
        <span
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
          style={{
            background: "var(--color-accent-dim)",
            border: "1px solid var(--color-rim-accent)",
            color: "var(--color-accent)",
          }}
          aria-hidden="true"
        >
          {initials}
        </span>
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--color-txt-1)" }}>
            {t.name}
          </p>
          <p className="text-xs" style={{ color: "var(--color-txt-3)" }}>
            {t.goal}
          </p>
        </div>
      </figcaption>
    </motion.figure>
  );
}

// ─── Секция ──────────────────────────────────────────────────────────────────
export default function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <section ref={ref} id="testimonials" className="relative py-14 sm:py-28 overflow-hidden">
      {/* Фоновое свечение */}
      <div
        className="pointer-events-none absolute left-[-10%] top-1/3 w-[420px] h-[420px] rounded-full"
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
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <span className="h-px flex-1 max-w-[40px]" style={{ background: "var(--color-accent)" }} />
            <span
              className="text-xs font-semibold tracking-[0.18em] uppercase"
              style={{ color: "var(--color-accent)" }}
            >
              Отзывы
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold leading-[1.15] max-w-xl">
            Результаты, о которых{" "}
            <span className="text-accent-gradient">говорят ученики</span>
          </h2>
        </motion.div>

        {/* Карточки */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.name} t={t} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
