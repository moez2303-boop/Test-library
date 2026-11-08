import { useState } from "react";
import { uninstall, type DataMeta } from "../install";
import { setSettings, useSettings } from "../settings";
import { Card, Section, TopBar } from "./ui";

export function SettingsView({ meta }: { meta: DataMeta }) {
  const s = useSettings();
  const [busy, setBusy] = useState(false);
  return (
    <div>
      <TopBar title="Réglages" />
      <Card className="divide-y divide-line">
        <Toggle
          label="Afficher l’anglais sous le français"
          checked={s.showEnglish}
          onChange={(v) => setSettings({ showEnglish: v })}
        />
        <Toggle label="Afficher le romaji" checked={s.showRomaji} onChange={(v) => setSettings({ showRomaji: v })} />
        <label className="flex items-center justify-between gap-3 px-4 py-3.5">
          <span>Thème</span>
          <select
            value={s.theme}
            onChange={(e) => setSettings({ theme: e.target.value as typeof s.theme })}
            className="rounded-lg bg-paper px-2 py-1 ring-1 ring-line"
          >
            <option value="system">Système</option>
            <option value="light">Clair</option>
            <option value="dark">Sombre</option>
          </select>
        </label>
      </Card>

      <Section title="Dictionnaire">
        <Card className="p-4 text-sm">
          <p>
            {meta.words.toLocaleString("fr-FR")} mots et {meta.kanji.toLocaleString("fr-FR")} kanji installés sur cet
            appareil (version {meta.version}).
          </p>
          <button
            disabled={busy}
            onClick={async () => {
              if (!confirm("Supprimer le dictionnaire de cet appareil ? Vos listes et révisions sont gardées.")) return;
              setBusy(true);
              await uninstall();
              location.reload();
            }}
            className="mt-3 rounded-lg px-3 py-1.5 text-beni ring-1 ring-line"
          >
            Réinstaller le dictionnaire
          </button>
        </Card>
      </Section>

      <Section title="Sources et licence">
        <Card className="space-y-3 p-4 text-sm">
          <p>
            Ce dictionnaire est une œuvre dérivée, distribuée sous licence{" "}
            <a className="text-ai underline" href="https://creativecommons.org/licenses/by-sa/4.0/deed.fr">
              CC BY-SA 4.0
            </a>
            . La plupart des sens français ont été traduits automatiquement depuis le japonais par Jiyomi (étiquette
            « traduit ») ; ceux écrits par les contributeurs de JMdict portent l’étiquette « vérifié ».
          </p>
          <ul className="space-y-1.5">
            {meta.attribution.map((a) => (
              <li key={a.source}>
                <a className="text-ai underline" href={a.url}>
                  {a.source}
                </a>{" "}
                <span className="text-ink-soft">— {a.licence}</span>
              </li>
            ))}
          </ul>
        </Card>
      </Section>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3.5">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-ai" />
    </label>
  );
}
