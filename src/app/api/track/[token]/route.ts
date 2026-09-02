import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { trackingTokenParamsSchema } from '@/lib/validation/common';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { SupabaseOrderRepository } from '@/infrastructure/supabase/repositories/supabase-order-repository';
import { errorResponse } from '@/infrastructure/http/api-response';

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const requestId = randomUUID();
  const parsed = trackingTokenParamsSchema.safeParse(await context.params);
  if (!parsed.success) return errorResponse('TRACKING_NOT_FOUND', 404, requestId);

  try {
    const repository = new SupabaseOrderRepository(await createSupabaseServerClient());
    const tracking = await repository.getPublicTracking(parsed.data.token);
    if (!tracking) return errorResponse('TRACKING_NOT_FOUND', 404, requestId);
    return NextResponse.json(tracking, {
      headers: {
        'Cache-Control': 'no-store',
        'Referrer-Policy': 'no-referrer',
        'X-Request-Id': requestId,
      },
    });
  } catch {
    return errorResponse('TRACKING_UNAVAILABLE', 503, requestId);
  }
}
