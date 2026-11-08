import { useEffect, useState } from "react";
import { Installer } from "./components/Installer";
import { KanjiView } from "./components/KanjiView";
import { ListsView, ListView } from "./components/Lists";
import { ReviewView } from "./components/Review";
import { SearchView } from "./components/SearchView";
import { SettingsView } from "./components/SettingsView";
import { WordView } from "./components/WordView";
import { fetchMeta, installedMeta, type DataMeta } from "./install";
import { href, useRoute, type Route } from "./router";

type State =
  | { phase: "loading" }
  | { phase: "install"; meta?: DataMeta; update?: boolean; error?: string }
  | { phase: "ready"; meta: DataMeta; update?: DataMeta };

export default function App() {
  const [state, setState] = useState<State>({ phase: "loading" });
  const route = useRoute();

  useEffect(() => {
    void (async () => {
      const have = await installedMeta().catch(() => undefined);
      const remote = await fetchMeta().catch(() => undefined);
      if (have) {
        setState({ phase: "ready", meta: have, update: remote && remote.version !== have.version ? remote : undefined });
      } else {
        setState({ phase: "install", meta: remote, error: remote ? undefined : "Impossible de joindre le serveur." });
      }
    })();
  }, []);

  if (state.phase === "loading") {
    return <div className="grid min-h-dvh place-items-center text-ink-soft">Chargement…</div>;
  }
  if (state.phase === "install") {
    return <Installer meta={state.meta} error={state.error} onDone={(meta) => setState({ phase: "ready", meta })} />;
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col">
      <main className="flex-1 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+84px)]">
        <Screen route={route} meta={state.meta} />
      </main>
      <TabBar route={route} />
    </div>
  );
}

function Screen({ route, meta }: { route: Route; meta: DataMeta }) {
  switch (route.name) {
    case "search":
      return <SearchView q={route.q} />;
    case "word":
      return <WordView key={route.id} id={route.id} />;
    case "kanji":
      return <KanjiView key={route.c} c={route.c} />;
    case "lists":
      return <ListsView />;
    case "list":
      return <ListView key={route.id} id={route.id} />;
    case "review":
      return <ReviewView />;
    case "settings":
      return <SettingsView meta={meta} />;
  }
}

function TabBar({ route }: { route: Route }) {
  const tabs: { label: string; icon: string; to: Route; active: boolean }[] = [
    {
      label: "Recherche",
      icon: "辞",
      to: { name: "search", q: "" },
      active: route.name === "search" || route.name === "word" || route.name === "kanji",
    },
    { label: "Listes", icon: "☆", to: { name: "lists" }, active: route.name === "lists" || route.name === "list" },
    { label: "Réviser", icon: "⟳", to: { name: "review" }, active: route.name === "review" },
    { label: "Réglages", icon: "⚙", to: { name: "settings" }, active: route.name === "settings" },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-card/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur">
      <div className="mx-auto flex max-w-2xl">
        {tabs.map((t) => (
          <a
            key={t.label}
            href={href(t.to)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
              t.active ? "text-ai" : "text-ink-soft"
            }`}
            aria-current={t.active ? "page" : undefined}
          >
            <span className="jp text-xl leading-none">{t.icon}</span>
            {t.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
