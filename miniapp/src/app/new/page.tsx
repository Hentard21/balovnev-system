"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/TelegramProvider";
import { StatusScreen } from "@/components/StatusScreen";
import { BottomNav } from "@/components/BottomNav";
import { WellbeingPicker, Wellbeing } from "@/components/WellbeingPicker";
import { WaterSlider } from "@/components/WaterSlider";
import { TagInput } from "@/components/TagInput";
import { PhotoPicker } from "@/components/PhotoPicker";

export default function NewMeasurementPage() {
  const { user, status } = useAuth();
  const router = useRouter();

  const [weight, setWeight] = useState("");
  const [water, setWater] = useState(2000);
  const [wellbeing, setWellbeing] = useState<Wellbeing | null>(null);
  const [supplements, setSupplements] = useState<string[]>([]);
  const [showAnabolics, setShowAnabolics] = useState(false);
  const [anabolics, setAnabolics] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status === "loading") return <StatusScreen title="Подключаемся к Telegram…" />;
  if (!user) return <StatusScreen title="Не удалось войти" />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData();
    if (weight) form.set("weightKg", weight);
    form.set("waterMl", String(water));
    if (wellbeing) form.set("wellbeing", wellbeing);
    if (supplements.length) form.set("supplements", JSON.stringify(supplements));
    if (anabolics.length) form.set("anabolics", JSON.stringify(anabolics));
    if (note) form.set("note", note);
    photos.forEach((f) => form.append("photos", f));

    try {
      const res = await fetch("/api/measurements", { method: "POST", body: form });
      if (!res.ok) throw new Error("Не удалось сохранить замер");
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto min-h-dvh max-w-md px-4 pb-28 pt-6">
      <h1 className="mb-5 font-display text-2xl" style={{ color: "var(--color-txt-1)" }}>
        Новый замер
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <section>
          <label className="mb-2 block text-sm" style={{ color: "var(--color-txt-2)" }}>
            Вес, кг
          </label>
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            min="0"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="напр. 78.4"
            className="w-full rounded-xl border px-4 py-3 text-lg outline-none"
            style={{ borderColor: "var(--color-rim)", background: "var(--color-surface)", color: "var(--color-txt-1)" }}
          />
        </section>

        <section>
          <label className="mb-2 block text-sm" style={{ color: "var(--color-txt-2)" }}>
            Сколько воды выпил
          </label>
          <WaterSlider value={water} onChange={setWater} />
        </section>

        <section>
          <label className="mb-2 block text-sm" style={{ color: "var(--color-txt-2)" }}>
            Самочувствие
          </label>
          <WellbeingPicker value={wellbeing} onChange={setWellbeing} />
        </section>

        <section>
          <label className="mb-2 block text-sm" style={{ color: "var(--color-txt-2)" }}>
            БАДы за последнее время
          </label>
          <TagInput value={supplements} onChange={setSupplements} placeholder="напр. Омега-3" />
        </section>

        <section>
          <button
            type="button"
            onClick={() => setShowAnabolics((v) => !v)}
            className="flex w-full items-center justify-between text-sm"
            style={{ color: "var(--color-txt-2)" }}
          >
            <span>Анаболики (опционально)</span>
            <span style={{ color: "var(--color-txt-3)" }}>{showAnabolics ? "скрыть" : "указать"}</span>
          </button>
          {showAnabolics && (
            <div className="mt-2">
              <TagInput
                value={anabolics}
                onChange={setAnabolics}
                placeholder="напр. препарат и дозировка"
                accentClass="border-[rgb(234_179_8_/_0.35)] bg-[rgb(234_179_8_/_0.08)] text-[var(--color-warn)]"
              />
              <p className="mt-1.5 text-xs" style={{ color: "var(--color-txt-3)" }}>
                Эта информация видна только тренеру и нужна для безопасной корректировки программы.
              </p>
            </div>
          )}
        </section>

        <section>
          <label className="mb-2 block text-sm" style={{ color: "var(--color-txt-2)" }}>
            Фото замеров
          </label>
          <PhotoPicker files={photos} onChange={setPhotos} />
        </section>

        <section>
          <label className="mb-2 block text-sm" style={{ color: "var(--color-txt-2)" }}>
            Комментарий
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Необязательно"
            className="w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none"
            style={{ borderColor: "var(--color-rim)", background: "var(--color-surface)", color: "var(--color-txt-1)" }}
          />
        </section>

        {error && <p className="text-sm" style={{ color: "var(--color-bad)" }}>{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl py-3.5 text-center font-display text-base disabled:opacity-50"
          style={{ background: "var(--color-accent)", color: "#0b0d10" }}
        >
          {submitting ? "Сохраняем…" : "Сохранить замер"}
        </button>
      </form>

      <BottomNav />
    </main>
  );
}
