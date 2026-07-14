"use client";

import Link from "next/link";
import CountdownTimer from "@/components/CountdownTimer";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import About from "@/components/About";
import HowItWorks from "@/components/HowItWorks";
import UniversalTraining from "@/components/UniversalTraining";
import Ecosystem from "@/components/Ecosystem";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Tariffs from "@/components/Tariffs";
import FAQ from "@/components/FAQ";
import ContactForm from "@/components/ContactForm";
import SocialLinks from "@/components/SocialLinks";

// ─── Утилита плавного скролла к секции ──────────────────────────────────────
function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ─── Страница ────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main className="flex flex-col flex-1">
      {/* Баннер-таймер скидки (прокручивается вместе со страницей) */}
      <CountdownTimer />

      {/* Навигация (прилипает к верху) */}
      <Navbar />

      {/* Главный экран */}
      <Hero
        onScrollToTariffs={() => scrollTo("tariffs")}
        onScrollToEcosystem={() => scrollTo("ecosystem")}
      />

      {/* Цифры и факты */}
      <Stats />

      {/* О наставнике */}
      <About />

      {/* Как проходит работа */}
      <HowItWorks />

      {/* Универсальный тренинг (видео + фото) */}
      <UniversalTraining />

      {/* ИИ-экосистема */}
      <Ecosystem />

      {/* Галерея */}
      <Gallery />

      {/* Отзывы */}
      <Testimonials />

      {/* Тарифы */}
      <Tariffs />

      {/* FAQ */}
      <FAQ />

      {/* Форма захвата */}
      <ContactForm />

      {/* Подвал */}
      <footer
        className="py-10 border-t flex flex-col items-center gap-6 px-5 text-center"
        style={{
          background: "var(--color-deep)",
          borderColor: "var(--color-rim)",
        }}
      >
        <SocialLinks variant="footer" />

        {/* Юридические ссылки */}
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
          <Link
            href="/privacy"
            className="transition-colors hover:opacity-80"
            style={{ color: "var(--color-txt-2)" }}
          >
            Политика конфиденциальности
          </Link>
          <Link
            href="/oferta"
            className="transition-colors hover:opacity-80"
            style={{ color: "var(--color-txt-2)" }}
          >
            Публичная оферта
          </Link>
        </nav>

        <span className="text-xs" style={{ color: "var(--color-txt-3)" }}>
          © 2026 Игорь Баловнев. Все права защищены.
        </span>
      </footer>
    </main>
  );
}
