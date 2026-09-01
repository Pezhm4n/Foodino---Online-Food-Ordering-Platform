import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/infrastructure/supabase/database.types';
import { getServerEnv } from '@/infrastructure/config/server-env';

export async function refreshSupabaseSession(request: NextRequest) {
  const env = getServerEnv();
  let response = NextResponse.next({ request });
  const client = createServerClient<Database>(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, {
    cookieOptions: {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    },
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet, responseHeaders) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, {
            ...options,
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
          });
        }
        for (const [name, value] of Object.entries(responseHeaders)) response.headers.set(name, value);
      },
    },
  });

  await client.auth.getClaims();
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}
