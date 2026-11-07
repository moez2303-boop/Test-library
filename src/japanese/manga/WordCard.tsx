import { speakJapanese } from "../util";
import type { WordInfo } from "./types";

export interface WordLookupState {
  word: string;
  reading: string;
  info?: WordInfo;
  loading?: boolean;
  error?: string;
}

/** A bottom sheet with the tapped word's reading and meaning. */
export function WordCard({ state, onClose }: { state: WordLookupState; onClose: () => void }) {
  const { word, reading, info, loading, error } = state;
  const shownWord = info?.dictionaryForm || word;
  const shownReading = info?.reading || reading;
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 px-[max(16px,env(safe-area-inset-left,0px))] pb-[calc(env(safe-area-inset-bottom,0px)+16px)]"
      role="dialog"
      aria-label={`Meaning of ${word}`}
    >
      <div className="mx-auto max-w-xl rounded-2xl bg-card p-4 shadow-2xl ring-1 ring-sumi/15">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="jp text-2xl font-bold">{shownWord}</span>
              {shownReading && shownReading !== shownWord && (
                <span className="jp text-sm text-sumi-soft">{shownReading}</span>
              )}
              {info && shownWord !== word && <span className="jp text-xs text-sumi-soft">（{word}）</span>}
            </div>
            {loading && <p className="mt-1 animate-pulse text-sm text-sumi-soft">Looking it up…</p>}
            {error && <p className="mt-1 text-sm text-shu">{error}</p>}
            {info && (
              <>
                <p className="mt-1 text-base">{info.meaning}</p>
                {info.note && <p className="mt-1 text-sm text-sumi-soft">{info.note}</p>}
                <p className="mt-2 text-xs text-sumi-soft">
                  {info.source === "list" ? "From this lesson's word list" : "Explained by Claude for this line"}
                </p>
              </>
            )}
          </div>
          <div className="flex shrink-0 flex-col gap-1.5">
            <button
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-washi"
              aria-label="Close"
            >
              ✕
            </button>
            <button
              onClick={() => speakJapanese(shownReading || shownWord)}
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-washi"
              aria-label="Listen"
            >
              🔊
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
