"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { asset } from "@/lib/config";
import MediaLightbox from "@/components/MediaLightbox";

// Изображения — самодостаточные карточки-результаты (бейдж, заголовок, ДО/ПОСЛЕ,
// подпись уже впечатаны в макет). Поэтому компонент НЕ добавляет свою подпись
// снизу — это давало «карточку в карточке» и дублирование текста. Показываем
// материалы чистой галереей с возможностью открыть в полном размере.
const TESTIMONIALS = [
  {
    src: "/media/testimonials/01-online-coaching-before-after.webp",
    title: "Онлайн-сопровождение — результат клиента",
    alt: "Фотографии клиента до и после онлайн-сопровождения",
  },
  {
    src: "/media/testimonials/02-form-progress-before-after.webp",
    title: "Работа над формой — результат клиента",
    alt: "Сопоставление фотографий клиента в рамках работы над формой",
  },
  {
    src: "/media/testimonials/03-two-months-before-after.webp",
    title: "Два месяца работы — результат клиента",
    alt: "Фотографии клиента до начала работы и спустя два месяца",
  },
  {
    src: "/media/testimonials/04-minus-10kg-before-after.webp",
    title: "Минус 10 кг — результат клиента",
    alt: "Фотографии клиента до и после с результатом минус 10 килограммов",
  },
  {
    src: "/media/testimonials/05-68-2-to-60-7-before-after.webp",
    title: "68,2 → 60,7 кг — результат клиента",
    alt: "Фотографии клиента с исходным весом 68,2 и итоговым 60,7 килограмма",
  },
  {
    src: "/media/testimonials/06-client-message-size-result.webp",
    title: "46 → 42 размер одежды — отзыв клиента",
    alt: "Переписка, в которой клиент сообщает об изменении размера одежды с 46 на 42",
  },
] as const;

type Testimonial = (typeof TESTIMONIALS)[number];

export default function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const [selected, setSelected] = useState<Testimonial | null>(null);
  const closeLightbox = useCallback(() => setSelected(null), []);

  return (
    <section ref={ref} id="testimonials" className="relative overflow-hidden py-14 sm:py-28">
      <div
        className="pointer-events-none absolute left-[-10%] top-1/3 h-[420px] w-[420px] rounded-full"
        aria-hidden="true"
        style={{ background: "radial-gradient(circle, rgb(249 115 22 / 0.04) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <motion.div
          className="mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="mb-3 flex items-center gap-3 sm:mb-4">
            <span className="h-px max-w-[40px] flex-1" style={{ background: "var(--color-accent)" }} />
            <span
              className="text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--color-accent)" }}
            >
              Результаты клиентов
            </span>
          </div>
          <h2 className="max-w-2xl text-2xl font-bold leading-[1.15] sm:text-4xl">
            Изменения, показанные <span className="text-accent-gradient">без ретуши тела</span>
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed sm:text-base" style={{ color: "var(--color-txt-2)" }}>
            Исходные фотографии и формулировки клиентов сохранены. Нажмите на материал, чтобы
            рассмотреть его в полном размере.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.button
              key={testimonial.src}
              type="button"
              onClick={() => setSelected(testimonial)}
              className="group relative block overflow-hidden rounded-2xl border text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
              style={{ borderColor: "var(--color-rim)" }}
              aria-label={`Открыть: ${testimonial.title}`}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08 + index * 0.06, ease: [0.23, 1, 0.32, 1] }}
            >
              <Image
                src={asset(testimonial.src)}
                alt={testimonial.alt}
                width={1080}
                height={1350}
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="block aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              />
              <span
                className="absolute bottom-3 right-3 flex min-h-9 items-center rounded-full border border-white/15 bg-black/70 px-4 text-xs font-semibold text-white opacity-100 backdrop-blur-sm transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100"
                aria-hidden="true"
              >
                Увеличить
              </span>
            </motion.button>
          ))}
        </div>

        <p className="mt-6 max-w-4xl text-xs leading-relaxed" style={{ color: "var(--color-txt-3)" }}>
          Результат индивидуален и зависит от исходных данных, соблюдения рекомендаций, режима и
          состояния здоровья. Материалы не являются гарантией аналогичного результата.
        </p>
      </div>

      <MediaLightbox
        open={selected !== null}
        src={selected ? asset(selected.src) : ""}
        alt={selected?.alt ?? ""}
        title={selected?.title ?? ""}
        width={1080}
        height={1350}
        onClose={closeLightbox}
      />
    </section>
  );
}
