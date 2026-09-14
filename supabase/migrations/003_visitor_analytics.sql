create table if not exists public.visitors (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  session_id text not null,
  current_path text not null default '/',
  device_type text not null default 'unknown',
  referrer text,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists visitors_visitor_id_idx
  on public.visitors (visitor_id);

create index if not exists visitors_session_id_idx
  on public.visitors (session_id);

create index if not exists visitors_last_seen_idx
  on public.visitors (last_seen desc);

alter table public.visitors enable row level security;

create policy "Visitors can create sessions"
  on public.visitors
  for insert
  to anon
  with check (true);

create policy "Visitors can update their sessions"
  on public.visitors
  for update
  to anon
  using (true)
  with check (true);

create policy "Admins can read visitors"
  on public.visitors
  for select
  to authenticated
  using (true);
