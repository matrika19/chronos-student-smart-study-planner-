# Chronos & Canvas

Neo-brutalist paper notebook for AIML III-C (REVA): timetable, attendance bunk-bank, exam reverse-solver, focus timer, and a mock squad canvas. Data lives in `lib/repo.ts` (Zustand + localStorage) so Supabase can replace it later.

## Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Demo data loads automatically on first visit — no API key required.

## Environment

Copy `.env.local.example` to `.env.local`:

- `GEMINI_API_KEY` — required only for timetable photo OCR (`POST /api/ocr`)
- `GEMINI_MODEL` — defaults to `gemini-2.0-flash`

Never put the key in client code.

## Scripts

- `npm run dev` — local server
- `npm run build` — production build
- Optional engine checks: `npx tsx lib/engine.test.ts` (tsx is not installed)

## Deploy (Vercel)

1. Push this folder to GitHub and import in Vercel.
2. Add `GEMINI_API_KEY` (and optional `GEMINI_MODEL`) in project Environment Variables.
3. Deploy. OCR stays server-side; the rest works offline in the browser.

## Limitations

OCR needs a valid Gemini key. Squad peers are a local mock (`lib/squad.ts`). No database in v1.
