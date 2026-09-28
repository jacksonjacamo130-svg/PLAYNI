create schema if not exists private;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
drop policy if exists "Admins can view own admin status" on public.admin_users;
create policy "Admins can view own admin status" on public.admin_users for select to authenticated using ((select auth.uid())=user_id);

create or replace function private.is_admin()
returns boolean language sql stable security definer set search_path=public,pg_temp
as $$ select exists (select 1 from public.admin_users where user_id=(select auth.uid())); $$;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated;

drop policy if exists "Admins can view profiles" on public.profiles;
create policy "Admins can view profiles" on public.profiles for select to authenticated using (private.is_admin());
drop policy if exists "Admins can update profiles" on public.profiles;
create policy "Admins can update profiles" on public.profiles for update to authenticated using (private.is_admin()) with check (private.is_admin());
drop policy if exists "Admins can view wallets" on public.wallets;
create policy "Admins can view wallets" on public.wallets for select to authenticated using (private.is_admin());
drop policy if exists "Admins can update wallets" on public.wallets;
create policy "Admins can update wallets" on public.wallets for update to authenticated using (private.is_admin()) with check (private.is_admin());
drop policy if exists "Admins can view wallet transactions" on public.wallet_transactions;
create policy "Admins can view wallet transactions" on public.wallet_transactions for select to authenticated using (private.is_admin());
drop policy if exists "Admins can view withdrawals" on public.withdrawals;
create policy "Admins can view withdrawals" on public.withdrawals for select to authenticated using (private.is_admin());
drop policy if exists "Admins can update withdrawals" on public.withdrawals;
create policy "Admins can update withdrawals" on public.withdrawals for update to authenticated using (private.is_admin()) with check (private.is_admin());
drop policy if exists "Admins can view offer catalog" on public.offer_catalog;
create policy "Admins can view offer catalog" on public.offer_catalog for select to authenticated using (private.is_admin());
drop policy if exists "Admins can update offer catalog" on public.offer_catalog;
create policy "Admins can update offer catalog" on public.offer_catalog for update to authenticated using (private.is_admin()) with check (private.is_admin());
drop policy if exists "Admins can view offer clicks" on public.offer_clicks;
create policy "Admins can view offer clicks" on public.offer_clicks for select to authenticated using (private.is_admin());
drop policy if exists "Admins can view offer conversions" on public.offer_conversions;
create policy "Admins can view offer conversions" on public.offer_conversions for select to authenticated using (private.is_admin());
drop policy if exists "Admins can update offer conversions" on public.offer_conversions;
create policy "Admins can update offer conversions" on public.offer_conversions for update to authenticated using (private.is_admin()) with check (private.is_admin());
drop policy if exists "Admins can view started offers" on public.user_offers;
create policy "Admins can view started offers" on public.user_offers for select to authenticated using (private.is_admin());
drop policy if exists "Admins can update started offers" on public.user_offers;
create policy "Admins can update started offers" on public.user_offers for update to authenticated using (private.is_admin()) with check (private.is_admin());
drop policy if exists "Admins can view offer tasks" on public.user_offer_tasks;
create policy "Admins can view offer tasks" on public.user_offer_tasks for select to authenticated using (private.is_admin());
drop policy if exists "Admins can update offer tasks" on public.user_offer_tasks;
create policy "Admins can update offer tasks" on public.user_offer_tasks for update to authenticated using (private.is_admin()) with check (private.is_admin());
grant select on public.admin_users to authenticated;
