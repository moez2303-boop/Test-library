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

# Allons-y French

A complete French course in the browser, at `/french/` (`npm run dev`, then open
`http://localhost:5173/french/`).

## What's inside

- **28 lessons over 3 levels** (Débutant, Intermédiaire, Avancé), grouped into
  modules. Two kinds:
  - **Interactive audio lessons** — a dialogue you can play line by line or as a
    whole, at normal or slow speed, with English shown or hidden.
  - **Language & culture lessons** — grammar and culture notes with playable
    examples.
- **Six activities per lesson**, each tracked separately:
  - **Hear It Say It** — listen, record yourself, get a pronunciation score
    (speech recognition) and play your own recording back.
  - **Write It** — dictation with an accent keyboard and forgiving grading.
  - **Know It** — flip cards in both directions with Hard / Good / Easy ratings.
  - **Quiz** — multiple choice, listening, fill-the-gap and word-order questions.
  - **Play It** — role-play: pick a character and say their lines in the conversation.
- **My Vocab** — save any phrase; review with spaced repetition. Cards you rate
  "Hard" are added automatically.
- **Verbs** — 22 essential verbs in six tenses (present, passé composé,
  imparfait, future, conditional, subjunctive) plus a conjugation drill.
- **Survival Kit** — the travel phrases you'll need most.
- **Progress** — points, daily goal, day streak, 14-day chart, 16 badges and a
  printable certificate for each completed level.
- **Settings** — French voice, speed, daily goal, theme, backup/restore.

Audio uses the browser's built-in French text-to-speech; pronunciation scoring
uses the Web Speech API (Chrome, Edge, Safari). Progress is stored in
`localStorage` on the device.

Code lives in `src/french/`; lesson content is in `src/french/content/`.
