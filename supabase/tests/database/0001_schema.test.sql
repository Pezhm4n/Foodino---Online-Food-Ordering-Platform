begin;
select plan(12);

select has_schema('api', 'api schema exists');
select has_schema('private', 'private schema exists');
select has_table('public', 'orders', 'orders table exists');
select has_table('public', 'payments', 'payments table exists');
select has_table('private', 'rate_limit_buckets', 'private rate-limit table exists');
select has_index('public', 'orders', 'orders_user_created_id_idx', 'user keyset index exists');
select has_index('public', 'orders', 'orders_status_created_id_idx', 'operator queue index exists');
select ok((select relrowsecurity from pg_class where oid = 'public.orders'::regclass), 'orders RLS enabled');
select ok((select relforcerowsecurity from pg_class where oid = 'public.orders'::regclass), 'orders force RLS enabled');
select ok(not has_schema_privilege('anon', 'private', 'usage'), 'anon cannot use private schema');
select ok(not has_table_privilege('authenticated', 'public.orders', 'insert'), 'customers cannot insert orders directly');
select ok(not has_table_privilege('authenticated', 'public.payments', 'update'), 'customers cannot mutate payments');

select * from finish();
rollback;
