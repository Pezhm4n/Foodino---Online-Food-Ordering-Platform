drop function api.get_public_tracking(text);

create function api.get_public_tracking(p_token text)
returns table (
  status public.order_status,
  restaurant_name text,
  created_at timestamptz,
  updated_at timestamptz,
  is_demo boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  select o.status, o.restaurant_name_snapshot, o.created_at, o.updated_at,
    coalesce(p.provider = 'demo', false)
  from public.orders o
  left join public.payments p on p.order_id = o.id
  where o.tracking_token_hash = extensions.digest(convert_to(p_token, 'utf8'), 'sha256')
  limit 1;
$$;

revoke execute on function api.get_public_tracking(text) from public;
grant execute on function api.get_public_tracking(text) to anon, authenticated, service_role;
