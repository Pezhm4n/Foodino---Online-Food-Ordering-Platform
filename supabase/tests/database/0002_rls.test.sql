begin;
select plan(8);

insert into auth.users(instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000000', 'a0000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'a@example.test', 'x', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'b0000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'b@example.test', 'x', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'c0000000-0000-4000-8000-000000000003', 'authenticated', 'authenticated', 'operator@example.test', 'x', now(), now(), now());

insert into public.addresses(
  id, user_id, title, recipient_name, recipient_phone, province, city, address_line, postal_code
) values
  ('a1000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'خانه', 'کاربر الف', '09120000001', 'تهران', 'تهران', 'خیابان نمونه یک', '1111111111'),
  ('b1000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000002', 'خانه', 'کاربر ب', '09120000002', 'تهران', 'تهران', 'خیابان نمونه دو', '2222222222');

insert into public.orders(
  id, user_id, address_id, restaurant_id, idempotency_key, restaurant_name_snapshot,
  address_snapshot, subtotal_irr, delivery_fee_irr, tax_irr, total_irr, tracking_token_hash
) values
  ('a2000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001',
    'a1000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001',
    'a3000000-0000-4000-8000-000000000001', 'پیتزا برتر', '{}'::jsonb,
    1450000, 150000, 130500, 1730500, extensions.digest('token-a', 'sha256')),
  ('b2000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000002',
    'b1000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001',
    'b3000000-0000-4000-8000-000000000002', 'پیتزا برتر', '{}'::jsonb,
    1450000, 150000, 130500, 1730500, extensions.digest('token-b', 'sha256'));

set local role anon;
select is((select count(*) from public.restaurants where is_active), 5::bigint, 'anon reads active catalog');
select throws_ok('select * from public.orders', '42501', null, 'anon cannot read orders');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"a0000000-0000-4000-8000-000000000001","role":"authenticated","app_metadata":{}}', true);
select is((select count(*) from public.addresses), 1::bigint, 'customer A sees only own address');
select is((select count(*) from public.orders), 1::bigint, 'customer A sees only own order');
select throws_ok(
  $$update public.addresses set user_id = 'b0000000-0000-4000-8000-000000000002' where id = 'a1000000-0000-4000-8000-000000000001'$$,
  '42501', null, 'WITH CHECK prevents moving an address to another user'
);
select throws_ok('select * from public.payments', '42501', null, 'customer cannot read payments');

select set_config('request.jwt.claims', '{"sub":"c0000000-0000-4000-8000-000000000003","role":"authenticated","app_metadata":{"role":"operator"}}', true);
select is((select count(*) from public.orders), 2::bigint, 'operator sees order queue');

select set_config('request.jwt.claims', '{"sub":"a0000000-0000-4000-8000-000000000001","role":"authenticated","app_metadata":{},"user_metadata":{"role":"operator"}}', true);
select is((select count(*) from public.orders), 1::bigint, 'user_metadata cannot self-elevate to operator');

select * from finish();
rollback;
