// ═════════════════════════════════════════════════════════════════════════════
// ССЫЛКА «НАПИСАТЬ ТРЕНЕРУ» С ГОТОВЫМ ТЕКСТОМ ЗАЯВКИ
//
// Заявку в Telegram отправляет сам клиент со своего аккаунта — бота и токена
// в схеме нет. Так вышло не сразу:
//   • свой обработчик на Cloudflare Pages — сайт не открывался из России;
//   • свой обработчик на Yandex Cloud — 5 успешных доставок из 12, ретраи не
//     помогали (отказ занимал все три попытки, успех приходил с первой);
//   • отправка ботом прямо из браузера — работала быстро (87–310 мс), но
//     требовала публичного токена, и его сняли с сайта.
//
// Текущая схема закрывает проблему насовсем: красть нечего. Побочный плюс —
// тренер может ответить сразу, тогда как боту Telegram запрещает писать
// человеку первым, и первый шаг всегда оставался за тренером.
// ═════════════════════════════════════════════════════════════════════════════

import { CONTACTS } from "@/lib/config";

// ─── Формат анкеты ───────────────────────────────────────────────────────────
// Совпадает с payload, который собирает ContactForm. Поля необязательные:
// анкета может измениться, а ссылка должна собираться из того, что есть.
export interface LeadPayload {
  applicant?: {
    name?: string;
    age?: number;
    contact?: string;
    heightCm?: number;
    weightKg?: number;
  };
  selection?: {
    goal?: { label?: string };
    product?: { label?: string };
  };
  preliminaryRecommendation?: { title?: string };
}

/** «27 лет», «34 года», «41 год» — сообщение читают глазами, склонение заметно. */
function yearsLabel(age: number): string {
  const lastTwo = age % 100;
  if (lastTwo >= 11 && lastTwo <= 14) return `${age} лет`;
  const last = age % 10;
  if (last === 1) return `${age} год`;
  if (last >= 2 && last <= 4) return `${age} года`;
  return `${age} лет`;
}

/**
 * Короткий текст заявки для подстановки в чат.
 *
 * Зачем короткий: текст едет внутри URL, а длина ссылки ограничена и
 * браузером, и Telegram. Полная анкета туда не влезет — и не нужна: она
 * уходит на почту целиком. Здесь только то, с чего начинается разговор.
 */
export function buildShortLeadText(lead: LeadPayload): string {
  const { applicant, selection, preliminaryRecommendation } = lead;
  const parts: string[] = ["Здравствуйте! Заполнил(а) анкету на сайте."];

  const who: string[] = [];
  if (applicant?.name?.trim()) who.push(applicant.name.trim());
  if (typeof applicant?.age === "number") who.push(yearsLabel(applicant.age));
  const params: string[] = [];
  if (typeof applicant?.heightCm === "number") params.push(`${applicant.heightCm} см`);
  if (typeof applicant?.weightKg === "number") params.push(`${applicant.weightKg} кг`);
  if (params.length) who.push(params.join(", "));
  if (who.length) parts.push(who.join(", "));

  const goal = selection?.goal?.label;
  const product = selection?.product?.label;
  if (goal) parts.push(`Цель: ${goal}`);
  if (product) parts.push(`Формат: ${product}`);

  const recommendation = preliminaryRecommendation?.title;
  if (recommendation) parts.push(`Анкета предложила: ${recommendation}`);

  parts.push("Подробные ответы отправлены вместе с анкетой.");
  return parts.join("\n");
}

/** Ссылка, открывающая чат с тренером с уже подставленным текстом заявки. */
export function buildTrainerChatLink(lead: LeadPayload): string {
  const username = CONTACTS.telegram.replace(/^https?:\/\/t\.me\//, "").replace(/\/$/, "");
  return `https://t.me/${username}?text=${encodeURIComponent(buildShortLeadText(lead))}`;
}
