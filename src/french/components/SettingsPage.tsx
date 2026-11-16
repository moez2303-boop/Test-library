import { useRef, useState } from "react";
import { recognitionSupported, ttsSupported, useFrenchVoices } from "../speech";
import { exportData, importData, resetProgress, updateSettings, useStore } from "../store";
import { Button, Card, cx, say } from "./ui";

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 border-b border-line py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium">{label}</p>
        {hint && <p className="text-sm text-ink-soft">{hint}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const settings = useStore((s) => s.settings);
  const voices = useFrenchVoices();
  const [msg, setMsg] = useState<string | null>(null);
  const file = useRef<HTMLInputElement>(null);

  const download = () => {
    const blob = new Blob([exportData()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "allons-y-progress.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="text-ink-soft">Your progress is saved in this browser only.</p>
      </div>

      <Card className="px-5">
        <Row label="French voice" hint={voices.length ? `${voices.length} French voice${voices.length === 1 ? "" : "s"} on this device` : "No French voice found — install one in your system's speech settings for the best audio."}>
          <div className="flex gap-2">
            <select
              value={settings.voiceURI ?? ""}
              onChange={(e) => updateSettings({ voiceURI: e.target.value || undefined })}
              className="max-w-56 rounded-xl border border-line bg-card px-3 py-2 text-sm"
            >
              <option value="">Automatic</option>
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
            <Button variant="secondary" onClick={() => void say("Bonjour ! Je suis votre voix française.")}>Test</Button>
          </div>
        </Row>
        <Row label="Speaking speed" hint="Normal playback speed. The 🐢 button always plays slower.">
          <div className="flex items-center gap-3">
            <input type="range" min={0.6} max={1.2} step={0.05} value={settings.rate} onChange={(e) => updateSettings({ rate: Number(e.target.value) })} className="accent-[var(--color-bleu)]" />
            <span className="w-10 text-sm font-semibold">{settings.rate.toFixed(2)}×</span>
          </div>
        </Row>
        <Row label="Daily points goal">
          <div className="inline-flex rounded-xl border border-line p-1 text-sm">
            {[20, 50, 100, 200].map((g) => (
              <button key={g} onClick={() => updateSettings({ dailyGoal: g })} className={cx("rounded-lg px-3 py-1.5 font-medium", settings.dailyGoal === g ? "bg-bleu text-white dark:text-paper" : "text-ink-soft")}>
                {g}
              </button>
            ))}
          </div>
        </Row>
        <Row label="Show English in dialogues" hint="Turn off to test your listening; you can still reveal lines one at a time.">
          <input type="checkbox" checked={settings.showEnglish} onChange={(e) => updateSettings({ showEnglish: e.target.checked })} className="h-5 w-5 accent-[var(--color-bleu)]" />
        </Row>
        <Row label="Theme">
          <div className="inline-flex rounded-xl border border-line p-1 text-sm">
            {(["system", "light", "dark"] as const).map((t) => (
              <button key={t} onClick={() => updateSettings({ theme: t })} className={cx("rounded-lg px-3 py-1.5 font-medium capitalize", settings.theme === t ? "bg-bleu text-white dark:text-paper" : "text-ink-soft")}>
                {t}
              </button>
            ))}
          </div>
        </Row>
      </Card>

      <Card className="px-5">
        <Row label="Browser support" hint="Audio uses your device's built-in speech. Pronunciation scoring needs speech recognition (Chrome, Edge or Safari).">
          <div className="text-sm">
            <p>{ttsSupported() ? "✅" : "❌"} Text to speech</p>
            <p>{recognitionSupported() ? "✅" : "❌"} Speech recognition</p>
          </div>
        </Row>
        <Row label="Back up progress" hint="Download your progress, or restore it on another device.">
          <div className="flex gap-2">
            <Button variant="secondary" onClick={download}>Export</Button>
            <Button variant="secondary" onClick={() => file.current?.click()}>Import</Button>
            <input
              ref={file}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setMsg(importData(await f.text()) ? "Progress restored." : "That file isn't a valid progress backup.");
                e.target.value = "";
              }}
            />
          </div>
        </Row>
        <Row label="Reset progress" hint="Deletes all points, lesson progress, badges and saved vocab.">
          <Button
            variant="danger"
            onClick={() => {
              if (confirm("Reset all progress? This can't be undone.")) {
                resetProgress();
                setMsg("Progress reset.");
              }
            }}
          >
            Reset
          </Button>
        </Row>
      </Card>
      {msg && <p className="rounded-xl bg-bleu-soft px-4 py-3 text-sm text-bleu" role="status">{msg}</p>}
    </div>
  );
}
