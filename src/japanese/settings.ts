import { useCallback, useState } from "react";
import { DEFAULT_MODEL, MODELS } from "./grader";
import type { Settings } from "./types";

const KEY = "kotoba.settings";

function load(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw) as Partial<Settings>;
      const model = MODELS.some((m) => m.id === s.model) ? s.model! : DEFAULT_MODEL;
      return { apiKey: s.apiKey ?? "", model };
    }
  } catch {
    /* storage unavailable or corrupt */
  }
  return { apiKey: "", model: DEFAULT_MODEL };
}

export function useSettings() {
  const [settings, setState] = useState<Settings>(load);
  const setSettings = useCallback((next: Settings) => {
    setState(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — keep for this session only */
    }
  }, []);
  return [settings, setSettings] as const;
}
