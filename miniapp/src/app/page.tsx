"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/TelegramProvider";
import { StatusScreen } from "@/components/StatusScreen";
import { BottomNav } from "@/components/BottomNav";
import { MeasurementCard } from "@/components/MeasurementCard";
import { MeasurementDto } from "@/lib/types";

export default function HomePage() {
  const { user, status, errorMessage } = useAuth();
  const router = useRouter();
  const [measurements, setMeasurements] = useState<MeasurementDto[] | null>(null);

  useEffect(() => {
    if (status !== "ready" || !user) return;
    if (user.role === "TRAINER") {
      router.replace("/trainer");
      return;
    }
    fetch("/api/measurements")
      .then((res) => res.json())
      .then(setMeasurements);
  }, [status, user, router]);

  if (status === "loading") return <StatusScreen title="Подключаемся к Telegram…" />;
  if (status === "error")
    return <StatusScreen title="Не удалось войти" subtitle={errorMessage ?? undefined} />;
  if (!user || user.role === "TRAINER" || measurements === null)
    return <StatusScreen title="Загрузка…" />;

  return (
    <main className="mx-auto min-h-dvh max-w-md px-4 pb-24 pt-6">
      <header className="mb-5">
        <p className="text-xs uppercase tracking-wider" style={{ color: "var(--color-txt-3)" }}>
          С возвращением
        </p>
        <h1 className="font-display text-2xl" style={{ color: "var(--color-txt-1)" }}>
          {user.firstName}
        </h1>
      </header>

      {measurements.length === 0 ? (
        <div className="glass-card rounded-2xl p-6 text-center">
          <p style={{ color: "var(--color-txt-2)" }}>Замеров пока нет.</p>
          <p className="mt-1 text-sm" style={{ color: "var(--color-txt-3)" }}>
            Добавь первый — вкладка «Новый замер» внизу.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {measurements.map((m, i) => (
            <MeasurementCard key={m.id} m={m} previous={measurements[i + 1]} />
          ))}
        </div>
      )}

      <BottomNav />
    </main>
  );
}
