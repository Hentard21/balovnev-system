// ═════════════════════════════════════════════════════════════════════════════
// ПРИЁМ ЗАЯВОК С САЙТА → TELEGRAM
//
// Cloudflare Pages Function. Живёт на том же домене, что и сайт, поэтому
// форма шлёт запрос на /api/lead без CORS.
//
// Хранилища нет намеренно: входящие заявки — это переписка с ботом в
// Telegram. Там же поиск и история, отдельная БД ничего не добавляет.
//
// Переменные окружения (Cloudflare Pages → Settings → Environment variables,
// оба значения задать как Secret, в репозиторий они не попадают):
//   TELEGRAM_BOT_TOKEN  — токен от @BotFather
//   TRAINER_CHAT_ID     — числовой Telegram id Игоря (узнать у @userinfobot)
// ═════════════════════════════════════════════════════════════════════════════

interface Env {
  TELEGRAM_BOT_TOKEN: string;
  TRAINER_CHAT_ID: string;
}

// ─── Формат анкеты ───────────────────────────────────────────────────────────
// Повторяет payload из src/components/ContactForm.tsx. Все поля необязательны:
// форма может измениться, а заявку терять нельзя — недостающее просто не
// попадёт в сообщение.
interface LeadPayload {
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

// Telegram режет сообщения на 4096 символах. Свободные поля анкеты
// (травмы, заболевания, комментарии) — произвольный текст, поэтому режем
// каждое поле и общий размер, иначе длинная анкета не отправится вовсе.
const MAX_FIELD = 220;
const MAX_MESSAGE = 3900;

/** Экранирует текст пользователя — сообщение уходит с parse_mode: HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Обрезает поле и экранирует его. Пустые значения отбрасываются. */
function field(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const clipped =
    trimmed.length > MAX_FIELD ? `${trimmed.slice(0, MAX_FIELD)}…` : trimmed;
  return escapeHtml(clipped);
}

/** «нет», «ограничений нет» и т.п. — не повод занимать строку в карточке. */
function isEmptyAnswer(value: string): boolean {
  const normalized = value.toLowerCase().replace(/[.!]/g, "").trim();
  return ["нет", "не было", "отсутствуют", "ограничений нет", "не принимаю", "не наблюдаюсь", "добавить нечего"].includes(
    normalized,
  );
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
 * первым, поэтому Игорь пишет со своего аккаунта по ссылке t.me/<username>.
 */
function telegramUsername(contact: string | undefined): string | null {
  if (!contact) return null;
  const match = contact.trim().match(/^@?([A-Za-z0-9_]{5,32})$/);
  return match ? match[1] : null;
}

function buildMessage(lead: LeadPayload): string {
  const lines: string[] = [];
  const { applicant, selection, experience, health, preliminaryRecommendation } = lead;

  // ── Шапка: имя, возраст, параметры ──
  const name = field(applicant?.name) ?? "Без имени";
  const headerBits = [`<b>${name}</b>`];
  if (typeof applicant?.age === "number") headerBits.push(yearsLabel(applicant.age));
  lines.push(`🔥 <b>Новая заявка</b>`, "", headerBits.join(", "));

  const params: string[] = [];
  if (typeof applicant?.heightCm === "number") params.push(`${applicant.heightCm} см`);
  if (typeof applicant?.weightKg === "number") params.push(`${applicant.weightKg} кг`);
  if (params.length) lines.push(params.join(" · "));

  const contact = field(applicant?.contact);
  if (contact) lines.push(`📱 ${contact}`);

  // ── Цель и формат ──
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

  // ── Опыт ──
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

  // ── Здоровье ──
  // Показываем только заполненное: «нет» по всем пунктам превращается в
  // одну строку вместо пяти пустых.
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

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TRAINER_CHAT_ID) {
    // Конфиг не задан — честная 500, чтобы форма показала «отправка
    // недоступна» вместо ложного успеха.
    return Response.json({ ok: false, error: "not_configured" }, { status: 500 });
  }

  let lead: LeadPayload;
  try {
    lead = await request.json();
  } catch {
    return Response.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  // Минимальная проверка: заявка без имени и контакта бесполезна и,
  // скорее всего, прилетела от бота.
  const hasName = Boolean(lead.applicant?.name?.trim());
  const hasContact = Boolean(lead.applicant?.contact?.trim());
  if (!hasName || !hasContact) {
    return Response.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const username = telegramUsername(lead.applicant?.contact);
  const reply_markup = username
    ? {
        inline_keyboard: [
          [{ text: "💬 Написать клиенту", url: `https://t.me/${username}` }],
        ],
      }
    : undefined;

  const response = await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: env.TRAINER_CHAT_ID,
        text: buildMessage(lead),
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
        reply_markup,
      }),
    },
  );

  if (!response.ok) {
    // Тело ответа Telegram не отдаём наружу — в нём может быть токен.
    // Клиент увидит только факт неудачи и предложение написать напрямую.
    console.error("telegram sendMessage failed", response.status, await response.text());
    return Response.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
};
