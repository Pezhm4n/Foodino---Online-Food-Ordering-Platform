import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getServerEnv } from '@/infrastructure/config/server-env';

function safeNext(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/';
  return value;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const next = safeNext(request.nextUrl.searchParams.get('next'));
  const origin = request.nextUrl.origin;

  if (!code) {
    return NextResponse.redirect(new URL('/auth?error=invalid_callback', origin));
  }

  const env = getServerEnv();
  let response = NextResponse.redirect(new URL(next, origin));

  const client = createServerClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.redirect(new URL(next, origin));
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, {
            ...options,
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
          })
        );
      },
    },
  });

  const { error } = await client.auth.exchangeCodeForSession(code);
  if (error) {
    console.error('exchangeCodeForSession failed:', error.message);
    return NextResponse.redirect(new URL('/auth?error=invalid_callback', origin));
  }

  return response;
}
