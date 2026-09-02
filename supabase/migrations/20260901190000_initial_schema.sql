create schema if not exists api;
create schema if not exists private;

create extension if not exists pgcrypto with schema extensions;
create extension if not exists pg_trgm with schema extensions;

create type public.order_status as enum (
  'pending_payment', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'canceled'
);
create type public.payment_status as enum (
  'created', 'pending', 'succeeded', 'failed', 'canceled', 'refunded'
);

create domain public.irr_amount as bigint
  check (value >= 0 and value <= 9007199254740990 and value % 10 = 0);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null default '' check (char_length(first_name) <= 80),
  last_name text not null default '' check (char_length(last_name) <= 80),
  phone text check (phone is null or phone ~ '^09[0-9]{9}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 80),
  recipient_name text not null check (char_length(recipient_name) between 1 and 160),
  recipient_phone text not null check (recipient_phone ~ '^09[0-9]{9}$'),
  province text not null,
  city text not null,
  address_line text not null check (char_length(address_line) between 5 and 500),
  postal_code text not null check (postal_code ~ '^[0-9]{10}$'),
  latitude numeric(9, 6) check (latitude between -90 and 90),
  longitude numeric(9, 6) check (longitude between -180 and 180),
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index addresses_one_default_per_user_idx
  on public.addresses(user_id) where is_default;

create table public.restaurants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 1 and 160),
  normalized_name text generated always as (lower(name)) stored,
  description text not null default '',
  logo_path text,
  cover_path text,
  rating numeric(2, 1) not null default 0 check (rating between 0 and 5),
  minimum_order_irr public.irr_amount not null default 0,
  delivery_fee_irr public.irr_amount not null default 0,
  tax_rate_bps integer not null default 900 check (tax_rate_bps between 0 and 10000),
  estimated_delivery_min integer not null default 30 check (estimated_delivery_min between 1 and 1440),
  estimated_delivery_max integer not null default 60 check (estimated_delivery_max between estimated_delivery_min and 1440),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 1 and 120),
  normalized_name text generated always as (lower(name)) stored,
  description text not null default '',
  icon text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.restaurant_categories (
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  primary key (restaurant_id, category_id)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 1 and 160),
  normalized_name text generated always as (lower(name)) stored,
  description text not null default '',
  price_irr public.irr_amount not null,
  image_path text,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  price_adjustment_irr public.irr_amount not null default 0,
  is_available boolean not null default true,
  sort_order integer not null default 0,
  unique (product_id, name)
);

create table public.product_addons (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  price_irr public.irr_amount not null default 0,
  is_available boolean not null default true,
  sort_order integer not null default 0,
  unique (product_id, name)
);

create table public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, restaurant_id)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete restrict,
  address_id uuid references public.addresses(id) on delete set null,
  restaurant_id uuid not null references public.restaurants(id) on delete restrict,
  idempotency_key uuid not null,
  status public.order_status not null default 'pending_payment',
  restaurant_name_snapshot text not null,
  address_snapshot jsonb not null check (jsonb_typeof(address_snapshot) = 'object'),
  subtotal_irr public.irr_amount not null,
  delivery_fee_irr public.irr_amount not null,
  tax_irr public.irr_amount not null,
  total_irr public.irr_amount not null,
  tracking_token_hash bytea not null unique check (octet_length(tracking_token_hash) = 32),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, idempotency_key),
  check (total_irr = subtotal_irr + delivery_fee_irr + tax_irr)
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  product_id uuid references public.products(id) on delete set null,
  product_name_snapshot text not null,
  unit_price_irr public.irr_amount not null,
  quantity smallint not null check (quantity between 1 and 99),
  variant_snapshot jsonb check (variant_snapshot is null or jsonb_typeof(variant_snapshot) = 'object'),
  addons_snapshot jsonb not null default '[]'::jsonb check (jsonb_typeof(addons_snapshot) = 'array'),
  line_total_irr public.irr_amount not null,
  check (line_total_irr = unit_price_irr * quantity)
);

create table public.order_status_history (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders(id) on delete restrict,
  actor_id uuid references auth.users(id) on delete set null,
  actor_type text not null check (actor_type in ('customer', 'operator', 'payment_system', 'system')),
  from_status public.order_status,
  to_status public.order_status not null,
  reason text check (reason is null or char_length(reason) <= 500),
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete restrict,
  provider text not null check (provider ~ '^[a-z0-9_-]+$'),
  provider_reference text,
  status public.payment_status not null default 'created',
  amount_irr public.irr_amount not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index payments_provider_reference_idx
  on public.payments(provider, provider_reference) where provider_reference is not null;

create table public.payment_events (
  id bigint generated always as identity primary key,
  payment_id uuid references public.payments(id) on delete restrict,
  provider text not null,
  provider_event_id text not null,
  event_status public.payment_status not null,
  payload_hash bytea not null check (octet_length(payload_hash) = 32),
  applied boolean not null default false,
  received_at timestamptz not null default now(),
  unique (provider, provider_event_id)
);

create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  name text not null check (char_length(name) between 2 and 160),
  email text not null check (char_length(email) <= 254),
  subject text not null check (char_length(subject) between 2 and 200),
  message text not null check (char_length(message) between 10 and 5000),
  created_at timestamptz not null default now()
);

create table private.rate_limit_buckets (
  bucket_key bytea primary key,
  window_started_at timestamptz not null,
  request_count integer not null check (request_count >= 0),
  expires_at timestamptz not null
);

create table private.audit_events (
  id bigint generated always as identity primary key,
  request_id uuid,
  actor_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  target_type text,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now()
);

create index addresses_user_id_idx on public.addresses(user_id);
create index restaurant_categories_category_id_idx on public.restaurant_categories(category_id);
create index products_restaurant_id_idx on public.products(restaurant_id);
create index products_category_id_idx on public.products(category_id);
create index product_variants_product_id_idx on public.product_variants(product_id);
create index product_addons_product_id_idx on public.product_addons(product_id);
create index favorites_restaurant_id_idx on public.favorites(restaurant_id);
create index orders_user_created_id_idx on public.orders(user_id, created_at desc, id desc);
create index orders_status_created_id_idx on public.orders(status, created_at, id);
create index orders_restaurant_id_idx on public.orders(restaurant_id);
create index orders_address_id_idx on public.orders(address_id);
create index order_items_order_id_idx on public.order_items(order_id);
create index order_items_product_id_idx on public.order_items(product_id);
create index order_status_history_order_id_idx on public.order_status_history(order_id, created_at, id);
create index payment_events_payment_id_idx on public.payment_events(payment_id);
create index contact_submissions_user_id_idx on public.contact_submissions(user_id);
create index audit_events_actor_id_idx on private.audit_events(actor_id);
create index rate_limit_buckets_expires_at_idx on private.rate_limit_buckets(expires_at);
create index products_active_restaurant_idx on public.products(restaurant_id, created_at, id)
  where is_available;
create index restaurants_name_trgm_idx on public.restaurants using gin(normalized_name extensions.gin_trgm_ops)
  where is_active;
create index products_name_trgm_idx on public.products using gin(normalized_name extensions.gin_trgm_ops)
  where is_available;
create index products_description_trgm_idx on public.products using gin(description extensions.gin_trgm_ops)
  where is_available;

alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.restaurants enable row level security;
alter table public.categories enable row level security;
alter table public.restaurant_categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_addons enable row level security;
alter table public.favorites enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.payments enable row level security;
alter table public.payment_events enable row level security;
alter table public.contact_submissions enable row level security;

alter table public.profiles force row level security;
alter table public.addresses force row level security;
alter table public.restaurants force row level security;
alter table public.categories force row level security;
alter table public.restaurant_categories force row level security;
alter table public.products force row level security;
alter table public.product_variants force row level security;
alter table public.product_addons force row level security;
alter table public.favorites force row level security;
alter table public.orders force row level security;
alter table public.order_items force row level security;
alter table public.order_status_history force row level security;
alter table public.payments force row level security;
alter table public.payment_events force row level security;
alter table public.contact_submissions force row level security;

revoke all on schema public from public;
revoke all on schema api from public;
revoke all on schema private from public;
grant usage on schema public, api to anon, authenticated, service_role;
grant usage on schema private to service_role;

revoke all on all tables in schema public from public, anon, authenticated;
revoke all on all sequences in schema public from public, anon, authenticated;
revoke all on all tables in schema private from public, anon, authenticated;
revoke all on all sequences in schema private from public, anon, authenticated;

grant select on public.restaurants, public.categories, public.restaurant_categories,
  public.products, public.product_variants, public.product_addons to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.addresses, public.favorites to authenticated;
grant select on public.orders, public.order_items, public.order_status_history to authenticated;
grant all on all tables in schema public, private to service_role;
grant all on all sequences in schema public, private to service_role;

alter default privileges in schema public revoke all on tables from public, anon, authenticated;
alter default privileges in schema public revoke all on sequences from public, anon, authenticated;
alter default privileges in schema public revoke execute on functions from public, anon, authenticated;
alter default privileges in schema api revoke execute on functions from public, anon, authenticated;
alter default privileges in schema private revoke all on tables from public, anon, authenticated;
alter default privileges in schema private revoke execute on functions from public, anon, authenticated;

create policy restaurants_active_read on public.restaurants for select to anon, authenticated
  using (is_active);
create policy categories_active_read on public.categories for select to anon, authenticated
  using (is_active);
create policy restaurant_categories_active_read on public.restaurant_categories for select to anon, authenticated
  using (
    exists (select 1 from public.restaurants r where r.id = restaurant_id and r.is_active)
    and exists (select 1 from public.categories c where c.id = category_id and c.is_active)
  );
create policy products_active_read on public.products for select to anon, authenticated
  using (is_available and exists (
    select 1 from public.restaurants r where r.id = restaurant_id and r.is_active
  ));
create policy product_variants_active_read on public.product_variants for select to anon, authenticated
  using (is_available and exists (
    select 1 from public.products p where p.id = product_id and p.is_available
  ));
create policy product_addons_active_read on public.product_addons for select to anon, authenticated
  using (is_available and exists (
    select 1 from public.products p where p.id = product_id and p.is_available
  ));

create policy profiles_own_select on public.profiles for select to authenticated
  using ((select auth.uid()) = id);
create policy profiles_own_update on public.profiles for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy addresses_own_all on public.addresses for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy favorites_own_all on public.favorites for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy orders_own_select on public.orders for select to authenticated
  using ((select auth.uid()) = user_id);
create policy order_items_own_select on public.order_items for select to authenticated
  using (exists (
    select 1 from public.orders o where o.id = order_id and o.user_id = (select auth.uid())
  ));
create policy order_history_own_select on public.order_status_history for select to authenticated
  using (exists (
    select 1 from public.orders o where o.id = order_id and o.user_id = (select auth.uid())
  ));
