"use client";

export type Wellbeing = "GREAT" | "GOOD" | "OK" | "BAD" | "TERRIBLE";

const OPTIONS: { value: Wellbeing; emoji: string; label: string }[] = [
  { value: "GREAT", emoji: "😄", label: "Отлично" },
  { value: "GOOD", emoji: "🙂", label: "Хорошо" },
  { value: "OK", emoji: "😐", label: "Норм" },
  { value: "BAD", emoji: "🙁", label: "Плохо" },
  { value: "TERRIBLE", emoji: "🤒", label: "Очень плохо" },
];

export function wellbeingMeta(value: Wellbeing | null | undefined) {
  return OPTIONS.find((o) => o.value === value) ?? null;
}

export function WellbeingPicker({
  value,
  onChange,
}: {
  value: Wellbeing | null;
  onChange: (v: Wellbeing) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {OPTIONS.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="flex flex-col items-center gap-1.5 rounded-2xl border py-3 text-[11px] transition active:scale-95"
            style={{
              borderColor: selected ? "var(--color-rim-accent)" : "var(--color-rim)",
              background: selected ? "var(--color-accent-dim)" : "var(--color-surface)",
              color: selected ? "var(--color-accent-light)" : "var(--color-txt-2)",
            }}
          >
            <span className="text-2xl leading-none">{opt.emoji}</span>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
