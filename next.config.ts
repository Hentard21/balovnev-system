import type { NextConfig } from "next";

// ─── Статический экспорт для GitHub Pages ────────────────────────────────────
// Репозиторий: balovnev-system → сайт живёт по адресу
// https://<username>.github.io/balovnev-system/
//
// basePath подставляется только при сборке в CI (см. .github/workflows/deploy.yml,
// там выставляется NEXT_PUBLIC_BASE_PATH=/balovnev-system).
// Локальная разработка (npm run dev) работает без префикса.
// При переезде на собственный домен просто уберите env из workflow.
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
