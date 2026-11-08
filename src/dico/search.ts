import { db } from "./db";
import { deinflect, posTypes } from "./deinflect";
import { foldFr, frGlossKey, frTokens, hasJapanese, jpKey, romajiToKana } from "./text";
import type { StoredWord, Word } from "./types";

export interface Hit {
  word: StoredWord;
  score: number;
  /** How the word was found: "exact", "conjugated", "prefix", "french". */
  how: "exact" | "conjugated" | "prefix" | "french";
  reasons?: string[]; // conjugation steps, for "conjugated"
  matched?: string; // the dictionary form the input was traced back to
}

export interface SearchResult {
  hits: Hit[];
  kana?: string; // romaji read as kana, when it was
  query: string;
}

/** Higher for common words. */
export function commonness(w: Word): number {
  return (w.c ? 200 - w.c : 0) + (w.z ?? 0) / 4;
}

const PREFIX_LIMIT = 600;

async function byJp(terms: string[]) {
  const d = await db();
  const tx = d.transaction("words");
  const idx = tx.store.index("jp");
  return Promise.all(terms.map((t) => idx.getAll(t)));
}

function allPos(w: Word) {
  return w.s.flatMap((s) => s.p);
}

export async function searchJapanese(input: string): Promise<Hit[]> {
  const key = jpKey(input);
  if (!key) return [];
  const hits = new Map<number, Hit>();
  const cands = deinflect(key);
  const found = await byJp(cands.map((c) => c.term));
  cands.forEach((cand, n) => {
    for (const w of found[n]) {
      if (cand.types && !(posTypes(allPos(w)) & cand.types)) continue;
      const exact = cand.types === 0;
      const score = (exact ? 3000 : 2000 - cand.reasons.length * 10) + commonness(w);
      const prev = hits.get(w.i);
      if (prev && prev.score >= score) continue;
      hits.set(w.i, {
        word: w,
        score,
        how: exact ? "exact" : "conjugated",
        reasons: exact ? undefined : cand.reasons,
        matched: exact ? undefined : cand.term,
      });
    }
  });
  const d = await db();
  const prefix = await d.getAllFromIndex("words", "jp", IDBKeyRange.bound(key, key + "￿", true), PREFIX_LIMIT);
  for (const w of prefix) {
    if (hits.has(w.i)) continue;
    const shortest = Math.min(...w.jp.filter((f) => f.startsWith(key)).map((f) => f.length));
    hits.set(w.i, { word: w, score: 1000 + commonness(w) - (shortest - key.length) * 8, how: "prefix" });
  }
  return [...hits.values()];
}

export async function searchFrench(input: string): Promise<Hit[]> {
  const folded = foldFr(input).trim();
  let tokens = frTokens(input);
  if (!tokens.length && folded.length > 1) tokens = [folded.replace(/[^a-z0-9]/g, "")].filter(Boolean);
  if (!tokens.length) return [];
  const d = await db();
  const tx = d.transaction("words");
  const idx = tx.store.index("fr");
  const variants = (t: string) => {
    const v = [t];
    if (t.length > 3 && /[sx]$/.test(t)) v.push(t.slice(0, -1));
    if (t.endsWith("aux") && t.length > 4) v.push(t.slice(0, -3) + "al");
    return v;
  };
  const sets: Set<number>[] = [];
  for (const t of tokens) {
    const keys = (await Promise.all(variants(t).map((v) => idx.getAllKeys(v)))).flat();
    const ids = new Set<number>(keys);
    if (tokens.length === 1 && t.length >= 3) {
      for (const k of await idx.getAllKeys(IDBKeyRange.bound(t, t + "￿", true), 300)) ids.add(k);
    }
    sets.push(ids);
  }
  sets.sort((a, b) => a.size - b.size);
  let ids = [...sets[0]].filter((id) => sets.every((s) => s.has(id)));
  if (ids.length > 3000) ids = ids.slice(0, 3000);
  const words = (await Promise.all(ids.map((id) => tx.store.get(id)))).filter((w): w is StoredWord => !!w);
  const qkey = frGlossKey(input);
  const hits: Hit[] = [];
  for (const w of words) {
    let best = 0;
    w.s.forEach((s, si) => {
      for (const g of s.f ?? []) {
        const gk = frGlossKey(g);
        let sc = 0;
        if (gk === qkey) sc = 3000;
        else if (gk.startsWith(qkey + " ") || gk.endsWith(" " + qkey)) sc = 2200;
        else if (` ${gk} `.includes(` ${qkey} `)) sc = 1800;
        else if (tokens.every((t) => frTokens(g).some((x) => x === t || variants(x).includes(t)))) sc = 1500;
        else if (tokens.some((t) => frTokens(g).some((x) => x.startsWith(t)))) sc = 1000;
        sc -= si * 40 + (s.f!.indexOf(g) > 0 ? 20 : 0);
        best = Math.max(best, sc);
      }
    });
    if (best > 0) hits.push({ word: w, score: best + commonness(w), how: "french" });
  }
  return hits;
}

export async function search(query: string): Promise<SearchResult> {
  const q = query.trim();
  if (!q) return { hits: [], query: q };
  if (hasJapanese(q)) {
    const hits = await searchJapanese(q);
    return { hits: hits.sort((a, b) => b.score - a.score), query: q };
  }
  const kana = romajiToKana(q);
  const [fr, jp] = await Promise.all([searchFrench(q), kana ? searchJapanese(kana) : Promise.resolve([])]);
  const merged = new Map<number, Hit>();
  for (const h of fr) merged.set(h.word.i, h);
  for (const h of jp) {
    // A romaji match outranks a French one only when it is exact.
    const adj = { ...h, score: h.how === "prefix" ? h.score - 600 : h.score };
    const prev = merged.get(h.word.i);
    if (!prev || prev.score < adj.score) merged.set(h.word.i, adj);
  }
  return {
    hits: [...merged.values()].sort((a, b) => b.score - a.score),
    kana: kana && jp.length ? kana : undefined,
    query: q,
  };
}

// ---- Sentence analysis ----

export interface Token {
  surface: string;
  hits: Hit[]; // best first; empty for text with no entry
}

const MAX_LEN = 12;

/** Splits Japanese text into dictionary words, longest match first. */
export async function analyse(text: string): Promise<Token[]> {
  const chars = [...text.replace(/\s+/g, "")];
  const tokens: Token[] = [];
  let i = 0;
  while (i < chars.length) {
    if (!hasJapanese(chars[i])) {
      let j = i;
      while (j < chars.length && !hasJapanese(chars[j])) j++;
      tokens.push({ surface: chars.slice(i, j).join(""), hits: [] });
      i = j;
      continue;
    }
    let matched: Token | null = null;
    for (let len = Math.min(MAX_LEN, chars.length - i); len >= 1 && !matched; len--) {
      const surface = chars.slice(i, i + len).join("");
      if (!hasJapanese(surface[surface.length - 1])) continue;
      const key = jpKey(surface);
      const cands = deinflect(key);
      const found = await byJp(cands.map((c) => c.term));
      const hits: Hit[] = [];
      cands.forEach((cand, n) => {
        for (const w of found[n]) {
          if (cand.types && !(posTypes(allPos(w)) & cand.types)) continue;
          if (hits.some((h) => h.word.i === w.i)) continue;
          const exact = cand.types === 0;
          hits.push({
            word: w,
            score: (exact ? 3000 : 2000) + commonness(w),
            how: exact ? "exact" : "conjugated",
            reasons: exact ? undefined : cand.reasons,
            matched: exact ? undefined : cand.term,
          });
        }
      });
      if (hits.length) matched = { surface, hits: hits.sort((a, b) => b.score - a.score) };
    }
    if (!matched) matched = { surface: chars[i], hits: [] };
    tokens.push(matched);
    i += [...matched.surface].length;
  }
  return tokens;
}

export async function wordsWithKanji(c: string, limit = 80): Promise<StoredWord[]> {
  const all = await (await db()).getAllFromIndex("words", "kj", c, 4000);
  return all.sort((a, b) => commonness(b) - commonness(a)).slice(0, limit);
}
