import { useState } from "react";
import { install, type DataMeta, type Progress } from "../install";

const mb = (n: number) => `${(n / 1_000_000).toFixed(1).replace(".", ",")} Mo`;

export function Installer({ meta, error, onDone }: { meta?: DataMeta; error?: string; onDone: (m: DataMeta) => void }) {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [err, setErr] = useState(error);
  const size = meta ? Object.values(meta.files).reduce((a, b) => a + b, 0) : 0;

  async function start() {
    if (!meta) return;
    setErr(undefined);
    try {
      await navigator.storage?.persist?.().catch(() => false);
      await install(meta, setProgress);
      onDone(meta);
    } catch (e) {
      setProgress(null);
      setErr(e instanceof Error ? e.message : String(e));
    }
  }

  const pct = progress ? Math.round((progress.done / Math.max(1, progress.total)) * 100) : 0;
  const stepLabel = progress
    ? {
        download: `Téléchargement… ${mb(progress.done)} / ${mb(progress.total)}`,
        kanji: `Préparation des kanji… ${progress.done.toLocaleString("fr-FR")}`,
        words: `Préparation des mots… ${progress.done.toLocaleString("fr-FR")} / ${progress.total.toLocaleString("fr-FR")}`,
        done: "Terminé",
      }[progress.step]
    : "";

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-10">
      <div className="jp mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-ai text-3xl text-card">辞</div>
      <h1 className="text-3xl font-bold">Kotoba Dico</h1>
      <p className="mt-1 text-lg text-ink-soft">Le dictionnaire japonais–français dans votre poche.</p>
      <ul className="mt-6 space-y-2 text-[15px]">
        <li>🔎 Cherchez en kanji, en kana, en romaji <em>ou en français</em>.</li>
        <li>🧩 Les formes conjuguées sont reconnues : 食べなかった → 食べる.</li>
        <li>✍️ Kanji avec ordre des traits, lectures et mots qui les contiennent.</li>
        <li>⭐ Listes de vocabulaire et révisions espacées.</li>
        <li>✈️ Fonctionne hors ligne une fois installé.</li>
      </ul>
      {meta && (
        <p className="mt-6 text-sm text-ink-soft">
          {meta.words.toLocaleString("fr-FR")} mots et {meta.kanji.toLocaleString("fr-FR")} kanji, téléchargés une seule
          fois ({mb(size)}) et gardés sur cet appareil.
        </p>
      )}
      {progress ? (
        <div className="mt-6" aria-live="polite">
          <div className="h-2 overflow-hidden rounded-full bg-line">
            <div className="h-full bg-ai transition-[width]" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-sm text-ink-soft">{stepLabel}</p>
          <p className="mt-1 text-xs text-ink-soft">Gardez cette page ouverte : cela prend environ une minute.</p>
        </div>
      ) : (
        <button
          onClick={start}
          disabled={!meta}
          className="mt-6 rounded-xl bg-ai px-5 py-3 font-semibold text-card disabled:opacity-50"
        >
          Installer le dictionnaire
        </button>
      )}
      {err && <p className="mt-3 text-sm text-beni">Erreur : {err}</p>}
      <p className="mt-8 text-xs text-ink-soft">
        Données : JMdict et KANJIDIC2 (EDRDG), KanjiVG, sens français de Jiyomi — licence CC BY-SA.
      </p>
    </div>
  );
}
