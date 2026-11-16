/**
 * Kana helpers for the Japanese course: Hepburn romaji for display, and a
 * forgiving "canonical" spelling so typed answers in kana or any common romaji
 * style (shi/si, tsu/tu, ō/ou/oo, wa/ha for the particle) compare equal.
 */

const BASE: Record<string, string> = {
  あ: "a", い: "i", う: "u", え: "e", お: "o",
  か: "ka", き: "ki", く: "ku", け: "ke", こ: "ko",
  さ: "sa", し: "shi", す: "su", せ: "se", そ: "so",
  た: "ta", ち: "chi", つ: "tsu", て: "te", と: "to",
  な: "na", に: "ni", ぬ: "nu", ね: "ne", の: "no",
  は: "ha", ひ: "hi", ふ: "fu", へ: "he", ほ: "ho",
  ま: "ma", み: "mi", む: "mu", め: "me", も: "mo",
  や: "ya", ゆ: "yu", よ: "yo",
  ら: "ra", り: "ri", る: "ru", れ: "re", ろ: "ro",
  わ: "wa", ゐ: "i", ゑ: "e", を: "o", ん: "n",
  が: "ga", ぎ: "gi", ぐ: "gu", げ: "ge", ご: "go",
  ざ: "za", じ: "ji", ず: "zu", ぜ: "ze", ぞ: "zo",
  だ: "da", ぢ: "ji", づ: "zu", で: "de", ど: "do",
  ば: "ba", び: "bi", ぶ: "bu", べ: "be", ぼ: "bo",
  ぱ: "pa", ぴ: "pi", ぷ: "pu", ぺ: "pe", ぽ: "po",
  ゔ: "vu",
};
const SMALL_Y: Record<string, string> = { ゃ: "a", ゅ: "u", ょ: "o" };
const SMALL_V: Record<string, string> = { ぁ: "a", ぃ: "i", ぅ: "u", ぇ: "e", ぉ: "o", ゎ: "a" };
/** Particles written as one word in a spaced reading. */
const PARTICLES: Record<string, string> = { は: "wa", へ: "e", を: "o" };

export function toHiragana(s: string): string {
  return s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
}

export function hasKana(s: string): boolean {
  return /[ぁ-ゖァ-ヺ]/.test(s);
}

function wordToRomaji(word: string): string {
  if (PARTICLES[word]) return PARTICLES[word];
  const chars = [...toHiragana(word)];
  const out: string[] = [];
  let double = false;
  for (const c of chars) {
    if (c === "っ") {
      double = true;
      continue;
    }
    if (c === "ー") {
      const prev = out[out.length - 1];
      if (prev) out[out.length - 1] = prev + (prev.match(/[aeiou]$/)?.[0] ?? "");
      continue;
    }
    let syl: string | undefined;
    if (SMALL_Y[c] && out.length && out[out.length - 1].endsWith("i")) {
      const base = out.pop()!.slice(0, -1);
      syl = (["sh", "ch", "j"].includes(base) ? base : base + "y") + SMALL_Y[c];
    } else if (SMALL_V[c] && out.length) {
      const prev = out.pop()!;
      const base = prev.replace(/[aeiou]$/, "") || "w";
      syl = base + SMALL_V[c];
    } else {
      syl = BASE[c] ?? c;
    }
    if (double) {
      syl = (syl.startsWith("ch") ? "t" : syl[0]) + syl;
      double = false;
    }
    // ん before a vowel or y is written n' so it reads correctly (kin'en).
    if (out[out.length - 1] === "n" && /^[aeiouy]/.test(syl)) {
      out[out.length - 1] = "n'";
    }
    out.push(syl);
  }
  return out.join("");
}

/** Hepburn romaji of a kana reading, keeping its word spaces. */
export function romaji(reading: string): string {
  return reading
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => wordToRomaji(w.replace(/[、。！？!?「」…・〜]/g, "")))
    .filter(Boolean)
    .join(" ");
}

/** A spelling that ignores romaji style, long-vowel spelling and particle spelling. */
export function canonical(s: string): string {
  let r = s
    .split(/\s+/)
    .map((w) => (hasKana(w) ? wordToRomaji(w) : w))
    .join(" ")
    .toLowerCase()
    .replace(/ā/g, "aa").replace(/ī/g, "ii").replace(/ū/g, "uu").replace(/ē/g, "ee").replace(/ō/g, "ou").replace(/â/g, "aa").replace(/ô/g, "ou")
    .replace(/[^a-z]/g, "");
  r = r
    .replace(/tch/g, "tty")
    .replace(/shi/g, "si").replace(/chi/g, "ti").replace(/tsu/g, "tu").replace(/fu/g, "hu").replace(/ji/g, "zi")
    .replace(/sh/g, "sy").replace(/ch/g, "ty").replace(/j/g, "zy")
    .replace(/wo/g, "o").replace(/wa/g, "ha")
    .replace(/m(?=[bp])/g, "n").replace(/nn/g, "n")
    .replace(/ou|oo/g, "o").replace(/uu/g, "u").replace(/aa/g, "a").replace(/ii/g, "i").replace(/ee|ei/g, "e");
  return r;
}
