import { db } from "./db";
import { frTokens, jpKey, kanjiIn } from "./text";
import type { Kanji, StoredWord, Word } from "./types";

export interface DataMeta {
  version: number;
  words: number;
  kanji: number;
  files: Record<string, number>;
  attribution: { source: string; licence: string; url: string }[];
}

const DATA = `${import.meta.env.BASE_URL}dico/data/`;

export async function fetchMeta(): Promise<DataMeta> {
  const res = await fetch(`${DATA}meta.json`, { cache: "no-cache" });
  if (!res.ok) throw new Error(`meta.json : HTTP ${res.status}`);
  return res.json();
}

export async function installedMeta(): Promise<DataMeta | undefined> {
  return (await (await db()).get("meta", "data")) as DataMeta | undefined;
}

export function toStored(w: Word): StoredWord {
  const forms = [...(w.k ?? []), ...(w.ks ?? []), ...w.r, ...(w.rs ?? [])];
  const fr = new Set<string>();
  for (const s of w.s) for (const g of s.f ?? []) for (const t of frTokens(g)) fr.add(t);
  return {
    ...w,
    jp: [...new Set(forms.map(jpKey))],
    fr: [...fr],
    kj: kanjiIn([...(w.k ?? []), ...(w.ks ?? [])].join("")),
  };
}

async function download(file: string, size: number, onBytes: (n: number) => void): Promise<Uint8Array> {
  const res = await fetch(DATA + file);
  if (!res.ok || !res.body) throw new Error(`${file} : HTTP ${res.status}`);
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let got = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    got += value.length;
    onBytes(Math.min(got, size));
  }
  const all = new Uint8Array(got);
  let at = 0;
  for (const c of chunks) {
    all.set(c, at);
    at += c.length;
  }
  return all;
}

/** Lines of a gzip'd NDJSON file (some servers already undo the gzip: then the bytes are plain text). */
async function* lines(bytes: Uint8Array): AsyncGenerator<string> {
  const gz = bytes[0] === 0x1f && bytes[1] === 0x8b;
  let stream = new Blob([bytes as BlobPart]).stream() as ReadableStream<Uint8Array>;
  if (gz) stream = stream.pipeThrough(new DecompressionStream("gzip") as unknown as TransformStream<Uint8Array, Uint8Array>);
  const reader = stream.pipeThrough(new TextDecoderStream() as unknown as TransformStream<Uint8Array, string>).getReader();
  let rest = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    const parts = (rest + value).split("\n");
    rest = parts.pop()!;
    for (const p of parts) if (p) yield p;
  }
  if (rest) yield rest;
}

export interface Progress {
  step: "download" | "words" | "kanji" | "done";
  done: number;
  total: number;
}

export async function install(meta: DataMeta, onProgress: (p: Progress) => void) {
  const d = await db();
  const wordsSize = meta.files["mots.ndjson.gz"];
  const kanjiSize = meta.files["kanji.ndjson.gz"];
  const total = wordsSize + kanjiSize;
  onProgress({ step: "download", done: 0, total });
  const kanjiBytes = await download("kanji.ndjson.gz", kanjiSize, (n) =>
    onProgress({ step: "download", done: n, total }),
  );
  const wordBytes = await download("mots.ndjson.gz", wordsSize, (n) =>
    onProgress({ step: "download", done: kanjiSize + n, total }),
  );

  await d.delete("meta", "data");
  await d.clear("words");
  await d.clear("kanji");

  let batch: Kanji[] = [];
  let n = 0;
  for await (const line of lines(kanjiBytes)) {
    batch.push(JSON.parse(line));
    if (batch.length === 2000) {
      await putAll("kanji", batch);
      n += batch.length;
      batch = [];
      onProgress({ step: "kanji", done: n, total: meta.kanji });
    }
  }
  await putAll("kanji", batch);

  let words: StoredWord[] = [];
  n = 0;
  for await (const line of lines(wordBytes)) {
    words.push(toStored(JSON.parse(line)));
    if (words.length === 2000) {
      await putAll("words", words);
      n += words.length;
      words = [];
      onProgress({ step: "words", done: n, total: meta.words });
    }
  }
  await putAll("words", words);
  await d.put("meta", meta, "data");
  onProgress({ step: "done", done: meta.words, total: meta.words });
}

async function putAll<S extends "words" | "kanji">(store: S, values: (S extends "words" ? StoredWord : Kanji)[]) {
  if (!values.length) return;
  const tx = (await db()).transaction(store, "readwrite", { durability: "relaxed" });
  for (const v of values) void tx.store.put(v as never);
  await tx.done;
}

export async function uninstall() {
  const d = await db();
  await d.delete("meta", "data");
  await d.clear("words");
  await d.clear("kanji");
}
