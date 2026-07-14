import type { Metadata } from "next";
import { Sofia_Sans_Condensed, Sofia_Sans, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SITE_URL, YANDEX_METRIKA_ID } from "@/lib/config";
import "./globals.css";

// Дисплейный шрифт — заголовки, логотип (атлетический кондансед, кириллица)
const sofiaCondensed = Sofia_Sans_Condensed({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700", "800"],
});

// Текстовый шрифт — всё остальное (та же суперсемья — целостная пара)
const sofiaSans = Sofia_Sans({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
});

// Моно — только для табличных цифр таймера
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Игорь Баловнев | Персональный онлайн-коучинг",
  description:
    "Построй форму уровня Абсолютного Чемпиона под личным контролем Игоря Баловнева — 3-кратного чемпиона России по пляжному бодибилдингу. Персональное ведение с ИИ-мониторингом здоровья.",
  keywords: [
    "бодибилдинг",
    "пляжный бодибилдинг",
    "онлайн-коучинг",
    "Игорь Баловнев",
    "персональный тренер",
    "фитнес",
  ],
  openGraph: {
    title: "Игорь Баловнев | Персональный онлайн-коучинг",
    description:
      "Построй форму уровня Абсолютного Чемпиона под личным контролем Игоря Баловнева.",
    type: "website",
    locale: "ru_RU",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Игорь Баловнев — персональный онлайн-коучинг" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Игорь Баловнев | Персональный онлайн-коучинг",
    description:
      "Построй форму уровня Абсолютного Чемпиона под личным контролем Игоря Баловнева.",
    images: ["/og.jpg"],
  },
};

// ─── Структурированные данные для поисковиков ────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Игорь Баловнев",
  url: SITE_URL,
  jobTitle: "Персональный тренер, онлайн-коуч",
  description:
    "3-кратный чемпион России по пляжному бодибилдингу. Персональное онлайн-ведение с ИИ-мониторингом здоровья.",
  knowsAbout: ["бодибилдинг", "фитнес", "спортивное питание", "биомеханика"],
  makesOffer: [
    {
      "@type": "Offer",
      name: "Абсолютный Чемпион — персональное онлайн-ведение",
      price: "15000",
      priceCurrency: "RUB",
    },
    {
      "@type": "Offer",
      name: "Гран-при Pro — очный тренинг в Краснодаре",
      price: "20000",
      priceCurrency: "RUB",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${sofiaCondensed.variable} ${sofiaSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* Inline-скрипт: предотвращает вспышку неправильной темы до гидрации.
            Next.js автоматически поместит его в <head> благодаря beforeInteractive. */}
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("balovnev-theme");if(!t){t=window.matchMedia("(prefers-color-scheme:light)").matches?"light":"dark"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`,
          }}
        />

        {/* JSON-LD для поисковиков */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Яндекс.Метрика — подключается, когда в config.ts указан YANDEX_METRIKA_ID */}
        {YANDEX_METRIKA_ID && (
          <Script
            id="yandex-metrika"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${YANDEX_METRIKA_ID},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true});`,
            }}
          />
        )}

        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
