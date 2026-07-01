create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  city text,
  participation_type text not null,
  services jsonb not null default '[]'::jsonb,
  total_amount integer not null,
  notes text
);

alter table public.bookings enable row level security;

drop policy if exists "Allow public insert" on public.bookings;

create policy "Allow public insert"
  on public.bookings
  for insert
  to anon
  with check (true);
