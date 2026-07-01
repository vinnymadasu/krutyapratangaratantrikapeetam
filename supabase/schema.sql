-- Run this once in the Supabase Dashboard: Project (ledchnydbjfxnwzixejl) -> SQL Editor -> New query.
-- Creates the bookings table used by the website's booking form, and locks
-- it down with Row Level Security so the public (anon/publishable) key can
-- only INSERT new rows -- it cannot read, update, or delete anyone's data.
-- Reading the bookings should be done from the Supabase Table Editor (or
-- with the secret key from a trusted, non-public environment), never from
-- the website itself.

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

-- No select/update/delete policy is created for anon on purpose, so the
-- publishable key embedded in the site cannot read back other customers'
-- bookings.
