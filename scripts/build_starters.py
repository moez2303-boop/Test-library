"""Converts scripts/manga-starters.txt into src/japanese/manga/starters.json,
checking every lesson on the way. Run: python3 scripts/build_starters.py"""

import json
import os
import re
import sys

HERE = os.path.dirname(__file__)
SRC = os.path.join(HERE, "manga-starters.txt")
OUT = os.path.join(HERE, "..", "src", "japanese", "manga", "starters.json")

WRITING = {"open_question", "continue_story", "say_it_in_japanese"}
CHOICE = {"vocabulary", "grammar", "kanji_reading", "who_said_it", "true_false", "fill_blank"}
RUBY = re.compile(r"\{([^|{}]+)\|([^{}]+)\}")


def fields(line, n, where):
    parts = [p.strip() for p in line.split(" || ")]
    if len(parts) != n:
        sys.exit(f"{where}: expected {n} fields, got {len(parts)}: {line!r}")
    return parts


def check_ruby(text, where):
    stripped = RUBY.sub("", text)
    if "{" in stripped or "}" in stripped:
        sys.exit(f"{where}: broken reading markup in {text!r}")


def main():
    lessons, lesson, section = [], None, None
    for no, raw in enumerate(open(SRC, encoding="utf-8"), 1):
        line = raw.rstrip("\n")
        where = f"line {no}"
        if not line.strip() or line.startswith("#"):
            continue
        if line.startswith("=== "):
            lesson = {"id": line[4:].strip(), "pages": [], "glossary": [], "exercises": []}
            lessons.append(lesson)
            section = None
        elif line.startswith("--- "):
            kind = line[4:].split()
            if kind[0] == "page":
                lesson["pages"].append({"panels": []})
                section = "page"
            elif kind[0] == "glossary":
                section = "glossary"
            elif kind[0] == "exercise":
                t = kind[1]
                if t not in WRITING | CHOICE:
                    sys.exit(f"{where}: unknown exercise type {t}")
                lesson["exercises"].append({"type": t, "prompt": "", "promptEn": "", "options": [],
                                            "answerIndex": -1, "explanation": "", "referenceAnswer": ""})
                section = "exercise"
            else:
                sys.exit(f"{where}: unknown section {line}")
        elif section is None:
            key, _, value = line.partition(":")
            lesson[key.strip()] = value.strip()
        elif section == "page":
            panels = lesson["pages"][-1]["panels"]
            if line.startswith("> "):
                scene, scene_en = fields(line[2:], 2, where)
                check_ruby(scene, where)
                panels.append({"scene": scene, "sceneEn": scene_en, "lines": []})
            elif line.startswith("@"):
                speaker, text, en = fields(line[1:], 3, where)
                check_ruby(text, where)
                panels[-1]["lines"].append({"speaker": speaker, "text": text, "en": en})
            else:
                sys.exit(f"{where}: unexpected page line {line!r}")
        elif section == "glossary":
            word, reading, meaning = fields(line, 3, where)
            lesson["glossary"].append({"word": word, "reading": reading, "meaning": meaning})
        elif section == "exercise":
            ex = lesson["exercises"][-1]
            tag, body = line[:1], line[2:].strip()
            if tag == "?":
                ex["prompt"], ex["promptEn"] = fields(body, 2, where)
                check_ruby(ex["prompt"], where)
            elif tag in "+-":
                if tag == "+":
                    ex["answerIndex"] = len(ex["options"])
                ex["options"].append(body)
            elif tag == "!":
                ex["explanation"] = body
            elif tag == "=":
                check_ruby(body, where)
                ex["referenceAnswer"] = body
            else:
                sys.exit(f"{where}: unexpected exercise line {line!r}")

    out = []
    for l in lessons:
        name = l["id"]
        for key in ("title", "title_en", "level", "topic", "summary"):
            if not l.get(key):
                sys.exit(f"{name}: missing {key}")
        if not 3 <= len(l["pages"]) <= 4:
            sys.exit(f"{name}: needs 3-4 pages")
        for i, p in enumerate(l["pages"], 1):
            if not 3 <= len(p["panels"]) <= 5 or any(not panel["lines"] for panel in p["panels"]):
                sys.exit(f"{name} page {i}: needs 3-5 panels, each with lines")
        for i, ex in enumerate(l["exercises"], 1):
            if ex["type"] in CHOICE:
                if sum(1 for o in ex["options"] if o) < 2 or ex["answerIndex"] < 0:
                    sys.exit(f"{name} exercise {i}: needs options and one correct answer")
            elif ex["options"]:
                sys.exit(f"{name} exercise {i}: writing exercises have no options")
        types = [e["type"] for e in l["exercises"]]
        if len(types) != 6 or sum(t in WRITING for t in types) != 2:
            sys.exit(f"{name}: needs 6 exercises with exactly 2 writing ones, got {types}")
        out.append({
            "id": name, "title": l["title"], "titleEn": l["title_en"], "summaryEn": l["summary"],
            "level": l["level"], "topic": l["topic"], "source": "story", "pageCount": len(l["pages"]),
            "pages": l["pages"], "glossary": l["glossary"], "exercises": l["exercises"],
        })
        print(f"  {name:28} {l['level']}  {len(l['pages'])} pages  "
              f"{sum(len(p['panels']) for p in l['pages'])} panels  {', '.join(types)}")

    # Each choice exercise must mark exactly one "+": count them per exercise in the source.
    plus = 0
    for raw in open(SRC, encoding="utf-8"):
        if raw.startswith("--- exercise"):
            if plus > 1:
                sys.exit("an exercise marks more than one correct option")
            plus = 0
        elif raw.startswith("+ "):
            plus += 1
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print(f"Wrote {len(out)} lessons to {os.path.relpath(OUT)}")


if __name__ == "__main__":
    main()
