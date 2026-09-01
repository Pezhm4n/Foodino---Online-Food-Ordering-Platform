begin;
select plan(4);

insert into auth.users(
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_user_meta_data, created_at, updated_at
) values
  (
    '00000000-0000-0000-0000-000000000000', 'e0000000-0000-4000-8000-000000000001',
    'authenticated', 'authenticated', 'profile@example.test', 'x', now(),
    '{"first_name":"آریا","last_name":"نمونه","phone":"09123456789"}', now(), now()
  ),
  (
    '00000000-0000-0000-0000-000000000000', 'e0000000-0000-4000-8000-000000000002',
    'authenticated', 'authenticated', 'invalid-phone@example.test', 'x', now(),
    '{"first_name":"کاربر","last_name":"دوم","phone":"not-a-phone"}', now(), now()
  );

select is(
  (select first_name from public.profiles where id = 'e0000000-0000-4000-8000-000000000001'),
  'آریا',
  'signup trigger copies the validated first name'
);
select is(
  (select last_name from public.profiles where id = 'e0000000-0000-4000-8000-000000000001'),
  'نمونه',
  'signup trigger copies the validated last name'
);
select is(
  (select phone from public.profiles where id = 'e0000000-0000-4000-8000-000000000001'),
  '09123456789',
  'signup trigger copies a valid Iranian phone number'
);
select is(
  (select phone from public.profiles where id = 'e0000000-0000-4000-8000-000000000002'),
  null,
  'signup trigger discards malformed phone metadata'
);

select * from finish();
rollback;
