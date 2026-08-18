-- 認証ユーザーとStripe課金状態を1対1で安全に管理する。
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  birth_date date,
  plan_type text not null default 'free',
  trial_ends_at timestamptz,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists birth_date date;
alter table public.profiles add column if not exists plan_type text not null default 'free';
alter table public.profiles add column if not exists trial_ends_at timestamptz;
alter table public.profiles add column if not exists stripe_customer_id text;
alter table public.profiles add column if not exists stripe_subscription_id text;
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

create unique index if not exists profiles_stripe_customer_id_key
  on public.profiles (stripe_customer_id) where stripe_customer_id is not null;
create unique index if not exists profiles_stripe_subscription_id_key
  on public.profiles (stripe_subscription_id) where stripe_subscription_id is not null;

alter table public.profiles enable row level security;

revoke insert, update, delete on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

-- plan_typeとStripe IDはWebhook（service_role）だけが更新する。
drop policy if exists "Users cannot change billing state" on public.profiles;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, birth_date)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    case
      when (new.raw_user_meta_data ->> 'birth_date') ~ '^\d{4}-\d{2}-\d{2}$'
      then (new.raw_user_meta_data ->> 'birth_date')::date
      else null
    end
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    birth_date = coalesce(excluded.birth_date, public.profiles.birth_date),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update of email, raw_user_meta_data on auth.users
  for each row execute procedure public.handle_new_user();

-- 既存ユーザーにもプロフィールを補完する。
insert into public.profiles (id, email, full_name, birth_date)
select
  id,
  email,
  raw_user_meta_data ->> 'full_name',
  case
    when (raw_user_meta_data ->> 'birth_date') ~ '^\d{4}-\d{2}-\d{2}$'
    then (raw_user_meta_data ->> 'birth_date')::date
    else null
  end
from auth.users
on conflict (id) do nothing;
