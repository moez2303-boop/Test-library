"""Checks src/japanese/game/words.tsv: well-formed lines, no duplicate words or
English meanings, kana-only readings, and the level counts."""
import re
import sys
from collections import Counter

PATH = "src/japanese/game/words.tsv"
KANA = re.compile(r"^[぀-ゟ゠-ヿー]+$")
level, rows, bad = None, [], []
for no, line in enumerate(open(PATH, encoding="utf-8"), 1):
    line = line.rstrip("\n")
    if not line:
        continue
    if line.startswith("# N"):
        level = line[2:].strip()
        continue
    if line.startswith("#"):
        continue
    parts = line.split("\t")
    if len(parts) != 3 or not all(p.strip() for p in parts):
        bad.append(f"line {no}: needs 3 tab-separated fields: {line!r}")
        continue
    word, reading, en = parts
    if not KANA.match(reading):
        bad.append(f"line {no}: reading isn't kana: {reading!r}")
    rows.append((level, word, reading, en, no))

for label, key in (("word", 1), ("meaning", 3)):
    for value, n in Counter(r[key].lower() for r in rows).items():
        if n > 1:
            bad.append(f"duplicate {label}: {value} ({[r[4] for r in rows if r[key].lower() == value]})")

counts = Counter(r[0] for r in rows)
print(f"{len(rows)} words: " + ", ".join(f"{k} {v}" for k, v in counts.items()))
if bad:
    print("\n".join(bad))
    sys.exit(1)
