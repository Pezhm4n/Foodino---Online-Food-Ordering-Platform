begin;
select plan(5);

insert into auth.users(instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values ('00000000-0000-0000-0000-000000000000', 'e9000000-0000-4000-8000-000000000001',
  'authenticated', 'authenticated', 'tracking-provenance@example.test', 'x', now(), now(), now());
insert into public.addresses(id,user_id,title,recipient_name,recipient_phone,province,city,address_line,postal_code)
values ('e9100000-0000-4000-8000-000000000001','e9000000-0000-4000-8000-000000000001',
  'آزمایش','کاربر آزمایشی','09990000001','تهران','تهران','نشانی آزمایشی بدون ارسال واقعی','1234567890');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"e9000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
select set_config('test.demo_tracking_token', tracking_token, true)
from api.create_pending_order(
  'e9100000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001',
  'e9200000-0000-4000-8000-000000000001',
  '[{"product_id":"30000000-0000-4000-8000-000000000001","quantity":1,"addon_ids":[]}]'::jsonb
);

set local role anon;
select is((select is_demo from api.get_public_tracking(current_setting('test.demo_tracking_token'))), false,
  'non-demo payment provenance remains false');
select is((select count(*) from api.get_public_tracking(repeat('0',43))), 0::bigint,
  'unknown tracking token exposes no order');

reset role;
update public.payments set provider='demo'
where order_id=(select id from public.orders where user_id='e9000000-0000-4000-8000-000000000001');

set local role anon;
select is((select is_demo from api.get_public_tracking(current_setting('test.demo_tracking_token'))), true,
  'public tracking carries the persisted demo marker');
select is((select count(*) from api.get_public_tracking(current_setting('test.demo_tracking_token'))), 1::bigint,
  'valid tracking capability still returns one minimal result');
select ok(not has_table_privilege('anon','public.payments','select'),
  'public demo provenance does not grant access to payment records');

select * from finish();
rollback;
