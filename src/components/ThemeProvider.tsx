"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

// ─── Типы ───────────────────────────────────────────────────────────────────
type Theme = "dark" | "light";

interface ThemeCtx {
  theme: Theme;
  toggle: () => void;
}

// ─── Контекст ───────────────────────────────────────────────────────────────
const ThemeContext = createContext<ThemeCtx>({ theme: "dark", toggle: () => {} });

export const useTheme = () => useContext(ThemeContext);

// ─── Вспомогательные ────────────────────────────────────────────────────────
const STORAGE_KEY = "balovnev-theme";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return getSystemTheme();
}

function applyTheme(t: Theme) {
  document.documentElement.setAttribute("data-theme", t);
}

// ─── Provider ───────────────────────────────────────────────────────────────
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Гидрация без вспышки
  useEffect(() => {
    const t = getStoredTheme();
    // Синхронизация с localStorage после гидрации — легитимный случай
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(t);
    applyTheme(t);
    setMounted(true);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
      {mounted && <ThemeToggle theme={theme} toggle={toggle} />}
    </ThemeContext.Provider>
  );
}

// ─── Тумблер ────────────────────────────────────────────────────────────────
function ThemeToggle({ theme, toggle }: { theme: Theme; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"}
      className="
        fixed bottom-6 right-6 z-50
        flex items-center gap-2.5
        px-3.5 py-2.5 rounded-full
        glass-card
        text-xs font-medium
        transition-all duration-300
        hover:border-[var(--color-rim-accent)]
        active:scale-95
      "
      style={{ color: "var(--color-txt-2)" }}
    >
      {/* Иконка солнца */}
      <svg
        className={`w-4 h-4 transition-all duration-300 ${
          theme === "light" ? "opacity-100 scale-100" : "opacity-40 scale-90"
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
        style={{ color: "var(--color-accent)" }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 4.05l.71.71M21 12h-1M4 12H3m16.95 7.95l-.71-.71M4.05 19.95l.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>

      {/* Разделитель */}
      <span
        className="w-px h-4 transition-colors duration-300"
        style={{ background: "var(--color-rim)" }}
      />

      {/* Иконка луны */}
      <svg
        className={`w-4 h-4 transition-all duration-300 ${
          theme === "dark" ? "opacity-100 scale-100" : "opacity-40 scale-90"
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
        style={{ color: "var(--color-txt-2)" }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
        />
      </svg>
    </button>
  );
}
