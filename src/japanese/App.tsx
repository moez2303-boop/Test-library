import { useCallback, useEffect, useState } from "react";
import { deleteClip, getAllAttempts, getAllClips } from "./db";
import { useSettings } from "./settings";
import type { Attempt, Clip } from "./types";
import { ClipLibrary } from "./components/ClipLibrary";
import { ClipEditor } from "./components/ClipEditor";
import { Practice } from "./components/Practice";
import { SettingsDialog } from "./components/SettingsDialog";
import { TikTokQuickAdd } from "./components/TikTokQuickAdd";

type View =
  | { name: "library" }
  | { name: "practice"; clipId: string }
  | { name: "edit"; clipId: string | null };

export default function App() {
  const [settings, setSettings] = useSettings();
  const [clips, setClips] = useState<Clip[] | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [view, setView] = useState<View>({ name: "library" });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tiktokOpen, setTiktokOpen] = useState(false);

  const refresh = useCallback(async () => {
    const [c, a] = await Promise.all([getAllClips(), getAllAttempts()]);
    setClips(c);
    setAttempts(a);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const current =
    view.name !== "library" && view.clipId ? clips?.find((c) => c.id === view.clipId) : undefined;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-washi-dark bg-washi/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <button
            onClick={() => {
              setView({ name: "library" });
              void refresh();
            }}
            className="flex items-center gap-2"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-shu font-display text-lg text-white jp">
              言
            </span>
            <span className="text-left leading-tight">
              <span className="block font-display text-lg font-bold">Kotoba Clips</span>
              <span className="block text-xs text-sumi-soft">Learn Japanese from anime scenes</span>
            </span>
          </button>
          <div className="flex-1" />
          <button
            onClick={() => setSettingsOpen(true)}
            className="rounded-full border border-sumi/15 px-4 py-2 text-sm font-medium hover:bg-washi-dark"
          >
            Settings
          </button>
        </div>
        {!settings.apiKey && (
          <div className="bg-kin/15 px-4 py-2 text-center text-sm">
            Grading uses Claude.{" "}
            <button className="font-semibold underline" onClick={() => setSettingsOpen(true)}>
              Add your Anthropic API key
            </button>{" "}
            to get feedback on your answers.
          </div>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {clips === null ? (
          <p className="py-20 text-center text-sumi-soft">Loading…</p>
        ) : view.name === "library" ? (
          <ClipLibrary
            clips={clips}
            attempts={attempts}
            onPractice={(id) => setView({ name: "practice", clipId: id })}
            onEdit={(id) => setView({ name: "edit", clipId: id })}
            onNew={() => setView({ name: "edit", clipId: null })}
            onAddTikTok={() => setTiktokOpen(true)}
            onDelete={async (id) => {
              await deleteClip(id);
              await refresh();
            }}
          />
        ) : view.name === "practice" && current ? (
          <Practice
            clip={current}
            settings={settings}
            onBack={() => {
              setView({ name: "library" });
              void refresh();
            }}
            onEdit={() => setView({ name: "edit", clipId: current.id })}
            onNeedSettings={() => setSettingsOpen(true)}
          />
        ) : view.name === "edit" ? (
          <ClipEditor
            key={view.clipId ?? "new"}
            clip={current ?? null}
            settings={settings}
            onCancel={() =>
              setView(current ? { name: "practice", clipId: current.id } : { name: "library" })
            }
            onSaved={async (id) => {
              await refresh();
              setView({ name: "practice", clipId: id });
            }}
            onNeedSettings={() => setSettingsOpen(true)}
          />
        ) : (
          <p className="py-20 text-center text-sumi-soft">Clip not found.</p>
        )}
      </main>

      {tiktokOpen && (
        <TikTokQuickAdd
          settings={settings}
          onClose={() => setTiktokOpen(false)}
          onAdded={async (id) => {
            setTiktokOpen(false);
            await refresh();
            setView({ name: "practice", clipId: id });
          }}
        />
      )}

      {settingsOpen && (
        <SettingsDialog
          settings={settings}
          onSave={(s) => {
            setSettings(s);
            setSettingsOpen(false);
          }}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}
