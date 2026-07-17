"use client";

// ─── Блок 5: Тарифные планы ─────────────────────────────────────────────────

interface Tariff {
  badge: string;
  badgeStyle: "neutral" | "gold";
  title: string;
  subtitle: string;
  forWhom: string;
  perks: string[];
  price: string;
  period?: string;
  cta: string;
  featured?: boolean;
}

// Разовые продукты — покупаются один раз, без ежемесячного сопровождения
const ONE_TIME_TARIFFS: Tariff[] = [
  {
    badge: "Разовая оплата",
    badgeStyle: "neutral",
    title: "Тренировочный план",
    subtitle: "Программа на месяц",
    forWhom:
      "Для тех, кто хочет тренироваться самостоятельно по чёткой системе, без личного сопровождения тренера.",
    perks: [
      "Программа тренировок на 4 недели под твой уровень и цель",
      "Подбор упражнений и нагрузки под доступный инвентарь",
      "Готовый план — занимаешься в своём темпе",
    ],
    price: "7 000 ₽",
    cta: "Заказать план",
  },
  {
    badge: "Разовая оплата",
    badgeStyle: "neutral",
    title: "План с видеообзором техники",
    subtitle: "Для самостоятельных тренировок",
    forWhom:
      "Тот же тренировочный план, но с разбором техники каждого упражнения на видео — чтобы не гадать, правильно ли выполняешь движение.",
    perks: [
      "Тренировочный план на месяц",
      "Видеообзор техники выполнения каждого упражнения",
      "Идеально, если нет возможности заниматься с тренером очно",
    ],
    price: "10 000 ₽",
    cta: "Заказать план",
  },
  {
    badge: "Разовая оплата",
    badgeStyle: "neutral",
    title: "План питания",
    subtitle: "3–4 варианта меню",
    forWhom:
      "Несколько вариантов меню с вариацией продуктов — можно менять блюда местами без потери баланса БЖУ.",
    perks: [
      "3–4 готовых плана меню под твою цель",
      "Вариации продуктов под пищевые предпочтения",
      "База рецептов регулярно пополняется",
    ],
    price: "7 000 ₽",
    cta: "Заказать план питания",
  },
];

// Персональное ведение — ежемесячное сопровождение с обратной связью
const COACHING_TARIFFS: Tariff[] = [
  {
    badge: "Ежемесячно",
    badgeStyle: "neutral",
    title: "Дистанционное ведение",
    subtitle: "Тренировки + питание",
    forWhom:
      "Комплекс тренировок для зала и индивидуальный план питания с сопровождением на протяжении месяца.",
    perks: [
      "Комплекс тренировок для зала под твою цель",
      "Индивидуальный план питания",
      "Корректировки плана по ходу месяца",
    ],
    price: "11 000 ₽",
    period: "/ месяц",
    cta: "Оставить заявку",
  },
  {
    badge: "Максимум сопровождения",
    badgeStyle: "gold",
    title: "Подготовка к соревнованиям «Под ключ»",
    subtitle: "Позирование + БАДы + ведение",
    forWhom:
      "Полное сопровождение к сцене: тренировки, питание, позирование и подбор добавок под контролем тренера.",
    perks: [
      "Всё из тарифа «Дистанционное ведение»",
      "Постановка соревновательного позирования",
      "Ведение по БАДам и витаминам",
      "Полное сопровождение до соревнований",
    ],
    price: "15 000 ₽",
    period: "/ месяц",
    cta: "Занять слот на подготовку",
    featured: true,
  },
];

function scrollToContact() {
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ─── Бейдж ──────────────────────────────────────────────────────────────────
function Badge({ text, style }: { text: string; style: Tariff["badgeStyle"] }) {
  const styles: Record<string, string> = {
    neutral: "bg-white/[0.06] text-txt-2 border border-white/[0.08]",
    gold: "border text-gold animate-badge-glow",
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

// ─── Карточка тарифа ────────────────────────────────────────────────────────
function TariffCard({ t }: { t: Tariff }) {
  return (
    <div
      className="glass-card rounded-2xl p-6 flex flex-col gap-5 relative h-full"
      style={
        t.featured
          ? {
              borderColor: "var(--color-rim-accent)",
              boxShadow: "0 0 40px rgb(249 115 22 / 0.08), inset 0 0 40px rgb(249 115 22 / 0.03)",
            }
          : undefined
      }
    >
      {/* Золотая полоса сверху у премиального тарифа */}
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
            className="text-xl font-bold leading-snug"
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
          onClick={scrollToContact}
          className={`w-full px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
            t.featured ? "btn-accent" : "btn-ghost"
          }`}
        >
          {t.cta}
        </button>
      </div>
    </div>
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
        <div className="mb-10">
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

        {/* Разовые продукты */}
        <p
          className="text-xs font-semibold tracking-[0.12em] uppercase mb-4"
          style={{ color: "var(--color-txt-3)" }}
        >
          Разовые продукты
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch mb-14">
          {ONE_TIME_TARIFFS.map((t) => (
            <TariffCard key={t.title} t={t} />
          ))}
        </div>

        {/* Персональное ведение */}
        <p
          className="text-xs font-semibold tracking-[0.12em] uppercase mb-4"
          style={{ color: "var(--color-txt-3)" }}
        >
          Персональное ведение
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
          {COACHING_TARIFFS.map((t) => (
            <TariffCard key={t.title} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
