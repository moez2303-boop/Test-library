# My Library

A Kindle-inspired personal library for PDF books. Upload PDFs and they land on
a warm, wooden bookshelf — with real cover thumbnails generated from each
book's first page, progress tracking, and a distraction-free reader.

Everything runs entirely in the browser: PDFs are parsed with
[pdf.js](https://mozilla.github.io/pdf.js/) and stored locally in
IndexedDB. Nothing is uploaded to a server.

## Features

- Drag-and-drop or click to upload one or more PDFs
- Automatic cover thumbnail, title, and author extraction from each PDF
- Kindle-style shelf grid with search and sort (recent / title / author / progress)
- Full-screen reader with page navigation, keyboard shortcuts, and a
  scrubbable progress bar
- Reading progress is remembered per book and persists across reloads
- All data stays on-device (IndexedDB) — no backend required

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL and upload a PDF to get started.

## Build

```bash
npm run build
```

## Tech stack

- React + TypeScript + Vite
- Tailwind CSS v4
- pdf.js (`pdfjs-dist`) for parsing and rendering
- `idb` for IndexedDB storage

---

# Allons-y & Ikimashō: French and Japanese courses

Two complete language courses in one app, at `/course/` (`npm run dev`, then
open `http://localhost:5173/course/`). A switch in the sidebar (or the top bar
on phones) changes between **French (Allons-y)** and **Japanese (Ikimashō)**.
Each course keeps its own points, streak, badges, lesson progress and vocab;
settings such as theme and daily goal are shared.

## What's inside each course

- **28 lessons over 3 levels**, grouped into modules. Two kinds:
  - **Interactive audio lessons** — a dialogue you can play line by line or as a
    whole, at normal or slow speed, with English shown or hidden.
  - **Language & culture lessons** — grammar and culture notes with playable
    examples.
- **Six activities per lesson**, each tracked separately:
  - **Hear It Say It** — listen, record yourself, get a pronunciation score
    (speech recognition) and play your own recording back.
  - **Write It** — dictation. French has an accent keyboard; Japanese accepts
    kana, romaji in any common spelling, or the written form.
  - **Know It** — flip cards in both directions with Hard / Good / Easy ratings.
  - **Quiz** — multiple choice, listening, fill-the-gap and word-order
    questions; Japanese adds "how is this kanji read?".
  - **Play It** — role-play: pick a character and say their lines in the conversation.
- **My Vocab** — save any phrase; review with spaced repetition. Cards you rate
  "Hard" are added automatically.
- **Verbs** — French: 22 verbs in six tenses. Japanese: 25 verbs in polite,
  plain and eight more forms (て form, potential, volitional, passive…),
  generated from each verb's class. Both have a conjugation drill.
- **Survival Kit** — the travel phrases you'll need most.
- **Progress** — points, daily goal, day streak, 14-day chart, 16 badges and a
  printable certificate for each completed level.
- **Settings** — voice, speed, daily goal, theme, kana/romaji display for
  Japanese, backup/restore.

Japanese phrases carry a kana reading (`reading`, words separated by spaces);
the app derives romaji from it (`src/course/kana.ts`) for display and for
grading typed answers.

Audio uses the browser's built-in text-to-speech; pronunciation scoring uses
the Web Speech API (Chrome, Edge, Safari). Progress is stored in
`localStorage` on the device.

Code lives in `src/course/`; each language's content is in
`src/course/languages/<fr|ja>/`.

## claude.ai Artifact build

`npm run build:artifact:course` builds the whole app as one HTML file
(`dist-artifact/allons-y-french.html`) for a claude.ai Artifact. There it uses
the viewer's capabilities instead of browser APIs the Artifact frame blocks:
Claude's voice, Claude dictation for pronunciation scores, downloads for
backups, and a private per-user store that syncs progress across devices.
