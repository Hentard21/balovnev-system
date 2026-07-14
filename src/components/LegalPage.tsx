import Link from "next/link";

// ─── Обёртка для текстовых (юридических) страниц ─────────────────────────────
export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1" style={{ background: "var(--color-deep)" }}>
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
        {/* Назад */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium mb-10 transition-colors hover:opacity-80"
          style={{ color: "var(--color-accent)" }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          На главную
        </Link>

        <h1 className="text-2xl sm:text-4xl font-bold leading-tight mb-3">{title}</h1>
        <p className="text-xs mb-10" style={{ color: "var(--color-txt-3)" }}>
          Дата последнего обновления: {updated}
        </p>

        {/* Текст документа */}
        <div
          className="legal-content flex flex-col gap-4 text-sm sm:text-base leading-relaxed"
          style={{ color: "var(--color-txt-2)" }}
        >
          {children}
        </div>
      </div>

      <style>{`
        .legal-content h2 {
          color: var(--color-txt-1);
          font-weight: 700;
          font-size: 1.15em;
          margin-top: 1.25rem;
        }
        .legal-content ul {
          list-style: disc;
          padding-left: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }
        .legal-content mark {
          background: var(--color-accent-dim);
          color: var(--color-accent);
          padding: 0 0.35em;
          border-radius: 0.25em;
          font-weight: 600;
        }
      `}</style>
    </main>
  );
}
