import { useState } from "react";
import { MODELS } from "../grader";
import type { Settings } from "../types";

export function SettingsDialog({
  settings,
  onSave,
  onClose,
}: {
  settings: Settings;
  onSave: (s: Settings) => void;
  onClose: () => void;
}) {
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [model, setModel] = useState(settings.model);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-sumi/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <form
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          onSave({ apiKey: apiKey.trim(), model });
        }}
      >
        <h2 className="font-display text-xl font-bold">Settings</h2>

        <label className="mt-5 block text-sm font-medium">Anthropic API key</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-ant-…"
          autoComplete="off"
          className="mt-1 w-full rounded-lg border border-sumi/20 px-3 py-2 font-mono text-sm focus:border-shu focus:outline-none"
        />
        <p className="mt-1 text-xs text-sumi-soft">
          Stored only in this browser. Answers are sent straight from your browser to the Claude API
          for grading. Get a key at console.anthropic.com.
        </p>

        <label className="mt-5 block text-sm font-medium">Grading model</label>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="mt-1 w-full rounded-lg border border-sumi/20 bg-white px-3 py-2 text-sm focus:border-shu focus:outline-none"
        >
          {MODELS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-full px-4 py-2 text-sm hover:bg-washi">
            Cancel
          </button>
          <button className="rounded-full bg-shu px-5 py-2 text-sm font-semibold text-white hover:bg-shu-dark">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
