begin;
select plan(25);

insert into auth.users(instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000000', 'd8000000-0000-4000-8000-000000000001', 'authenticated',
    'authenticated', 'checkout-discount@example.test', 'x', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'd8000000-0000-4000-8000-000000000002', 'authenticated',
    'authenticated', 'checkout-welcome@example.test', 'x', now(), now(), now());
insert into public.addresses(id, user_id, title, recipient_name, recipient_phone, province, city, address_line, postal_code)
values
  ('d8100000-0000-4000-8000-000000000001', 'd8000000-0000-4000-8000-000000000001', 'خانه', 'خریدار',
    '09120000001', 'تهران', 'تهران', 'خیابان پرداخت نمونه', '3333333333'),
  ('d8100000-0000-4000-8000-000000000002', 'd8000000-0000-4000-8000-000000000002', 'خانه', 'خریدار',
    '09120000002', 'تهران', 'تهران', 'خیابان پرداخت نمونه', '3333333333');

select set_config('test.checkout_items',
  '[{"product_id":"30000000-0000-4000-8000-000000000001","variant_id":"40000000-0000-4000-8000-000000000001","addon_ids":["50000000-0000-4000-8000-000000000001"],"quantity":2,"note":"بدون پیاز","forged_total":10}]', true);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"d8000000-0000-4000-8000-000000000001","role":"authenticated"}', true);

select is((select total_irr from api.quote_checkout(
  '20000000-0000-4000-8000-000000000001', current_setting('test.checkout_items')::jsonb
)), 3747000::bigint, 'undiscounted quote includes actual restaurant delivery and tax');
select is((select discount_irr from api.quote_checkout(
  '20000000-0000-4000-8000-000000000001', current_setting('test.checkout_items')::jsonb, ' foodino '
)), 500000::bigint, 'FOODINO is normalized and capped');
select is((select total_irr from api.quote_checkout(
  '20000000-0000-4000-8000-000000000001', current_setting('test.checkout_items')::jsonb, 'FOODINO'
)), 3247000::bigint, 'discount is subtracted from the live server quote');
select is((select total_irr from api.quote_checkout(
  '20000000-0000-4000-8000-000000000001', current_setting('test.checkout_items')::jsonb, 'FREESHIP'
)), 3597000::bigint, 'shipping discount uses the restaurant shipping fee once');
select is((select discount_irr from api.quote_checkout(
  '20000000-0000-4000-8000-000000000001', current_setting('test.checkout_items')::jsonb, 'TASTY10'
)), 300000::bigint, 'TASTY10 cap is applied');
select throws_ok($$
  select * from api.quote_checkout(
    '20000000-0000-4000-8000-000000000001', current_setting('test.checkout_items')::jsonb, 'UNKNOWN')
$$, '22023', 'invalid_coupon', 'unknown coupons are rejected');
select throws_ok($$
  select * from api.create_pending_order(
    'd8100000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001',
    'd8200000-0000-4000-8000-000000000001', current_setting('test.checkout_items')::jsonb, 'FOODINO', null, 10)
$$, '22023', 'checkout_total_changed', 'a stale or forged amount cannot be accepted');
select is((select count(*) from public.orders where idempotency_key = 'd8200000-0000-4000-8000-000000000001'),
  0::bigint, 'a stale quote does not insert an order');
select throws_ok($$
  select * from api.create_pending_order(
    'd8100000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001',
    'd8200000-0000-4000-8000-000000000001', current_setting('test.checkout_items')::jsonb, 'FOODINO', null, 3247000)
$$, '42501', 'address_not_found', 'another account address is rejected');
select lives_ok($$
  select * from api.create_pending_order(
    'd8100000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001',
    'd8200000-0000-4000-8000-000000000001', current_setting('test.checkout_items')::jsonb, 'FOODINO', '  لطفاً زنگ بزنید  ', 3247000)
$$, 'guarded checkout persists the quoted discounted order');
select is((select order_note from public.orders where idempotency_key = 'd8200000-0000-4000-8000-000000000001'),
  'لطفاً زنگ بزنید', 'customer can read the persisted trimmed order note');
select is((select i.note from public.order_items i join public.orders o on o.id = i.order_id
  where o.idempotency_key = 'd8200000-0000-4000-8000-000000000001'),
  'بدون پیاز', 'item note is persisted on the same order');
select is((select reused from api.create_pending_order(
  'd8100000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001',
  'd8200000-0000-4000-8000-000000000001', current_setting('test.checkout_items')::jsonb, 'FOODINO', 'لطفاً زنگ بزنید', 3247000)
), true, 'a matching guarded retry reuses the original order');
select throws_ok($$
  select * from api.create_pending_order(
    'd8100000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001',
    'd8200000-0000-4000-8000-000000000001', current_setting('test.checkout_items')::jsonb, 'FOODINO', 'یادداشت متفاوت', 3247000)
$$, '22023', 'checkout_request_changed', 'same amount with changed instructions cannot reuse a guarded key');
select throws_ok($$
  select * from api.quote_checkout(
    '20000000-0000-4000-8000-000000000001', current_setting('test.checkout_items')::jsonb, 'WELCOME')
$$, '22023', 'coupon_first_order_only', 'existing pending orders reserve first-order eligibility');

reset role;
select is((select p.amount_irr from public.payments p join public.orders o on o.id = p.order_id
  where o.idempotency_key = 'd8200000-0000-4000-8000-000000000001'),
  3247000::public.irr_amount, 'payment row uses the exact discounted order total');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"d8000000-0000-4000-8000-000000000002","role":"authenticated"}', true);
select is((select count(*) from public.orders where idempotency_key = 'd8200000-0000-4000-8000-000000000001'),
  0::bigint, 'another customer cannot see the order or its note');
select lives_ok($$
  select * from api.create_pending_order(
    'd8100000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001',
    'd8200000-0000-4000-8000-000000000002', current_setting('test.checkout_items')::jsonb, 'WELCOME', null, 3252000)
$$, 'WELCOME works on the first order');
select throws_ok($$
  select * from api.quote_checkout(
    '20000000-0000-4000-8000-000000000001', current_setting('test.checkout_items')::jsonb, 'WELCOME')
$$, '22023', 'coupon_first_order_only', 'a second WELCOME attempt is ineligible');
select is((select total_irr from api.quote_checkout(
  '20000000-0000-4000-8000-000000000001', current_setting('test.checkout_items')::jsonb, 'WELCOME',
  'd8200000-0000-4000-8000-000000000002', 'd8100000-0000-4000-8000-000000000002'
)), 3252000::bigint, 'the owner can recover the original WELCOME quote with the attempt key');
select throws_ok($$
  select * from api.quote_checkout(
    '20000000-0000-4000-8000-000000000001', current_setting('test.checkout_items')::jsonb, 'UNKNOWN',
    'd8200000-0000-4000-8000-000000000002', 'd8100000-0000-4000-8000-000000000002')
$$, '22023', 'checkout_request_changed', 'an owned attempt key cannot quote different selections');

reset role;
update public.orders set status = 'canceled' where idempotency_key = 'd8200000-0000-4000-8000-000000000002';
set local role authenticated;
select throws_ok($$
  select * from api.quote_checkout(
    '20000000-0000-4000-8000-000000000001', current_setting('test.checkout_items')::jsonb, 'WELCOME',
    'd8200000-0000-4000-8000-000000000002', 'd8100000-0000-4000-8000-000000000002')
$$, '22023', 'checkout_attempt_closed', 'canceled quotes cannot be resumed');
select throws_ok($$
  select * from api.create_pending_order(
    'd8100000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001',
    'd8200000-0000-4000-8000-000000000002', current_setting('test.checkout_items')::jsonb, 'WELCOME', null, 3252000)
$$, '22023', 'checkout_attempt_closed', 'canceled payment attempts cannot be retried');
select is((select total_irr from api.quote_checkout(
  '20000000-0000-4000-8000-000000000001', current_setting('test.checkout_items')::jsonb, 'WELCOME'
)), 3252000::bigint, 'cancelling an unpaid first order releases WELCOME for a new attempt');

set local role anon;
select throws_ok($$
  select * from api.quote_checkout(
    '20000000-0000-4000-8000-000000000001', current_setting('test.checkout_items')::jsonb)
$$, '42501', 'permission denied for function quote_checkout', 'anonymous callers cannot quote checkout');

select * from finish();
rollback;
