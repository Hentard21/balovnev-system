import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyInitData, TelegramUser } from "@/lib/telegram";
import { setSessionCookie } from "@/lib/session";

// Мок-пользователи для локальной разработки, пока не готов бот-токен.
// Никогда не активируются в production (см. проверку NODE_ENV ниже).
const DEV_CLIENT: TelegramUser = {
  id: 111111111,
  first_name: "Тест",
  last_name: "Клиент",
  username: "test_client",
};
const DEV_TRAINER: TelegramUser = {
  id: 999999999,
  first_name: "Игорь",
  last_name: "(тест)",
  username: "test_trainer",
};

export async function POST(req: NextRequest) {
  const { initData, devRole } = (await req.json().catch(() => ({}))) as {
    initData?: string;
    devRole?: string;
  };

  let tgUser: TelegramUser | null = null;

  const devBypass =
    process.env.NODE_ENV !== "production" && process.env.DEV_AUTH_BYPASS === "true";

  if (initData) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (botToken) {
      tgUser = verifyInitData(initData, botToken);
    }
  }

  if (!tgUser && devBypass) {
    tgUser = devRole === "trainer" ? DEV_TRAINER : DEV_CLIENT;
  }

  if (!tgUser) {
    return NextResponse.json({ error: "Не удалось подтвердить Telegram-пользователя" }, { status: 401 });
  }

  const telegramId = String(tgUser.id);
  const role = telegramId === process.env.TRAINER_TELEGRAM_ID ? "TRAINER" : "CLIENT";

  const user = await prisma.user.upsert({
    where: { telegramId },
    update: {
      firstName: tgUser.first_name,
      lastName: tgUser.last_name,
      username: tgUser.username,
      photoUrl: tgUser.photo_url,
      role,
    },
    create: {
      telegramId,
      firstName: tgUser.first_name,
      lastName: tgUser.last_name,
      username: tgUser.username,
      photoUrl: tgUser.photo_url,
      role,
    },
  });

  await setSessionCookie({ userId: user.id, role: user.role });

  return NextResponse.json({ id: user.id, role: user.role, firstName: user.firstName });
}
