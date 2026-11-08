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

## Kotoba Dico — dictionnaire japonais–français (`/dico/`)

An offline Japanese → French dictionary app, in French, at `dico/index.html`.

- Search by kanji, kana, romaji **or French** (`猫`, `ねこ`, `neko`, `chat`)
- Conjugated forms are traced back to the dictionary form (`食べなかった` → `食べる`)
- Sentences are split into words you can tap (`猫が好きです`)
- Word pages: furigana, French senses (with English on request), conjugation tables, audio
- Kanji pages: animated stroke order, on/kun readings, French meanings, words using the kanji
- Lists (favourites and your own), CSV export for Anki, spaced-repetition flashcards
- Installs once (~15 MB) into IndexedDB and then works offline (service worker for the app shell)

The data in `public/dico/data/` (211,689 words, 12,633 kanji) is built by
`scripts/build_dico.py` from the CC BY-SA Jiyomi Japanese → French dictionary
(JMdict + KANJIDIC2 + KanjiVG with French senses). See
`public/dico/data/LICENSE.md` for attribution; the data stays under CC BY-SA.
