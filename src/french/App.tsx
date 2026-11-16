import { useEffect, useState } from "react";
import { getLesson } from "./content";
import { onBadge, streak, todayPoints, useStore, type ActivityId, type Badge } from "./store";
import { cx, navigate, stopSay } from "./components/ui";
import Dashboard from "./components/Dashboard";
import LessonPage from "./components/LessonPage";
import Vocab from "./components/Vocab";
import Verbs from "./components/Verbs";
import Survival from "./components/Survival";
import ProgressPage from "./components/ProgressPage";
import SettingsPage from "./components/SettingsPage";

type Route =
  | { name: "home"; level?: number }
  | { name: "lesson"; id: string; activity: ActivityId }
  | { name: "vocab" | "verbs" | "survival" | "progress" | "settings" };

const ACTIVITY_IDS: ActivityId[] = ["lesson", "hear", "write", "know", "quiz", "play"];

function parse(hash: string): Route {
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  switch (parts[0]) {
    case "level":
      return { name: "home", level: Number(parts[1]) || 1 };
    case "lesson": {
      const id = parts[1];
      if (!id || !getLesson(id)) return { name: "home" };
      const a = parts[2] as ActivityId;
      return { name: "lesson", id, activity: ACTIVITY_IDS.includes(a) ? a : "lesson" };
    }
    case "vocab":
    case "verbs":
    case "survival":
    case "progress":
    case "settings":
      return { name: parts[0] };
    default:
      return { name: "home" };
  }
}

function useRoute(): Route {
  const [route, setRoute] = useState(() => parse(window.location.hash));
  useEffect(() => {
    const on = () => {
      stopSay();
      setRoute(parse(window.location.hash));
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}

function useTheme() {
  const theme = useStore((s) => s.settings.theme);
  useEffect(() => {
    const el = document.documentElement;
    if (theme === "system") el.removeAttribute("data-theme");
    else el.setAttribute("data-theme", theme);
  }, [theme]);
}

const NAV: { path: string; name: Route["name"]; label: string; icon: string }[] = [
  { path: "/", name: "home", label: "Course", icon: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" },
  { path: "/vocab", name: "vocab", label: "My Vocab", icon: "M6 3h12v18l-6-4-6 4z" },
  { path: "/verbs", name: "verbs", label: "Verbs", icon: "M4 6h16M4 12h10M4 18h7" },
  { path: "/survival", name: "survival", label: "Survival Kit", icon: "M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" },
  { path: "/progress", name: "progress", label: "Progress", icon: "M4 20V10M10 20V4M16 20v-7M22 20H2" },
  { path: "/settings", name: "settings", label: "Settings", icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" },
];

function NavIcon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

function Logo() {
  return (
    <a href="#/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-bleu font-display text-lg font-bold text-white dark:text-paper">A</span>
      <span className="leading-tight">
        <span className="block font-display text-lg font-bold">Allons-y</span>
        <span className="block text-[11px] font-medium uppercase tracking-wider text-ink-soft">French course</span>
      </span>
    </a>
  );
}

function StatChips() {
  const today = useStore(todayPoints);
  const goal = useStore((s) => s.settings.dailyGoal);
  const days = useStore(streak);
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="inline-flex items-center gap-1 rounded-full bg-or-soft px-2.5 py-1 font-semibold text-or" title="Day streak">
        🔥 {days}
      </span>
      <span className="inline-flex items-center gap-1 rounded-full bg-bleu-soft px-2.5 py-1 font-semibold text-bleu" title="Points today / daily goal">
        ⭐ {today}/{goal}
      </span>
    </div>
  );
}

function BadgeToast() {
  const [queue, setQueue] = useState<Badge[]>([]);
  useEffect(() => onBadge((b) => setQueue((q) => [...q, b])), []);
  useEffect(() => {
    if (!queue.length) return;
    const t = setTimeout(() => setQueue((q) => q.slice(1)), 3500);
    return () => clearTimeout(t);
  }, [queue]);
  const b = queue[0];
  if (!b) return null;
  return (
    <div className="fixed inset-x-0 bottom-20 z-50 flex justify-center px-4 md:bottom-6" role="status">
      <button onClick={() => navigate("/progress")} className="animate-pop flex items-center gap-3 rounded-2xl border border-line bg-card px-5 py-3 text-left shadow-xl">
        <span className="text-3xl">{b.icon}</span>
        <span>
          <span className="block text-xs font-semibold uppercase tracking-wide text-or">Badge unlocked</span>
          <span className="block font-semibold">{b.title}</span>
          <span className="block text-xs text-ink-soft">{b.desc}</span>
        </span>
      </button>
    </div>
  );
}

export default function App() {
  const route = useRoute();
  useTheme();
  const active = route.name === "lesson" ? "home" : route.name;

  return (
    <div className="min-h-screen md:flex">
      {/* Sidebar (desktop) */}
      <aside className="no-print sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-6 border-r border-line bg-card px-4 py-6 md:flex">
        <Logo />
        <nav className="flex flex-col gap-1">
          {NAV.map((n) => (
            <a
              key={n.path}
              href={`#${n.path}`}
              className={cx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active === n.name ? "bg-bleu-soft text-bleu" : "text-ink-soft hover:bg-paper-2 hover:text-ink",
              )}
            >
              <NavIcon d={n.icon} />
              {n.label}
            </a>
          ))}
        </nav>
        <div className="mt-auto">
          <StatChips />
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Top bar (mobile) */}
        <header className="no-print sticky top-0 z-30 flex items-center justify-between border-b border-line bg-card/95 px-4 py-3 backdrop-blur md:hidden">
          <Logo />
          <StatChips />
        </header>

        <main className="mx-auto w-full max-w-4xl px-4 pb-28 pt-6 md:px-8 md:pb-12 md:pt-8">
          {route.name === "home" && <Dashboard level={route.level} />}
          {route.name === "lesson" && <LessonPage key={route.id} id={route.id} activity={route.activity} />}
          {route.name === "vocab" && <Vocab />}
          {route.name === "verbs" && <Verbs />}
          {route.name === "survival" && <Survival />}
          {route.name === "progress" && <ProgressPage />}
          {route.name === "settings" && <SettingsPage />}
        </main>
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="no-print fixed inset-x-0 bottom-0 z-30 grid grid-cols-6 border-t border-line bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {NAV.map((n) => (
          <a
            key={n.path}
            href={`#${n.path}`}
            className={cx("flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium", active === n.name ? "text-bleu" : "text-ink-soft")}
          >
            <NavIcon d={n.icon} />
            <span className="truncate">{n.label.replace("Survival Kit", "Survival").replace("My Vocab", "Vocab")}</span>
          </a>
        ))}
      </nav>

      <BadgeToast />
    </div>
  );
}
