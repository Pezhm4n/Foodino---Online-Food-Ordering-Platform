create or replace function private.is_operator()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce((select auth.jwt() -> 'app_metadata' ->> 'role') = 'operator', false);
$$;

create or replace function private.order_transition_allowed(
  p_from public.order_status,
  p_to public.order_status
)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select case p_from
    when 'pending_payment' then p_to in ('confirmed', 'canceled')
    when 'confirmed' then p_to in ('preparing', 'canceled')
    when 'preparing' then p_to in ('ready', 'canceled')
    when 'ready' then p_to in ('delivering', 'canceled')
    when 'delivering' then p_to = 'delivered'
    else false
  end;
$$;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function private.set_updated_at();
create trigger addresses_set_updated_at before update on public.addresses
  for each row execute function private.set_updated_at();
create trigger restaurants_set_updated_at before update on public.restaurants
  for each row execute function private.set_updated_at();
create trigger products_set_updated_at before update on public.products
  for each row execute function private.set_updated_at();
create trigger orders_set_updated_at before update on public.orders
  for each row execute function private.set_updated_at();
create trigger payments_set_updated_at before update on public.payments
  for each row execute function private.set_updated_at();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles(id, first_name, last_name)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'first_name', ''), 80),
    left(coalesce(new.raw_user_meta_data ->> 'last_name', ''), 80)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

create policy orders_operator_select on public.orders for select to authenticated
  using ((select private.is_operator()));
create policy order_items_operator_select on public.order_items for select to authenticated
  using ((select private.is_operator()));
create policy order_history_operator_select on public.order_status_history for select to authenticated
  using ((select private.is_operator()));

create or replace function api.create_pending_order(
  p_address_id uuid,
  p_restaurant_id uuid,
  p_idempotency_key uuid,
  p_items jsonb
)
returns table(order_id uuid, tracking_token text, reused boolean)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_order_id uuid;
  v_existing_id uuid;
  v_tracking_token text;
  v_tracking_hash bytea;
  v_restaurant public.restaurants%rowtype;
  v_address public.addresses%rowtype;
  v_item record;
  v_product public.products%rowtype;
  v_variant public.product_variants%rowtype;
  v_addons jsonb;
  v_addons_total bigint;
  v_unit_price bigint;
  v_subtotal bigint := 0;
  v_tax bigint;
  v_total bigint;
begin
  if v_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  select o.id into v_existing_id
  from public.orders o
  where o.user_id = v_user_id and o.idempotency_key = p_idempotency_key;
  if v_existing_id is not null then
    return query select v_existing_id, null::text, true;
    return;
  end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) not between 1 and 100 then
    raise exception 'invalid_items' using errcode = '22023';
  end if;

  select * into v_address from public.addresses a
  where a.id = p_address_id and a.user_id = v_user_id;
  if not found then
    raise exception 'address_not_found' using errcode = '42501';
  end if;

  select * into v_restaurant from public.restaurants r
  where r.id = p_restaurant_id and r.is_active
  for share;
  if not found then
    raise exception 'restaurant_unavailable' using errcode = '22023';
  end if;

  perform p.id
  from public.products p
  where p.id in (
    select x.product_id
    from jsonb_to_recordset(p_items) as x(product_id uuid, variant_id uuid, addon_ids uuid[], quantity integer)
  )
  order by p.id
  for share;

  for v_item in
    select * from jsonb_to_recordset(p_items)
      as x(product_id uuid, variant_id uuid, addon_ids uuid[], quantity integer)
  loop
    if v_item.product_id is null or v_item.quantity not between 1 and 99 then
      raise exception 'invalid_cart_item' using errcode = '22023';
    end if;

    select * into v_product from public.products p
    where p.id = v_item.product_id
      and p.restaurant_id = p_restaurant_id
      and p.is_available;
    if not found then
      raise exception 'product_unavailable' using errcode = '22023';
    end if;

    v_unit_price := v_product.price_irr;
    v_variant := null;
    if v_item.variant_id is not null then
      select * into v_variant from public.product_variants pv
      where pv.id = v_item.variant_id and pv.product_id = v_product.id and pv.is_available;
      if not found then
        raise exception 'variant_unavailable' using errcode = '22023';
      end if;
      v_unit_price := v_unit_price + v_variant.price_adjustment_irr;
    end if;

    select coalesce(sum(pa.price_irr), 0),
      coalesce(jsonb_agg(jsonb_build_object('id', pa.id, 'name', pa.name, 'priceIrr', pa.price_irr)
        order by pa.id), '[]'::jsonb)
      into v_addons_total, v_addons
    from public.product_addons pa
    where pa.id = any(coalesce(v_item.addon_ids, '{}'::uuid[]))
      and pa.product_id = v_product.id and pa.is_available;

    if coalesce(cardinality(v_item.addon_ids), 0) <> jsonb_array_length(v_addons) then
      raise exception 'addon_unavailable' using errcode = '22023';
    end if;

    v_unit_price := v_unit_price + v_addons_total;
    v_subtotal := v_subtotal + (v_unit_price * v_item.quantity);
  end loop;

  if v_subtotal < v_restaurant.minimum_order_irr then
    raise exception 'minimum_order_not_met' using errcode = '22023';
  end if;

  v_tax := round((v_subtotal * v_restaurant.tax_rate_bps / 10000.0) / 10) * 10;
  v_total := v_subtotal + v_restaurant.delivery_fee_irr + v_tax;
  v_tracking_token := rtrim(translate(encode(extensions.gen_random_bytes(32), 'base64'), '+/', '-_'), '=');
  v_tracking_hash := extensions.digest(convert_to(v_tracking_token, 'utf8'), 'sha256');

  insert into public.orders(
    user_id, address_id, restaurant_id, idempotency_key, restaurant_name_snapshot,
    address_snapshot, subtotal_irr, delivery_fee_irr, tax_irr, total_irr, tracking_token_hash
  ) values (
    v_user_id, p_address_id, p_restaurant_id, p_idempotency_key, v_restaurant.name,
    jsonb_build_object(
      'title', v_address.title, 'recipientName', v_address.recipient_name,
      'recipientPhone', v_address.recipient_phone, 'province', v_address.province,
      'city', v_address.city, 'addressLine', v_address.address_line,
      'postalCode', v_address.postal_code, 'latitude', v_address.latitude,
      'longitude', v_address.longitude
    ),
    v_subtotal, v_restaurant.delivery_fee_irr, v_tax, v_total, v_tracking_hash
  ) returning id into v_order_id;

  for v_item in
    select * from jsonb_to_recordset(p_items)
      as x(product_id uuid, variant_id uuid, addon_ids uuid[], quantity integer)
  loop
    select * into v_product from public.products p where p.id = v_item.product_id;
    v_unit_price := v_product.price_irr;
    v_variant := null;
    if v_item.variant_id is not null then
      select * into v_variant from public.product_variants pv where pv.id = v_item.variant_id;
      v_unit_price := v_unit_price + v_variant.price_adjustment_irr;
    end if;
    select coalesce(sum(pa.price_irr), 0),
      coalesce(jsonb_agg(jsonb_build_object('id', pa.id, 'name', pa.name, 'priceIrr', pa.price_irr)
        order by pa.id), '[]'::jsonb)
      into v_addons_total, v_addons
    from public.product_addons pa
    where pa.id = any(coalesce(v_item.addon_ids, '{}'::uuid[]));
    v_unit_price := v_unit_price + v_addons_total;

    insert into public.order_items(
      order_id, product_id, product_name_snapshot, unit_price_irr, quantity,
      variant_snapshot, addons_snapshot, line_total_irr
    ) values (
      v_order_id, v_product.id, v_product.name, v_unit_price, v_item.quantity,
      case when v_variant.id is null then null else jsonb_build_object(
        'id', v_variant.id, 'name', v_variant.name,
        'priceAdjustmentIrr', v_variant.price_adjustment_irr
      ) end,
      v_addons, v_unit_price * v_item.quantity
    );
  end loop;

  insert into public.payments(order_id, provider, status, amount_irr)
  values (v_order_id, 'pending_assignment', 'created', v_total);

  insert into public.order_status_history(order_id, actor_id, actor_type, to_status)
  values (v_order_id, v_user_id, 'customer', 'pending_payment');

  insert into private.audit_events(actor_id, event_type, target_type, target_id)
  values (v_user_id, 'checkout.order_created', 'order', v_order_id);

  return query select v_order_id, v_tracking_token, false;
exception
  when unique_violation then
    select o.id into v_existing_id from public.orders o
    where o.user_id = v_user_id and o.idempotency_key = p_idempotency_key;
    if v_existing_id is not null then
      return query select v_existing_id, null::text, true;
      return;
    end if;
    raise;
end;
$$;

create or replace function api.apply_payment_event(
  p_provider text,
  p_provider_event_id text,
  p_provider_reference text,
  p_status public.payment_status,
  p_amount_irr bigint,
  p_payload_hash bytea
)
returns table(applied boolean, order_id uuid, order_status public.order_status)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_payment public.payments%rowtype;
  v_order public.orders%rowtype;
  v_event_id bigint;
begin
  if (select auth.role()) <> 'service_role' then
    raise exception 'service_role_required' using errcode = '42501';
  end if;
  if p_status not in ('succeeded', 'failed', 'canceled') then
    raise exception 'invalid_payment_event' using errcode = '22023';
  end if;
  if octet_length(p_payload_hash) <> 32 then
    raise exception 'invalid_payload_hash' using errcode = '22023';
  end if;

  insert into public.payment_events(provider, provider_event_id, event_status, payload_hash)
  values (p_provider, p_provider_event_id, p_status, p_payload_hash)
  on conflict (provider, provider_event_id) do nothing
  returning id into v_event_id;
  if v_event_id is null then
    return query select false, null::uuid, null::public.order_status;
    return;
  end if;

  select * into v_payment from public.payments p
  where p.provider = p_provider and p.provider_reference = p_provider_reference
  for update;
  if not found then
    return query select false, null::uuid, null::public.order_status;
    return;
  end if;

  update public.payment_events set payment_id = v_payment.id where id = v_event_id;
  select * into v_order from public.orders o where o.id = v_payment.order_id for update;

  if v_payment.status <> 'pending' or v_order.status <> 'pending_payment' then
    return query select false, v_order.id, v_order.status;
    return;
  end if;
  if p_amount_irr <> v_payment.amount_irr then
    raise exception 'payment_amount_mismatch' using errcode = '22023';
  end if;

  update public.payments set status = p_status where id = v_payment.id;
  if p_status = 'succeeded' then
    update public.orders set status = 'confirmed' where id = v_order.id;
    insert into public.order_status_history(
      order_id, actor_type, from_status, to_status, reason
    ) values (v_order.id, 'payment_system', 'pending_payment', 'confirmed', 'verified payment callback');
    v_order.status := 'confirmed';
  else
    update public.orders set status = 'canceled' where id = v_order.id;
    insert into public.order_status_history(
      order_id, actor_type, from_status, to_status, reason
    ) values (v_order.id, 'payment_system', 'pending_payment', 'canceled', 'payment failed or canceled');
    v_order.status := 'canceled';
  end if;
  update public.payment_events set applied = true where id = v_event_id;
  insert into private.audit_events(event_type, target_type, target_id, metadata)
  values ('payment.callback_applied', 'order', v_order.id, jsonb_build_object('status', p_status));
  return query select true, v_order.id, v_order.status;
end;
$$;

create or replace function api.transition_order_status(
  p_order_id uuid,
  p_to_status public.order_status,
  p_reason text default null
)
returns public.order_status
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_order public.orders%rowtype;
begin
  if v_user_id is null or not (select private.is_operator()) then
    raise exception 'operator_required' using errcode = '42501';
  end if;
  if p_reason is not null and char_length(p_reason) > 500 then
    raise exception 'reason_too_long' using errcode = '22023';
  end if;

  select * into v_order from public.orders o where o.id = p_order_id for update;
  if not found then raise exception 'order_not_found' using errcode = 'P0002'; end if;
  if not private.order_transition_allowed(v_order.status, p_to_status) then
    raise exception 'invalid_order_transition' using errcode = '22023';
  end if;

  update public.orders set status = p_to_status where id = p_order_id;
  insert into public.order_status_history(
    order_id, actor_id, actor_type, from_status, to_status, reason
  ) values (p_order_id, v_user_id, 'operator', v_order.status, p_to_status, p_reason);
  insert into private.audit_events(actor_id, event_type, target_type, target_id, metadata)
  values (v_user_id, 'operator.order_transition', 'order', p_order_id,
    jsonb_build_object('from', v_order.status, 'to', p_to_status));
  return p_to_status;
end;
$$;

create or replace function api.cancel_own_order(
  p_order_id uuid,
  p_reason text default null
)
returns public.order_status
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_order public.orders%rowtype;
begin
  if v_user_id is null then raise exception 'authentication_required' using errcode = '42501'; end if;
  if p_reason is not null and char_length(p_reason) > 500 then
    raise exception 'reason_too_long' using errcode = '22023';
  end if;

  select * into v_order from public.orders o
  where o.id = p_order_id and o.user_id = v_user_id for update;
  if not found then raise exception 'order_not_found' using errcode = 'P0002'; end if;
  if v_order.status not in ('pending_payment', 'confirmed') then
    raise exception 'order_cancel_not_allowed' using errcode = '22023';
  end if;

  update public.orders set status = 'canceled' where id = p_order_id;
  update public.payments set status = 'canceled'
    where order_id = p_order_id and status in ('created', 'pending');
  insert into public.order_status_history(
    order_id, actor_id, actor_type, from_status, to_status, reason
  ) values (p_order_id, v_user_id, 'customer', v_order.status, 'canceled', p_reason);
  return 'canceled'::public.order_status;
end;
$$;

create or replace function api.get_public_tracking(p_token text)
returns table(
  status public.order_status,
  restaurant_name text,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select o.status, o.restaurant_name_snapshot, o.created_at, o.updated_at
  from public.orders o
  where o.tracking_token_hash = extensions.digest(convert_to(p_token, 'utf8'), 'sha256')
  limit 1;
$$;

revoke execute on function private.is_operator() from public, anon;
revoke execute on function private.order_transition_allowed(public.order_status, public.order_status)
  from public, anon, authenticated, service_role;
revoke execute on function private.set_updated_at() from public, anon, authenticated, service_role;
revoke execute on function private.handle_new_user() from public, anon, authenticated, service_role;
grant usage on schema private to authenticated;
grant execute on function private.is_operator() to authenticated;

revoke execute on function api.create_pending_order(uuid, uuid, uuid, jsonb) from public, anon;
grant execute on function api.create_pending_order(uuid, uuid, uuid, jsonb) to authenticated;
revoke execute on function api.apply_payment_event(text, text, text, public.payment_status, bigint, bytea)
  from public, anon, authenticated;
grant execute on function api.apply_payment_event(text, text, text, public.payment_status, bigint, bytea)
  to service_role;
revoke execute on function api.transition_order_status(uuid, public.order_status, text) from public, anon;
grant execute on function api.transition_order_status(uuid, public.order_status, text) to authenticated;
revoke execute on function api.cancel_own_order(uuid, text) from public, anon;
grant execute on function api.cancel_own_order(uuid, text) to authenticated;
revoke execute on function api.get_public_tracking(text) from public;
grant execute on function api.get_public_tracking(text) to anon, authenticated, service_role;
