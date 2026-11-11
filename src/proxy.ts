import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { refreshSupabaseSession } from '@/infrastructure/supabase/proxy';
import { logger } from '@/infrastructure/logging/logger';

export async function proxy(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();

  // Forward x-request-id to downstream request handlers
  request.headers.set('x-request-id', requestId);

  let response = NextResponse.next({ request });
  const hasSession = request.cookies.getAll().some(({ name }) => /^sb-.+-auth-token(?:\.\d+)?$/.test(name));
  if (hasSession) {
    try {
      response = await refreshSupabaseSession(request);
    } catch {
      logger.error('Session refresh unavailable', { requestId, errorCode: 'AUTH_REFRESH_UNAVAILABLE' });
      response.headers.set('Cache-Control', 'private, no-store');
    }
  }

  // Attach x-request-id to response
  response.headers.set('x-request-id', requestId);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images / public static files
     */
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
