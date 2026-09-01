begin;
select plan(11);

insert into auth.users(instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values ('00000000-0000-0000-0000-000000000000', 'd0000000-0000-4000-8000-000000000001',
  'authenticated', 'authenticated', 'checkout@example.test', 'x', now(), now(), now());
insert into public.addresses(
  id, user_id, title, recipient_name, recipient_phone, province, city, address_line, postal_code
) values (
  'd1000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000001',
  'خانه', 'خریدار', '09120000003', 'تهران', 'تهران', 'خیابان پرداخت نمونه', '3333333333'
);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"d0000000-0000-4000-8000-000000000001","role":"authenticated","app_metadata":{}}', true);

select lives_ok($$
  select * from api.create_pending_order(
    'd1000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000001',
    'd2000000-0000-4000-8000-000000000001',
    '[{"product_id":"30000000-0000-4000-8000-000000000001","variant_id":"40000000-0000-4000-8000-000000000001","addon_ids":["50000000-0000-4000-8000-000000000001"],"quantity":2,"forged_total":10}]'::jsonb
  )
$$, 'checkout accepts IDs and ignores forged amount fields');
select is((select count(*) from public.orders where user_id = 'd0000000-0000-4000-8000-000000000001'), 1::bigint, 'checkout creates one order');
select is((select subtotal_irr from public.orders where user_id = 'd0000000-0000-4000-8000-000000000001'), 3300000::public.irr_amount, 'server reprices product and addon');
select is((select total_irr from public.orders where user_id = 'd0000000-0000-4000-8000-000000000001'), 3747000::public.irr_amount, 'server calculates delivery and tax');
select is((
  select count(*) from public.order_items oi
  join public.orders o on o.id = oi.order_id
  where o.user_id = 'd0000000-0000-4000-8000-000000000001'
), 1::bigint, 'immutable order item snapshot created');

select lives_ok($$
  select * from api.create_pending_order(
    'd1000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000001',
    'd2000000-0000-4000-8000-000000000001',
    '[{"product_id":"30000000-0000-4000-8000-000000000001","addon_ids":[],"quantity":1}]'::jsonb
  )
$$, 'same idempotency key is a safe retry');
select is((select count(*) from public.orders where user_id = 'd0000000-0000-4000-8000-000000000001'), 1::bigint, 'retry does not create a second order');

select throws_ok($$
  select * from api.create_pending_order(
    'd1000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000001',
    'd2000000-0000-4000-8000-000000000002',
    '[{"product_id":"30000000-0000-4000-8000-000000000002","addon_ids":[],"quantity":1}]'::jsonb
  )
$$, '22023', 'product_unavailable', 'mixed-restaurant product is rejected');

reset role;
update public.payments set provider = 'development', provider_reference = 'dev-order-ref', status = 'pending'
where order_id = (select id from public.orders where user_id = 'd0000000-0000-4000-8000-000000000001');
set local role service_role;
select set_config('request.jwt.claims', '{"role":"service_role"}', true);

select lives_ok($$
  select * from api.apply_payment_event(
    'development', 'event-1', 'dev-order-ref', 'succeeded', 3747000,
    extensions.digest('payload-1', 'sha256')
  )
$$, 'verified payment callback applies atomically');
select is((select status::text from public.orders where user_id = 'd0000000-0000-4000-8000-000000000001'), 'confirmed', 'successful payment confirms order');
select is(
  (select count(*) from api.apply_payment_event(
    'development', 'event-1', 'dev-order-ref', 'succeeded', 3747000,
    extensions.digest('payload-1', 'sha256')
  ) where applied),
  0::bigint,
  'duplicate provider event has no second effect'
);

select * from finish();
rollback;
