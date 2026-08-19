"use client";

const DIRECTIONS = [
  {
    number: "01",
    title: "Снижение веса",
    description:
      "План под безопасное снижение жировой массы с понятной нагрузкой, рационом и контролем динамики.",
    focus: "Силовые, ежедневная активность, питание",
  },
  {
    number: "02",
    title: "Набор мышечной массы",
    description:
      "Прогрессия нагрузки и объёма с учётом стажа, восстановления, техники и доступного оборудования.",
    focus: "Гипертрофия, сила, восстановление",
  },
  {
    number: "03",
    title: "Коррекция фигуры",
    description:
      "Работа над пропорциями и приоритетными мышечными группами без универсального шаблона для всех.",
    focus: "Пропорции, мобильность, слабые зоны",
  },
  {
    number: "04",
    title: "Функциональная форма",
    description:
      "Круговые, многоповторные и функциональные тренировки для выносливости и общей работоспособности.",
    focus: "Круговые, CrossFit, многоповторка",
  },
  {
    number: "05",
    title: "Подготовка к сцене",
    description:
      "Периодизированная подготовка с тренировками, питанием, контролем формы и соревновательными задачами.",
    focus: "Форма, позирование, контроль этапов",
  },
] as const;

function scrollToQuestionnaire() {
  const detail = { product: "unsure" as const, offer: "" as const };
  (
    window as typeof window & {
      __balovnevProductSelection?: typeof detail;
    }
  ).__balovnevProductSelection = detail;
  window.dispatchEvent(
    new CustomEvent("balovnev:select-product", {
      detail,
    }),
  );
  document
    .getElementById("contact")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function ProgramDirections() {
  return (
    <section
      id="directions"
      className="relative overflow-hidden border-y py-14 sm:py-24"
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-rim)",
      }}
    >
      <div
        className="pointer-events-none absolute right-[-120px] top-[-180px] h-[420px] w-[420px] rounded-full"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle, var(--color-accent-dim) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="mb-10 grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.6fr)] lg:items-end lg:gap-12">
          <div>
            <p
              className="mb-3 text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--color-accent)" }}
            >
              Программы под задачу
            </p>
            <h2 className="max-w-3xl text-3xl font-bold leading-[1.08] sm:text-5xl">
              Не шаблон из интернета, а{" "}
              <span className="text-accent-gradient">понятный план действий</span>
            </h2>
          </div>

          <p
            className="max-w-xl text-sm leading-relaxed sm:text-base"
            style={{ color: "var(--color-txt-2)" }}
          >
            Одна и та же программа не подходит новичку после перерыва,
            опытному атлету без системы и человеку с травмами. Направление,
            объём и формат работы определяются после анкеты.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {DIRECTIONS.map((direction) => (
            <article
              key={direction.title}
              className="glass-card flex min-h-[260px] flex-col rounded-2xl p-5 sm:p-6"
            >
              <div className="mb-8 flex items-center justify-between gap-4">
                <span
                  className="font-display text-3xl font-bold tabular-nums"
                  style={{ color: "var(--color-accent)" }}
                  aria-hidden="true"
                >
                  {direction.number}
                </span>
                <span
                  className="h-px flex-1"
                  style={{ background: "var(--color-rim)" }}
                  aria-hidden="true"
                />
              </div>

              <h3 className="mb-3 text-xl font-bold leading-tight">
                {direction.title}
              </h3>
              <p
                className="mb-6 text-sm leading-relaxed"
                style={{ color: "var(--color-txt-2)" }}
              >
                {direction.description}
              </p>
              <p
                className="mt-auto border-t pt-4 text-xs font-medium leading-relaxed"
                style={{
                  borderColor: "var(--color-rim)",
                  color: "var(--color-txt-3)",
                }}
              >
                {direction.focus}
              </p>
            </article>
          ))}
        </div>

        <div
          className="mt-6 flex flex-col gap-5 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7"
          style={{
            borderColor: "var(--color-rim-accent)",
            background: "var(--color-accent-dim)",
          }}
        >
          <div>
            <h3 className="mb-1 text-xl font-bold">Не знаете, что выбрать?</h3>
            <p
              className="max-w-2xl text-sm leading-relaxed"
              style={{ color: "var(--color-txt-2)" }}
            >
              Заполните анкету: Игорь определит, достаточно ли отдельного плана
              тренировок или питания, либо эффективнее начать с сопровождения.
            </p>
          </div>
          <button
            type="button"
            onClick={scrollToQuestionnaire}
            className="btn-accent min-h-12 shrink-0 px-6 py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-4"
            style={{ outlineColor: "var(--color-accent)" }}
          >
            Пройти анкету
          </button>
        </div>
      </div>
    </section>
  );
}
