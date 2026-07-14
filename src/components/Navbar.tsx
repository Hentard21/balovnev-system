"use client";

import { useState, useEffect } from "react";

// ─── Пункты меню (якоря секций главной страницы) ─────────────────────────────
const NAV_ITEMS = [
  { id: "about", label: "О наставнике" },
  { id: "ecosystem", label: "Экосистема" },
  { id: "testimonials", label: "Отзывы" },
  { id: "tariffs", label: "Тарифы" },
  { id: "faq", label: "FAQ" },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ─── Компонент ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (id: string) => {
    setMenuOpen(false);
    scrollTo(id);
  };

  return (
    <header
      className="sticky top-0 z-40 w-full transition-all duration-300"
      style={{
        background: scrolled ? "color-mix(in srgb, var(--color-deep) 82%, transparent)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid var(--color-rim)" : "1px solid transparent",
      }}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* Словомарка */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-baseline gap-0.5 shrink-0"
          aria-label="Наверх"
        >
          <span
            className="font-display text-sm sm:text-base font-bold tracking-[0.06em] uppercase"
            style={{ color: "var(--color-txt-1)" }}
          >
            Баловнев
          </span>
          <span
            className="w-1.5 h-1.5 rounded-full translate-y-[-1px]"
            style={{ background: "var(--color-accent)" }}
            aria-hidden="true"
          />
        </button>

        {/* Меню — десктоп */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className="px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-white/[0.05]"
              style={{ color: "var(--color-txt-2)" }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* CTA + бургер */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleNav("contact")}
            className="btn-accent px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap"
          >
            Оставить заявку
          </button>

          {/* Бургер — мобильный */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center btn-ghost"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={menuOpen}
          >
            <svg className="w-4.5 h-4.5 w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Выпадающее мобильное меню */}
      {menuOpen && (
        <div
          className="md:hidden border-t px-5 py-3 flex flex-col"
          style={{
            background: "color-mix(in srgb, var(--color-deep) 94%, transparent)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderColor: "var(--color-rim)",
          }}
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className="text-left px-2 py-3 text-sm font-medium border-b last:border-b-0"
              style={{ color: "var(--color-txt-2)", borderColor: "var(--color-rim)" }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
