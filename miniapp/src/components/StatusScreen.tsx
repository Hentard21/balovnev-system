export function StatusScreen({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-2 px-6 text-center">
      <p className="font-display text-lg" style={{ color: "var(--color-txt-1)" }}>
        {title}
      </p>
      {subtitle && (
        <p className="text-sm" style={{ color: "var(--color-txt-3)" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
