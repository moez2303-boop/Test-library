"""Builds the Atashinchi lesson pack: every video on the official channel
that is under 4 minutes, with its Japanese subtitles as the script.

    pip install yt-dlp
    python3 scripts/fetch_atashinchi.py

Writes src/japanese/packs/atashinchi.json. The channel rotates many episodes
out after about 45 days, so re-run it now and then to refresh the list.
"""

import glob
import json
import os
import re
import sys
import tempfile
import time
from datetime import datetime, timezone

from yt_dlp import YoutubeDL

CHANNEL = "https://www.youtube.com/@atashinchi"
MAX_SECONDS = 4 * 60
OUT = os.path.join(os.path.dirname(__file__), "..", "src", "japanese", "packs", "atashinchi.json")
MAX_SCRIPT_CHARS = 4000


def list_videos():
    """Flat-lists the channel's Videos and Shorts tabs (fast: no per-video pages)."""
    found = {}
    with YoutubeDL({"extract_flat": "in_playlist", "quiet": True, "skip_download": True}) as ydl:
        for tab in ("videos", "shorts"):
            try:
                info = ydl.extract_info(f"{CHANNEL}/{tab}", download=False)
            except Exception as err:  # a missing tab is fine
                print(f"  {tab}: {err}", file=sys.stderr)
                continue
            for e in info.get("entries") or []:
                if e.get("id"):
                    found[e["id"]] = {
                        "id": e["id"],
                        "title": e.get("title") or "",
                        "duration": e.get("duration"),
                        "short": tab == "shorts",
                    }
            print(f"  {tab}: {len(info.get('entries') or [])} videos")
    return list(found.values())


def vtt_to_text(path):
    """Subtitle file -> plain lines, without timing, tags or repeated lines."""
    lines, last = [], None
    with open(path, encoding="utf-8") as f:
        for raw in f:
            line = raw.strip()
            if (not line or line == "WEBVTT" or "-->" in line or line.isdigit()
                    or line.startswith(("Kind:", "Language:", "NOTE"))):
                continue
            line = re.sub(r"<[^>]+>", "", line).strip()
            if line and line != last:
                lines.append(line)
                last = line
    return "\n".join(lines)[:MAX_SCRIPT_CHARS]


def details_and_script(video_id, workdir):
    """Full metadata (duration) plus Japanese subtitles: uploaded ones, else auto-generated."""
    opts = {
        "quiet": True,
        "skip_download": True,
        "writesubtitles": True,
        "writeautomaticsub": True,
        "subtitleslangs": ["ja", "ja-JP", "ja-orig"],
        "subtitlesformat": "vtt",
        "outtmpl": os.path.join(workdir, "%(id)s.%(ext)s"),
    }
    with YoutubeDL(opts) as ydl:
        info = ydl.extract_info(f"https://www.youtube.com/watch?v={video_id}", download=True)
    manual = bool({"ja", "ja-JP"} & set((info.get("subtitles") or {}).keys()))
    files = sorted(glob.glob(os.path.join(workdir, f"{video_id}*.vtt")))
    script = vtt_to_text(files[0]) if files else ""
    return info, script, ("manual" if manual else "auto") if script else None


def main():
    print("Listing channel videos…")
    videos = list_videos()
    pack = []
    with tempfile.TemporaryDirectory() as workdir:
        for i, v in enumerate(videos, 1):
            if v["duration"] and v["duration"] >= MAX_SECONDS:
                continue
            try:
                info, script, subs = details_and_script(v["id"], workdir)
            except Exception as err:  # private, region-locked, removed…
                print(f"  skip {v['id']}: {err}", file=sys.stderr)
                continue
            duration = info.get("duration") or v["duration"]
            if not duration or duration >= MAX_SECONDS:
                continue
            pack.append({
                "id": v["id"],
                "title": info.get("title") or v["title"],
                "duration": duration,
                "short": v["short"],
                "subtitles": subs,
                "script": script,
            })
            print(f"  [{i}/{len(videos)}] {duration:>4}s  subs={subs or '-':6}  {pack[-1]['title'][:50]}")
            time.sleep(1)  # be gentle with YouTube

    pack.sort(key=lambda x: x["title"])
    data = {
        "channel": "あたしンち 公式",
        "channelUrl": CHANNEL,
        "fetchedAt": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "maxSeconds": MAX_SECONDS,
        "videos": pack,
    }
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    with_script = sum(1 for v in pack if v["script"])
    print(f"Wrote {len(pack)} videos under 4 min ({with_script} with Japanese subtitles) to {OUT}")


if __name__ == "__main__":
    main()
