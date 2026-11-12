import { useEffect, useRef } from "react";

export type Section = "manga" | "game" | "library";

export const SECTIONS: { key: Section; jp: string; en: string; badge: string; about: string }[] = [
  { key: "manga", jp: "マンガ", en: "Manga", badge: "読", about: "Read stories, then do exercises" },
  { key: "game", jp: "ゲーム", en: "Word game", badge: "遊", about: "Match 500 N3–N2 words" },
  { key: "library", jp: "動画", en: "Clips", badge: "映", about: "Video clips and questions" },
];

/** A slide-out menu from the left with large, easy-to-tap sections. */
export function SideMenu({
  open,
  current,
  onSelect,
  onClose,
  extra,
}: {
  open: boolean;
  current: Section;
  onSelect: (s: Section) => void;
  onClose: () => void;
  extra?: React.ReactNode;
}) {
  const firstItem = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    firstItem.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-sumi/40 transition-opacity duration-200 motion-reduce:transition-none ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <nav
        role="dialog"
        aria-modal="true"
        aria-label="Sections"
        className={`absolute inset-y-0 left-0 flex w-[min(85vw,20rem)] flex-col bg-card shadow-2xl transition-transform duration-200 motion-reduce:transition-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)",
          paddingLeft: "env(safe-area-inset-left, 0px)",
        }}
      >
        <div className="flex items-center gap-2 px-5 pb-4">
          <span className="jp grid h-9 w-9 place-items-center rounded-full bg-shu font-display text-lg text-white">
            言
          </span>
          <span className="flex-1 font-display text-lg font-bold">Kotoba Clips</span>
          <button
            onClick={onClose}
            className="grid h-11 w-11 place-items-center rounded-full text-xl hover:bg-washi"
            aria-label="Close menu"
            tabIndex={open ? 0 : -1}
          >
            ✕
          </button>
        </div>
        <ul className="grid gap-1 px-3">
          {SECTIONS.map((s, i) => {
            const active = s.key === current;
            return (
              <li key={s.key}>
                <button
                  ref={i === 0 ? firstItem : undefined}
                  tabIndex={open ? 0 : -1}
                  onClick={() => onSelect(s.key)}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-16 w-full items-center gap-3 rounded-xl px-3 py-2 text-left ${
                    active ? "bg-sumi text-washi" : "hover:bg-washi"
                  }`}
                >
                  <span
                    className={`jp grid h-10 w-10 shrink-0 place-items-center rounded-lg font-display text-lg ${
                      active ? "bg-washi/15" : "bg-washi-dark"
                    }`}
                  >
                    {s.badge}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold">
                      <span className="jp">{s.jp}</span> <span className="font-normal opacity-80">· {s.en}</span>
                    </span>
                    <span className={`block text-sm ${active ? "opacity-80" : "text-sumi-soft"}`}>{s.about}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {extra && <div className="mt-auto px-3">{extra}</div>}
      </nav>
    </div>
  );
}
