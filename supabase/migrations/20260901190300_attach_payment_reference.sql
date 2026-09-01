create or replace function api.attach_payment_reference(
  p_order_id uuid,
  p_provider text,
  p_provider_reference text
)
returns public.payment_status
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_payment public.payments%rowtype;
begin
  if (select auth.role()) <> 'service_role' then
    raise exception 'service_role_required' using errcode = '42501';
  end if;
  if char_length(p_provider) not between 1 and 80
    or char_length(p_provider_reference) not between 1 and 255 then
    raise exception 'invalid_payment_reference' using errcode = '22023';
  end if;

  select * into v_payment
  from public.payments p
  where p.order_id = p_order_id
  for update;
  if not found then
    raise exception 'payment_not_found' using errcode = 'P0002';
  end if;

  if v_payment.status = 'pending'
    and v_payment.provider = p_provider
    and v_payment.provider_reference = p_provider_reference then
    return v_payment.status;
  end if;
  if v_payment.status <> 'created' then
    raise exception 'payment_reference_conflict' using errcode = '23505';
  end if;

  update public.payments
  set provider = p_provider,
      provider_reference = p_provider_reference,
      status = 'pending'
  where id = v_payment.id;

  insert into private.audit_events(event_type, target_type, target_id, metadata)
  values (
    'payment.reference_attached',
    'payment',
    v_payment.id,
    jsonb_build_object('provider', p_provider)
  );
  return 'pending'::public.payment_status;
end;
$$;

revoke execute on function api.attach_payment_reference(uuid, text, text)
  from public, anon, authenticated;
grant execute on function api.attach_payment_reference(uuid, text, text)
  to service_role;
