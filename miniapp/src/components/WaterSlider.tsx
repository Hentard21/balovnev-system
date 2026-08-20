"use client";

export function WaterSlider({ value, onChange }: { value: number; onChange: (ml: number) => void }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-2xl font-display" style={{ color: "var(--color-txt-1)" }}>
          {(value / 1000).toFixed(1)} л
        </span>
        <span className="text-xs" style={{ color: "var(--color-txt-3)" }}>
          до 5 л
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={5000}
        step={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}
