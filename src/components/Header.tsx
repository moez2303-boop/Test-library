interface HeaderProps {
  streak: number;
  dueCount: number;
  showBack: boolean;
  onHome: () => void;
}

export function Header({ streak, dueCount, showBack, onHome }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-navy/10 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <button
          onClick={onHome}
          className="flex items-center gap-2 font-serif text-xl font-semibold text-navy transition-opacity hover:opacity-80"
        >
          {showBack && <span aria-hidden="true">←</span>}
          <span>🇫🇷 Bonjour</span>
        </button>

        <div className="flex items-center gap-3 text-sm font-medium">
          {dueCount > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-red/10 px-3 py-1 text-red-dark">
              <span aria-hidden="true">🔔</span>
              {dueCount} due
            </span>
          )}
          <span className="flex items-center gap-1 rounded-full bg-gold/20 px-3 py-1 text-navy-dark">
            <span aria-hidden="true">🔥</span>
            {streak} day{streak === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </header>
  );
}
