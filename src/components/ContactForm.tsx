"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import SocialLinks from "./SocialLinks";
import { FORM_ENDPOINT, CONTACTS } from "@/lib/config";

// ─── Типы ───────────────────────────────────────────────────────────────────
type Goal = "" | "shape" | "competition";

interface FormState {
  name: string;
  contact: string;
  goal: Goal;
}

const GOAL_LABELS: Record<Exclude<Goal, "">, string> = {
  shape: "Создать форму для себя",
  competition: "Подготовка к соревнованиям",
};

// ─── Компонент ──────────────────────────────────────────────────────────────
export default function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: "", contact: "", goal: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValid = form.name.trim() && form.contact.trim() && form.goal;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;

    // Сайт статический: без настроенного endpoint форма не может отправить
    // заявку — показываем блок прямой связи вместо ложного «успеха».
    if (!FORM_ENDPOINT) {
      setError(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          contact: form.contact.trim(),
          goal: form.goal ? GOAL_LABELS[form.goal as Exclude<Goal, "">] : "",
          source: "site",
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative py-14 sm:py-28 overflow-hidden"
      style={{ background: "var(--color-surface)" }}
    >
      {/* Верхняя линия */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "var(--color-rim)" }} />

      {/* Фоновое свечение */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-20 w-[500px] h-[300px]"
        aria-hidden="true"
        style={{ background: "radial-gradient(ellipse, rgb(249 115 22 / 0.05) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-5 sm:px-8">
        {/* Шапка */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 leading-[1.15]">
            Сделай первый шаг к{" "}
            <span className="text-accent-gradient">форме чемпионов</span>
          </h2>
          <p className="text-sm sm:text-base" style={{ color: "var(--color-txt-2)" }}>
            Оставь заявку, и мы подберем оптимальный формат работы под твои
            цели и текущий уровень подготовки.
          </p>
        </div>

        {/* Соцсети — «напиши напрямую» */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <span className="text-xs tracking-[0.12em] uppercase" style={{ color: "var(--color-txt-3)" }}>
            Или напиши напрямую
          </span>
          <SocialLinks variant="row" />
        </div>

        {/* Карточка формы */}
        {submitted ? (
          /* Успешная отправка */
          <div className="glass-card rounded-2xl p-10 text-center flex flex-col items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-2"
              style={{ background: "var(--color-accent-dim)", border: "1px solid var(--color-rim-accent)" }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" style={{ color: "var(--color-accent)" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Заявка отправлена!</h3>
            <p className="text-sm" style={{ color: "var(--color-txt-2)" }}>
              Игорь или его команда свяжутся с тобой в ближайшее время.
            </p>
          </div>
        ) : error ? (
          /* Endpoint не настроен или запрос упал: честный фолбэк */
          <div className="glass-card rounded-2xl p-8 sm:p-10 text-center flex flex-col items-center gap-4">
            <h3 className="text-xl font-semibold">Напиши Игорю напрямую</h3>
            <p className="text-sm max-w-md" style={{ color: "var(--color-txt-2)" }}>
              Онлайн-приём заявок временно недоступен. Быстрее всего — написать
              в Telegram или WhatsApp: разбор твоей цели займёт пару сообщений.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              <a
                href={CONTACTS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent px-6 py-3 rounded-xl text-sm font-semibold"
              >
                Написать в Telegram
              </a>
              <a
                href={CONTACTS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost px-6 py-3 rounded-xl text-sm font-medium"
              >
                WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-7 sm:p-8 flex flex-col gap-5">
            {/* Поле: имя */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: "var(--color-txt-2)" }}>
                Ваше имя
              </label>
              <input
                type="text"
                placeholder="Алексей"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder-txt-3"
                style={{
                  background: "rgb(255 255 255 / 0.04)",
                  border: "1px solid var(--color-rim)",
                  color: "var(--color-txt-1)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-rim-accent)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-rim)")}
                required
              />
            </div>

            {/* Поле: контакт */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: "var(--color-txt-2)" }}>
                Телефон / Telegram для связи
              </label>
              <input
                type="text"
                placeholder="+7 900 000 00 00 или @username"
                value={form.contact}
                onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                style={{
                  background: "rgb(255 255 255 / 0.04)",
                  border: "1px solid var(--color-rim)",
                  color: "var(--color-txt-1)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-rim-accent)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-rim)")}
                required
              />
            </div>

            {/* Поле: цель */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: "var(--color-txt-2)" }}>
                Ваша цель
              </label>
              <select
                value={form.goal}
                onChange={(e) => setForm((f) => ({ ...f, goal: e.target.value as Goal }))}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all appearance-none"
                style={{
                  background: "rgb(255 255 255 / 0.04)",
                  border: "1px solid var(--color-rim)",
                  color: form.goal ? "var(--color-txt-1)" : "var(--color-txt-3)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-rim-accent)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-rim)")}
                required
              >
                {/* Фон опций наследует тему через CSS-переменную,
                    а не жёстко прошитый тёмный цвет */}
                <option value="" disabled style={{ background: "var(--color-card)", color: "var(--color-txt-2)" }}>
                  Выберите из списка
                </option>
                <option value="shape" style={{ background: "var(--color-card)", color: "var(--color-txt-1)" }}>
                  Создать форму для себя
                </option>
                <option value="competition" style={{ background: "var(--color-card)", color: "var(--color-txt-1)" }}>
                  Подготовка к соревнованиям
                </option>
              </select>
            </div>

            {/* Кнопка отправки */}
            <button
              type="submit"
              disabled={!isValid || loading}
              className="btn-accent w-full px-6 py-3.5 rounded-xl text-sm font-semibold mt-1 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Отправляем..." : "Отправить заявку тренеру"}
            </button>

            {/* Согласие на обработку данных */}
            <p className="text-center text-xs" style={{ color: "var(--color-txt-3)" }}>
              Нажимая кнопку, вы соглашаетесь с{" "}
              <Link href="/privacy" className="underline hover:opacity-80" style={{ color: "var(--color-txt-2)" }}>
                политикой конфиденциальности
              </Link>
              .
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
