create table if not exists public.user_offers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null,
  external_offer_id text not null,
  title text not null,
  description text not null default '',
  icon_url text,
  landing_url text,
  category text not null default 'Oferta',
  platform text not null default 'unknown',
  reward_coins bigint not null default 0 check (reward_coins >= 0),
  days_limit integer,
  started_at timestamptz not null default now(),
  deadline_at timestamptz,
  install_confirmed boolean not null default false,
  progress_percent numeric(5,2) not null default 0 check (progress_percent >= 0 and progress_percent <= 100),
  status text not null default 'active' check (status in ('active','completed','expired')),
  last_activity_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider, external_offer_id)
);

create table if not exists public.user_offer_tasks (
  id uuid primary key default gen_random_uuid(),
  user_offer_id uuid not null references public.user_offers(id) on delete cascade,
  external_task_id text,
  name text not null,
  reward_coins bigint check (reward_coins is null or reward_coins >= 0),
  status text not null default 'pending' check (status in ('pending','completed','credited')),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_offers_user_status_idx on public.user_offers(user_id, status);
create index if not exists user_offer_tasks_offer_idx on public.user_offer_tasks(user_offer_id);

alter table public.user_offers enable row level security;
alter table public.user_offer_tasks enable row level security;

drop policy if exists "Users can view own started offers" on public.user_offers;
create policy "Users can view own started offers" on public.user_offers
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Users can start offers for themselves" on public.user_offers;
create policy "Users can start offers for themselves" on public.user_offers
  for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own started offers" on public.user_offers;
create policy "Users can update own started offers" on public.user_offers
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own started offers" on public.user_offers;
create policy "Users can delete own started offers" on public.user_offers
  for delete to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Users can view own offer tasks" on public.user_offer_tasks;
create policy "Users can view own offer tasks" on public.user_offer_tasks
  for select to authenticated
  using (exists (
    select 1 from public.user_offers uo
    where uo.id = user_offer_tasks.user_offer_id
      and uo.user_id = (select auth.uid())
  ));

drop policy if exists "Users can create tasks for own offers" on public.user_offer_tasks;
create policy "Users can create tasks for own offers" on public.user_offer_tasks
  for insert to authenticated
  with check (exists (
    select 1 from public.user_offers uo
    where uo.id = user_offer_tasks.user_offer_id
      and uo.user_id = (select auth.uid())
  ));

drop policy if exists "Users can update tasks for own offers" on public.user_offer_tasks;
create policy "Users can update tasks for own offers" on public.user_offer_tasks
  for update to authenticated
  using (exists (
    select 1 from public.user_offers uo
    where uo.id = user_offer_tasks.user_offer_id
      and uo.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.user_offers uo
    where uo.id = user_offer_tasks.user_offer_id
      and uo.user_id = (select auth.uid())
  ));

grant select, insert, update, delete on public.user_offers to authenticated;
grant select, insert, update on public.user_offer_tasks to authenticated;