begin;
select plan(5);

insert into auth.users(instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values ('00000000-0000-0000-0000-000000000000', 'f0000000-0000-4000-8000-000000000001',
  'authenticated', 'authenticated', 'payment-ref@example.test', 'x', now(), now(), now());
insert into public.addresses(
  id, user_id, title, recipient_name, recipient_phone, province, city, address_line, postal_code
) values (
  'f1000000-0000-4000-8000-000000000001', 'f0000000-0000-4000-8000-000000000001',
  'خانه', 'خریدار', '09120000004', 'تهران', 'تهران', 'خیابان مرجع پرداخت', '4444444444'
);
insert into public.orders(
  id, user_id, address_id, restaurant_id, idempotency_key, restaurant_name_snapshot,
  address_snapshot, subtotal_irr, delivery_fee_irr, tax_irr, total_irr, tracking_token_hash
) values (
  'f2000000-0000-4000-8000-000000000001', 'f0000000-0000-4000-8000-000000000001',
  'f1000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001',
  'f3000000-0000-4000-8000-000000000001', 'پیتزا برتر', '{}'::jsonb,
  1450000, 150000, 130500, 1730500, extensions.digest('token-ref', 'sha256')
);
insert into public.payments(order_id, provider, status, amount_irr)
values ('f2000000-0000-4000-8000-000000000001', 'pending_assignment', 'created', 1730500);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"f0000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
select throws_ok(
  $$select api.attach_payment_reference('f2000000-0000-4000-8000-000000000001', 'development', 'dev-ref')$$,
  '42501', null, 'customers cannot attach provider references'
);

set local role service_role;
select set_config('request.jwt.claims', '{"role":"service_role"}', true);
select is(
  api.attach_payment_reference('f2000000-0000-4000-8000-000000000001', 'development', 'dev-ref')::text,
  'pending', 'service role attaches a provider reference'
);
select is((select provider from public.payments limit 1), 'development', 'provider is persisted');
select is(
  api.attach_payment_reference('f2000000-0000-4000-8000-000000000001', 'development', 'dev-ref')::text,
  'pending', 'same reference retry is idempotent'
);
select throws_ok(
  $$select api.attach_payment_reference('f2000000-0000-4000-8000-000000000001', 'development', 'other-ref')$$,
  '23505', 'payment_reference_conflict', 'a different reference cannot replace the attached payment'
);

select * from finish();
rollback;
