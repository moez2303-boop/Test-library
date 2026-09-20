# Apprends — Learn French

A friendly, browser-based French vocabulary trainer. Practice with flashcards,
test yourself with quizzes, and let spaced repetition bring back the words
you're about to forget — right before you forget them.

Everything runs entirely in the browser. Your progress is stored locally in
IndexedDB — nothing is uploaded to a server.

## Features

- 10 themed lessons (greetings, numbers, colors, family, food, animals, time,
  verbs, adjectives, and travel) with ~100 words total
- Flip-card flashcards with example sentences and spoken pronunciation
  (via the browser's speech synthesis)
- A Leitner-style spaced repetition system: grade yourself "Again / Good /
  Easy" and words you know well show up less often
- A daily review queue that surfaces exactly the words that are due
- Multiple-choice quizzes per lesson to test recall
- Daily streak and mastery tracking, saved locally across sessions

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL and start learning.

## Build

```bash
npm run build
```

## Tech stack

- React + TypeScript + Vite
- Tailwind CSS v4
- `idb` for IndexedDB storage
- Web Speech API for pronunciation
