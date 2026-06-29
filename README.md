# Indent

Code, line by line. An original Python-learning mobile app built with
React Native, Expo, and TypeScript.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full architecture,
brand identity rationale, and phase-by-phase build log.

## Setup

```bash
npm install
cp .env.example .env   # fill in Supabase credentials if you have a project; optional for now
npx expo start
```

Press `i` for iOS simulator, `a` for Android emulator, or `w` for web.

### Supabase setup (needed for real lesson content)

The app works without this — it just won't have any lessons to show.
To load the real "Python Fundamentals" content:

1. In your Supabase project's SQL Editor, run `supabase/migrations/000_profiles.sql`, then `supabase/migrations/001_lesson_schema.sql`, in that order. (The dashboard's SQL Editor is fine for these — they're mostly structural DDL with little prose.)
2. **Run `supabase/seed/seed.sql` via `psql`, not the dashboard SQL Editor.** The Editor's pre-execution scanner has a confirmed false-positive bug where short common English words inside lesson content (`one`, `a`, etc.) get misread as table names, throwing bogus `schema "x" does not exist` errors — see `docs/ARCHITECTURE.md` for the full writeup. `psql` bypasses this entirely:
   ```bash
   # Get your connection string from Supabase Dashboard > Project Settings > Database (use the pooler URI)
   psql "postgresql://postgres.<ref>:<password>@<host>.pooler.supabase.com:5432/postgres" -f supabase/seed/seed.sql
   ```
   You'll need `psql` installed locally (bundled with the official Postgres installer — see postgresql.org/download).
3. To regenerate `seed.sql` after editing the TypeScript content in `supabase/seed/module*.ts`, run `npx tsx supabase/seed/generate-seed-sql.ts > supabase/seed/seed.sql`.

## Scripts

| Command | Purpose |
|---|---|
| `npm start` | Start the Expo dev server |
| `npm run ios` / `npm run android` / `npm run web` | Start targeting a specific platform |
| `npm run typecheck` | Run `tsc --noEmit` |
| `npm run lint` | Run ESLint |
| `npm run validate-icons` | Check every `lucide-react-native` icon import against the installed package's real export names (see ARCHITECTURE.md — this catches a real class of silent bug `tsc`/`eslint` miss entirely) |
| `npm run format` | Run Prettier across the project |

## Environment variables

See `.env.example`. The app runs fully offline-first without Supabase
configured — cloud sync and lesson content simply stay inactive until
credentials are provided.

## Project status

Currently on **Phase 3 of 9** (lesson engine). See the phase log in
`docs/ARCHITECTURE.md` for what's built and what's next.
