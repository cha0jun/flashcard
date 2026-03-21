-- =========================================================
-- Extensions
-- =========================================================

create extension if not exists pgcrypto; -- for gen_random_uuid()

-- =========================================================
-- Tables
-- =========================================================

create table public.decks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  description text,
  created_at  timestamptz not null default now()
);

create table public.cards (
  id         uuid primary key default gen_random_uuid(),
  deck_id    uuid not null references public.decks(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  front      text not null,
  back       text not null,
  created_at timestamptz not null default now()
);

create table public.card_srs_metadata (
  card_id        uuid primary key references public.cards(id) on delete cascade,
  ease_factor    double precision not null default 2.5,
  interval_days  integer not null default 1,
  repetitions    integer not null default 0,
  next_review_at timestamptz not null default now()
);

create table public.review_logs (
  id               uuid primary key default gen_random_uuid(),
  card_id          uuid not null references public.cards(id) on delete cascade,
  user_id          uuid not null references auth.users(id) on delete cascade,
  rating           integer not null check (rating between 1 and 4),
  response_time_ms integer not null default 0,
  reviewed_at      timestamptz not null default now()
);

-- =========================================================
-- Indexes
-- =========================================================

create index on public.decks (user_id);
create index on public.cards (deck_id);
create index on public.card_srs_metadata (next_review_at);
create index on public.review_logs (card_id);

-- =========================================================
-- Row Level Security
-- =========================================================

alter table public.decks enable row level security;
alter table public.cards enable row level security;
alter table public.card_srs_metadata enable row level security;
alter table public.review_logs enable row level security;

create policy "own decks" on public.decks
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own cards" on public.cards
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own srs metadata" on public.card_srs_metadata
  for all to authenticated
  using (exists (select 1 from public.cards where id = card_id and user_id = auth.uid()))
  with check (exists (select 1 from public.cards where id = card_id and user_id = auth.uid()));

create policy "own review logs" on public.review_logs
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);