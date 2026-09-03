begin;
select plan(4);

insert into auth.users(instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000000', 'd0000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'a@example.test', 'x', now(), now(), now());

-- 1. کاربران مهمان می‌توانند نظرات را بخوانند
set local role anon;
select is((select count(*) from public.reviews), 0::bigint, 'anon can select reviews');

-- 2. کاربر بدون خرید نمی‌تواند نظر ثبت کند
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"d0000000-0000-4000-8000-000000000001","role":"authenticated","app_metadata":{}}', true);

select throws_ok(
  $$insert into public.reviews(restaurant_id, user_id, user_name, rating, comment)
    values ('20000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000001', 'تست', 5, 'خیلی خوب')$$,
  '42501',
  null,
  'user without orders cannot insert review'
);

-- 3. ثبت سفارش به عنوان سوپریوزر و تست ثبت نظر توسط کاربر
reset role;

insert into public.addresses(
  id, user_id, title, recipient_name, recipient_phone, province, city, address_line, postal_code
) values (
  'a1000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000001', 'خانه', 'کاربر الف', '09120000001', 'تهران', 'تهران', 'خیابان نمونه یک', '1111111111'
);

insert into public.orders(
  id, user_id, address_id, restaurant_id, idempotency_key, status, restaurant_name_snapshot,
  address_snapshot, subtotal_irr, delivery_fee_irr, tax_irr, total_irr, tracking_token_hash
) values (
  'a2000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000001',
  'a1000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001',
  'a3000000-0000-4000-8000-000000000001', 'delivered', 'پیتزا برتر', '{}'::jsonb,
  1450000, 150000, 130500, 1730500, extensions.digest('token-test-rev', 'sha256')
);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"d0000000-0000-4000-8000-000000000001","role":"authenticated","app_metadata":{}}', true);

select lives_ok(
  $$insert into public.reviews(restaurant_id, user_id, user_name, rating, food_name, comment)
    values ('20000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000001', 'کاربر الف', 5, 'پیتزا مخصوص', 'عالی و داغ بود')$$,
  'purchased customer can insert review'
);

select is((select count(*) from public.reviews), 1::bigint, 'review was persisted successfully');

select * from finish();
rollback;
