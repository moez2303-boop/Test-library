#!/usr/bin/env python3
"""Render listing images (Etsy / Gumroad) from the generated PDFs.

    python3 generate.py && python3 mockups.py

Writes 2700x2025 PNGs (4:3, Etsy's recommended ratio) into dist/listing/.
"""

import glob
import os

import pypdfium2 as pdfium
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(HERE, "dist")
OUT = os.path.join(DIST, "listing")
W, H = 2700, 2025
FONT_DIR = "/usr/share/fonts/truetype/crosextra"

THEME_BG = {"Sage": "#E6EDE5", "Blush": "#F6E6E7", "Slate": "#E3E9F1"}
INK = "#2F3A34"


def font(name, size):
    return ImageFont.truetype(os.path.join(FONT_DIR, name), size)


def page(pdf_path, index, width):
    doc = pdfium.PdfDocument(pdf_path)
    p = doc[index]
    scale = width / p.get_width()
    return p.render(scale=scale).to_pil().convert("RGB")


def shadowed(canvas, img, xy, radius=28, frame=0, frame_color="#1E1E1E"):
    """Paste img at xy, optionally inside a tablet bezel, with a soft shadow."""
    w, h = img.size[0] + 2 * frame, img.size[1] + 2 * frame
    shadow = Image.new("RGBA", (w + 160, h + 160), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle((80, 100, 80 + w, 100 + h), radius + frame, fill=(0, 0, 0, 70))
    shadow = shadow.filter(ImageFilter.GaussianBlur(36))
    canvas.paste(shadow, (xy[0] - 80, xy[1] - 80), shadow)
    if frame:
        bezel = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        ImageDraw.Draw(bezel).rounded_rectangle((0, 0, w - 1, h - 1), radius + frame, fill=frame_color)
        canvas.paste(bezel, xy, bezel)
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, img.size[0] - 1, img.size[1] - 1), radius if frame else 8, fill=255)
    canvas.paste(img, (xy[0] + frame, xy[1] + frame), mask)


def base(bg):
    return Image.new("RGB", (W, H), bg)


def title(d, lines, x, y, sizes=(120, 54), color=INK, sub_color="#6B746E"):
    d.text((x, y), lines[0], font=font("Caladea-Bold.ttf", sizes[0]), fill=color)
    yy = y + sizes[0] + 30
    for line in lines[1:]:
        d.text((x, yy), line, font=font("Carlito-Regular.ttf", sizes[1]), fill=sub_color)
        yy += int(sizes[1] * 1.45)


def pill(d, x, y, text, bg, fg, size=42):
    f = font("Carlito-Bold.ttf", size)
    tw = d.textlength(text, font=f)
    d.rounded_rectangle((x, y, x + tw + 60, y + size + 34), (size + 34) // 2, fill=bg)
    d.text((x + 30, y + 15), text, font=f, fill=fg)
    return x + tw + 60 + 20


def main():
    os.makedirs(OUT, exist_ok=True)
    digital = {t: f for t in THEME_BG for f in glob.glob(os.path.join(DIST, f"*Digital-{t}-MondayStart.pdf"))}
    letter = glob.glob(os.path.join(DIST, "*Printable-Letter-MondayStart.pdf"))
    if len(digital) < 3:
        raise SystemExit("Run generate.py first.")
    sage = digital["Sage"]
    year = os.path.basename(sage).split("-")[1]
    pages = {"cover": 0, "contents": 1, "year": 2, "goals": 3, "month": 4, "habits": 5, "week": 7, "day": 11}

    # 1. Hero
    img = base("#F4F1EA")
    d = ImageDraw.Draw(img)
    title(d, [f"{year} Digital Planner", "Hyperlinked · 466 pages · daily, weekly, monthly",
              "For GoodNotes, Notability, Noteshelf & any PDF app"], 150, 170, sizes=(150, 60))
    shadowed(img, page(sage, pages["month"], 1500), (1090, 640), frame=40)
    shadowed(img, page(digital["Blush"], pages["cover"], 900), (170, 1000), frame=30)
    x = 170
    for t in ("3 colours", "Mon & Sun start", "+ printable"):
        x = pill(d, x, 1760, t, "#6E8B74", "#FFFFFF")
    img.save(os.path.join(OUT, "01-hero.png"))

    # 2. What's inside
    img = base("#FBFAF6")
    d = ImageDraw.Draw(img)
    title(d, ["What's inside"], 150, 110, sizes=(120, 50))
    tiles = [("Year at a glance", "year"), ("Goals", "goals"), ("12 monthly calendars", "month"),
             ("12 habit trackers", "habits"), ("53 weekly spreads", "week"), ("365 daily pages", "day")]
    tw, gap = 760, 90
    for i, (label, key) in enumerate(tiles):
        col, row = i % 3, i // 3
        x, y = 150 + col * (tw + gap), 360 + row * 820
        shadowed(img, page(sage, pages[key], tw), (x, y))
        d.text((x, y + 600), label, font=font("Carlito-Bold.ttf", 54), fill=INK)
    img.save(os.path.join(OUT, "02-whats-inside.png"))

    # 3. Hyperlinks
    img = base("#E6EDE5")
    d = ImageDraw.Draw(img)
    title(d, ["Tap. Jump. Plan.", "22,000+ hyperlinks in every file:", "month tabs on every page,",
              "tap any date to open its day,", "breadcrumbs to go back up."], 150, 300, sizes=(130, 62))
    shadowed(img, page(sage, pages["day"], 1450), (1120, 470), frame=40)
    img.save(os.path.join(OUT, "03-hyperlinked.png"))

    # 4. Colours
    img = base("#FBFAF6")
    d = ImageDraw.Draw(img)
    title(d, ["Choose your colour", "All three included · Monday or Sunday start"], 150, 110, sizes=(120, 56))
    for i, (t, path) in enumerate(digital.items()):
        x = 150 + i * 820
        shadowed(img, page(path, pages["week"], 740), (x, 520), frame=22)
        d.text((x, 1170), t, font=font("Caladea-Bold.ttf", 72), fill=INK)
        shadowed(img, page(path, pages["cover"], 740), (x, 1320), frame=22)
    img.save(os.path.join(OUT, "04-colours.png"))

    # 5. Printable
    if letter:
        img = base("#F2F2F2")
        d = ImageDraw.Draw(img)
        title(d, ["Prefer paper?", "Printable editions included:", "US Letter & A4, ink-saver design,",
                  "Monday & Sunday start."], 150, 300, sizes=(130, 62))
        for i, key in enumerate(("month", "week", "day")):
            shadowed(img, page(letter[0], pages[key] - (1 if key == "week" else 0), 640), (1100 + i * 180, 380 + i * 160))
        img.save(os.path.join(OUT, "05-printable.png"))

    # 6. How it works / compatibility
    img = base("#6E8B74")
    d = ImageDraw.Draw(img)
    d.text((150, 200), "Instant download", font=font("Caladea-Bold.ttf", 140), fill="#FFFFFF")
    steps = ["1.  Download the zip after purchase",
             "2.  Open the PDF in GoodNotes, Notability, Noteshelf,",
             "     Xodo, Samsung Notes, OneNote or any PDF app",
             "3.  Write with your stylus, tap tabs to navigate",
             "",
             "Works on iPad, Android tablets, reMarkable*, Boox*",
             "and desktop. No subscription. Yours to keep."]
    for i, s in enumerate(steps):
        d.text((160, 520 + i * 110), s, font=font("Carlito-Regular.ttf", 66), fill="#FFFFFF")
    d.text((160, 1820), "* e-ink devices: links work in PDF viewers that support them",
           font=font("Carlito-Regular.ttf", 40), fill="#DDE7DE")
    img.save(os.path.join(OUT, "06-how-it-works.png"))

    for f in sorted(os.listdir(OUT)):
        print(os.path.join(OUT, f))


if __name__ == "__main__":
    main()
