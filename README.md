# Игорь Баловнев — сайт персонального онлайн-коучинга

Лендинг на Next.js 16 (App Router, Tailwind 4, framer-motion) со статическим
экспортом для GitHub Pages. Часть экосистемы: сайт + Telegram-бот для сбора
еженедельных отчётов подопечных и ИИ-разбора анализов.

## Запуск локально

```bash
npm install
npm run dev      # http://localhost:3000
```

## Сборка и деплой

```bash
npm run build    # статический сайт в ./out
```

Деплой автоматический: пуш в `main` репозитория `balovnev-system` запускает
GitHub Actions (`.github/workflows/deploy.yml`) и публикует `out/` на
GitHub Pages. Перед первым деплоем включите в настройках репозитория:
**Settings → Pages → Source → «GitHub Actions»**.

## ✅ Чек-лист перед запуском

Все заглушки собраны в одном файле — `src/lib/config.ts`:

- [ ] `CONTACTS` — реальные ссылки Telegram / Instagram / WhatsApp / VK
- [ ] `SITE_URL` — реальный адрес сайта (username на GitHub или домен)
- [ ] `FORM_ENDPOINT` — URL вебхука бота для приёма заявок с формы
      (пока пустой — форма предлагает написать напрямую)
- [ ] `YANDEX_METRIKA_ID` — номер счётчика Яндекс.Метрики

Кроме config.ts:

- [ ] `public/robots.txt` и `public/sitemap.xml` — заменить USERNAME
- [ ] `/privacy` и `/oferta` — заполнить места, выделенные жёлтым
      (реквизиты, условия возврата), показать юристу
- [ ] `src/components/Testimonials.tsx` — заменить отзывы-заглушки на
      реальные (с письменного согласия учеников)
- [ ] Сжать видео в `public/video/` (сейчас до 7,7 МБ; цель — до 2 МБ каждое)

## Структура

- `src/app/page.tsx` — главная (порядок секций)
- `src/app/privacy`, `src/app/oferta` — юридические страницы
- `src/components/` — секции лендинга
- `src/lib/config.ts` — все настройки и заглушки
- `.github/workflows/deploy.yml` — автодеплой на Pages

## Секреты

`.env` игнорируется гитом (`.gitignore` → `.env*`) — ключи API в репозиторий
не попадают. Никогда не вписывайте ключи в клиентский код: статический сайт
целиком виден пользователям.
