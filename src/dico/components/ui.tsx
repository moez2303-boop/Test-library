import type { ReactNode } from "react";

export function Badge({ children, tone = "soft" }: { children: ReactNode; tone?: "soft" | "ai" | "matcha" | "kin" }) {
  const cls = {
    soft: "bg-line/60 text-ink-soft",
    ai: "bg-ai-soft text-ai",
    matcha: "bg-matcha/15 text-matcha",
    kin: "bg-kin/15 text-kin",
  }[tone];
  return <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${cls}`}>{children}</span>;
}

export function Section({ title, children, right }: { title: string; children: ReactNode; right?: ReactNode }) {
  return (
    <section className="mt-6">
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="text-xs font-semibold tracking-wide text-ink-soft uppercase">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-card ring-1 ring-line ${className}`}>{children}</div>;
}

export function IconButton({
  label,
  onClick,
  children,
  active,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={`grid h-10 w-10 place-items-center rounded-full text-lg transition ${
        active ? "bg-ai text-card" : "bg-card text-ink ring-1 ring-line hover:bg-ai-soft"
      }`}
    >
      {children}
    </button>
  );
}

export function TopBar({ title, onBack, right }: { title?: ReactNode; onBack?: () => void; right?: ReactNode }) {
  return (
    <div className="sticky top-0 z-20 -mx-4 mb-2 flex items-center gap-2 bg-paper/90 px-4 pt-[calc(env(safe-area-inset-top,0px)+10px)] pb-2 backdrop-blur">
      {onBack && (
        <button onClick={onBack} className="-ml-2 rounded-full px-2 py-1 text-ai hover:bg-ai-soft" aria-label="Retour">
          ‹ Retour
        </button>
      )}
      <div className="min-w-0 flex-1 truncate text-center font-semibold">{title}</div>
      <div className="flex min-w-[60px] justify-end">{right}</div>
    </div>
  );
}
