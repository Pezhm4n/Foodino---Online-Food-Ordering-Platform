create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  user_name text not null check (char_length(user_name) between 1 and 100),
  rating smallint not null check (rating between 1 and 5),
  food_name text not null default '',
  comment text not null check (char_length(comment) between 3 and 1000),
  created_at timestamptz not null default now()
);

create index reviews_restaurant_id_idx on public.reviews(restaurant_id);
create index reviews_user_id_idx on public.reviews(user_id);

alter table public.reviews enable row level security;

-- همه کاربران (حتی مهمان) می‌توانند نظرات را بخوانند
create policy reviews_select_all on public.reviews for select using (true);

-- فقط کاربرانی که از این رستوران سفارش ثبت کرده‌اند می‌توانند نظر ثبت کنند
create policy reviews_insert_purchased on public.reviews for insert to authenticated with check (
  (select auth.uid()) = user_id and
  exists (
    select 1 from public.orders o
    where o.user_id = (select auth.uid())
      and o.restaurant_id = reviews.restaurant_id
      and o.status in ('confirmed', 'preparing', 'ready', 'delivering', 'delivered')
  )
);

grant select on public.reviews to anon;
grant select, insert on public.reviews to authenticated;
