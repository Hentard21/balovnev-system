"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import SocialLinks from "./SocialLinks";
import { CONTACTS, FORM_ENDPOINT } from "@/lib/config";
import { buildTrainerChatLink } from "@/lib/lead-telegram";

type Goal =
  | ""
  | "fat_loss"
  | "muscle_gain"
  | "recomposition"
  | "functional"
  | "competition"
  | "general_fitness";

type Product = "" | "training" | "nutrition" | "coaching" | "competition" | "unsure";
type Offer =
  | ""
  | "training_plan"
  | "training_video_review"
  | "nutrition_plan"
  | "online_coaching"
  | "competition_key";
type TrainingExperience = "" | "never" | "under_6_months" | "6_12_months" | "1_3_years" | "over_3_years";
type LastTraining = "" | "currently" | "under_3_months" | "3_12_months" | "over_1_year" | "never";
type TrainingStyle = "strength" | "hypertrophy" | "circuits" | "high_reps" | "crossfit" | "cardio";

interface FormState {
  name: string;
  age: string;
  contact: string;
  height: string;
  weight: string;
  goal: Goal;
  product: Product;
  selectedOffer: Offer;
  previousSports: string;
  trainingExperience: TrainingExperience;
  lastTraining: LastTraining;
  currentSchedule: string;
  equipment: string;
  nutritionPreferences: string;
  trainingStyles: TrainingStyle[];
  injuries: string;
  chronicConditions: string;
  medicalLimitations: string;
  medicationsAndSupervision: string;
  healthNotes: string;
  healthConsent: boolean;
  privacyConsent: boolean;
}

type FieldName = keyof FormState;
type FormErrors = Partial<Record<FieldName, string>>;

const INITIAL_FORM: FormState = {
  name: "",
  age: "",
  contact: "",
  height: "",
  weight: "",
  goal: "",
  product: "",
  selectedOffer: "",
  previousSports: "",
  trainingExperience: "",
  lastTraining: "",
  currentSchedule: "",
  equipment: "",
  nutritionPreferences: "",
  trainingStyles: [],
  injuries: "",
  chronicConditions: "",
  medicalLimitations: "",
  medicationsAndSupervision: "",
  healthNotes: "",
  healthConsent: false,
  privacyConsent: false,
};

const STEPS = ["О вас", "Цель", "Опыт", "Здоровье"] as const;

const GOALS = [
  { value: "fat_loss", label: "Снижение веса" },
  { value: "muscle_gain", label: "Набор мышечной массы" },
  { value: "recomposition", label: "Коррекция фигуры и рекомпозиция" },
  { value: "functional", label: "Функциональная форма и CrossFit" },
  { value: "competition", label: "Подготовка к соревнованиям" },
  { value: "general_fitness", label: "Общая физическая форма" },
] as const;

const PRODUCTS = [
  { value: "training", label: "Программа тренировок" },
  { value: "nutrition", label: "План питания" },
  { value: "coaching", label: "Онлайн-сопровождение" },
  { value: "competition", label: "Подготовка к соревнованиям" },
  { value: "unsure", label: "Не знаю — нужна рекомендация" },
] as const;

const OFFERS = [
  { value: "training_plan", label: "Тренировочный план" },
  { value: "training_video_review", label: "План с видеообзором техники" },
  { value: "nutrition_plan", label: "План питания" },
  { value: "online_coaching", label: "Дистанционное ведение" },
  { value: "competition_key", label: "Подготовка к соревнованиям «Под ключ»" },
] as const;

const TRAINING_EXPERIENCE = [
  { value: "never", label: "Раньше не занимался(ась)" },
  { value: "under_6_months", label: "До 6 месяцев" },
  { value: "6_12_months", label: "От 6 до 12 месяцев" },
  { value: "1_3_years", label: "От 1 до 3 лет" },
  { value: "over_3_years", label: "Больше 3 лет" },
] as const;

const LAST_TRAINING = [
  { value: "currently", label: "Занимаюсь сейчас" },
  { value: "under_3_months", label: "Меньше 3 месяцев назад" },
  { value: "3_12_months", label: "От 3 до 12 месяцев назад" },
  { value: "over_1_year", label: "Больше года назад" },
  { value: "never", label: "Никогда не занимался(ась)" },
] as const;

const TRAINING_STYLES = [
  { value: "strength", label: "Силовые" },
  { value: "hypertrophy", label: "Набор мышц" },
  { value: "circuits", label: "Круговые" },
  { value: "high_reps", label: "Многоповторные" },
  { value: "crossfit", label: "CrossFit / функциональные" },
  { value: "cardio", label: "Кардио" },
] as const;

const inputStyle = {
  background: "rgb(255 255 255 / 0.04)",
  border: "1px solid var(--color-rim)",
  color: "var(--color-txt-1)",
} as const;

const inputClass =
  "min-h-11 w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2";

function labelFor<T extends string>(options: readonly { value: T; label: string }[], value: T | "") {
  return options.find((option) => option.value === value)?.label ?? "";
}

function isExplicitlyEmpty(value: string) {
  const normalized = value.trim().toLocaleLowerCase("ru-RU").replace(/[.!]/g, "");
  return [
    "нет",
    "не было",
    "отсутствуют",
    "ограничений нет",
    "не принимаю",
    "не наблюдаюсь",
    "добавить нечего",
  ].includes(normalized);
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;

  return (
    <p id={id} className="text-xs" style={{ color: "#fb7185" }}>
      {message}
    </p>
  );
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  // Ссылка на чат с тренером с уже подставленным текстом заявки. Собирается
  // при отправке, потому что после успеха форма размонтируется вместе с ответами.
  const [trainerChatLink, setTrainerChatLink] = useState("");
  const [sendUnavailable, setSendUnavailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const stepLabelRef = useRef<HTMLParagraphElement>(null);
  const previousStepRef = useRef(step);

  useEffect(() => {
    type SelectionDetail = { product: Product; offer?: Offer };

    const applySelection = (detail?: SelectionDetail) => {
      const product = detail?.product;
      const offer = detail?.offer ?? "";
      if (!product || !PRODUCTS.some((option) => option.value === product)) return;
      if (offer && !OFFERS.some((option) => option.value === offer)) return;

      setForm((current) => ({ ...current, product, selectedOffer: offer }));
      setErrors((current) => {
        if (!current.product) return current;
        const next = { ...current };
        delete next.product;
        return next;
      });
    };

    const selectProduct = (event: Event) => {
      applySelection((event as CustomEvent<SelectionDetail>).detail);
    };

    window.addEventListener("balovnev:select-product", selectProduct);
    applySelection(
      (
        window as typeof window & {
          __balovnevProductSelection?: SelectionDetail;
        }
      ).__balovnevProductSelection,
    );
    return () => window.removeEventListener("balovnev:select-product", selectProduct);
  }, []);

  useEffect(() => {
    if (previousStepRef.current !== step) {
      stepLabelRef.current?.focus();
      previousStepRef.current = step;
    }
  }, [step]);

  const recommendation = useMemo(() => {
    const healthValues = [
      form.injuries,
      form.chronicConditions,
      form.medicalLimitations,
      form.medicationsAndSupervision,
    ];
    const hasReportedLimitations = healthValues.some(
      (value) => value.trim().length > 0 && !isExplicitlyEmpty(value),
    );

    if (form.goal === "competition" || form.product === "competition") {
      return {
        code: "competition_preparation",
        title: "Подготовка к соревнованиям",
        reason:
          "Нужны индивидуальная периодизация, контроль формы, питания и регулярные корректировки по прогрессу.",
      };
    }

    if (
      hasReportedLimitations ||
      form.product === "coaching" ||
      form.product === "unsure" ||
      form.trainingExperience === "never" ||
      form.lastTraining === "over_1_year"
    ) {
      return {
        code: "online_coaching",
        title: "Онлайн-сопровождение",
        reason: hasReportedLimitations
          ? "Перед стартом Игорь уточнит ограничения и подберёт безопасную нагрузку; при необходимости попросит допуск врача."
          : "На старте важны диагностика, понятный план действий и регулярная обратная связь по технике и прогрессу.",
      };
    }

    if (form.product === "nutrition") {
      return {
        code: "nutrition_plan",
        title: "Индивидуальный план питания",
        reason: "Рацион можно настроить под вашу цель, параметры, режим и пищевые предпочтения.",
      };
    }

    if (form.product === "training") {
      return {
        code: "training_plan",
        title: "Индивидуальная программа тренировок",
        reason: "Ваш опыт, доступное оборудование и график позволяют собрать самостоятельный план с понятной прогрессией.",
      };
    }

    return {
      code: "personal_consultation",
      title: "Персональный разбор",
      reason: "Игорь сопоставит цель, опыт и ограничения и предложит подходящий формат после короткого диалога.",
    };
  }, [form]);

  const updateField = <K extends FieldName>(field: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const updateProduct = (product: Product) => {
    setForm((current) => ({
      ...current,
      product,
      selectedOffer: "",
    }));
    setErrors((current) => {
      const next = { ...current };
      delete next.product;
      if (product === "nutrition") delete next.trainingStyles;
      return next;
    });
  };

  const showErrors = (nextErrors: FormErrors) => {
    setErrors(nextErrors);
    window.requestAnimationFrame(() => errorSummaryRef.current?.focus());
  };

  const validateStep = (stepIndex: number): FormErrors => {
    const nextErrors: FormErrors = {};

    if (stepIndex === 0) {
      if (!form.name.trim()) nextErrors.name = "Укажите имя.";

      const age = Number(form.age);
      if (!form.age.trim()) nextErrors.age = "Укажите возраст.";
      else if (!Number.isInteger(age) || age < 18 || age > 100) {
        nextErrors.age = "Анкета доступна совершеннолетним от 18 до 100 лет.";
      }

      if (!form.contact.trim()) nextErrors.contact = "Укажите Telegram или телефон для связи.";

      const height = Number(form.height);
      if (!form.height.trim()) nextErrors.height = "Укажите рост.";
      else if (!Number.isFinite(height) || height < 120 || height > 230) {
        nextErrors.height = "Укажите рост от 120 до 230 см.";
      }

      const weight = Number(form.weight);
      if (!form.weight.trim()) nextErrors.weight = "Укажите вес.";
      else if (!Number.isFinite(weight) || weight < 35 || weight > 350) {
        nextErrors.weight = "Укажите вес от 35 до 350 кг.";
      }
    }

    if (stepIndex === 1) {
      if (!form.goal) nextErrors.goal = "Выберите основную цель.";
      if (!form.product) nextErrors.product = "Выберите интересующий формат.";
    }

    if (stepIndex === 2) {
      if (!form.previousSports.trim()) {
        nextErrors.previousSports = "Расскажите о прошлом опыте или напишите «нет».";
      }
      if (!form.trainingExperience) nextErrors.trainingExperience = "Укажите общий опыт тренировок.";
      if (!form.lastTraining) nextErrors.lastTraining = "Укажите, когда вы тренировались в последний раз.";
      if (!form.currentSchedule.trim()) {
        nextErrors.currentSchedule = "Укажите текущий или желаемый график.";
      }
      if (!form.equipment.trim()) {
        nextErrors.equipment = "Укажите доступное оборудование или напишите «нет».";
      }
      if (form.product !== "training" && !form.nutritionPreferences.trim()) {
        nextErrors.nutritionPreferences =
          "Укажите пищевые предпочтения и ограничения или напишите «нет».";
      }
      if (form.product !== "nutrition" && form.trainingStyles.length === 0) {
        nextErrors.trainingStyles = "Выберите хотя бы один подходящий стиль.";
      }
    }

    if (stepIndex === 3) {
      if (!form.injuries.trim()) nextErrors.injuries = "Укажите травмы или напишите «нет».";
      if (!form.chronicConditions.trim()) {
        nextErrors.chronicConditions = "Укажите хронические заболевания или напишите «нет».";
      }
      if (!form.medicalLimitations.trim()) {
        nextErrors.medicalLimitations = "Укажите медицинские ограничения или напишите «нет».";
      }
      if (!form.medicationsAndSupervision.trim()) {
        nextErrors.medicationsAndSupervision = "Укажите препараты и наблюдение врача или напишите «нет».";
      }
      if (!form.healthNotes.trim()) {
        nextErrors.healthNotes = "Добавьте важные сведения или напишите «нет».";
      }
      if (!form.healthConsent) {
        nextErrors.healthConsent = "Нужно отдельное согласие на обработку сведений о здоровье.";
      }
      if (!form.privacyConsent) {
        nextErrors.privacyConsent = "Подтвердите согласие с политикой конфиденциальности.";
      }
    }

    return nextErrors;
  };

  const goNext = () => {
    const nextErrors = validateStep(step);
    if (Object.keys(nextErrors).length > 0) {
      showErrors(nextErrors);
      return;
    }

    setErrors({});
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setErrors({});
    setStep((current) => Math.max(current - 1, 0));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (step < STEPS.length - 1) {
      goNext();
      return;
    }

    const nextErrors = validateStep(3);
    if (Object.keys(nextErrors).length > 0) {
      showErrors(nextErrors);
      return;
    }

    if (loading) return;

    // Канал доставки не настроен — показываем прямую связь вместо ложного
    // «отправлено».
    if (!FORM_ENDPOINT) {
      setSendUnavailable(true);
      return;
    }

    const payload = {
      schemaVersion: 1,
      source: "site_detailed_application",
      submittedAt: new Date().toISOString(),
      applicant: {
        name: form.name.trim(),
        age: Number(form.age),
        isAdult: Number(form.age) >= 18,
        contact: form.contact.trim(),
        heightCm: Number(form.height),
        weightKg: Number(form.weight),
      },
      selection: {
        goal: { code: form.goal, label: labelFor(GOALS, form.goal) },
        product: { code: form.product, label: labelFor(PRODUCTS, form.product) },
        selectedOffer: form.selectedOffer
          ? {
              code: form.selectedOffer,
              label: labelFor(OFFERS, form.selectedOffer),
            }
          : null,
      },
      experience: {
        previousSports: form.previousSports.trim(),
        duration: {
          code: form.trainingExperience,
          label: labelFor(TRAINING_EXPERIENCE, form.trainingExperience),
        },
        lastTraining: {
          code: form.lastTraining,
          label: labelFor(LAST_TRAINING, form.lastTraining),
        },
        currentOrPreferredSchedule: form.currentSchedule.trim(),
        availableEquipment: form.equipment.trim(),
        nutritionPreferencesAndRestrictions:
          form.nutritionPreferences.trim() || null,
        preferredStyles: form.trainingStyles.map((style) => ({
          code: style,
          label: labelFor(TRAINING_STYLES, style),
        })),
      },
      health: {
        injuries: form.injuries.trim(),
        chronicConditions: form.chronicConditions.trim(),
        medicalLimitations: form.medicalLimitations.trim(),
        medicationsAndDoctorSupervision: form.medicationsAndSupervision.trim(),
        additionalNotes: form.healthNotes.trim(),
      },
      preliminaryRecommendation: recommendation,
      consents: {
        healthDataProcessing: form.healthConsent,
        privacyPolicy: form.privacyConsent,
      },
    };

    const send = async (endpoint: string) => {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Formspree: без этого заголовка сервис вернёт HTML вместо JSON.
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
    };

    setLoading(true);
    try {
      // Анкета целиком уходит на почту. В Telegram заявку отправит сам клиент
      // кнопкой на экране успеха — ссылку готовим здесь, пока ответы под рукой.
      await send(FORM_ENDPOINT);
      setTrainerChatLink(buildTrainerChatLink(payload));
      setSubmitted(true);
    } catch {
      setSendUnavailable(true);
    } finally {
      setLoading(false);
    }
  };

  const toggleTrainingStyle = (style: TrainingStyle) => {
    const nextStyles = form.trainingStyles.includes(style)
      ? form.trainingStyles.filter((current) => current !== style)
      : [...form.trainingStyles, style];
    updateField("trainingStyles", nextStyles);
  };

  const errorMessages = Object.values(errors);

  return (
    <section id="contact" className="relative overflow-hidden py-14 sm:py-28" style={{ background: "var(--color-surface)" }}>
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: "var(--color-rim)" }} />
      <div
        className="pointer-events-none absolute left-1/2 -top-20 h-[300px] w-[500px] -translate-x-1/2"
        aria-hidden="true"
        style={{ background: "radial-gradient(ellipse, rgb(249 115 22 / 0.05) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-8">
        <div className="mb-8 text-center sm:mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--color-accent)" }}>
            Персональный подбор программы
          </p>
          <h2 className="mb-3 text-3xl font-bold leading-[1.15] sm:text-4xl">
            Начните с подробной <span className="text-accent-gradient">анкеты</span>
          </h2>
          <p className="mx-auto max-w-2xl text-sm sm:text-base" style={{ color: "var(--color-txt-2)" }}>
            Игорь изучит цель, опыт и ограничения и предложит формат, который подходит именно вам — без шаблонных обещаний.
          </p>
        </div>

        <div className="mb-8 flex flex-col items-center gap-3">
          <span className="text-xs uppercase tracking-[0.12em]" style={{ color: "var(--color-txt-3)" }}>
            Предпочитаете диалог сразу?
          </span>
          <SocialLinks variant="row" />
        </div>

        {submitted ? (
          <div className="glass-card flex flex-col items-center gap-4 rounded-2xl p-8 text-center sm:p-10" role="status">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: "var(--color-accent-dim)", border: "1px solid var(--color-rim-accent)" }}
            >
              <svg aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" style={{ color: "var(--color-accent)" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Анкета отправлена</h3>
            <p className="max-w-md text-sm" style={{ color: "var(--color-txt-2)" }}>
              Игорь изучит ответы и свяжется с вами, чтобы уточнить детали и предложить следующий шаг.
            </p>

            {/* Необязательный шаг, который заметно ускоряет ответ: клиент пишет
                Игорю сам, со своего аккаунта. Telegram запрещает боту писать
                человеку первым, поэтому иначе первый шаг всегда за тренером. */}
            {trainerChatLink && (
              <div className="mt-2 flex flex-col items-center gap-2">
                <p className="max-w-md text-sm" style={{ color: "var(--color-txt-2)" }}>
                  Хотите ответ быстрее? Напишите Игорю — текст заявки уже готов,
                  останется нажать «отправить».
                </p>
                <a
                  href={trainerChatLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-accent inline-flex min-h-11 items-center rounded-xl px-6 py-3 text-sm font-semibold"
                >
                  Написать Игорю в Telegram
                </a>
              </div>
            )}
          </div>
        ) : sendUnavailable ? (
          <div className="glass-card flex flex-col items-center gap-4 rounded-2xl p-8 text-center sm:p-10" role="alert">
            <h3 className="text-xl font-semibold">Отправка с сайта пока не подключена</h3>
            <p className="max-w-md text-sm" style={{ color: "var(--color-txt-2)" }}>
              Анкета не была отправлена. Свяжитесь с Игорем напрямую — онлайн-приём заявок будет доступен после подключения защищённого обработчика.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <a href={CONTACTS.telegram} target="_blank" rel="noopener noreferrer" className="btn-accent inline-flex min-h-11 items-center rounded-xl px-6 py-3 text-sm font-semibold">
                Написать в Telegram
              </a>
              <a href={CONTACTS.instagram} target="_blank" rel="noopener noreferrer" className="btn-ghost inline-flex min-h-11 items-center rounded-xl px-6 py-3 text-sm font-medium">
                Написать в Instagram
              </a>
            </div>
            <button type="button" onClick={() => setSendUnavailable(false)} className="min-h-11 px-4 text-sm underline underline-offset-4" style={{ color: "var(--color-txt-2)" }}>
              Вернуться к анкете
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="glass-card rounded-2xl p-5 sm:p-8">
            <div className="mb-7" aria-label={`Шаг ${step + 1} из ${STEPS.length}: ${STEPS[step]}`}>
              <div className="mb-3 flex items-center justify-between gap-4 text-xs font-medium">
                <p
                  ref={stepLabelRef}
                  tabIndex={-1}
                  className="rounded outline-none"
                  style={{ color: "var(--color-accent)" }}
                >
                  Шаг {step + 1} из {STEPS.length}
                </p>
                <span style={{ color: "var(--color-txt-2)" }}>{STEPS[step]}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full" style={{ background: "var(--color-rim)" }} aria-hidden="true">
                <div
                  className="h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none"
                  style={{ width: `${((step + 1) / STEPS.length) * 100}%`, background: "var(--color-accent)" }}
                />
              </div>
              <ol className="mt-3 grid grid-cols-4 gap-2 text-[11px]" aria-hidden="true">
                {STEPS.map((name, index) => (
                  <li key={name} className="truncate" style={{ color: index <= step ? "var(--color-txt-1)" : "var(--color-txt-3)" }}>
                    {name}
                  </li>
                ))}
              </ol>
            </div>

            {errorMessages.length > 0 && (
              <div
                ref={errorSummaryRef}
                tabIndex={-1}
                role="alert"
                className="mb-6 rounded-xl p-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ background: "rgb(244 63 94 / 0.08)", border: "1px solid rgb(251 113 133 / 0.35)" }}
              >
                <p className="mb-2 text-sm font-semibold">Проверьте ответы:</p>
                <ul className="list-disc space-y-1 pl-5 text-xs" style={{ color: "var(--color-txt-2)" }}>
                  {errorMessages.map((message) => <li key={message}>{message}</li>)}
                </ul>
              </div>
            )}

            {step === 0 && (
              <fieldset className="grid gap-5 sm:grid-cols-2">
                <legend className="col-span-full mb-1 text-xl font-semibold">Контакты и параметры</legend>
                <p className="col-span-full -mt-3 text-sm" style={{ color: "var(--color-txt-2)" }}>
                  Анкета предназначена для совершеннолетних клиентов. Эти данные нужны для первичной оценки нагрузки и питания.
                </p>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-xs font-medium" style={{ color: "var(--color-txt-2)" }}>Имя</label>
                  <input id="name" name="name" autoComplete="name" value={form.name} onChange={(event) => updateField("name", event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} className={inputClass} style={inputStyle} placeholder="Алексей" />
                  <FieldError id="name-error" message={errors.name} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="age" className="text-xs font-medium" style={{ color: "var(--color-txt-2)" }}>Возраст, полных лет</label>
                  <input id="age" name="age" type="number" inputMode="numeric" min={18} max={100} value={form.age} onChange={(event) => updateField("age", event.target.value)} aria-invalid={Boolean(errors.age)} aria-describedby={errors.age ? "age-error" : undefined} className={inputClass} style={inputStyle} placeholder="28" />
                  <FieldError id="age-error" message={errors.age} />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="contact" className="text-xs font-medium" style={{ color: "var(--color-txt-2)" }}>Ваш Telegram</label>
                  <input
                    id="contact"
                    name="contact"
                    type="text"
                    autoComplete="off"
                    value={form.contact}
                    onChange={(event) => updateField("contact", event.target.value)}
                    aria-invalid={Boolean(errors.contact)}
                    aria-describedby={errors.contact ? "contact-hint contact-error" : "contact-hint"}
                    className={inputClass}
                    style={inputStyle}
                    placeholder="@username или t.me/username"
                  />
                  <p id="contact-hint" className="text-xs" style={{ color: "var(--color-txt-3)" }}>
                    Оставьте ссылку на свой Telegram или @username — так Игорь ответит быстрее всего.
                    Если вы не пользуетесь Telegram, напишите номер телефона и удобное время для звонка.
                  </p>
                  <FieldError id="contact-error" message={errors.contact} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="height" className="text-xs font-medium" style={{ color: "var(--color-txt-2)" }}>Рост, см</label>
                  <input id="height" name="height" type="number" inputMode="decimal" min={120} max={230} value={form.height} onChange={(event) => updateField("height", event.target.value)} aria-invalid={Boolean(errors.height)} aria-describedby={errors.height ? "height-error" : undefined} className={inputClass} style={inputStyle} placeholder="178" />
                  <FieldError id="height-error" message={errors.height} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="weight" className="text-xs font-medium" style={{ color: "var(--color-txt-2)" }}>Вес, кг</label>
                  <input id="weight" name="weight" type="number" inputMode="decimal" min={35} max={350} step="0.1" value={form.weight} onChange={(event) => updateField("weight", event.target.value)} aria-invalid={Boolean(errors.weight)} aria-describedby={errors.weight ? "weight-error" : undefined} className={inputClass} style={inputStyle} placeholder="82.5" />
                  <FieldError id="weight-error" message={errors.weight} />
                </div>
              </fieldset>
            )}

            {step === 1 && (
              <div className="space-y-7">
                <fieldset
                  aria-invalid={Boolean(errors.goal)}
                  aria-describedby={errors.goal ? "goal-error" : undefined}
                >
                  <legend className="mb-2 text-lg font-semibold">Основная цель</legend>
                  <p className="mb-3 text-xs" style={{ color: "var(--color-txt-2)" }}>Выберите один главный результат на ближайший этап.</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {GOALS.map((option) => (
                      <label key={option.value} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors motion-reduce:transition-none" style={{ ...inputStyle, borderColor: form.goal === option.value ? "var(--color-accent)" : "var(--color-rim)", background: form.goal === option.value ? "var(--color-accent-dim)" : inputStyle.background }}>
                        <input type="radio" name="goal" value={option.value} checked={form.goal === option.value} onChange={() => updateField("goal", option.value)} className="h-4 w-4 shrink-0" style={{ accentColor: "var(--color-accent)" }} />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                  <FieldError id="goal-error" message={errors.goal} />
                </fieldset>

                <fieldset
                  aria-invalid={Boolean(errors.product)}
                  aria-describedby={errors.product ? "product-error" : undefined}
                >
                  <legend className="mb-2 text-lg font-semibold">Что вас интересует</legend>
                  <p className="mb-3 text-xs" style={{ color: "var(--color-txt-2)" }}>Если пока не уверены, Игорь подберёт формат по ответам.</p>
                  {form.selectedOffer && (
                    <p
                      className="mb-3 rounded-xl px-4 py-3 text-sm"
                      style={{
                        color: "var(--color-txt-1)",
                        background: "var(--color-accent-dim)",
                        border: "1px solid var(--color-rim-accent)",
                      }}
                    >
                      Вы выбрали в тарифах: <strong>{labelFor(OFFERS, form.selectedOffer)}</strong>
                    </p>
                  )}
                  <div className="grid gap-2 sm:grid-cols-2">
                    {PRODUCTS.map((option) => (
                      <label key={option.value} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors motion-reduce:transition-none" style={{ ...inputStyle, borderColor: form.product === option.value ? "var(--color-accent)" : "var(--color-rim)", background: form.product === option.value ? "var(--color-accent-dim)" : inputStyle.background }}>
                        <input type="radio" name="product" value={option.value} checked={form.product === option.value} onChange={() => updateProduct(option.value)} className="h-4 w-4 shrink-0" style={{ accentColor: "var(--color-accent)" }} />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                  <FieldError id="product-error" message={errors.product} />
                </fieldset>
              </div>
            )}

            {step === 2 && (
              <fieldset className="grid gap-5 sm:grid-cols-2">
                <legend className="col-span-full mb-1 text-xl font-semibold">Опыт и условия тренировок</legend>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="previous-sports" className="text-xs font-medium" style={{ color: "var(--color-txt-2)" }}>Какими видами спорта вы занимались</label>
                  <textarea id="previous-sports" name="previousSports" rows={3} value={form.previousSports} onChange={(event) => updateField("previousSports", event.target.value)} aria-invalid={Boolean(errors.previousSports)} aria-describedby={errors.previousSports ? "previous-sports-error" : undefined} className={`${inputClass} resize-y`} style={inputStyle} placeholder="Например: тренажёрный зал 2 года, плавание — или «нет»" />
                  <FieldError id="previous-sports-error" message={errors.previousSports} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="training-experience" className="text-xs font-medium" style={{ color: "var(--color-txt-2)" }}>Общий опыт тренировок</label>
                  <select id="training-experience" name="trainingExperience" value={form.trainingExperience} onChange={(event) => updateField("trainingExperience", event.target.value as TrainingExperience)} aria-invalid={Boolean(errors.trainingExperience)} aria-describedby={errors.trainingExperience ? "training-experience-error" : undefined} className={`${inputClass} appearance-none`} style={inputStyle}>
                    <option value="" style={{ background: "var(--color-card)" }}>Выберите вариант</option>
                    {TRAINING_EXPERIENCE.map((option) => <option key={option.value} value={option.value} style={{ background: "var(--color-card)" }}>{option.label}</option>)}
                  </select>
                  <FieldError id="training-experience-error" message={errors.trainingExperience} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="last-training" className="text-xs font-medium" style={{ color: "var(--color-txt-2)" }}>Когда тренировались последний раз</label>
                  <select id="last-training" name="lastTraining" value={form.lastTraining} onChange={(event) => updateField("lastTraining", event.target.value as LastTraining)} aria-invalid={Boolean(errors.lastTraining)} aria-describedby={errors.lastTraining ? "last-training-error" : undefined} className={`${inputClass} appearance-none`} style={inputStyle}>
                    <option value="" style={{ background: "var(--color-card)" }}>Выберите вариант</option>
                    {LAST_TRAINING.map((option) => <option key={option.value} value={option.value} style={{ background: "var(--color-card)" }}>{option.label}</option>)}
                  </select>
                  <FieldError id="last-training-error" message={errors.lastTraining} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="schedule" className="text-xs font-medium" style={{ color: "var(--color-txt-2)" }}>Текущий или желаемый график</label>
                  <textarea id="schedule" name="currentSchedule" rows={3} value={form.currentSchedule} onChange={(event) => updateField("currentSchedule", event.target.value)} aria-invalid={Boolean(errors.currentSchedule)} aria-describedby={errors.currentSchedule ? "schedule-error" : undefined} className={`${inputClass} resize-y`} style={inputStyle} placeholder="Например: 3 раза в неделю по вечерам" />
                  <FieldError id="schedule-error" message={errors.currentSchedule} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="equipment" className="text-xs font-medium" style={{ color: "var(--color-txt-2)" }}>Где и с чем сможете заниматься</label>
                  <textarea id="equipment" name="equipment" rows={3} value={form.equipment} onChange={(event) => updateField("equipment", event.target.value)} aria-invalid={Boolean(errors.equipment)} aria-describedby={errors.equipment ? "equipment-error" : undefined} className={`${inputClass} resize-y`} style={inputStyle} placeholder="Зал, домашние гантели, турник — или «оборудования нет»" />
                  <FieldError id="equipment-error" message={errors.equipment} />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="nutrition-preferences" className="text-xs font-medium" style={{ color: "var(--color-txt-2)" }}>
                    Питание: предпочтения, аллергии и непереносимости
                    {form.product === "training" ? " (необязательно)" : ""}
                  </label>
                  <textarea
                    id="nutrition-preferences"
                    name="nutritionPreferences"
                    rows={3}
                    value={form.nutritionPreferences}
                    onChange={(event) => updateField("nutritionPreferences", event.target.value)}
                    aria-invalid={Boolean(errors.nutritionPreferences)}
                    aria-describedby={errors.nutritionPreferences ? "nutrition-preferences-error" : undefined}
                    className={`${inputClass} resize-y`}
                    style={inputStyle}
                    placeholder="Что не едите, режим, аллергии и непереносимости — или «нет»"
                  />
                  <FieldError id="nutrition-preferences-error" message={errors.nutritionPreferences} />
                </div>

                <fieldset
                  className="sm:col-span-2"
                  aria-invalid={Boolean(errors.trainingStyles)}
                  aria-describedby={errors.trainingStyles ? "training-styles-error" : undefined}
                >
                  <legend className="mb-1 text-sm font-semibold">Предпочтительные форматы тренировок</legend>
                  <p className="mb-3 text-xs" style={{ color: "var(--color-txt-2)" }}>
                    {form.product === "nutrition"
                      ? "Для отдельного плана питания этот пункт необязателен."
                      : "Можно выбрать несколько вариантов."}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {TRAINING_STYLES.map((option) => (
                      <label key={option.value} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm" style={{ ...inputStyle, borderColor: form.trainingStyles.includes(option.value) ? "var(--color-accent)" : "var(--color-rim)", background: form.trainingStyles.includes(option.value) ? "var(--color-accent-dim)" : inputStyle.background }}>
                        <input type="checkbox" name="trainingStyles" value={option.value} checked={form.trainingStyles.includes(option.value)} onChange={() => toggleTrainingStyle(option.value)} className="h-4 w-4 shrink-0" style={{ accentColor: "var(--color-accent)" }} />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                  <FieldError id="training-styles-error" message={errors.trainingStyles} />
                </fieldset>
              </fieldset>
            )}

            {step === 3 && (
              <div className="space-y-7">
                <div className="rounded-2xl p-5" style={{ background: "var(--color-accent-dim)", border: "1px solid var(--color-rim-accent)" }} aria-live="polite">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--color-accent)" }}>Предварительная рекомендация</p>
                  <h3 className="mb-2 text-xl font-semibold">{recommendation.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-txt-2)" }}>{recommendation.reason}</p>
                  <p className="mt-3 text-xs" style={{ color: "var(--color-txt-3)" }}>Это не медицинское заключение и не окончательное предложение. Игорь подтвердит формат после личного разбора анкеты.</p>
                </div>

                <fieldset className="grid gap-5">
                  <legend className="mb-1 text-xl font-semibold">Здоровье и ограничения</legend>
                  <p className="-mt-3 text-sm" style={{ color: "var(--color-txt-2)" }}>
                    Каждое поле обязательно. Если ограничений нет, так и напишите: «нет». Это помогает не назначать нагрузку вслепую.
                  </p>

                  {[
                    { field: "injuries" as const, label: "Травмы и операции", placeholder: "Что, когда произошло, есть ли дискомфорт сейчас — или «нет»" },
                    { field: "chronicConditions" as const, label: "Хронические заболевания", placeholder: "Сердце, давление, суставы и другие диагнозы — или «нет»" },
                    { field: "medicalLimitations" as const, label: "Медицинские ограничения", placeholder: "Запрещённые нагрузки, рекомендации врача — или «нет»" },
                    { field: "medicationsAndSupervision" as const, label: "Препараты и наблюдение врача", placeholder: "Регулярные препараты и профиль врача — или «нет»" },
                    { field: "healthNotes" as const, label: "Что ещё важно знать", placeholder: "Самочувствие, сон, особенности режима — или «нет»" },
                  ].map((item) => (
                    <div key={item.field} className="flex flex-col gap-1.5">
                      <label htmlFor={item.field} className="text-xs font-medium" style={{ color: "var(--color-txt-2)" }}>{item.label}</label>
                      <textarea id={item.field} name={item.field} rows={3} value={form[item.field]} onChange={(event) => updateField(item.field, event.target.value)} aria-invalid={Boolean(errors[item.field])} aria-describedby={errors[item.field] ? `${item.field}-error` : undefined} className={`${inputClass} resize-y`} style={inputStyle} placeholder={item.placeholder} />
                      <FieldError id={`${item.field}-error`} message={errors[item.field]} />
                    </div>
                  ))}
                </fieldset>

                <div className="space-y-3">
                  <div className="flex min-h-11 items-start gap-3 rounded-xl p-4 text-sm" style={inputStyle}>
                    <input
                      id="health-consent"
                      type="checkbox"
                      checked={form.healthConsent}
                      onChange={(event) => updateField("healthConsent", event.target.checked)}
                      className="mt-0.5 h-5 w-5 shrink-0"
                      style={{ accentColor: "var(--color-accent)" }}
                      aria-invalid={Boolean(errors.healthConsent)}
                      aria-describedby={errors.healthConsent ? "health-consent-error" : undefined}
                    />
                    <label htmlFor="health-consent" className="cursor-pointer">
                      Я отдельно и явно соглашаюсь на обработку сведений о здоровье и ограничениях для подбора безопасного формата тренировок и питания.
                    </label>
                  </div>
                  <FieldError id="health-consent-error" message={errors.healthConsent} />

                  <div className="flex min-h-11 items-start gap-3 rounded-xl p-4 text-sm" style={inputStyle}>
                    <input
                      id="privacy-consent"
                      type="checkbox"
                      checked={form.privacyConsent}
                      onChange={(event) => updateField("privacyConsent", event.target.checked)}
                      className="mt-0.5 h-5 w-5 shrink-0"
                      style={{ accentColor: "var(--color-accent)" }}
                      aria-invalid={Boolean(errors.privacyConsent)}
                      aria-describedby={errors.privacyConsent ? "privacy-consent-error" : undefined}
                    />
                    <span>
                      <label htmlFor="privacy-consent" className="cursor-pointer">
                        Я соглашаюсь с обработкой персональных данных и принимаю
                      </label>{" "}
                      <Link href="/privacy" target="_blank" className="underline underline-offset-4 hover:opacity-80" style={{ color: "var(--color-accent)" }}>
                        политику конфиденциальности
                      </Link>.
                    </span>
                  </div>
                  <FieldError id="privacy-consent-error" message={errors.privacyConsent} />
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              {step > 0 ? (
                <button type="button" onClick={goBack} className="btn-ghost min-h-11 rounded-xl px-6 py-3 text-sm font-medium sm:min-w-32">Назад</button>
              ) : <span aria-hidden="true" />}

              {step < STEPS.length - 1 ? (
                <button type="button" onClick={goNext} className="btn-accent min-h-11 rounded-xl px-6 py-3 text-sm font-semibold sm:min-w-44">Продолжить</button>
              ) : (
                <button type="submit" disabled={loading} className="btn-accent min-h-11 rounded-xl px-6 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-52">
                  {loading ? "Отправляем анкету..." : "Отправить анкету Игорю"}
                </button>
              )}
            </div>

            <p className="mt-5 text-center text-xs" style={{ color: "var(--color-txt-2)" }}>
              Ответы не сохраняются в браузере. До подключения защищённого приёма данных анкета не отправляется автоматически.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
