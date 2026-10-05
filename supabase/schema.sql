-- EventHub database schema.
-- Run this once in: Supabase Dashboard -> SQL Editor -> New query -> Run.

-- 1. Tables ---------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role text not null default 'attendee' check (role in ('attendee', 'organizer')),
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 3 and 120),
  description text not null default '',
  category text not null,
  location text not null,
  starts_at timestamptz not null,
  capacity int not null check (capacity > 0),
  price numeric(10, 2) not null default 0 check (price >= 0),
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (event_id, user_id) -- one registration per person per event
);

create index if not exists events_starts_at_idx on public.events (starts_at);
create index if not exists registrations_user_idx on public.registrations (user_id);

-- 2. Create a profile automatically when someone signs up -------------------
-- The role comes from the sign-up form. Only 'organizer' is accepted;
-- anything else becomes 'attendee', so nobody can sign up as an admin.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    case when new.raw_user_meta_data ->> 'role' = 'organizer' then 'organizer' else 'attendee' end
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. Seat limit enforced in the database ------------------------------------
-- Locking the event row (FOR UPDATE) makes two people registering for the
-- last seat at the same moment line up one after the other.

create or replace function public.enforce_event_capacity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  cap int;
  starts timestamptz;
  taken int;
begin
  select capacity, starts_at into cap, starts
  from public.events
  where id = new.event_id
  for update;

  if starts < now() then
    raise exception 'This event has already ended.';
  end if;

  select count(*) into taken from public.registrations where event_id = new.event_id;
  if taken >= cap then
    raise exception 'This event is full.';
  end if;

  return new;
end;
$$;

drop trigger if exists check_capacity on public.registrations;
create trigger check_capacity
  before insert on public.registrations
  for each row execute function public.enforce_event_capacity();

-- 4. View with registration counts -------------------------------------------
-- Registrations are private (people only see their own), but everyone needs to
-- see how many seats are taken. This view exposes only the count.

create or replace view public.events_with_counts as
select
  e.*,
  coalesce(r.cnt, 0)::int as registered_count
from public.events e
left join (
  select event_id, count(*) as cnt
  from public.registrations
  group by event_id
) r on r.event_id = e.id;

grant select on public.events_with_counts to anon, authenticated;

-- 5. Row Level Security -------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.registrations enable row level security;

-- Profiles: names are public (shown as "Hosted by"). There is no update policy,
-- so nobody can change their own role from the browser.
drop policy if exists "Profiles are public" on public.profiles;
create policy "Profiles are public"
  on public.profiles for select using (true);

-- Events: anyone can read; only organizers can create; owners can edit/delete.
drop policy if exists "Events are public" on public.events;
create policy "Events are public"
  on public.events for select using (true);

drop policy if exists "Organizers create events" on public.events;
create policy "Organizers create events"
  on public.events for insert to authenticated
  with check (
    organizer_id = auth.uid()
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'organizer'
    )
  );

drop policy if exists "Owners update events" on public.events;
create policy "Owners update events"
  on public.events for update to authenticated
  using (organizer_id = auth.uid())
  with check (organizer_id = auth.uid());

drop policy if exists "Owners delete events" on public.events;
create policy "Owners delete events"
  on public.events for delete to authenticated
  using (organizer_id = auth.uid());

-- Registrations: people can see, create and cancel only their own.
drop policy if exists "Read own registrations" on public.registrations;
create policy "Read own registrations"
  on public.registrations for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "Register yourself" on public.registrations;
create policy "Register yourself"
  on public.registrations for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Cancel own registration" on public.registrations;
create policy "Cancel own registration"
  on public.registrations for delete to authenticated
  using (user_id = auth.uid());
