#!/usr/bin/env python3
"""Generate the "Calm Planner" — a hyperlinked digital planner for tablets
(GoodNotes, Notability, Noteshelf, Xodo...) plus printable Letter/A4 editions.

Usage:
    python3 generate.py                 # 2027, every edition, into ./dist
    python3 generate.py --year 2028     # next year's product, same code
    python3 generate.py --only digital  # just the tablet editions

Every page is vector, so files stay small and print crisply at any size.
Fonts are Caladea and Carlito (SIL Open Font License, OK for commercial use).
"""

from __future__ import annotations

import argparse
import calendar
import datetime as dt
import os
import zipfile
from dataclasses import dataclass

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4, LETTER
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

FONT_DIRS = ["/usr/share/fonts/truetype/crosextra", os.path.join(os.path.dirname(__file__), "fonts")]


def _register_fonts() -> None:
    wanted = {
        "Serif": "Caladea-Regular.ttf",
        "Serif-Bold": "Caladea-Bold.ttf",
        "Serif-Italic": "Caladea-Italic.ttf",
        "Sans": "Carlito-Regular.ttf",
        "Sans-Bold": "Carlito-Bold.ttf",
    }
    for name, file in wanted.items():
        for d in FONT_DIRS:
            path = os.path.join(d, file)
            if os.path.exists(path):
                pdfmetrics.registerFont(TTFont(name, path))
                break
        else:
            raise SystemExit(f"Font {file} not found in {FONT_DIRS}")


@dataclass(frozen=True)
class Theme:
    key: str
    name: str
    bg: str
    ink: str
    muted: str
    line: str
    accent: str
    soft: str

    def c(self, attr: str):
        return HexColor(getattr(self, attr))


THEMES = {
    "sage": Theme("sage", "Sage", "#FBFAF6", "#2F3A34", "#7C877F", "#D9DDD6", "#6E8B74", "#E6EDE5"),
    "blush": Theme("blush", "Blush", "#FFFAF8", "#3D3236", "#8F7F84", "#EADCDD", "#C27C86", "#F6E6E7"),
    "slate": Theme("slate", "Slate", "#F8F9FB", "#263040", "#7A8494", "#D8DDE5", "#4F6D8F", "#E3E9F1"),
    "ink": Theme("ink", "Ink Saver", "#FFFFFF", "#222222", "#777777", "#C8C8C8", "#555555", "#F1F1F1"),
}

DIGITAL_SIZE = (1024.0, 768.0)  # 4:3 landscape, matches iPad / most Android tablets


@dataclass
class Rect:
    x: float
    y: float
    w: float
    h: float

    @property
    def top(self) -> float:
        return self.y + self.h

    @property
    def right(self) -> float:
        return self.x + self.w


def d_key(d: dt.date) -> str:
    return f"d-{d.isoformat()}"


class Planner:
    def __init__(self, path: str, year: int, theme: Theme, size, digital: bool, week_start: int):
        self.year = year
        self.t = theme
        self.W, self.H = size
        self.digital = digital
        self.week_start = week_start  # 0 = Monday, 6 = Sunday
        self.cal = calendar.Calendar(firstweekday=week_start)
        self.c = canvas.Canvas(path, pagesize=size, pageCompression=1)
        self.c.setTitle(f"Calm Planner {year}")
        self.c.setAuthor("Calm Planner")
        self.c.setSubject(f"{year} {'digital' if digital else 'printable'} planner")
        self.weeks = self._weeks()
        self.week_of = {d: i for i, wk in enumerate(self.weeks) for d in wk}
        self._forms: set[str] = set()

    # ---------- calendar helpers ----------

    def _weeks(self) -> list[list[dt.date]]:
        jan1 = dt.date(self.year, 1, 1)
        start = jan1 - dt.timedelta(days=(jan1.weekday() - self.week_start) % 7)
        weeks = []
        while start.year <= self.year and not (start.year == self.year and start > dt.date(self.year, 12, 31)):
            weeks.append([start + dt.timedelta(days=i) for i in range(7)])
            start += dt.timedelta(days=7)
        return weeks

    def weekday_letters(self, n: int = 3) -> list[str]:
        names = [calendar.day_abbr[(self.week_start + i) % 7] for i in range(7)]
        return [s[:n] for s in names]

    def in_year(self, d: dt.date) -> bool:
        return d.year == self.year

    # ---------- drawing primitives ----------

    def link(self, key: str, x: float, y: float, w: float, h: float) -> None:
        if self.digital:
            self.c.linkAbsolute("", key, Rect=(x, y, x + w, y + h), thickness=0)

    def text(self, s, x, y, size=11, font="Sans", color="ink", align="left"):
        c = self.c
        c.setFont(font, size)
        c.setFillColor(self.t.c(color))
        if align == "center":
            c.drawCentredString(x, y, s)
        elif align == "right":
            c.drawRightString(x, y, s)
        else:
            c.drawString(x, y, s)

    def hline(self, x1, x2, y, color="line", width=0.6):
        self.c.setStrokeColor(self.t.c(color))
        self.c.setLineWidth(width)
        self.c.line(x1, y, x2, y)

    def box(self, r: Rect, fill=None, stroke="line", radius=6, width=0.8):
        c = self.c
        c.setLineWidth(width)
        if stroke:
            c.setStrokeColor(self.t.c(stroke))
        if fill:
            c.setFillColor(self.t.c(fill))
        c.roundRect(r.x, r.y, r.w, r.h, radius, stroke=1 if stroke else 0, fill=1 if fill else 0)

    def lines_in(self, r: Rect, spacing=22.0, start_offset=None):
        y = r.top - (start_offset if start_offset is not None else spacing)
        while y > r.y + 4:
            self.hline(r.x, r.right, y)
            y -= spacing

    def dots_in(self, r: Rect, spacing=18.0):
        # Dot fields repeat on hundreds of pages; draw each distinct one once as a
        # reusable form XObject so the PDF stays small.
        key = f"dots_{r.x:.0f}_{r.y:.0f}_{r.w:.0f}_{r.h:.0f}_{spacing:.0f}"
        c = self.c
        if key not in self._forms:
            self._forms.add(key)
            c.beginForm(key)
            c.setFillColor(self.t.c("line"))
            p = c.beginPath()
            y = r.top - spacing / 2
            while y > r.y:
                x = r.x + spacing / 2
                while x < r.right:
                    p.circle(x, y, 0.9)
                    x += spacing
                y -= spacing
            c.drawPath(p, stroke=0, fill=1)
            c.endForm()
        c.doForm(key)

    def checkbox(self, x, y, s=9):
        self.c.setStrokeColor(self.t.c("muted"))
        self.c.setLineWidth(0.7)
        self.c.roundRect(x, y, s, s, 2, stroke=1, fill=0)

    def section_label(self, s, x, y):
        self.text(s.upper(), x, y, size=9, font="Sans-Bold", color="accent")

    # ---------- page frame & navigation ----------

    def new_page(self, key: str, active_month: int | None = None, crumbs=()) -> Rect:
        """Start a page; returns the content rectangle."""
        c = self.c
        c.setFillColor(self.t.c("bg"))
        c.rect(0, 0, self.W, self.H, stroke=0, fill=1)
        c.bookmarkPage(key, fit="Fit")
        if not self.digital:
            m = 36
            return Rect(m, m, self.W - 2 * m, self.H - 2 * m)

        tab_w, bar_h, m = 54, 40, 28
        # Right-hand month tabs.
        tab_h = (self.H - bar_h - 16) / 12
        for i in range(12):
            y = self.H - bar_h - 8 - (i + 1) * tab_h
            active = active_month == i + 1
            c.setFillColor(self.t.c("accent" if active else "soft"))
            c.rect(self.W - tab_w, y + 1, tab_w, tab_h - 2, stroke=0, fill=1)
            self.text(calendar.month_abbr[i + 1].upper(), self.W - tab_w / 2, y + tab_h / 2 - 4,
                      size=10, font="Sans-Bold", color="bg" if active else "accent", align="center")
            self.link(f"m-{i + 1}", self.W - tab_w, y, tab_w, tab_h)
        # Top bar: breadcrumbs left, quick links right.
        bar_y = self.H - bar_h
        self.hline(m, self.W - tab_w - m / 2, bar_y, width=0.8)
        x = m
        for label, target in (((str(self.year), "year"),) + tuple(crumbs)):
            self.text(label, x, bar_y + 14, size=11, font="Sans-Bold" if target == key else "Sans",
                      color="ink" if target == key else "muted")
            w = pdfmetrics.stringWidth(label, "Sans", 11)
            self.link(target, x - 3, bar_y + 6, w + 6, 26)
            x += w + 8
            if target != key:
                self.text("›", x, bar_y + 14, size=11, color="line")
                x += 12
        x = self.W - tab_w - m / 2
        habit_target = f"h-{active_month}" if active_month else "h-1"
        for label, target in reversed((("Year", "year"), ("Goals", "goals"), ("Habits", habit_target),
                                       ("Notes", "notes-1"), ("Contents", "contents"))):
            w = pdfmetrics.stringWidth(label, "Sans-Bold", 10) + 18
            x -= w
            self.box(Rect(x, bar_y + 8, w - 6, 22), fill="soft", stroke=None, radius=11)
            self.text(label, x + (w - 6) / 2, bar_y + 15, size=10, font="Sans-Bold", color="accent", align="center")
            self.link(target, x, bar_y + 6, w - 6, 26)
        return Rect(m, 22, self.W - tab_w - m * 1.5, self.H - bar_h - 34)

    def heading(self, r: Rect, title: str, subtitle: str = "") -> Rect:
        size = 34 if self.digital else 30
        self.text(title, r.x, r.top - size + 6, size=size, font="Serif-Bold")
        if subtitle:
            self.text(subtitle, r.right, r.top - size + 8, size=12, font="Serif-Italic", color="muted", align="right")
        return Rect(r.x, r.y, r.w, r.h - size - 14)

    @property
    def landscape(self) -> bool:
        return self.W > self.H

    # ---------- pages ----------

    def cover(self):
        c = self.c
        c.setFillColor(self.t.c("bg"))
        c.rect(0, 0, self.W, self.H, stroke=0, fill=1)
        c.bookmarkPage("cover", fit="Fit")
        big = min(self.W, self.H)
        c.setFillColor(self.t.c("soft"))
        c.circle(self.W - big * 0.12, self.H - big * 0.1, big * 0.42, stroke=0, fill=1)
        c.setFillColor(self.t.c("accent"))
        c.circle(self.W - big * 0.3, self.H - big * 0.36, big * 0.06, stroke=0, fill=1)
        c.setStrokeColor(self.t.c("accent"))
        c.setLineWidth(1.2)
        c.circle(self.W - big * 0.1, big * 0.1, big * 0.16, stroke=1, fill=0)
        x = self.W * 0.1
        y = self.H * (0.42 if self.landscape else 0.46)
        self.text("C A L M   P L A N N E R", x + 4, y + (150 if self.landscape else 128), size=15,
                  font="Sans-Bold", color="accent")
        self.text(str(self.year), x, y, size=150 if self.landscape else 128, font="Serif-Bold")
        self.text("plan gently, live fully", x + 6, y - 36, size=16, font="Serif-Italic", color="muted")
        self.hline(x + 6, x + 220, y - 54, color="accent", width=1.2)
        if self.digital:
            self.text("Tap a month to begin", x + 6, 116, size=11, color="muted")
            w = 50
            for i in range(12):
                bx = x + i * w
                self.box(Rect(bx, 72, w - 6, 30), fill="soft", stroke=None, radius=15)
                self.text(calendar.month_abbr[i + 1], bx + (w - 6) / 2, 82, size=12, font="Sans-Bold",
                          color="accent", align="center")
                self.link(f"m-{i + 1}", bx, 72, w - 6, 30)
        c.showPage()

    def contents(self):
        r = self.heading(self.new_page("contents", crumbs=(("Contents", "contents"),)), "Contents",
                         "everything is one tap away" if self.digital else "")
        items = [("Year at a glance", "year"), ("Goals for the year", "goals")]
        items += [(f"{calendar.month_name[m]}", f"m-{m}") for m in range(1, 13)]
        items += [("Notes — lined", "notes-1"), ("Notes — dot grid", "notes-dots-1")]
        col_w = r.w / 2 - 12
        row_h = 30
        for i, (label, key) in enumerate(items):
            col, row = (0, i) if i < 8 else (1, i - 8)
            x = r.x + col * (col_w + 24)
            y = r.top - 10 - (row + 1) * row_h
            self.text(label, x, y + 8, size=15, font="Serif")
            self.hline(x, x + col_w, y, color="line")
            if self.digital:
                self.text("→", x + col_w, y + 8, size=13, color="accent", align="right")
            self.link(key, x, y, col_w, row_h)
        if self.digital:
            tips = ("How it works: tap a month tab on the right to jump there. On a month, tap a date to open "
                    "its daily page, or a W-number to open the week. The top bar always takes you back.")
            self._paragraph(tips, Rect(r.x, r.y, r.w, 60), size=11, color="muted")
        self.c.showPage()

    def _paragraph(self, s, r: Rect, size=11, color="ink"):
        words, line, y = s.split(), "", r.top - size
        for w in words:
            trial = (line + " " + w).strip()
            if pdfmetrics.stringWidth(trial, "Sans", size) > r.w:
                self.text(line, r.x, y, size=size, color=color)
                y -= size * 1.45
                line = w
            else:
                line = trial
        if line:
            self.text(line, r.x, y, size=size, color=color)

    def mini_month(self, r: Rect, month: int, title_size=12, highlight: dt.date | None = None):
        self.text(calendar.month_name[month], r.x, r.top - title_size, size=title_size, font="Serif-Bold")
        self.link(f"m-{month}", r.x, r.top - title_size - 4, r.w, title_size + 6)
        grid = Rect(r.x, r.y, r.w, r.h - title_size - 8)
        cw, ch = grid.w / 7, grid.h / 7
        fs = min(9.0, ch * 0.62)
        for i, wd in enumerate(self.weekday_letters(1)):
            self.text(wd, grid.x + (i + 0.5) * cw, grid.top - ch + 3, size=fs, font="Sans-Bold",
                      color="accent", align="center")
        for row, week in enumerate(self.cal.monthdatescalendar(self.year, month)):
            for col, d in enumerate(week):
                if d.month != month:
                    continue
                x, y = grid.x + col * cw, grid.top - (row + 2) * ch
                if d == highlight:
                    self.c.setFillColor(self.t.c("accent"))
                    self.c.circle(x + cw / 2, y + ch / 2 - 0.5, min(cw, ch) * 0.45, stroke=0, fill=1)
                self.text(str(d.day), x + cw / 2, y + ch / 2 - fs / 3, size=fs,
                          color="bg" if d == highlight else "ink", align="center")
                self.link(d_key(d), x, y, cw, ch)

    def year_at_a_glance(self):
        r = self.heading(self.new_page("year", crumbs=()), "Year at a glance", str(self.year))
        cols, rows = (4, 3) if self.landscape else (3, 4)
        gap = 22
        cw, ch = (r.w - gap * (cols - 1)) / cols, (r.h - gap * (rows - 1)) / rows
        for m in range(1, 13):
            i = m - 1
            x = r.x + (i % cols) * (cw + gap)
            y = r.top - (i // cols + 1) * ch - (i // cols) * gap
            self.mini_month(Rect(x, y, cw, ch), m)
        self.c.showPage()

    def goals(self):
        r = self.heading(self.new_page("goals", crumbs=(("Goals", "goals"),)), f"Goals for {self.year}",
                         "small steps, every day")
        word = Rect(r.x, r.top - 70, r.w, 60)
        self.box(word, fill="soft", stroke=None)
        self.section_label("My word for the year", word.x + 14, word.top - 20)
        self.section_label("This year I want to feel…", word.x + word.w / 2, word.top - 20)
        areas = ["Health & body", "Work & career", "Money", "Relationships", "Growth & learning", "Joy & adventure"]
        cols, rows = (3, 2) if self.landscape else (2, 3)
        grid = Rect(r.x, r.y, r.w, r.h - 86)
        gap = 16
        bw, bh = (grid.w - gap * (cols - 1)) / cols, (grid.h - gap * (rows - 1)) / rows
        for i, area in enumerate(areas):
            x = grid.x + (i % cols) * (bw + gap)
            y = grid.top - (i // cols + 1) * bh - (i // cols) * gap
            b = Rect(x, y, bw, bh)
            self.box(b)
            self.section_label(area, x + 12, b.top - 20)
            for j in range(3):
                ly = b.top - 46 - j * 26
                if ly < b.y + 8:
                    break
                self.checkbox(x + 12, ly + 2)
                self.hline(x + 28, b.right - 12, ly)
        self.c.showPage()

    def month_page(self, month: int):
        name = calendar.month_name[month]
        r = self.new_page(f"m-{month}", active_month=month, crumbs=((name, f"m-{month}"),))
        r = self.heading(r, name, str(self.year))
        weeks = self.cal.monthdatescalendar(self.year, month)
        if self.landscape:
            grid = Rect(r.x + 26, r.y, r.w * 0.74 - 26, r.h)
            side = Rect(grid.right + 20, r.y, r.right - grid.right - 20, r.h)
        else:
            grid = Rect(r.x + 22, r.y + r.h * 0.3, r.w - 22, r.h * 0.7)
            side = Rect(r.x, r.y, r.w, r.h * 0.3 - 18)
        head_h = 20
        cw, ch = grid.w / 7, (grid.h - head_h) / len(weeks)
        for i, wd in enumerate(self.weekday_letters(3)):
            self.text(wd.upper(), grid.x + (i + 0.5) * cw, grid.top - 14, size=9, font="Sans-Bold",
                      color="accent", align="center")
        for row, week in enumerate(weeks):
            y = grid.top - head_h - (row + 1) * ch
            wi = self.week_of.get(week[0])
            if wi is not None:
                self.text(f"W{wi + 1}", grid.x - 6, y + ch - 16, size=9, font="Sans-Bold", color="muted",
                          align="right")
                self.link(f"w-{wi}", grid.x - 26, y + ch - 24, 24, 22)
            for col, d in enumerate(week):
                x = grid.x + col * cw
                inside = d.month == month
                self.c.setStrokeColor(self.t.c("line"))
                self.c.setLineWidth(0.6)
                if inside:
                    self.c.setFillColor(self.t.c("bg"))
                else:
                    self.c.setFillColor(self.t.c("soft"))
                self.c.rect(x, y, cw, ch, stroke=1, fill=1)
                if inside:
                    self.text(str(d.day), x + 6, y + ch - 15, size=12, font="Sans-Bold")
                    self.link(d_key(d), x, y, cw, ch)
        self.section_label("Focus this month", side.x, side.top - 10)
        focus = Rect(side.x, side.top - side.h * 0.42, side.w, side.h * 0.42 - 16)
        self.lines_in(focus, spacing=22)
        self.section_label("Notes", side.x, focus.y - 16)
        self.dots_in(Rect(side.x, side.y, side.w, focus.y - 24 - side.y), spacing=16)
        self.c.showPage()

    def habit_page(self, month: int):
        name = calendar.month_name[month]
        r = self.new_page(f"h-{month}", active_month=month,
                          crumbs=((name, f"m-{month}"), ("Habits", f"h-{month}")))
        r = self.heading(r, "Habit tracker", f"{name} {self.year}")
        days = calendar.monthrange(self.year, month)[1]
        rows = 12
        label_w = min(170.0, r.w * 0.26)
        cw = (r.w - label_w) / 31
        rh = (r.h - 22) / rows
        for dnum in range(1, days + 1):
            d = dt.date(self.year, month, dnum)
            x = r.x + label_w + (dnum - 1) * cw
            self.text(str(dnum), x + cw / 2, r.top - 12, size=8, font="Sans-Bold", color="accent", align="center")
            self.text(calendar.day_abbr[d.weekday()][0], x + cw / 2, r.top - 21, size=6.5, color="muted",
                      align="center")
            self.link(d_key(d), x, r.top - 24, cw, 24)
        for i in range(rows):
            y = r.top - 24 - (i + 1) * rh
            self.hline(r.x, r.x + label_w + days * cw, y)
            s = min(cw, rh) * 0.62
            for dnum in range(days):
                cx = r.x + label_w + dnum * cw + cw / 2
                self.c.setStrokeColor(self.t.c("line"))
                self.c.setLineWidth(0.6)
                self.c.circle(cx, y + rh / 2, s / 2, stroke=1, fill=0)
        self.c.showPage()

    def week_page(self, wi: int):
        week = self.weeks[wi]
        first, last = week[0], week[-1]
        label = f"{first:%b} {first.day} – {last:%b} {last.day}"
        anchor_month = first.month if first.year == self.year else 1
        r = self.new_page(f"w-{wi}", active_month=anchor_month,
                          crumbs=((calendar.month_name[anchor_month], f"m-{anchor_month}"),
                                  (f"Week {wi + 1}", f"w-{wi}")))
        r = self.heading(r, f"Week {wi + 1}", label)
        cols, rows = (4, 2) if self.landscape else (2, 4)
        gap = 12
        bw, bh = (r.w - gap * (cols - 1)) / cols, (r.h - gap * (rows - 1)) / rows
        for i in range(8):
            x = r.x + (i % cols) * (bw + gap)
            y = r.top - (i // cols + 1) * bh - (i // cols) * gap
            b = Rect(x, y, bw, bh)
            if i == 7:
                self.box(b, fill="soft", stroke=None)
                self.section_label("Priorities", x + 12, b.top - 20)
                for j in range(int((bh - 40) // 24)):
                    ly = b.top - 44 - j * 24
                    self.checkbox(x + 12, ly + 2)
                    self.hline(x + 28, b.right - 12, ly, color="line")
                continue
            d = week[i]
            self.box(b)
            dim = not self.in_year(d)
            self.text(f"{d:%A}", x + 12, b.top - 22, size=13, font="Serif-Bold", color="muted" if dim else "ink")
            self.text(f"{d:%b} {d.day}", b.right - 12, b.top - 22, size=11, font="Sans-Bold",
                      color="muted" if dim else "accent", align="right")
            if not dim:
                self.link(d_key(d), x, b.top - 32, bw, 32)
            self.lines_in(Rect(x + 12, b.y + 4, bw - 24, bh - 36), spacing=22, start_offset=22)
        self.c.showPage()

    def day_page(self, d: dt.date):
        wi = self.week_of[d]
        r = self.new_page(d_key(d), active_month=d.month,
                          crumbs=((calendar.month_name[d.month], f"m-{d.month}"), (f"Week {wi + 1}", f"w-{wi}"),
                                  (f"{d:%a} {d.day}", d_key(d))))
        self.text(f"{d:%A}", r.x, r.top - 34, size=34, font="Serif-Bold")
        self.text(f"{d:%B} {d.day}, {d.year}", r.x, r.top - 56, size=13, font="Serif-Italic", color="muted")
        doy = d.timetuple().tm_yday
        days_in_year = 366 if calendar.isleap(d.year) else 365
        self.text(f"Day {doy} of {days_in_year}", r.x, r.top - 74, size=9, font="Sans-Bold", color="accent")
        # Mini calendar for quick day-to-day jumps.
        mini = Rect(r.right - 150, r.top - 96, 150, 96) if self.landscape else Rect(r.right - 132, r.top - 88, 132, 88)
        self.mini_month(mini, d.month, title_size=10, highlight=d)
        body = Rect(r.x, r.y, r.w, r.h - 108)

        left = Rect(body.x, body.y, body.w * 0.46, body.h)
        right = Rect(left.right + 22, body.y, body.right - left.right - 22, body.h)
        self.section_label("Schedule", left.x, left.top - 10)
        hours = list(range(6, 23))
        sh = (left.h - 22) / len(hours)
        for i, hr in enumerate(hours):
            y = left.top - 22 - (i + 1) * sh
            self.hline(left.x + 34, left.right, y + sh)
            label = f"{(hr - 1) % 12 + 1}{'am' if hr < 12 else 'pm'}"
            self.text(label, left.x + 28, y + sh - 12, size=9, color="muted", align="right")
        self.hline(left.x + 34, left.right, left.top - 22 - len(hours) * sh)

        top3 = Rect(right.x, right.top - 108, right.w, 98)
        self.box(top3, fill="soft", stroke=None)
        self.section_label("Top 3", top3.x + 12, top3.top - 20)
        for j in range(3):
            ly = top3.top - 46 - j * 22
            self.text(str(j + 1), top3.x + 14, ly + 3, size=11, font="Serif-Bold", color="accent")
            self.hline(top3.x + 30, top3.right - 12, ly)
        todo_top = top3.y - 16
        todo_h = (todo_top - right.y) * 0.55
        self.section_label("To do", right.x, todo_top - 10)
        n = int((todo_h - 18) // 22)
        for j in range(n):
            ly = todo_top - 34 - j * 22
            self.checkbox(right.x, ly + 2)
            self.hline(right.x + 16, right.right, ly)
        notes_top = todo_top - todo_h - 6
        self.section_label("Notes & gratitude", right.x, notes_top - 10)
        self.dots_in(Rect(right.x, right.y, right.w, notes_top - 20 - right.y), spacing=16)
        # Water tracker along the heading row.
        wx = r.x + 200 if self.landscape else r.x + 170
        self.section_label("Water", wx, r.top - 74)
        for k in range(8):
            self.c.setStrokeColor(self.t.c("accent"))
            self.c.setLineWidth(0.8)
            self.c.circle(wx + 52 + k * 16, r.top - 71, 5, stroke=1, fill=0)
        self.c.showPage()

    def notes(self, kind: str, n: int):
        for i in range(1, n + 1):
            key = f"notes-{i}" if kind == "lined" else f"notes-dots-{i}"
            r = self.new_page(key, crumbs=(("Notes", key),))
            r = self.heading(r, "Notes", f"{i} / {n}")
            if kind == "lined":
                self.lines_in(r, spacing=26)
            else:
                self.dots_in(r, spacing=18)
            if self.digital and i < n:
                nxt = f"notes-{i + 1}" if kind == "lined" else f"notes-dots-{i + 1}"
                self.text("next page →", r.right, 6, size=10, font="Sans-Bold", color="accent", align="right")
                self.link(nxt, r.right - 80, 0, 80, 20)
            self.c.showPage()

    # ---------- assembly ----------

    def build(self, notes_pages: int):
        c = self.c
        self.cover()
        self.contents()
        c.addOutlineEntry("Contents", "contents", 0)
        self.year_at_a_glance()
        c.addOutlineEntry("Year at a glance", "year", 0)
        self.goals()
        c.addOutlineEntry("Goals", "goals", 0)
        placed = set()
        for m in range(1, 13):
            self.month_page(m)
            c.addOutlineEntry(calendar.month_name[m], f"m-{m}", 0, closed=True)
            self.habit_page(m)
            c.addOutlineEntry("Habit tracker", f"h-{m}", 1)
            for wi, wk in enumerate(self.weeks):
                home = wk[0].month if wk[0].year == self.year else 1
                if home == m and wi not in placed:
                    placed.add(wi)
                    self.week_page(wi)
                    c.addOutlineEntry(f"Week {wi + 1}", f"w-{wi}", 1)
            for dnum in range(1, calendar.monthrange(self.year, m)[1] + 1):
                d = dt.date(self.year, m, dnum)
                self.day_page(d)
                c.addOutlineEntry(f"{d:%a %b} {d.day}", d_key(d), 1)
        self.notes("lined", notes_pages)
        c.addOutlineEntry("Notes — lined", "notes-1", 0)
        self.notes("dots", notes_pages)
        c.addOutlineEntry("Notes — dot grid", "notes-dots-1", 0)
        c.showOutline()
        c.save()


def editions(year: int, only: str | None):
    starts = (("monday", 0), ("sunday", 6))
    if only in (None, "digital"):
        for theme in ("sage", "blush", "slate"):
            for sname, s in starts:
                yield (f"CalmPlanner-{year}-Digital-{THEMES[theme].name}-{sname.title()}Start.pdf",
                       THEMES[theme], DIGITAL_SIZE, True, s, 10)
    if only in (None, "print"):
        for pname, size in (("Letter", LETTER), ("A4", A4)):
            for sname, s in starts:
                yield (f"CalmPlanner-{year}-Printable-{pname}-{sname.title()}Start.pdf",
                       THEMES["ink"], size, False, s, 4)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--year", type=int, default=2027)
    ap.add_argument("--out", default=os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist"))
    ap.add_argument("--only", choices=("digital", "print"))
    ap.add_argument("--no-zip", action="store_true", help="skip building the upload-ready zip bundles")
    args = ap.parse_args()
    _register_fonts()
    os.makedirs(args.out, exist_ok=True)
    built = []
    for fname, theme, size, digital, start, notes in editions(args.year, args.only):
        path = os.path.join(args.out, fname)
        Planner(path, args.year, theme, size, digital, start).build(notes)
        built.append(path)
        print(f"{os.path.getsize(path) / 1e6:6.1f} MB  {fname}")
    if not args.no_zip:
        groups = {"Digital": [p for p in built if "-Digital-" in p],
                  "Printable": [p for p in built if "-Printable-" in p]}
        for label, files in groups.items():
            if not files:
                continue
            zpath = os.path.join(args.out, f"CalmPlanner-{args.year}-{label}-Bundle.zip")
            with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
                for f in files:
                    z.write(f, os.path.basename(f))
            print(f"{os.path.getsize(zpath) / 1e6:6.1f} MB  {os.path.basename(zpath)}")


if __name__ == "__main__":
    main()
