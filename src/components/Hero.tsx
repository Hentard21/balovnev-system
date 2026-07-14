"use client";

import { asset } from "@/lib/config";

// ─── Типы ───────────────────────────────────────────────────────────────────
interface HeroProps {
  onScrollToTariffs: () => void;
  onScrollToEcosystem: () => void;
}

// ─── Компонент ──────────────────────────────────────────────────────────────
// Иммерсивный hero: фото на весь экран, контент поверх градиента.
// На мобильном фото остаётся фоном — текст прижат к низу.
export default function Hero({ onScrollToTariffs, onScrollToEcosystem }: HeroProps) {
  return (
    <section className="relative min-h-[92svh] flex items-end lg:items-center overflow-hidden">
      {/* ── Фоновое фото во весь блид ── */}
      <img
        src={asset("/photo2/hero-stage.jpg")}
        alt="Игорь Баловнев на сцене Кубка России"
        className="absolute inset-0 w-full h-full object-cover object-[70%_32%] lg:object-[78%_30%]"
        fetchPriority="high"
      />

      {/* Затемнение: слева направо для текста + снизу вверх для перехода в фон */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background: `
            linear-gradient(90deg, rgb(11 13 16 / 0.93) 0%, rgb(11 13 16 / 0.78) 38%, rgb(11 13 16 / 0.28) 70%, rgb(11 13 16 / 0.5) 100%),
            linear-gradient(to top, var(--color-deep) 4%, transparent 44%),
            linear-gradient(to bottom, rgb(11 13 16 / 0.97) 0%, rgb(11 13 16 / 0.6) 12%, transparent 28%)
          `,
        }}
      />

      {/* Вольт-свечение у левого края */}
      <div
        className="pointer-events-none absolute -left-40 top-1/3 w-[480px] h-[480px] rounded-full"
        aria-hidden="true"
        style={{ background: "radial-gradient(circle, rgb(249 115 22 / 0.07) 0%, transparent 70%)" }}
      />

      {/* ── Контент ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pb-16 pt-40 lg:py-32">
        <div className="max-w-2xl flex flex-col items-start">
          {/* Кикер */}
          <div className="inline-flex items-center gap-2.5 mb-5 sm:mb-7">
            <span className="w-2 h-2 rounded-full" style={{ background: "#f97316" }} />
            <span
              className="text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase"
              style={{ color: "#f97316" }}
            >
              Персональный онлайн-коучинг
            </span>
          </div>

          {/* H1 — коротко, дисплейным шрифтом */}
          <h1 className="uppercase text-[2.6rem] leading-[0.98] sm:text-6xl lg:text-[4.6rem] font-extrabold text-white mb-5 sm:mb-6 tracking-[0.01em]">
            Форма уровня
            <br />
            <span className="text-accent-gradient">абсолютного</span>
            <br />
            <span className="text-accent-gradient">чемпиона</span>
          </h1>

          {/* Подзаголовок */}
          <p className="text-sm sm:text-base lg:text-lg leading-relaxed mb-8 sm:mb-10 max-w-md" style={{ color: "rgb(214 217 222)" }}>
            Ведение до результата от Игоря Баловнева — 3-кратного чемпиона
            России. Научный тренинг, разбор анализов и умная экосистема
            в Telegram.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
            <button
              onClick={onScrollToTariffs}
              className="btn-accent inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm"
            >
              Занять слот на ведение
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>

            <button
              onClick={onScrollToEcosystem}
              className="btn-ghost inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-medium"
              style={{ borderColor: "rgb(255 255 255 / 0.22)", color: "#fff" }}
            >
              Как работает экосистема?
            </button>
          </div>

          {/* Титулы-чипы под CTA */}
          <div className="flex flex-wrap gap-2 mt-9 sm:mt-11">
            {["3× Чемпион России", "10+ лет тренерства", "150+ учеников"].map((chip) => (
              <span
                key={chip}
                className="text-[11px] sm:text-xs font-semibold px-3.5 py-1.5 rounded-full"
                style={{
                  color: "rgb(228 231 235)",
                  background: "rgb(255 255 255 / 0.07)",
                  border: "1px solid rgb(255 255 255 / 0.14)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
