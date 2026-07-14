import { asset } from "@/lib/config";

// ─── Блок 3: О наставнике ───────────────────────────────────────────────────

export default function About() {
  return (
    <section id="about" className="relative py-14 sm:py-28 overflow-hidden">
      {/* Фоновое свечение */}
      <div
        className="pointer-events-none absolute left-[-15%] top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
        aria-hidden="true"
        style={{
          background: "radial-gradient(circle, rgb(249 115 22 / 0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Надзаголовок секции */}
        <div className="flex items-center gap-3 mb-3 sm:mb-4">
          <span className="h-px flex-1 max-w-[40px]" style={{ background: "var(--color-accent)" }} />
          <span
            className="text-xs font-semibold tracking-[0.18em] uppercase"
            style={{ color: "var(--color-accent)" }}
          >
            О наставнике
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-bold mb-8 lg:mb-16 max-w-lg leading-[1.15]">
          Результат,{" "}
          <span className="text-accent-gradient">подкрепленный золотом</span>
        </h2>

        {/* Двухколоночный лейаут */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-start">

          {/* Фото с медалями — уменьшено на мобильных */}
          <div className="relative">
            <div
              className="absolute inset-0 rounded-3xl blur-2xl"
              style={{ background: "rgb(249 115 22 / 0.07)" }}
            />
            <div className="relative glass-card rounded-2xl lg:rounded-3xl overflow-hidden aspect-[3/4] max-w-[220px] sm:max-w-sm mx-auto lg:mx-0">
              <img
                src={asset("/photo2/champion-with-medal.jpg")}
                alt="Игорь Баловнев — чемпион с медалью"
                className="absolute inset-0 w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
          </div>

          {/* Текст */}
          <div className="flex flex-col justify-center gap-6 lg:pt-4">
            {/* Большая цитата */}
            <blockquote className="relative">
              <span
                className="absolute -top-4 -left-2 text-7xl font-serif leading-none select-none"
                style={{ color: "rgb(249 115 22 / 0.15)" }}
                aria-hidden="true"
              >
                {'"'}
              </span>
              <p
                className="relative text-base sm:text-lg leading-relaxed"
                style={{ color: "var(--color-txt-2)" }}
              >
                В фитнесе нет магии и шаблонных программ из интернета. Есть
                биомеханика, биохимия и дисциплина. Моя задача как тренера —
                убрать из твоего процесса трансформации любые слепые зоны.
              </p>
            </blockquote>

            <p style={{ color: "var(--color-txt-2)" }} className="text-base leading-relaxed">
              Ты получаешь систему, по которой тренируются лучшие атлеты
              страны, адаптированную под твой график, особенности здоровья и
              амбиции. Не важно, хочешь ли ты выйти на соревновательную сцену
              или построить лучшую форму в своей жизни для себя — мы сделаем
              это кратчайшим и безопасным путем.
            </p>

            {/* Подпись */}
            <div className="flex items-center gap-4 pt-2">
              <span
                className="w-10 h-px"
                style={{ background: "var(--color-accent)" }}
              />
              <div>
                <p className="font-semibold text-sm" style={{ color: "var(--color-txt-1)" }}>
                  Игорь Баловнев
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-accent)" }}>
                  Действующий спортсмен · 3-кратный Чемпион России
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
