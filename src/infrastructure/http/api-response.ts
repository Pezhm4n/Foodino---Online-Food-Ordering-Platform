import { NextResponse } from 'next/server';
import { apiError } from '@/application/api/error-envelope';

export function errorResponse(code: string, status: number, requestId: string) {
  return NextResponse.json(apiError(code, requestId), {
    status,
    headers: {
      'Cache-Control': 'private, no-store',
      'X-Request-Id': requestId,
    },
  });
}
