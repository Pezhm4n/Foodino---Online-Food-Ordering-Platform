alter table public.orders
  drop constraint orders_check,
  add column coupon_code text,
  add column discount_irr public.irr_amount not null default 0,
  add column order_note text check (char_length(order_note) <= 500),
  add column checkout_request_hash bytea check (octet_length(checkout_request_hash) = 32),
  add constraint orders_discount_requires_coupon check (coupon_code is not null or discount_irr = 0),
  add constraint orders_total_check
    check (total_irr = subtotal_irr + delivery_fee_irr + tax_irr - discount_irr);

alter table public.order_items
  add column note text check (char_length(note) <= 500);

create function private.checkout_price(p_restaurant_id uuid, p_items jsonb, p_coupon_code text, p_user_id uuid)
returns table (
  restaurant_name text, subtotal_irr bigint, delivery_fee_irr bigint, tax_irr bigint,
  coupon_code text, discount_irr bigint, total_irr bigint, priced_items jsonb
)
language plpgsql
set search_path = ''
as $$
declare
  v_restaurant public.restaurants%rowtype;
  v_item record;
  v_product public.products%rowtype;
  v_variant public.product_variants%rowtype;
  v_addons jsonb;
  v_addons_total numeric;
  v_unit_price numeric;
  v_subtotal numeric := 0;
  v_tax numeric;
  v_discount numeric := 0;
  v_total numeric;
  v_code text := nullif(upper(btrim(p_coupon_code)), '');
  v_items jsonb := '[]'::jsonb;
begin
  if p_items is null or jsonb_typeof(p_items) <> 'array' then
    raise exception 'invalid_items' using errcode = '22023';
  end if;
  if jsonb_array_length(p_items) not between 1 and 100 then
    raise exception 'invalid_items' using errcode = '22023';
  end if;

  select * into v_restaurant from public.restaurants r
  where r.id = p_restaurant_id and r.is_active for share;
  if not found then
    raise exception 'restaurant_unavailable' using errcode = '22023';
  end if;

  perform p.id from public.products p
  where p.id in (
    select x.product_id from jsonb_to_recordset(p_items) as x(product_id uuid)
  ) order by p.id for share;

  for v_item in
    select * from jsonb_to_recordset(p_items)
      as x(product_id uuid, variant_id uuid, addon_ids uuid[], quantity integer, note text)
  loop
    if v_item.product_id is null or v_item.quantity is null or v_item.quantity not between 1 and 99
      or coalesce(cardinality(v_item.addon_ids), 0) > 20 or char_length(v_item.note) > 500 then
      raise exception 'invalid_cart_item' using errcode = '22023';
    end if;

    select * into v_product from public.products p
    where p.id = v_item.product_id and p.restaurant_id = p_restaurant_id and p.is_available;
    if not found then
      raise exception 'product_unavailable' using errcode = '22023';
    end if;

    v_unit_price := v_product.price_irr;
    v_variant := null;
    if v_item.variant_id is not null then
      select * into v_variant from public.product_variants pv
      where pv.id = v_item.variant_id and pv.product_id = v_product.id and pv.is_available
      for share;
      if not found then
        raise exception 'variant_unavailable' using errcode = '22023';
      end if;
      v_unit_price := v_unit_price + v_variant.price_adjustment_irr;
    end if;

    select coalesce(sum(pa.price_irr), 0),
      coalesce(jsonb_agg(jsonb_build_object('id', pa.id, 'name', pa.name, 'priceIrr', pa.price_irr)
        order by pa.id), '[]'::jsonb)
      into v_addons_total, v_addons
    from (
      select a.id, a.name, a.price_irr from public.product_addons a
      where a.id = any(coalesce(v_item.addon_ids, '{}'::uuid[]))
        and a.product_id = v_product.id and a.is_available
      order by a.id for share
    ) pa;

    if coalesce(cardinality(v_item.addon_ids), 0) <> jsonb_array_length(v_addons) then
      raise exception 'addon_unavailable' using errcode = '22023';
    end if;

    v_unit_price := v_unit_price + v_addons_total;
    v_subtotal := v_subtotal + v_unit_price * v_item.quantity;
    v_items := v_items || jsonb_build_array(jsonb_build_object(
      'product_id', v_product.id, 'product_name_snapshot', v_product.name,
      'unit_price_irr', v_unit_price, 'quantity', v_item.quantity,
      'variant_snapshot', case when v_variant.id is null then null else jsonb_build_object(
        'id', v_variant.id, 'name', v_variant.name, 'priceAdjustmentIrr', v_variant.price_adjustment_irr
      ) end, 'addons_snapshot', v_addons, 'line_total_irr', v_unit_price * v_item.quantity,
      'note', nullif(btrim(v_item.note), '')
    ));
  end loop;

  if v_subtotal < v_restaurant.minimum_order_irr then
    raise exception 'minimum_order_not_met' using errcode = '22023';
  end if;

  case v_code
    when 'FOODINO' then
      if v_subtotal < 1000000 then
        raise exception 'coupon_minimum_not_met' using errcode = '22023';
      end if;
      v_discount := least(round(v_subtotal * 20 / 1000) * 10, 500000);
    when 'WELCOME' then
      if exists (
        select 1 from public.orders o
        left join public.payments p on p.order_id = o.id
        where o.user_id = p_user_id and (o.status <> 'canceled' or p.status in ('succeeded', 'refunded'))
      ) then
        raise exception 'coupon_first_order_only' using errcode = '22023';
      end if;
      v_discount := least(round(v_subtotal * 15 / 1000) * 10, 1000000);
    when 'TASTY10' then
      v_discount := least(round(v_subtotal * 10 / 1000) * 10, 300000);
    when 'FREESHIP' then
      v_discount := v_restaurant.delivery_fee_irr;
    else
      if v_code is not null then
        raise exception 'invalid_coupon' using errcode = '22023';
      end if;
  end case;

  v_tax := round(v_subtotal * v_restaurant.tax_rate_bps / 100000) * 10;
  v_total := v_subtotal + v_restaurant.delivery_fee_irr + v_tax - v_discount;
  if greatest(v_subtotal, v_total) > 9007199254740990 then
    raise exception 'invalid_order_total' using errcode = '22023';
  end if;

  return query select v_restaurant.name, v_subtotal::bigint, v_restaurant.delivery_fee_irr::bigint,
    v_tax::bigint, v_code, v_discount::bigint, v_total::bigint, v_items;
end;
$$;

revoke all on function private.checkout_price(uuid, jsonb, text, uuid)
  from public, anon, authenticated, service_role;

create function private.checkout_request_hash(
  p_address_id uuid, p_restaurant_id uuid, p_items jsonb, p_coupon_code text, p_order_note text
)
returns bytea
language sql
immutable
set search_path = ''
as $$
  select extensions.digest(convert_to(jsonb_build_object(
    'address', p_address_id, 'restaurant', p_restaurant_id, 'items', p_items,
    'coupon', nullif(upper(btrim(p_coupon_code)), ''), 'note', nullif(btrim(p_order_note), '')
  )::text, 'utf8'), 'sha256');
$$;

revoke all on function private.checkout_request_hash(uuid, uuid, jsonb, text, text)
  from public, anon, authenticated, service_role;

create function api.quote_checkout(
  p_restaurant_id uuid, p_items jsonb, p_coupon_code text default null, p_idempotency_key uuid default null,
  p_address_id uuid default null, p_order_note text default null
)
returns table (
  subtotal_irr bigint, delivery_fee_irr bigint, tax_irr bigint, coupon_code text, discount_irr bigint, total_irr bigint
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_existing public.orders%rowtype;
begin
  if v_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;
  if p_idempotency_key is not null then
    select * into v_existing from public.orders o
    where o.user_id = v_user_id and o.idempotency_key = p_idempotency_key;
    if found then
      if v_existing.status = 'canceled' then
        raise exception 'checkout_attempt_closed' using errcode = '22023';
      end if;
      if v_existing.checkout_request_hash is distinct from private.checkout_request_hash(
        p_address_id, p_restaurant_id, p_items, p_coupon_code, p_order_note
      ) then
        raise exception 'checkout_request_changed' using errcode = '22023';
      end if;
      return query select v_existing.subtotal_irr::bigint, v_existing.delivery_fee_irr::bigint, v_existing.tax_irr::bigint,
        v_existing.coupon_code, v_existing.discount_irr::bigint, v_existing.total_irr::bigint;
      return;
    end if;
  end if;
  return query
    select q.subtotal_irr, q.delivery_fee_irr, q.tax_irr, q.coupon_code, q.discount_irr, q.total_irr
    from private.checkout_price(p_restaurant_id, p_items, p_coupon_code, v_user_id) q;
end;
$$;

drop function api.create_pending_order(uuid, uuid, uuid, jsonb);

create function api.create_pending_order(
  p_address_id uuid, p_restaurant_id uuid, p_idempotency_key uuid, p_items jsonb,
  p_coupon_code text default null, p_order_note text default null, p_expected_total_irr bigint default null
)
returns table(order_id uuid, tracking_token text, reused boolean)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_order_id uuid;
  v_existing public.orders%rowtype;
  v_tracking_token text;
  v_address public.addresses%rowtype;
  v_quote record;
  v_request_hash bytea;
  v_guarded boolean := p_expected_total_irr is not null or nullif(btrim(p_coupon_code), '') is not null
    or nullif(btrim(p_order_note), '') is not null
    or coalesce(jsonb_path_exists(p_items, '$[*].note ? (@ != null && @ != "")'), false);
begin
  if v_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  v_request_hash := private.checkout_request_hash(
    p_address_id, p_restaurant_id, p_items, p_coupon_code, p_order_note
  );

  -- Serialize first-order eligibility and idempotency checks for this customer.
  perform pg_advisory_xact_lock(hashtextextended(v_user_id::text, 48160));
  select * into v_existing from public.orders o
  where o.user_id = v_user_id and o.idempotency_key = p_idempotency_key;
  if found then
    if v_existing.status = 'canceled' then
      raise exception 'checkout_attempt_closed' using errcode = '22023';
    end if;
    if p_expected_total_irr is not null and p_expected_total_irr <> v_existing.total_irr then
      raise exception 'checkout_total_changed' using errcode = '22023';
    end if;
    if v_existing.checkout_request_hash is not null and v_existing.checkout_request_hash is distinct from v_request_hash then
      raise exception 'checkout_request_changed' using errcode = '22023';
    end if;
    if v_existing.checkout_request_hash is null and v_guarded then
      raise exception 'checkout_request_changed' using errcode = '22023';
    end if;
    return query select v_existing.id, null::text, true;
    return;
  end if;

  if char_length(p_order_note) > 500 then
    raise exception 'invalid_order_note' using errcode = '22023';
  end if;

  select * into v_address from public.addresses a
  where a.id = p_address_id and a.user_id = v_user_id;
  if not found then
    raise exception 'address_not_found' using errcode = '42501';
  end if;

  select * into strict v_quote from private.checkout_price(p_restaurant_id, p_items, p_coupon_code, v_user_id);
  if p_expected_total_irr is not null and p_expected_total_irr <> v_quote.total_irr then
    raise exception 'checkout_total_changed' using errcode = '22023';
  end if;
  if not v_guarded then
    v_request_hash := null;
  end if;

  v_tracking_token := rtrim(translate(encode(extensions.gen_random_bytes(32), 'base64'), '+/', '-_'), '=');
  insert into public.orders(
    user_id, address_id, restaurant_id, idempotency_key, restaurant_name_snapshot, address_snapshot,
    subtotal_irr, delivery_fee_irr, tax_irr, coupon_code, discount_irr, total_irr, order_note,
    checkout_request_hash, tracking_token_hash
  ) values (
    v_user_id, p_address_id, p_restaurant_id, p_idempotency_key, v_quote.restaurant_name,
    jsonb_build_object(
      'title', v_address.title, 'recipientName', v_address.recipient_name,
      'recipientPhone', v_address.recipient_phone, 'province', v_address.province,
      'city', v_address.city, 'addressLine', v_address.address_line,
      'postalCode', v_address.postal_code, 'latitude', v_address.latitude, 'longitude', v_address.longitude
    ),
    v_quote.subtotal_irr, v_quote.delivery_fee_irr, v_quote.tax_irr, v_quote.coupon_code,
    v_quote.discount_irr, v_quote.total_irr, nullif(btrim(p_order_note), ''), v_request_hash,
    extensions.digest(convert_to(v_tracking_token, 'utf8'), 'sha256')
  ) returning id into v_order_id;

  insert into public.order_items(
    order_id, product_id, product_name_snapshot, unit_price_irr, quantity,
    variant_snapshot, addons_snapshot, line_total_irr, note
  )
  select v_order_id, i.product_id, i.product_name_snapshot, i.unit_price_irr, i.quantity,
    i.variant_snapshot, i.addons_snapshot, i.line_total_irr, i.note
  from jsonb_to_recordset(v_quote.priced_items) as i(
    product_id uuid, product_name_snapshot text, unit_price_irr bigint, quantity smallint,
    variant_snapshot jsonb, addons_snapshot jsonb, line_total_irr bigint, note text
  );

  insert into public.payments(order_id, provider, status, amount_irr)
  values (v_order_id, 'pending_assignment', 'created', v_quote.total_irr);

  insert into public.order_status_history(order_id, actor_id, actor_type, to_status)
  values (v_order_id, v_user_id, 'customer', 'pending_payment');

  insert into private.audit_events(actor_id, event_type, target_type, target_id)
  values (v_user_id, 'checkout.order_created', 'order', v_order_id);

  return query select v_order_id, v_tracking_token, false;
end;
$$;

revoke all on function api.quote_checkout(uuid, jsonb, text, uuid, uuid, text) from public, anon, service_role;
grant execute on function api.quote_checkout(uuid, jsonb, text, uuid, uuid, text) to authenticated;
revoke all on function api.create_pending_order(uuid, uuid, uuid, jsonb, text, text, bigint)
  from public, anon, service_role;
grant execute on function api.create_pending_order(uuid, uuid, uuid, jsonb, text, text, bigint) to authenticated;
