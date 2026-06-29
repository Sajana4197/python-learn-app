-- =============================================================================
-- Migration 001: Lesson content schema
-- =============================================================================
-- Run this in your Supabase project's SQL Editor (Dashboard > SQL Editor).
--
-- Design notes:
--   - `modules` and `lessons` are PUBLIC, READ-ONLY content. Every signed-in
--     or anonymous person can read them; nobody (except via the dashboard,
--     as you) can write them through the app's anon key. This is enforced
--     with RLS policies below, not just by omitting write UI.
--   - `lesson_content` is a JSONB column holding the rich body: intro,
--     explanation, visual examples, code sample, common mistakes, tips,
--     quiz, summary. Modeling this as one JSONB blob (rather than a dozen
--     separate columns or child tables) because the lesson reader UI
--     consumes it as one cohesive unit, and the shape may evolve quickly
--     during early content iteration — JSONB avoids a migration for every
--     small content-structure tweak. The exact shape is documented in
--     `src/types/lesson.ts` on the app side; keep both in sync by hand.
--   - `user_lesson_progress` is PRIVATE: each row is only readable/writable
--     by the user who owns it, enforced via RLS against `auth.uid()`.
-- =============================================================================

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  sort_order integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  slug text not null unique,
  title text not null,
  -- Short, one-line description shown on roadmap cards before opening the lesson.
  summary text not null,
  sort_order integer not null,
  estimated_minutes integer not null default 5,
  xp_reward integer not null default 10,
  -- See src/types/lesson.ts: LessonContent for the expected JSON shape.
  content jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lessons_module_id_idx on public.lessons(module_id);
create index if not exists lessons_sort_order_idx on public.lessons(module_id, sort_order);

create table if not exists public.user_lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  status text not null default 'not_started'
    check (status in ('not_started', 'in_progress', 'completed')),
  quiz_score integer,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create index if not exists user_lesson_progress_user_id_idx on public.user_lesson_progress(user_id);

-- =============================================================================
-- Row Level Security
-- =============================================================================

alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.user_lesson_progress enable row level security;

-- Modules & lessons: world-readable (including anonymous/guest users — the
-- app's anon key has no session at all for guests, and lesson content must
-- still load for them), never writable through the app's anon/authenticated
-- roles. Content changes happen via the Supabase dashboard (as the table
-- owner, bypassing RLS) or the service-role key, never the client.
create policy "modules are publicly readable"
  on public.modules for select
  using (true);

create policy "lessons are publicly readable"
  on public.lessons for select
  using (true);

-- Progress: strictly per-user. A person can only ever see or modify their
-- own rows — enforced against auth.uid(), not trusted from client input.
create policy "users can read their own progress"
  on public.user_lesson_progress for select
  using (auth.uid() = user_id);

create policy "users can insert their own progress"
  on public.user_lesson_progress for insert
  with check (auth.uid() = user_id);

create policy "users can update their own progress"
  on public.user_lesson_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =============================================================================
-- updated_at triggers
-- =============================================================================
-- Reuses the public.set_updated_at() function defined in
-- 000_profiles.sql — run that migration first.

drop trigger if exists set_lessons_updated_at on public.lessons;
create trigger set_lessons_updated_at
  before update on public.lessons
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_user_lesson_progress_updated_at on public.user_lesson_progress;
create trigger set_user_lesson_progress_updated_at
  before update on public.user_lesson_progress
  for each row
  execute function public.set_updated_at();
