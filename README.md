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

## Scripts

| Command | Purpose |
|---|---|
| `npm start` | Start the Expo dev server |
| `npm run ios` / `npm run android` / `npm run web` | Start targeting a specific platform |
| `npm run typecheck` | Run `tsc --noEmit` |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier across the project |

## Environment variables

See `.env.example`. The app runs fully offline-first without Supabase
configured — cloud sync features simply stay inactive until credentials
are provided.

## Project status

Currently on **Phase 1 of 9** (foundation). See the phase log in
`docs/ARCHITECTURE.md` for what's built and what's next.
