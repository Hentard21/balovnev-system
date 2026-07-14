// ─── Блок 5: Тарифные планы ─────────────────────────────────────────────────

interface Tariff {
  badge: string;
  badgeStyle: "neutral" | "gold" | "urgent";
  title: string;
  subtitle: string;
  forWhom: string;
  perks: string[];
  priceCrossed?: string;
  price: string;
  period?: string;
  cta: string;
  featured?: boolean;
}

const TARIFFS: Tariff[] = [
  {
    badge: "Скоро",
    badgeStyle: "neutral",
    title: "База",
    subtitle: "Курс видеолекций",
    forWhom:
      "Для тех, кто привык тренироваться автономно, но хочет закрыть пробелы в знаниях и биомеханике.",
    perks: [
      "Доступ к закрытой библиотеке видеоуроков от Игоря Баловнева",
      "Детальный разбор техники выполнения базовых и изолированных упражнений",
      "Методология построения сбалансированного рациона питания",
      "Основы спортивной нутрицевтики и минимизации травматизма",
    ],
    priceCrossed: "5 990 ₽",
    price: "—",
    cta: "Узнать о старте первым",
  },
  {
    badge: "Хит продаж",
    badgeStyle: "gold",
    title: "Абсолютный Чемпион",
    subtitle: "Персональное онлайн-ведение",
    forWhom:
      "Бескомпромиссное ведение до результата из любой точки мира. Идеально для подготовки к соревнованиям и создания топовой формы «для себя».",
    perks: [
      "Индивидуальный тренировочный план и стратегия питания под твои цели",
      "Полный доступ к ИИ-экосистеме (Mini App, трекеры, автоматические графики)",
      "Глубокий разбор анализов крови и составление плана БАД/витаминов",
      "Еженедельный контроль отчетов и оперативные корректировки",
      "Консультации и видеоразборы техники упражнений",
      "Прямой закрытый чат с Игорем Баловневым",
    ],
    priceCrossed: "20 000 ₽",
    price: "15 000 ₽",
    period: "/ месяц",
    cta: "Занять слот на ведение",
    featured: true,
  },
  {
    badge: "Осталось 2 места",
    badgeStyle: "urgent",
    title: "Гран-при Pro",
    subtitle: "Очный тренинг в Краснодаре",
    forWhom:
      "Премиальный формат для тех, кому необходим тотальный контроль face-to-face и личное менторство чемпиона.",
    perks: [
      "Включает ВСЕ опции тарифа «Абсолютный Чемпион»",
      "3 персональные тренировки в неделю под личным присмотром Игоря",
      "Длительность каждой сессии — от 1.5 до 2 часов",
      "Постановка соревновательного позирования и сценического образа",
      "Локация: премиальный тренажерный зал в г. Краснодар",
    ],
    price: "20 000 ₽",
    period: "/ месяц",
    cta: "Забронировать место",
  },
];

// ─── Бейдж ──────────────────────────────────────────────────────────────────
function Badge({ text, style }: { text: string; style: Tariff["badgeStyle"] }) {
  const styles: Record<string, string> = {
    neutral: "bg-white/[0.06] text-txt-2 border border-white/[0.08]",
    gold: "border text-gold animate-badge-glow",
    urgent: "bg-white/[0.06] text-txt-2 border border-white/[0.08]",
  };

  return (
    <>
      {/* Keyframes для «горящего» бейджа */}
      {style === "gold" && (
        <style>{`
          @keyframes badgeGlow {
            0%, 100% {
              box-shadow: 0 0 6px 0px rgb(249 115 22 / 0.20),
                          0 0 14px 3px rgb(249 115 22 / 0.08),
                          inset 0 0 6px 0px rgb(249 115 22 / 0.06);
              transform: scale(1);
            }
            40% {
              box-shadow: 0 0 16px 3px rgb(249 115 22 / 0.45),
                          0 0 32px 8px rgb(249 115 22 / 0.16),
                          inset 0 0 14px 2px rgb(249 115 22 / 0.12);
              transform: scale(1.025);
            }
            70% {
              box-shadow: 0 0 10px 1px rgb(249 115 22 / 0.30),
                          0 0 20px 5px rgb(249 115 22 / 0.10),
                          inset 0 0 10px 1px rgb(249 115 22 / 0.08);
              transform: scale(1.01);
            }
          }
          .animate-badge-glow {
            animation: badgeGlow 2.2s ease-in-out infinite;
          }
        `}</style>
      )}

      <span
        className={`inline-block text-[10px] font-semibold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full ${styles[style]}`}
        style={
          style === "gold"
            ? {
                background: "var(--color-accent-dim)",
                borderColor: "var(--color-rim-accent)",
                color: "var(--color-accent)",
              }
            : undefined
        }
      >
        {text}
      </span>
    </>
  );
}

// ─── Галочка ────────────────────────────────────────────────────────────────
function Check({ featured }: { featured?: boolean }) {
  return (
    <svg
      className="w-4 h-4 flex-shrink-0 mt-0.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      viewBox="0 0 24 24"
      style={{ color: featured ? "var(--color-accent)" : "var(--color-txt-3)" }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

// ─── Основной компонент ─────────────────────────────────────────────────────
export default function Tariffs() {
  return (
    <section id="tariffs" className="relative py-14 sm:py-28 overflow-hidden">
      {/* Фоновое свечение */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "var(--color-rim)" }}
      />
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-1/3 w-[600px] h-[600px] rounded-full"
        aria-hidden="true"
        style={{ background: "radial-gradient(circle, rgb(249 115 22 / 0.04) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Шапка */}
        <div className="mb-14">
          <p
            className="text-xs font-semibold tracking-[0.18em] uppercase mb-3"
            style={{ color: "var(--color-accent)" }}
          >
            Тарифные планы
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold leading-[1.15]">
            Выбери свой формат работы
          </h2>
        </div>

        {/* Сетка карточек */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {TARIFFS.map((t) => (
            <div
              key={t.title}
              className="glass-card rounded-2xl p-6 flex flex-col gap-5 relative"
              style={
                t.featured
                  ? {
                      borderColor: "var(--color-rim-accent)",
                      boxShadow: "0 0 40px rgb(249 115 22 / 0.08), inset 0 0 40px rgb(249 115 22 / 0.03)",
                    }
                  : undefined
              }
            >
              {/* Золотая точка "Хит продаж" */}
              {t.featured && (
                <div
                  className="absolute -top-px left-6 right-6 h-px rounded-full"
                  style={{ background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)" }}
                />
              )}

              {/* Бейдж + название */}
              <div className="flex flex-col gap-3">
                <Badge text={t.badge} style={t.badgeStyle} />
                <div>
                  <p
                    className="text-[10px] font-semibold tracking-[0.12em] uppercase mb-1"
                    style={{ color: "var(--color-txt-3)" }}
                  >
                    {t.subtitle}
                  </p>
                  <h3
                    className="text-xl font-bold"
                    style={
                      t.featured
                        ? {
                            background: "linear-gradient(135deg, #f97316 0%, #fb923c 60%, #f97316 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }
                        : { color: "var(--color-txt-1)" }
                    }
                  >
                    {t.title}
                  </h3>
                </div>
              </div>

              {/* Для кого */}
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-txt-2)" }}>
                {t.forWhom}
              </p>

              {/* Список преимуществ */}
              <ul className="flex flex-col gap-2.5">
                {t.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5">
                    <Check featured={t.featured} />
                    <span className="text-sm leading-snug" style={{ color: "var(--color-txt-2)" }}>
                      {perk}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Цена + кнопка */}
              <div className="mt-auto pt-4 border-t flex flex-col gap-4" style={{ borderColor: "var(--color-rim)" }}>
                <div className="flex items-baseline gap-2 flex-wrap">
                  {t.priceCrossed && (
                    <span className="text-sm line-through" style={{ color: "var(--color-txt-3)" }}>
                      {t.priceCrossed}
                    </span>
                  )}
                  <span
                    className="text-2xl font-bold"
                    style={t.featured ? { color: "var(--color-accent-light)" } : { color: "var(--color-txt-1)" }}
                  >
                    {t.price}
                  </span>
                  {t.period && (
                    <span className="text-sm" style={{ color: "var(--color-txt-2)" }}>
                      {t.period}
                    </span>
                  )}
                </div>

                <button
                  className={`w-full px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                    t.featured ? "btn-accent" : "btn-ghost"
                  }`}
                >
                  {t.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
