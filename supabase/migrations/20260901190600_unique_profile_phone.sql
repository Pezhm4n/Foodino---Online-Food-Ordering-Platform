-- Clean up duplicate phone numbers keeping only the most recent profile
with duplicates as (
  select id, phone, row_number() over (partition by phone order by updated_at desc, id desc) as rn
  from public.profiles
  where phone is not null
)
update public.profiles
set phone = null
where id in (
  select id from duplicates where rn > 1
);

-- Enforce unique phone numbers across profiles when phone is provided
create unique index if not exists idx_profiles_phone_unique
  on public.profiles (phone)
  where phone is not null;
