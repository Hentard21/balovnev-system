// ═════════════════════════════════════════════════════════════════════════════
// ОТПРАВКА ЗАЯВКИ В TELEGRAM ИЗ БРАУЗЕРА КЛИЕНТА
//
// Почему прямо из браузера, а не с сервера:
// заявки уходили через свой обработчик (сначала Cloudflare Pages Function,
// потом Yandex Cloud Function), но путь от серверов Yandex до api.telegram.org
// оказался нестабильным — замер показал 5 успехов из 12, причём неудачные
// вызовы просто висели до таймаута. Ретраи внутри функции не помогли:
// успех всегда приходил с первой попытки, отказ — всегда на всех трёх, то
// есть исход предопределён маршрутом контейнера. У клиента в браузере
// Telegram работает, поэтому отправка перенесена на его сторону — это
// убирает сломанный участок сети из схемы целиком.
//
// Цена решения: токен бота виден в исходниках страницы. Это осознанный
// размен, допустимый только потому, что бот выполняет ровно одну задачу —
// принести заявку тренеру:
//   • прочитать анкеты клиентов через токен НЕЛЬЗЯ: у Bot API нет метода
//     «покажи отправленное», а входящих сообщений у бота нет;
//   • писать бот может только тем, кто сам нажал у него Start, то есть
//     тренеру — для рассылок токен бесполезен;
//   • у мини-аппа будет отдельный бот, компрометация этого его не заденет;
//   • восстановление — /revoke у @BotFather и новый токен в конфиге.
// Из этого следует ограничение: этому боту нельзя выдавать другие функции.
// ═════════════════════════════════════════════════════════════════════════════

import { CONTACTS, TELEGRAM_BOT_TOKEN, TRAINER_CHAT_ID } from "@/lib/config";

// ─── Формат анкеты ───────────────────────────────────────────────────────────
// Совпадает с payload, который собирает ContactForm. Поля необязательные:
// анкета может измениться, а заявку терять нельзя — недостающее просто не
// попадёт в сообщение.
export interface LeadPayload {
  schemaVersion?: number;
  source?: string;
  submittedAt?: string;
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
    selectedOffer?: { label?: string } | null;
  };
  experience?: {
    previousSports?: string;
    duration?: { label?: string };
    lastTraining?: { label?: string };
    currentOrPreferredSchedule?: string;
    availableEquipment?: string;
    nutritionPreferencesAndRestrictions?: string | null;
    preferredStyles?: { label?: string }[];
  };
  health?: {
    injuries?: string;
    chronicConditions?: string;
    medicalLimitations?: string;
    medicationsAndDoctorSupervision?: string;
    additionalNotes?: string;
  };
  preliminaryRecommendation?: { title?: string };
}

// Telegram режет сообщения на 4096 символах. Поля про здоровье и опыт —
// свободный текст, поэтому ограничиваем и каждое поле, и итоговый размер,
// иначе длинная анкета не отправится вовсе.
const MAX_FIELD = 220;
const MAX_MESSAGE = 3900;

/** Экранирует текст клиента — сообщение уходит с parse_mode: HTML. */
function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Обрезает и экранирует поле. Пустые значения отбрасываются. */
function field(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const clipped = trimmed.length > MAX_FIELD ? `${trimmed.slice(0, MAX_FIELD)}…` : trimmed;
  return escapeHtml(clipped);
}

/** «нет», «ограничений нет» и т.п. — не повод занимать строку в карточке. */
function isEmptyAnswer(value: string): boolean {
  const normalized = value.toLowerCase().replace(/[.!]/g, "").trim();
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

/** «27 лет», «34 года», «41 год» — карточку читают глазами, склонение заметно. */
function yearsLabel(age: number): string {
  const lastTwo = age % 100;
  if (lastTwo >= 11 && lastTwo <= 14) return `${age} лет`;
  const last = age % 10;
  if (last === 1) return `${age} год`;
  if (last >= 2 && last <= 4) return `${age} года`;
  return `${age} лет`;
}

/**
 * Telegram-username из поля контакта, если он там есть.
 * Нужен для кнопки «Написать клиенту»: бот не может написать человеку
 * первым, поэтому тренер пишет со своего аккаунта по ссылке t.me/<username>.
 *
 * Клиенты заполняют поле как угодно, поэтому разбираем все живые формы:
 * ссылку, @user и голый username. Номер телефона сюда не попадает —
 * username по правилам Telegram начинается с буквы.
 */
export function telegramUsername(contact: string | undefined): string | null {
  if (!contact) return null;
  const value = contact.trim();

  const link = value.match(
    /(?:https?:\/\/)?(?:www\.)?(?:t\.me|telegram\.me|telegram\.dog)\/([A-Za-z][A-Za-z0-9_]{4,31})/i,
  );
  if (link) return link[1];

  const handle = value.match(/@([A-Za-z][A-Za-z0-9_]{4,31})/);
  if (handle) return handle[1];

  const bare = value.match(/^([A-Za-z][A-Za-z0-9_]{4,31})$/);
  return bare ? bare[1] : null;
}

export function buildMessage(lead: LeadPayload): string {
  const lines: string[] = [];
  const { applicant, selection, experience, health, preliminaryRecommendation } = lead;

  const name = field(applicant?.name) ?? "Без имени";
  const headerBits = [`<b>${name}</b>`];
  if (typeof applicant?.age === "number") headerBits.push(yearsLabel(applicant.age));
  lines.push("🔥 <b>Новая заявка</b>", "", headerBits.join(", "));

  const params: string[] = [];
  if (typeof applicant?.heightCm === "number") params.push(`${applicant.heightCm} см`);
  if (typeof applicant?.weightKg === "number") params.push(`${applicant.weightKg} кг`);
  if (params.length) lines.push(params.join(" · "));

  const contact = field(applicant?.contact);
  if (contact) lines.push(`📱 ${contact}`);

  const goal = field(selection?.goal?.label);
  const product = field(selection?.product?.label);
  const offer = field(selection?.selectedOffer?.label);
  if (goal || product) {
    lines.push("");
    if (goal) lines.push(`🎯 ${goal}`);
    if (product) lines.push(`📦 ${product}`);
    if (offer) lines.push(`💳 Выбрал в тарифах: ${offer}`);
  }

  const recommendation = field(preliminaryRecommendation?.title);
  if (recommendation) lines.push(`🤖 Рекомендация анкеты: ${recommendation}`);

  const experienceLines: string[] = [];
  const duration = field(experience?.duration?.label);
  const lastTraining = field(experience?.lastTraining?.label);
  if (duration) experienceLines.push(`Стаж: ${duration}`);
  if (lastTraining) experienceLines.push(`Последняя тренировка: ${lastTraining}`);

  const schedule = field(experience?.currentOrPreferredSchedule);
  if (schedule) experienceLines.push(`График: ${schedule}`);

  const equipment = field(experience?.availableEquipment);
  if (equipment) experienceLines.push(`Оборудование: ${equipment}`);

  const sports = field(experience?.previousSports);
  if (sports && !isEmptyAnswer(sports)) experienceLines.push(`Прошлый спорт: ${sports}`);

  const styles = experience?.preferredStyles
    ?.map((style) => style?.label)
    .filter((label): label is string => Boolean(label))
    .join(", ");
  const stylesField = field(styles);
  if (stylesField) experienceLines.push(`Форматы: ${stylesField}`);

  const nutrition = field(experience?.nutritionPreferencesAndRestrictions);
  if (nutrition && !isEmptyAnswer(nutrition)) experienceLines.push(`Питание: ${nutrition}`);

  if (experienceLines.length) {
    lines.push("", "💪 <b>Опыт</b>", ...experienceLines);
  }

  const healthPairs: [string, unknown][] = [
    ["Травмы", health?.injuries],
    ["Хронические", health?.chronicConditions],
    ["Ограничения", health?.medicalLimitations],
    ["Препараты/врач", health?.medicationsAndDoctorSupervision],
    ["Ещё важно", health?.additionalNotes],
  ];
  const healthLines = healthPairs
    .map(([label, value]) => {
      const text = field(value);
      if (!text || isEmptyAnswer(text)) return null;
      return `${label}: ${text}`;
    })
    .filter((line): line is string => line !== null);

  lines.push("", "⚠️ <b>Здоровье</b>");
  lines.push(healthLines.length ? healthLines.join("\n") : "Ограничений не указано");

  const message = lines.join("\n");
  return message.length > MAX_MESSAGE
    ? `${message.slice(0, MAX_MESSAGE)}\n\n…анкета обрезана, полный текст в почте`
    : message;
}

/**
 * Короткий текст заявки для ссылки «отправить самому» — клиент открывает чат
 * с тренером, где сообщение уже подставлено, и жмёт «отправить».
 *
 * Зачем короткий: текст едет внутри URL, а длина ссылки ограничена и
 * браузером, и Telegram. Полная анкета туда не влезет — она в любом случае
 * уходит на почту, поэтому здесь только то, что нужно для начала разговора:
 * кто, с какой целью и как связаться.
 *
 * Без HTML — это обычное сообщение от человека, а не карточка от бота.
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

/**
 * Ссылка, открывающая чат с тренером с уже готовым текстом заявки.
 * Токен и бот тут не участвуют вовсе: сообщение отправляет сам клиент со
 * своего аккаунта. Побочный плюс — тренер сможет ответить сразу, тогда как
 * боту Telegram запрещает писать человеку первым.
 */
export function buildTrainerChatLink(lead: LeadPayload): string {
  const username = CONTACTS.telegram.replace(/^https?:\/\/t\.me\//, "").replace(/\/$/, "");
  return `https://t.me/${username}?text=${encodeURIComponent(buildShortLeadText(lead))}`;
}

/**
 * Отправляет карточку заявки тренеру. Бросает исключение при любой неудаче —
 * вызывающий код перехватит и уйдёт на запасной канал (почту).
 */
export async function sendLeadToTelegram(lead: LeadPayload): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TRAINER_CHAT_ID) throw new Error("telegram_not_configured");

  const username = telegramUsername(lead.applicant?.contact);
  const reply_markup = username
    ? { inline_keyboard: [[{ text: "💬 Написать клиенту", url: `https://t.me/${username}` }]] }
    : undefined;

  const response = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TRAINER_CHAT_ID,
        text: buildMessage(lead),
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
        reply_markup,
      }),
    },
  );

  if (!response.ok) throw new Error(`telegram_http_${response.status}`);
}
