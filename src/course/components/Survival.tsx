import { useLang } from "../languages";
import { Card, SaveWordButton, SpeakButton, TargetText } from "./ui";

export default function Survival() {
  const SURVIVAL = useLang().survival;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Survival Kit</h1>
        <p className="text-ink-soft">The phrases you'll need most when you're travelling. Tap to hear them; bookmark the ones you want to drill.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {SURVIVAL.map((g) => (
          <Card key={g.title} className="p-5">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
              <span aria-hidden>{g.icon}</span>
              {g.title}
            </h2>
            <ul className="mt-3 space-y-1">
              {g.phrases.map((p) => (
                <li key={p.text} className="flex items-start gap-2 rounded-xl px-2 py-1.5 hover:bg-paper-2">
                  <SpeakButton text={p.text} size="sm" />
                  <SpeakButton text={p.text} size="sm" slow />
                  <div className="min-w-0 flex-1">
                    <TargetText phrase={p} className="font-medium" />
                    <p className="text-xs text-ink-soft">{p.en}</p>
                  </div>
                  <SaveWordButton phrase={p} />
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
