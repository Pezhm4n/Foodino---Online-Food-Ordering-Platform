import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { paymentProviderSchema } from '@/lib/validation/payment';
import { getPaymentProvider } from '@/infrastructure/payments/provider-factory';
import { errorResponse } from '@/infrastructure/http/api-response';
import { createSupabaseAdminClient } from '@/infrastructure/supabase/admin';
import { SupabasePaymentRepository } from '@/infrastructure/supabase/repositories/supabase-payment-repository';

export async function POST(
  request: Request,
  context: { params: Promise<{ provider: string }> },
) {
  const requestId = randomUUID();
  const params = await context.params;
  const providerName = paymentProviderSchema.safeParse(params.provider);
  if (!providerName.success) return errorResponse('UNKNOWN_PAYMENT_PROVIDER', 404, requestId);
  if (Number(request.headers.get('content-length') ?? 0) > 65_536) {
    return errorResponse('PAYLOAD_TOO_LARGE', 413, requestId);
  }

  try {
    const provider = getPaymentProvider();
    if (provider.name !== providerName.data) {
      return errorResponse('UNKNOWN_PAYMENT_PROVIDER', 404, requestId);
    }
    const rawBody = await request.text();
    const event = await provider.verifyCallback(rawBody, request.headers);
    const repository = new SupabasePaymentRepository(createSupabaseAdminClient());
    const result = await repository.applyVerifiedEvent(event);
    return NextResponse.json({ ok: true, applied: result.applied }, {
      headers: { 'Cache-Control': 'no-store', 'X-Request-Id': requestId },
    });
  } catch {
    return errorResponse('INVALID_PAYMENT_CALLBACK', 400, requestId);
  }
}
