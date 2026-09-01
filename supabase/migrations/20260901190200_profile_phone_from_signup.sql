create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_phone text := nullif(new.raw_user_meta_data ->> 'phone', '');
begin
  if v_phone is not null and v_phone !~ '^09[0-9]{9}$' then
    v_phone := null;
  end if;

  insert into public.profiles(id, first_name, last_name, phone)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'first_name', ''), 80),
    left(coalesce(new.raw_user_meta_data ->> 'last_name', ''), 80),
    v_phone
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke execute on function private.handle_new_user() from public, anon, authenticated, service_role;
