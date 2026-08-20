// ═════════════════════════════════════════════════════════════════════════════
// ПРИЁМ ЗАЯВОК С САЙТА → TELEGRAM (Yandex Cloud Functions)
//
// Порт functions/api/lead.ts под Yandex Cloud. Бизнес-логика (сборка карточки,
// экранирование, отсев ответов «нет», разбор Telegram-ссылок) не менялась —
// изменилась только обвязка: у Yandex свой формат входа/выхода функции и,
// в отличие от Cloudflare Pages Functions, функция живёт на чужом домене
// (functions.yandexcloud.net), поэтому нужны CORS-заголовки и обработка
// preflight-запроса OPTIONS.
//
// Хранилища нет намеренно: входящие заявки — это переписка с ботом в
// Telegram, отдельная БД ничего не добавляет.
//
// Переменные окружения (консоль Yandex Cloud → функция → Редактор →
// Переменные окружения):
//   TELEGRAM_BOT_TOKEN  — токен от @BotFather
//   TRAINER_CHAT_ID     — числовой Telegram id тренера (узнать у @userinfobot)
//
// Публичный доступ нужно выдать отдельно: консоль → функция → права доступа →
// добавить system:allUsers с ролью functions.functionInvoker — по умолчанию
// функция приватная и HTTP-вызов без токена авторизации получит отказ.
// ═════════════════════════════════════════════════════════════════════════════

// Разрешённые источники для CORS. Запрос с любого другого сайта не получит
// заголовок Access-Control-Allow-Origin и будет заблокирован браузером.
const ALLOWED_ORIGINS = new Set([
  "https://balovnev-system.ru",
  "https://www.balovnev-system.ru",
]);

const MAX_FIELD = 220;
const MAX_MESSAGE = 3900;

function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function field(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const clipped = trimmed.length > MAX_FIELD ? `${trimmed.slice(0, MAX_FIELD)}…` : trimmed;
  return escapeHtml(clipped);
}

function isEmptyAnswer(value) {
  const normalized = value.toLowerCase().replace(/[.!]/g, "").trim();
  return ["нет", "не было", "отсутствуют", "ограничений нет", "не принимаю", "не наблюдаюсь", "добавить нечего"].includes(
    normalized,
  );
}

function yearsLabel(age) {
  const lastTwo = age % 100;
  if (lastTwo >= 11 && lastTwo <= 14) return `${age} лет`;
  const last = age % 10;
  if (last === 1) return `${age} год`;
  if (last >= 2 && last <= 4) return `${age} года`;
  return `${age} лет`;
}

function telegramUsername(contact) {
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

function buildMessage(lead) {
  const lines = [];
  const { applicant, selection, experience, health, preliminaryRecommendation } = lead;

  const name = field(applicant?.name) ?? "Без имени";
  const headerBits = [`<b>${name}</b>`];
  if (typeof applicant?.age === "number") headerBits.push(yearsLabel(applicant.age));
  lines.push(`🔥 <b>Новая заявка</b>`, "", headerBits.join(", "));

  const params = [];
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

  const experienceLines = [];
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
    .filter(Boolean)
    .join(", ");
  const stylesField = field(styles);
  if (stylesField) experienceLines.push(`Форматы: ${stylesField}`);

  const nutrition = field(experience?.nutritionPreferencesAndRestrictions);
  if (nutrition && !isEmptyAnswer(nutrition)) experienceLines.push(`Питание: ${nutrition}`);

  if (experienceLines.length) {
    lines.push("", "💪 <b>Опыт</b>", ...experienceLines);
  }

  const healthPairs = [
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
    .filter((line) => line !== null);

  lines.push("", "⚠️ <b>Здоровье</b>");
  lines.push(healthLines.length ? healthLines.join("\n") : "Ограничений не указано");

  const message = lines.join("\n");
  return message.length > MAX_MESSAGE
    ? `${message.slice(0, MAX_MESSAGE)}\n\n…анкета обрезана, полный текст в почте`
    : message;
}

function corsHeaders(origin) {
  // Важно: при отсутствии заголовка Access-Control-Allow-Origin платформа
  // Yandex Cloud Functions сама подставляет "*" — молчание не значит запрет.
  // Поэтому для непройденных origin отдаём заведомо несовпадающее значение
  // "null" явно, а не полагаемся на пустой объект.
  if (!ALLOWED_ORIGINS.has(origin)) {
    return { "Access-Control-Allow-Origin": "null" };
  }
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function json(statusCode, body, origin) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    body: JSON.stringify(body),
  };
}

module.exports.handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin || "";

  // Preflight-запрос браузера перед реальным POST.
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders(origin), body: "" };
  }

  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, error: "method_not_allowed" }, origin);
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TRAINER_CHAT_ID;
  if (!token || !chatId) {
    // Конфиг не задан — честная 500, чтобы форма показала «отправка
    // недоступна» вместо ложного успеха.
    return json(500, { ok: false, error: "not_configured" }, origin);
  }

  let lead;
  try {
    lead = JSON.parse(event.body);
  } catch {
    return json(400, { ok: false, error: "bad_json" }, origin);
  }

  const hasName = Boolean(lead.applicant?.name?.trim());
  const hasContact = Boolean(lead.applicant?.contact?.trim());
  if (!hasName || !hasContact) {
    return json(400, { ok: false, error: "missing_fields" }, origin);
  }

  const username = telegramUsername(lead.applicant?.contact);
  const reply_markup = username
    ? { inline_keyboard: [[{ text: "💬 Написать клиенту", url: `https://t.me/${username}` }]] }
    : undefined;

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: buildMessage(lead),
      parse_mode: "HTML",
      link_preview_options: { is_disabled: true },
      reply_markup,
    }),
  });

  if (!response.ok) {
    // Тело ответа Telegram не отдаём наружу — в нём может быть токен.
    console.error("telegram sendMessage failed", response.status, await response.text());
    return json(502, { ok: false, error: "delivery_failed" }, origin);
  }

  return json(200, { ok: true }, origin);
};
