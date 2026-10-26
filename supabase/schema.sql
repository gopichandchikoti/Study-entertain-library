-- Run in the Supabase SQL editor before enabling the hosted catalog/progress phase.
-- The Node server uses the service role for server-side Storage access.

create extension if not exists pgcrypto;

insert into storage.buckets (id, name, public)
values ('study-library', 'study-library', false)
on conflict (id) do update set public = false;

create table if not exists public.library_items (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  title text not null,
  extension text not null,
  preview_kind text not null,
  mime_type text not null,
  size_bytes bigint not null default 0 check (size_bytes >= 0),
  category_path text not null default '',
  folder_path text not null default '',
  modified_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (storage_path <> ''),
  check (position('..' in storage_path) = 0),
  check (left(storage_path, 1) <> '/')
);

create index if not exists library_items_category_idx on public.library_items (category_path, folder_path);
create index if not exists library_items_modified_idx on public.library_items (modified_at desc);

create table if not exists public.reading_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  library_item_id uuid not null references public.library_items(id) on delete cascade,
  completed boolean not null default false,
  position numeric(10, 6) not null default 0 check (position >= 0 and position <= 1),
  last_opened_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, library_item_id)
);

create table if not exists public.bookmarks (
  user_id uuid not null references auth.users(id) on delete cascade,
  library_item_id uuid not null references public.library_items(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, library_item_id)
);

create table if not exists public.upload_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  storage_path text not null,
  original_name text not null,
  status text not null default 'staged' check (status in ('staged', 'committed', 'discarded', 'failed')),
  classification jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  committed_at timestamptz,
  check (position('..' in storage_path) = 0),
  check (left(storage_path, 1) <> '/')
);

alter table public.library_items enable row level security;
alter table public.reading_progress enable row level security;
alter table public.bookmarks enable row level security;
alter table public.upload_jobs enable row level security;

drop policy if exists "users read own progress" on public.reading_progress;
create policy "users read own progress" on public.reading_progress
  for select using (auth.uid() = user_id);

drop policy if exists "users write own progress" on public.reading_progress;
create policy "users write own progress" on public.reading_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "users read own bookmarks" on public.bookmarks;
create policy "users read own bookmarks" on public.bookmarks
  for select using (auth.uid() = user_id);

drop policy if exists "users write own bookmarks" on public.bookmarks;
create policy "users write own bookmarks" on public.bookmarks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Catalog and upload rows are intentionally service-role-only until Supabase Auth
-- replaces the shared-password MVP. Do not add public policies for these tables.
