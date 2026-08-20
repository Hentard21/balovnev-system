import path from "path";
import type { NextConfig } from "next";

// Серверное приложение (не статический экспорт): нужны API-роуты для приёма
// замеров, авторизации через Telegram initData и раздачи фото с проверкой прав.
const nextConfig: NextConfig = {
  // В репозитории два package-lock.json (сайт и miniapp) — явно фиксируем
  // корень трассировки файлов, чтобы Next не гадал.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
