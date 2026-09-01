import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getServerEnv } from '@/infrastructure/config/server-env';
import type { Database } from '@/infrastructure/supabase/database.types';

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const env = getServerEnv();

  return createServerClient<Database>(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, {
    cookieOptions: {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    },
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, {
              ...options,
              httpOnly: true,
              secure: env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
            });
          }
        } catch {
          // Server Components are read-only. proxy.ts performs refresh writes.
        }
      },
    },
  });
}

export async function requireClaims() {
  const client = await createSupabaseServerClient();
  const { data, error } = await client.auth.getClaims();
  if (error || !data?.claims?.sub) return null;
  return data.claims;
}

export function claimsHaveOperatorRole(claims: { app_metadata?: unknown } | null): boolean {
  if (!claims?.app_metadata || typeof claims.app_metadata !== 'object') return false;
  return (claims.app_metadata as { role?: unknown }).role === 'operator';
}
