import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { getServerEnv } from '@/infrastructure/config/server-env';
import type { Database } from '@/infrastructure/supabase/database.types';

export function createSupabaseAdminClient() {
  const env = getServerEnv();
  return createClient<Database>(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
}
