"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { MeasurementDto } from "@/lib/types";

function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

export function ProgressChart({
  measurements,
  dataKey,
  unit,
  color = "var(--color-accent)",
}: {
  measurements: MeasurementDto[];
  dataKey: "weightKg" | "waterMl";
  unit: string;
  color?: string;
}) {
  const data = measurements
    .filter((m) => m[dataKey] != null)
    .map((m) => ({
      day: formatDay(m.createdAt),
      value: dataKey === "waterMl" ? (m.waterMl as number) / 1000 : m.weightKg,
    }));

  if (data.length < 2) {
    return (
      <div className="flex h-40 items-center justify-center text-sm" style={{ color: "var(--color-txt-3)" }}>
        Недостаточно данных для графика
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid stroke="var(--color-rim)" vertical={false} />
        <XAxis dataKey="day" stroke="var(--color-txt-3)" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis
          stroke="var(--color-txt-3)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          width={40}
          unit={unit}
          domain={["dataMin - 1", "dataMax + 1"]}
          allowDecimals
        />
        <Tooltip
          contentStyle={{
            background: "var(--color-card)",
            border: "1px solid var(--color-rim)",
            borderRadius: 12,
            fontSize: 12,
            color: "var(--color-txt-1)",
          }}
          formatter={(v: number) => [`${v} ${unit}`, ""]}
          labelStyle={{ color: "var(--color-txt-3)" }}
        />
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} dot={{ r: 3, fill: color }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
