-- Function to atomically consume rate limit using private.rate_limit_buckets
create or replace function private.consume_rate_limit(
  p_key bytea,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
as $$
declare
  v_now timestamptz := clock_timestamp();
  v_bucket private.rate_limit_buckets%rowtype;
begin
  select * into v_bucket
  from private.rate_limit_buckets
  where bucket_key = p_key
  for update;

  if not found or v_bucket.expires_at <= v_now then
    insert into private.rate_limit_buckets (bucket_key, window_started_at, request_count, expires_at)
    values (p_key, v_now, 1, v_now + (p_window_seconds || ' seconds')::interval)
    on conflict (bucket_key) do update
      set window_started_at = v_now,
          request_count = 1,
          expires_at = v_now + (p_window_seconds || ' seconds')::interval;
    return true;
  end if;

  if v_bucket.request_count >= p_limit then
    return false;
  end if;

  update private.rate_limit_buckets
  set request_count = request_count + 1
  where bucket_key = p_key;

  return true;
end;
$$;
