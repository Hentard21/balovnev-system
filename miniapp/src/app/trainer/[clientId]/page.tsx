"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/TelegramProvider";
import { StatusScreen } from "@/components/StatusScreen";
import { MeasurementCard } from "@/components/MeasurementCard";
import { ProgressChart } from "@/components/ProgressChart";
import { ClientDetailDto } from "@/lib/types";

function fullName(c: ClientDetailDto) {
  return [c.firstName, c.lastName].filter(Boolean).join(" ");
}

export default function ClientDetailPage() {
  const { user, status } = useAuth();
  const router = useRouter();
  const params = useParams<{ clientId: string }>();
  const [client, setClient] = useState<ClientDetailDto | null | "not-found">(null);

  useEffect(() => {
    if (status !== "ready" || !user) return;
    if (user.role !== "TRAINER") {
      router.replace("/");
      return;
    }
    fetch(`/api/trainer/clients/${params.clientId}`)
      .then((res) => (res.ok ? res.json() : "not-found"))
      .then(setClient);
  }, [status, user, router, params.clientId]);

  if (status === "loading") return <StatusScreen title="Подключаемся к Telegram…" />;
  if (!user || user.role !== "TRAINER" || client === null) return <StatusScreen title="Загрузка…" />;
  if (client === "not-found") return <StatusScreen title="Клиент не найден" />;

  const measurementsDesc = [...client.measurements].reverse();

  return (
    <main className="mx-auto min-h-dvh max-w-2xl px-4 pb-10 pt-6">
      <Link href="/trainer" className="mb-4 inline-block text-sm" style={{ color: "var(--color-txt-3)" }}>
        ← Все клиенты
      </Link>

      <header className="mb-6">
        <h1 className="font-display text-2xl" style={{ color: "var(--color-txt-1)" }}>
          {fullName(client)}
        </h1>
        {client.username && (
          <p className="text-sm" style={{ color: "var(--color-txt-3)" }}>
            @{client.username}
          </p>
        )}
      </header>

      {client.measurements.length === 0 ? (
        <div className="glass-card rounded-2xl p-6 text-center" style={{ color: "var(--color-txt-2)" }}>
          Замеров пока нет.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="glass-card rounded-2xl p-4">
            <p className="mb-2 text-sm" style={{ color: "var(--color-txt-2)" }}>
              Вес, кг
            </p>
            <ProgressChart measurements={client.measurements} dataKey="weightKg" unit="кг" color="var(--color-accent)" />
          </div>

          <div className="glass-card rounded-2xl p-4">
            <p className="mb-2 text-sm" style={{ color: "var(--color-txt-2)" }}>
              Вода, л/день
            </p>
            <ProgressChart measurements={client.measurements} dataKey="waterMl" unit="л" color="#38bdf8" />
          </div>

          <div>
            <p className="mb-3 text-sm" style={{ color: "var(--color-txt-2)" }}>
              История замеров
            </p>
            <div className="flex flex-col gap-3">
              {measurementsDesc.map((m, i) => (
                <MeasurementCard key={m.id} m={m} previous={measurementsDesc[i + 1]} />
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
