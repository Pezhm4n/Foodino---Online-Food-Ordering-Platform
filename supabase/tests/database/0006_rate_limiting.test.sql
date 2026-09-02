begin;
select plan(4);

-- First consumption succeeds (limit 2 requests in 60s)
select is(
  private.consume_rate_limit(extensions.digest('client-ip-1', 'sha256'), 2, 60),
  true,
  'first consumption under limit succeeds'
);

-- Second consumption succeeds (2 of 2)
select is(
  private.consume_rate_limit(extensions.digest('client-ip-1', 'sha256'), 2, 60),
  true,
  'second consumption reaching limit succeeds'
);

-- Third consumption exceeds limit and fails
select is(
  private.consume_rate_limit(extensions.digest('client-ip-1', 'sha256'), 2, 60),
  false,
  'third consumption exceeding limit is rejected'
);

-- Separate client is independent
select is(
  private.consume_rate_limit(extensions.digest('client-ip-2', 'sha256'), 2, 60),
  true,
  'independent client bucket succeeds'
);

select * from finish();
rollback;
