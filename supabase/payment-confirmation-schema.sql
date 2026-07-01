alter table public.bookings
  add column if not exists booking_ref text;

create table if not exists public.payment_confirmations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  booking_ref text not null,
  name text not null,
  phone text not null,
  transaction_reference text not null,
  screenshot_path text,
  notes text
);

alter table public.payment_confirmations enable row level security;

drop policy if exists "Allow public insert" on public.payment_confirmations;

create policy "Allow public insert"
  on public.payment_confirmations
  for insert
  to anon
  with check (true);

insert into storage.buckets (id, name, public)
values ('payment-screenshots', 'payment-screenshots', false)
on conflict (id) do nothing;

drop policy if exists "Allow public upload to payment-screenshots" on storage.objects;

create policy "Allow public upload to payment-screenshots"
  on storage.objects
  for insert
  to anon
  with check (bucket_id = 'payment-screenshots');
