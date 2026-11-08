#!/usr/bin/env python3
"""Build the offline data for Kotoba Dico (Japanese → French dictionary).

Source: the Jiyomi Japanese → French dictionary (JMdict + KANJIDIC2 + KanjiVG,
with French senses added by Jiyomi), CC BY-SA 4.0:
  https://github.com/AStoicBoy/jiyomi-dico/releases/latest/download/jiyomi-dict-fr.db.gz

Usage:
  curl -L -o fr.db.gz https://github.com/AStoicBoy/jiyomi-dico/releases/latest/download/jiyomi-dict-fr.db.gz
  gunzip fr.db.gz
  python3 scripts/build_dico.py fr.db

Writes public/dico/data/:
  mots.ndjson.gz    one word per line (vocabulary only, no proper names)
  kanji.ndjson.gz   one kanji per line, with stroke paths when known
  meta.json         counts, sizes and attribution
"""
import gzip
import json
import os
import sqlite3
import sys

POS = {
    "noun (common) (futsuumeishi)": "n",
    "noun or participle which takes the aux. verb suru": "vs",
    "expressions (phrases, clauses, etc.)": "exp",
    "transitive verb": "vt",
    "intransitive verb": "vi",
    "nouns which may take the genitive case particle 'no'": "adj-no",
    "adjectival nouns or quasi-adjectives (keiyodoshi)": "adj-na",
    "Ichidan verb": "v1",
    "adverb (fukushi)": "adv",
    "Godan verb with 'ru' ending": "v5r",
    "Godan verb with 'su' ending": "v5s",
    "adjective (keiyoushi)": "adj-i",
    "adverb taking the 'to' particle": "adv-to",
    "Godan verb with 'ku' ending": "v5k",
    "noun or verb acting prenominally": "adj-f",
    "Godan verb with 'u' ending": "v5u",
    "Godan verb with 'mu' ending": "v5m",
    "noun, used as a suffix": "n-suf",
    "interjection (kandoushi)": "int",
    "suffix": "suf",
    "'taru' adjective": "adj-t",
    "suru verb - special class": "vs-s",
    "Godan verb with 'tsu' ending": "v5t",
    "pronoun": "pn",
    "particle": "prt",
    "suru verb - included": "vs-i",
    "prefix": "pref",
    "conjunction": "conj",
    "counter": "ctr",
    "Godan verb with 'gu' ending": "v5g",
    "pre-noun adjectival (rentaishi)": "adj-pn",
    "noun, used as a prefix": "n-pref",
    "auxiliary verb": "aux-v",
    "Godan verb with 'bu' ending": "v5b",
    "Ichidan verb - zuru verb (alternative form of -jiru verbs)": "vz",
    "adjective (keiyoushi) - yoi/ii class": "adj-ix",
    "numeric": "num",
    "Godan verb with 'ru' ending (irregular verb)": "v5r-i",
    "su verb - precursor to the modern suru": "vs-c",
    "Godan verb - Iku/Yuku special class": "v5k-s",
    "auxiliary": "aux",
    "Kuru verb - special class": "vk",
    "unclassified": "unc",
    "copula": "cop",
    "Godan verb with 'u' ending (special class)": "v5u-s",
    "Godan verb with 'nu' ending": "v5n",
    "irregular ru verb, plain form ends with -ri": "vr",
    "auxiliary adjective": "aux-adj",
    "Godan verb - -aru special class": "v5aru",
    "Ichidan verb - kureru special class": "v1-s",
    "irregular nu verb": "vn",
    "verb unspecified": "v-unspec",
    "'ku' adjective (archaic)": "adj-ku",
    "'shiku' adjective (archaic)": "adj-shiku",
    "archaic/formal form of na-adjective": "adj-nari",
}


def pos_code(p):
    if p in POS:
        return POS[p]
    # Archaic yodan / nidan verbs: keep one generic code each.
    if p.startswith("Yodan verb"):
        return "v4"
    if p.startswith("Nidan verb"):
        return "v2"
    raise SystemExit(f"unknown part of speech: {p!r}")


def merge_human_duplicates(senses):
    """Drop a JMdict contributor's French sense when an earlier sense already
    says the same thing, and mark that earlier sense as confirmed by a human."""
    out = []
    for sense in senses:
        if sense.get("h") and "e" not in sense:
            glosses = set(sense["f"])
            twin = next((o for o in out if "f" in o and glosses <= set(o["f"])), None)
            if twin is not None:
                twin["h"] = 1
                continue
        out.append(sense)
    return out


def word_record(i, freq, j):
    ki = j.get("ki", {})
    ri = j.get("ri", {})
    k, ks = [], []
    for n, form in enumerate(j["k"]):
        (ks if "sK" in ki.get(str(n), "") else k).append(form)
    r, rs = [], []
    for n, form in enumerate(j["r"]):
        (rs if "sk" in ri.get(str(n), "") else r).append(form)
    senses = []
    last_pos = []
    has_fr = any(s.get("fr") for s in j["s"])
    for s in j["s"]:
        pos = [pos_code(p) for p in s.get("pos", [])]
        if pos:
            last_pos = pos
        else:
            pos = last_pos  # In JMdict a sense's part of speech carries over.
        fr = s.get("fr") or []
        en = s.get("en") or []
        if has_fr and not fr:
            # An English-only sense on a word that already has a human French
            # sense: the French one covers it. Keep the English for reference.
            sense = {"p": pos, "e": en}
        else:
            sense = {"p": pos, "f": fr} if fr else {"p": pos, "e": en}
            if fr and en:
                sense["e"] = en
        if fr and not s.get("mt"):
            sense["h"] = 1  # French written by a JMdict contributor
        if s.get("fld"):
            sense["d"] = s["fld"]
        if s.get("uk"):
            sense["u"] = 1
        senses.append(sense)
    senses = merge_human_duplicates(senses)
    rec = {"i": i, "r": r, "s": senses}
    if k:
        rec["k"] = k
    if ks:
        rec["ks"] = ks
    if rs:
        rec["rs"] = rs
    rr = j.get("rr")
    if rr and k and not all(rr):
        rec["nk"] = [n for n, v in enumerate(rr) if not v]  # readings with no kanji
    if j.get("z"):
        rec["z"] = j["z"]
    if freq < 99:
        rec["c"] = freq
    if j.get("th"):
        rec["t"] = j["th"]
    return rec


def main():
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    db = sqlite3.connect(sys.argv[1])
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "dico", "data")
    os.makedirs(out, exist_ok=True)

    n_words = 0
    with gzip.open(os.path.join(out, "mots.ndjson.gz"), "wt", encoding="utf-8", compresslevel=9) as f:
        rows = db.execute("select id, freq, data from entry where id < 5000000 order by id")
        for i, freq, data in rows:
            rec = word_record(i, freq, json.loads(data))
            f.write(json.dumps(rec, ensure_ascii=False, separators=(",", ":")) + "\n")
            n_words += 1

    strokes = {c: json.loads(d) for c, _n, d in db.execute("select c, n, d from trait")}
    n_kanji = 0
    with gzip.open(os.path.join(out, "kanji.ndjson.gz"), "wt", encoding="utf-8", compresslevel=9) as f:
        for c, data in db.execute("select c, data from kanji order by coalesce(json_extract(data, '$.f'), 9999), c"):
            j = json.loads(data)
            rec = {"c": c, "n": j["n"]}
            for key in ("on", "kun", "fr", "en"):
                if j.get(key):
                    rec[key] = j[key]
            if j.get("g"):
                rec["g"] = j["g"]
            if j.get("f"):
                rec["f"] = j["f"]
            if j.get("m"):
                rec["m"] = j["m"]  # radical number (Kangxi)
            if c in strokes:
                rec["t"] = strokes[c]
            f.write(json.dumps(rec, ensure_ascii=False, separators=(",", ":")) + "\n")
            n_kanji += 1

    attribution = [
        {"source": s, "licence": l, "url": u} for s, l, u in db.execute("select source, licence, url from attribution")
        if not s.startswith("JMnedict")
    ]
    meta = {
        "version": 1,
        "words": n_words,
        "kanji": n_kanji,
        "files": {
            name: os.path.getsize(os.path.join(out, name)) for name in ("mots.ndjson.gz", "kanji.ndjson.gz")
        },
        "attribution": attribution,
    }
    with open(os.path.join(out, "meta.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=1)
    print(json.dumps(meta, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
