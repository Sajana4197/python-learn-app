# Indent — Architecture & Progress

> Living document. Updated at the end of every phase. This is the source of
> truth for what's been built, what's pending, and why key decisions were
> made — read this first if picking the project back up.

## What this is

**Indent** is an original Python-learning mobile app (React Native + Expo),
conceived as a from-scratch, better-designed alternative to apps like
"Learn Python: Code with AI." Not a clone — original branding, architecture,
and UX, built to fix the common complaints about existing apps (aggressive
monetization, buggy editors, weak onboarding) while keeping what works
(bite-sized lessons, in-app code execution, gamification).

## Brand identity

- **Name**: Indent — a literal core Python rule, used as the entire visual
  identity instead of a generic snake icon or neon-terminal cliché.
- **Signature visual motif**: the "indent step" — a staircase-offset left
  margin rhythm (see `src/components/ui/StepProgress.tsx`) used for lesson
  trails and onboarding progress, echoing Python's indentation requirement.
- **Palette**: warm neutrals (`ink`/`paper`/`mist`) + an amber/indigo accent
  duo, nodding to Python's own blue/yellow lineage without copying it. Full
  token list in `src/theme/tokens.ts`.
- **Type**: Sora (display), Inter (body), JetBrains Mono (code).

## Tech stack (as actually installed, verified working)

| Concern | Choice | Version |
|---|---|---|
| Framework | Expo (managed) | 56.0.12 |
| Native runtime | React Native | 0.85.3 |
| UI library | React | 19.2.3 |
| Routing | Expo Router | 56.2.11 |
| Styling | NativeWind + Tailwind | 4.2.6 + 3.4.17 (NativeWind v4 requires Tailwind v3 — v5/v4 pairing exists but isn't the stable path yet) |
| State | Zustand | 5.x |
| Local DB | expo-sqlite | 56.0.4 |
| Local KV | AsyncStorage | 2.2.0 |
| Cloud (auth/sync) | Supabase | client scaffolded Phase 1, wired Phase 2+ |
| Animation | Reanimated + Worklets | 4.3.1 + 0.8.3 |
| Gestures | react-native-gesture-handler | ~2.31.1 (see correction note below — not 3.x) |
| Forms | React Hook Form + Zod | 7.x + 4.x |
| Icons | lucide-react-native | 1.21.0 |
| TypeScript | — | ~6.0.3 |

**Correction (post-Phase-1, caught by `npx expo install --check` on a real
machine)**: the initial Phase 1 pins for `react-native-gesture-handler`
(3.0.2), `react-native-safe-area-context` (5.6.1), `react-native-webview`
(13.16.0), `react-native-svg` (15.15.5), `typescript` (5.9.2), and
`eslint-config-expo` (10.0.0) were all slightly wrong. Most notably,
gesture-handler 3.x targets RN 0.86 (not yet released to Expo); RN 0.85.3
(our actual version) needs the 2.31.x line. **Lesson for future phases**:
run `npx expo install --check` after any dependency change, on a real
machine if possible — it caught real mismatches that careful manual
`npm view` checking still missed, since compatibility isn't always fully
encoded in npm peerDependencies ranges.

**TypeScript 6.0 migration notes** (from the same correction pass):
- `tsconfig.json`'s `baseUrl` is deprecated in TS 6/7 — removed; `paths`
  alone is sufficient since they resolve relative to the tsconfig file.
- Added `global.d.ts` with `declare module '*.css'` — TS6's stricter
  module resolution flagged the `import '../global.css'` side-effect
  import in `app/_layout.tsx` as unresolvable without an explicit shim.
  (Previously this likely worked by accident via an auto-generated
  `expo-env.d.ts` that hadn't been generated yet in our sandbox; the
  explicit shim is more robust regardless.)

**Important version note**: Expo SDK 56 versions its own `expo-*` packages
(font, constants, splash-screen, sqlite, etc.) and `expo-router` in lockstep
with the SDK number (`56.0.x` / `56.2.x`), not independent semver like older
SDKs. Don't guess these from memory in later phases — check
`npm view <pkg> versions` or run `npx expo install <pkg>` to get the
SDK-aligned version.

**Babel/Reanimated note**: On Expo, do NOT add `react-native-reanimated/plugin`
or `react-native-worklets/plugin` manually to `babel.config.js`.
`babel-preset-expo` configures the Worklets Babel plugin automatically for
Reanimated 4. Adding it manually double-transforms worklets.

**Hoisting note**: `babel-preset-expo` and `@expo/metro-runtime` must be
explicit top-level dependencies (not just transitive deps of `expo`) or
Metro's static export fails to resolve them. Both are pinned in
`package.json`.

## Folder architecture

```
app/                        Expo Router routes (thin — logic lives in src/features)
  (onboarding)/              welcome, goal
  (auth)/                    sign-in (placeholder until Phase 2)
  (tabs)/                    home, roadmap, editor, profile
  lesson/[id].tsx            dynamic lesson route (placeholder until Phase 3)
  _layout.tsx                root layout: fonts, theme, error boundary, splash

src/
  components/
    ui/                      Text, Button, Card, StepProgress — themed primitives
    feedback/                Skeleton, EmptyState, ErrorBoundary, PlaceholderScreen
  features/                  one folder per product feature, screen components live here
    onboarding/, home/, auth/ (skeleton), ...
  services/
    supabase/                client singleton + hand-maintained DB types
    storage/                 SQLite migrations + AsyncStorage preference helpers
  store/                     Zustand stores (sessionStore, appReadinessStore, ...)
  theme/                     tokens.ts (colors/spacing/type) + ThemeProvider
  types/, utils/, hooks/, navigation/   (scaffolded, populated as features need them)

assets/images/               brand placeholder icons (real assets pending design phase)
docs/                        this file
```

**Rule**: route files under `app/` are thin — they import and re-export a
component from `src/features/<feature>/`. All real logic, state, and JSX
lives in the feature folder. This keeps routing and business logic
separated per the project's architecture rules.

## State management pattern

Each Zustand store is small and single-purpose (`sessionStore`,
`appReadinessStore`, more added per phase). No single mega-store. Stores
that need persistence go through `services/storage`, never call
AsyncStorage/SQLite directly inline in components.

## Local persistence strategy

- **SQLite** (`services/storage/database.ts`): structured/relational data —
  lessons, progress, notes, achievements. Versioned migrations via
  `PRAGMA user_version`, additive only.
- **AsyncStorage** (`services/storage/preferences.ts`): small flags/prefs
  only (theme mode, onboarding-completed flag). Centralized key registry
  in `storageKeys` — no scattered magic strings.

## Cloud sync strategy

Supabase client is configured in Phase 1 but the app does **not** require
it to function — `isSupabaseConfigured` is checked at runtime, and
auth/sync screens degrade gracefully (see `(auth)/sign-in.tsx`'s "Continue
as guest" path) when no project is connected. Real auth flow lands in
Phase 2.

## Python execution strategy (for Phase 4)

Decision: **Pyodide** (WASM Python) running inside a hidden
`react-native-webview`, bridging stdout/stderr back to the editor via
`postMessage`. This is the only realistic way to run real, offline-capable
Python on-device without a paid backend. Architecture for this lands in
Phase 4 — noting it here now so the decision isn't lost.

## AI tutor strategy (for Phase 7)

**Decision (revised): self-hosted Ollama, not third-party free-tier APIs.**

Free tiers (Groq, HF Inference, Gemini free) were rejected because their
rate limits/quotas are unacceptable for this product, even though they
cost nothing. Instead, the AI Tutor talks to an Ollama server that you
provision and run yourself (a VPS, home machine, or cloud GPU box — outside
this app's codebase). This gives full control over throughput with no
third-party throttling, at the cost of taking on hosting/uptime
responsibility yourself.

**What this changes architecturally:**

- The AI service interface (`src/services/ai/`, built in Phase 7) targets
  an **Ollama-compatible HTTP endpoint** — Ollama exposes both a native
  `/api/chat` endpoint and an OpenAI-compatible `/v1/chat/completions`
  endpoint. We'll use the OpenAI-compatible one since it's the more
  portable shape if the backend ever changes.
- The server URL is configured via `EXPO_PUBLIC_OLLAMA_BASE_URL`
  (env var, same pattern as Supabase) — never hardcoded, so it's
  swappable without a rebuild.
- **The AI Tutor becomes the one feature in the app with a hard server
  dependency.** Every other feature is offline-first; this one isn't, and
  that's a deliberate, accepted tradeoff. The UI must fail soft — a clear
  "tutor's offline right now" state — rather than crash or hang when the
  Ollama server is unreachable (sleeping, redeploying, down, or simply not
  yet configured by the person running their own instance).
- No multi-provider abstraction is needed — one adapter, one backend
  shape, since there's only one provider now (your Ollama server).
  Simpler than the original multi-provider plan.
- Model choice (e.g. `llama3.1:8b`, `qwen2.5:7b`, or a code-specialized
  model) is decided in Phase 7 once we know the exact tutoring/explainer
  prompts we need to support — noted here so the decision isn't lost
  before then.
- Cost note for whoever reads this later: this is not actually free —
  you're trading API fees for server hosting costs. The win is rate-limit
  control and data staying on infrastructure you own, not zero cost.

## Phase log

### ✅ Phase 1 — Foundation (complete)
- Project scaffolded: Expo + TypeScript + Expo Router + NativeWind + Zustand.
- Design system established: tokens, light/dark themes, typography, the
  "indent step" signature motif.
- Reusable UI kit: Text, Button, Card, StepProgress, Skeleton, EmptyState,
  ErrorBoundary, PlaceholderScreen.
- Full navigation skeleton: onboarding → auth/tabs, bottom tab bar, dynamic
  lesson route — all routes verified to resolve via a real Metro export.
- Supabase client + DB type skeleton (no live project wired up yet).
- SQLite local DB with migration runner; AsyncStorage preference helper.
- Verified: `tsc --noEmit` clean, `eslint` clean, `expo export --platform
  web` produces a working bundle with all 18 expected routes.

### ⬜ Phase 2 — Authentication, onboarding completion, splash, bottom nav polish
### ⬜ Phase 3 — Learning roadmap, lesson engine, lesson UI, progress tracking
### ⬜ Phase 4 — Interactive code editor, Pyodide execution, console, error handling
### ⬜ Phase 5 — Quizzes, challenges, gamification, XP, achievements
### ⬜ Phase 6 — Projects, bookmarks, notes, search, offline mode
### ⬜ Phase 7 — AI tutor, AI error explainer, recommendations
### ⬜ Phase 8 — Profile, certificates, interview prep, settings, cloud sync
### ⬜ Phase 9 — Optimization, animations, accessibility, testing, store polish
