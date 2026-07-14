"use client";

import { useState, useEffect } from "react";
import { DISCOUNT_PERCENT } from "@/lib/config";

// ─── Честный дедлайн: конец текущего месяца ─────────────────────────────────
// Скидка действует для всех, кто стартует в текущем месяце, — дедлайн
// одинаковый у всех посетителей и не «перезапускается» по localStorage.
function endOfMonth(): number {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).getTime();
}

const MONTHS_PREPOSITIONAL = [
  "январе", "феврале", "марте", "апреле", "мае", "июне",
  "июле", "августе", "сентябре", "октябре", "ноябре", "декабре",
];

/** Форматирует остаток в [дни, ЧЧ, ММ, СС]. */
function formatParts(ms: number): { days: number; hh: string; mm: string; ss: string } {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return { days, hh: pad(hours), mm: pad(minutes), ss: pad(seconds) };
}

// ─── Компонент ──────────────────────────────────────────────────────────────
export default function CountdownTimer() {
  // null до гидрации — избегаем SSR/CSR mismatch
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [monthName, setMonthName] = useState("");

  useEffect(() => {
    const deadline = endOfMonth();
    // Синхронизация с внешним источником (часами) после гидрации
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMonthName(MONTHS_PREPOSITIONAL[new Date().getMonth()]);

    const tick = () => setTimeLeft(deadline - Date.now());
    // Синхронизация с внешним источником (часами) — сразу показываем время
    // eslint-disable-next-line react-hooks/set-state-in-effect
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const baseClasses =
    "w-full py-1.5 sm:py-2.5 px-3 sm:px-4 text-center text-[10px] sm:text-sm relative overflow-hidden";
  const baseStyle: React.CSSProperties = {
    background: "var(--color-surface)",
    borderBottom: "1px solid var(--color-rim)",
  };

  // Скелетон до гидрации
  if (timeLeft === null) {
    return (
      <div className={baseClasses} style={baseStyle}>
        &nbsp;
      </div>
    );
  }

  const { days, hh, mm, ss } = formatParts(timeLeft);
  const accentColor = "var(--color-accent)";
  const textColor = "var(--color-txt-2)";
  const numColor = "var(--color-txt-1)";

  return (
    <div className={baseClasses} style={baseStyle}>
      <span className="relative" style={{ color: textColor }}>
        Скидка{" "}
        <span className="font-semibold" style={{ color: accentColor }}>
          {DISCOUNT_PERCENT}%
        </span>{" "}
        на первый месяц для стартующих в {monthName}
        {" — до конца месяца: "}
      </span>

      <span className="relative inline-flex items-center gap-0.5 font-mono font-bold" style={{ color: numColor }}>
        {days > 0 && (
          <>
            <span className="tabular-nums">{days}</span>
            <span className="mx-0.5 font-sans font-normal" style={{ color: textColor }}>
              дн.
            </span>
          </>
        )}
        <span className="tabular-nums">{hh}</span>
        <span style={{ color: textColor }}>:</span>
        <span className="tabular-nums">{mm}</span>
        <span style={{ color: textColor }}>:</span>
        <span className="tabular-nums">{ss}</span>
      </span>
    </div>
  );
}
