"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/TelegramProvider";
import { StatusScreen } from "@/components/StatusScreen";
import { wellbeingMeta } from "@/components/WellbeingPicker";
import { ClientSummaryDto } from "@/lib/types";

function fullName(c: ClientSummaryDto) {
  return [c.firstName, c.lastName].filter(Boolean).join(" ");
}

export default function TrainerPage() {
  const { user, status } = useAuth();
  const router = useRouter();
  const [clients, setClients] = useState<ClientSummaryDto[] | null>(null);

  useEffect(() => {
    if (status !== "ready" || !user) return;
    if (user.role !== "TRAINER") {
      router.replace("/");
      return;
    }
    fetch("/api/trainer/clients")
      .then((res) => res.json())
      .then(setClients);
  }, [status, user, router]);

  if (status === "loading") return <StatusScreen title="Подключаемся к Telegram…" />;
  if (!user || user.role !== "TRAINER" || clients === null) return <StatusScreen title="Загрузка…" />;

  return (
    <main className="mx-auto min-h-dvh max-w-2xl px-4 pb-10 pt-6">
      <header className="mb-5">
        <p className="text-xs uppercase tracking-wider" style={{ color: "var(--color-txt-3)" }}>
          Дашборд тренера
        </p>
        <h1 className="font-display text-2xl" style={{ color: "var(--color-txt-1)" }}>
          Клиенты ({clients.length})
        </h1>
      </header>

      {clients.length === 0 ? (
        <div className="glass-card rounded-2xl p-6 text-center" style={{ color: "var(--color-txt-2)" }}>
          Пока никто не отправил замеры.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {clients.map((c) => {
            const mood = wellbeingMeta(c.lastMeasurement?.wellbeing ?? null);
            return (
              <Link
                key={c.id}
                href={`/trainer/${c.id}`}
                className="glass-card flex items-center justify-between rounded-2xl p-4 transition active:scale-[0.99]"
              >
                <div>
                  <p className="font-display text-base" style={{ color: "var(--color-txt-1)" }}>
                    {fullName(c)}
                  </p>
                  <p className="text-xs" style={{ color: "var(--color-txt-3)" }}>
                    {c.username ? `@${c.username} · ` : ""}
                    {c.measurementsCount} замер(ов)
                  </p>
                </div>
                <div className="flex items-center gap-2 text-right">
                  {c.lastMeasurement?.weightKg != null && (
                    <span className="font-display text-lg" style={{ color: "var(--color-txt-1)" }}>
                      {c.lastMeasurement.weightKg} кг
                    </span>
                  )}
                  {mood && <span className="text-xl">{mood.emoji}</span>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
