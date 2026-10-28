#!/usr/bin/env python3
"""Sanity-check generated planners: every hyperlink must point at a page that
exists, and every day of the year must have its own page.

    python3 verify.py dist/*.pdf
"""

import calendar
import re
import sys

from pypdf import PdfReader


def _titles(outline):
    for item in outline:
        if isinstance(item, list):
            yield from _titles(item)
        else:
            yield item.title


def check(path: str) -> list[str]:
    reader = PdfReader(path)
    dests = set(reader.named_destinations)
    page_ids = {p.indirect_reference.idnum for p in reader.pages}
    problems = []
    links = 0
    for n, page in enumerate(reader.pages, 1):
        for annot in page.get("/Annots") or []:
            a = annot.get_object()
            if a.get("/Subtype") != "/Link":
                continue
            links += 1
            target = a.get("/Dest") or (a.get("/A") or {}).get("/D")
            if isinstance(target, list) and target:  # explicit [page /Fit] destination
                ok = getattr(target[0], "idnum", None) in page_ids
            else:
                ok = target is not None and str(target) in dests
            if not ok:
                problems.append(f"page {n}: broken link to {target!r}")
    year = int(re.search(r"(\d{4})", path.rsplit("/", 1)[-1]).group(1))
    days = [t for t in _titles(reader.outline) if re.fullmatch(r"\w{3} \w{3} \d{1,2}", t)]
    expected = 366 if calendar.isleap(year) else 365
    if len(days) != expected:
        problems.append(f"{len(days)} daily pages in the outline, expected {expected}")
    print(f"{'OK ' if not problems else 'BAD'} {path}: {len(reader.pages)} pages, {len(days)} days, {links} links")
    return problems


def main():
    failed = False
    for path in sys.argv[1:]:
        for p in check(path):
            failed = True
            print("   ", p)
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
