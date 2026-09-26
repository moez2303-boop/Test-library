import { useState } from "react";
import { writingPrompts } from "../data/writing";
import type { Level, WritingResponse } from "../types";

const LEVELS: (Level | "All")[] = ["All", "A2", "B1", "B2"];

const LEVEL_STYLES: Record<Level, string> = {
  A1: "bg-navy/10 text-navy",
  A2: "bg-navy/10 text-navy",
  B1: "bg-gold/25 text-navy-dark",
  B2: "bg-red/10 text-red-dark",
};

interface WritingProps {
  responses: Record<string, WritingResponse>;
  onOpen: (promptId: string) => void;
}

export function Writing({ responses, onOpen }: WritingProps) {
  const [levelFilter, setLevelFilter] = useState<Level | "All">("All");
  const visible = levelFilter === "All" ? writingPrompts : writingPrompts.filter((p) => p.level === levelFilter);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="animate-fade-in mb-6 rounded-2xl bg-navy px-6 py-6 text-cream">
        <h1 className="font-serif text-2xl font-semibold sm:text-3xl">✍️ Conversation & Response</h1>
        <p className="mt-1 text-sm text-cream/70">
          Read a short dialogue between two people, then write your own answer in French — in your own words.
        </p>
      </div>

      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="font-serif text-lg font-semibold text-navy-dark">Conversations</h2>
        <div className="flex gap-1.5">
          {LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => setLevelFilter(level)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                levelFilter === level ? "bg-navy text-cream" : "bg-navy/10 text-navy hover:bg-navy/20"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="grid animate-fade-in grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((prompt) => {
          const done = responses[prompt.id];
          return (
            <button
              key={prompt.id}
              onClick={() => onOpen(prompt.id)}
              className="flex flex-col gap-3 rounded-2xl border border-navy/10 bg-white/70 p-5 text-left shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-3xl">💬</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${LEVEL_STYLES[prompt.level]}`}>
                  {prompt.level}
                </span>
              </div>
              <h3 className="font-serif text-lg font-semibold text-navy-dark">{prompt.title}</h3>
              <p className="text-sm text-ink/60">{prompt.characters.join(" & ")}</p>
              <div className="mt-auto flex items-center justify-between text-xs font-medium text-ink/50">
                <span>{prompt.dialogue.length} lines · free-text answer</span>
                {done && <span className="rounded-full bg-navy/10 px-2 py-0.5 text-navy">Answered</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
