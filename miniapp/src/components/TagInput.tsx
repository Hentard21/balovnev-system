"use client";

import { useState, KeyboardEvent } from "react";

interface Props {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
  accentClass?: string;
}

const DEFAULT_ACCENT = "border-[var(--color-rim-accent)] bg-[var(--color-accent-dim)] text-[var(--color-accent-light)]";

export function TagInput({ value, onChange, placeholder, accentClass = DEFAULT_ACCENT }: Props) {
  const [draft, setDraft] = useState("");

  function addTag() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...value, trimmed]);
    setDraft("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-[var(--color-rim)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-txt-1)] outline-none placeholder:text-[var(--color-txt-3)] focus:border-[var(--color-rim-accent)]"
        />
        <button
          type="button"
          onClick={addTag}
          className="rounded-xl border border-[var(--color-rim)] px-4 text-sm text-[var(--color-txt-2)] active:scale-95 transition"
        >
          +
        </button>
      </div>
      {value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {value.map((tag, i) => (
            <span
              key={`${tag}-${i}`}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${accentClass}`}
            >
              {tag}
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                className="text-current/70 hover:text-current"
                aria-label={`Убрать ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
