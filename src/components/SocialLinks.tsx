// ─── Социальные сети Игоря Баловнева ────────────────────────────────────────
// Ссылки задаются в одном месте: src/lib/config.ts → CONTACTS

import { CONTACTS } from "@/lib/config";

interface SocialLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const SOCIALS: SocialLink[] = [
  {
    label: "Telegram",
    href: CONTACTS.telegram,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.2-.06-.05-.15-.04-.22-.02-.1.02-1.61 1.03-4.55 3.01-.43.3-.82.45-1.17.44-.39-.01-1.13-.22-1.68-.4-.68-.22-1.22-.34-1.17-.71.03-.19.28-.39.77-.6 3.02-1.32 5.03-2.19 6.03-2.6 2.87-1.19 3.47-1.4 3.85-1.41.09 0 .28.02.4.12.1.08.12.19.13.27-.01.09-.01.17-.02.21z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: CONTACTS.instagram,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: CONTACTS.whatsapp,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    label: "VK",
    href: CONTACTS.vk,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M15.684 0H8.316C3.724 0 0 3.724 0 8.316v7.368C0 20.276 3.724 24 8.316 24h7.368C20.276 24 24 20.276 24 15.684V8.316C24 3.724 20.276 0 15.684 0zm3.692 15.684h-1.812c-.416 0-.543-.33-1.283-1.08-.647-.625-1.463-.486-1.854-.263-.568.325-.55.947-.55 1.148 0 .194-.15.375-.425.375H12.4c-1.736 0-3.634-.958-4.98-2.741C5.382 10.086 5.2 5.91 5.164 5.657c-.018-.131.048-.253.202-.253h1.83c.154 0 .28.09.325.229.293.959.77 2.226 1.432 3.348.786 1.332 1.221 1.822 1.498 1.66.415-.244.379-1.78.33-2.327-.08-.97-.57-1.41-.57-1.41-.1-.07.06-.23.157-.33.173-.18.48-.27.76-.27h2.06c.44 0 .58.23.58.37 0 .14.06 1.24-.33 2.05-.19.39.28.59.47.78.19.19.83-.01 2.06-2.19.06-.12.95-1.22 1.13-1.58.06-.14.176-.23.326-.23h1.81c.267 0 .407.213.337.405-.636 1.728-2.654 4.507-3.081 4.507-.37 0-.55-.13-.78-.444-.234-.312-.42-.686-.42-.686s-.32 1.3.19 1.91c.56.66 1.35.47 1.98.47.25 0 1.215-.07 1.63-.37.19-.14.09-.39.09-.39z" />
      </svg>
    ),
  },
];

// ─── Стили вариантов ────────────────────────────────────────────────────────
type Variant = "row" | "footer";

const variantStyles: Record<
  Variant,
  { wrapper: string; item: string; itemHover: string }
> = {
  row: {
    wrapper: "flex flex-wrap items-center justify-center gap-3",
    item: "glass-card rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs font-medium transition-all duration-300",
    itemHover: "",
  },
  footer: {
    wrapper: "flex items-center justify-center gap-4",
    item: "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300",
    itemHover: "",
  },
};

// ─── Компонент ──────────────────────────────────────────────────────────────
export default function SocialLinks({ variant = "row" }: { variant?: Variant }) {
  const s = variantStyles[variant];

  return (
    <div className={s.wrapper}>
      {SOCIALS.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          className={s.item}
          style={{
            color: "var(--color-txt-2)",
            background:
              variant === "footer"
                ? "rgb(255 255 255 / 0.04)"
                : undefined,
            border:
              variant === "footer"
                ? "1px solid var(--color-rim)"
                : undefined,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--color-accent)";
            e.currentTarget.style.borderColor = "var(--color-rim-accent)";
            e.currentTarget.style.background =
              variant === "footer"
                ? "var(--color-accent-dim)"
                : "rgb(249 115 22 / 0.06)";
            e.currentTarget.style.boxShadow =
              "0 0 16px rgb(249 115 22 / 0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--color-txt-2)";
            e.currentTarget.style.borderColor = "var(--color-rim)";
            e.currentTarget.style.background =
              variant === "footer"
                ? "rgb(255 255 255 / 0.04)"
                : "";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <span className="flex-shrink-0" style={{ color: "var(--color-accent)" }}>
            {social.icon}
          </span>
          {variant === "row" && <span>{social.label}</span>}
        </a>
      ))}
    </div>
  );
}
