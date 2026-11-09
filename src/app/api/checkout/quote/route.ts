import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { checkoutQuoteSchema } from '@/lib/validation/checkout';
import { errorResponse } from '@/infrastructure/http/api-response';
import { checkoutFailure } from '@/infrastructure/http/checkout-error';
import { assertRequestSameOrigin, InvalidOriginError } from '@/infrastructure/http/same-origin';
import { createSupabaseServerClient, requireClaims } from '@/infrastructure/supabase/server';
import { SupabaseOrderRepository } from '@/infrastructure/supabase/repositories/supabase-order-repository';

export async function POST(request: Request) {
  const requestId = randomUUID();
  try {
    assertRequestSameOrigin(request);
    if (Number(request.headers.get('content-length') ?? 0) > 65_536) {
      return errorResponse('PAYLOAD_TOO_LARGE', 413, requestId);
    }
    if (!(await requireClaims())?.sub) return errorResponse('AUTHENTICATION_REQUIRED', 401, requestId);

    const parsed = checkoutQuoteSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return errorResponse('INVALID_CHECKOUT', 422, requestId);

    const repository = new SupabaseOrderRepository(await createSupabaseServerClient());
    return NextResponse.json(await repository.quote(parsed.data), {
      headers: { 'Cache-Control': 'private, no-store', 'X-Request-Id': requestId },
    });
  } catch (error) {
    if (error instanceof InvalidOriginError) return errorResponse('INVALID_ORIGIN', 403, requestId);
    const failure = checkoutFailure(error);
    return failure
      ? errorResponse(failure.code, failure.status, requestId)
      : errorResponse('CHECKOUT_QUOTE_FAILED', 409, requestId);
  }
}
