import type { NextConfig } from "next";

// ─── Статический экспорт для GitHub Pages ────────────────────────────────────
// Сайт живёт на собственном домене https://balovnev-system.ru (см. public/CNAME)
// и отдаётся с корня, поэтому basePath пуст по умолчанию.
//
// Если домен когда-нибудь отвяжут и сайт вернётся на путь вида
// <username>.github.io/balovnev-system/, задайте в workflow
// NEXT_PUBLIC_BASE_PATH=/balovnev-system — код подхватит его автоматически.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    // GitHub Pages не умеет оптимизировать изображения на лету
    unoptimized: true,
  },
};

export default nextConfig;
