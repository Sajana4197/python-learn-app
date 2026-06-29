-- =============================================================================
-- Migration 000: Profiles table
-- =============================================================================
-- Run this BEFORE 001_lesson_schema.sql if starting from a fresh project.
--
-- This table was referenced in the app's TypeScript types since Phase 1/2
-- (auth) but never had a real migration behind it — this fills that gap.
-- A profile row is created automatically for every new auth user via the
-- trigger below, so the app never has to remember to create one manually
-- after sign-up.
-- =============================================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are publicly readable"
  on public.profiles for select
  using (true);

create policy "users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user is created. Username
-- defaults to the email's local part plus a short random suffix to avoid
-- collisions; the person can change it later once a Settings/profile-edit
-- screen exists (Phase 8).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    split_part(coalesce(new.email, 'user'), '@', 1) || '_' || substr(new.id::text, 1, 6)
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();
