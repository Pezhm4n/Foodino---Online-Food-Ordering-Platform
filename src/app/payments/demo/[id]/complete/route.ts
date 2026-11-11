import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { routeUuidParamsSchema } from '@/lib/validation/common';
import { getServerEnv } from '@/infrastructure/config/server-env';
import { assertRequestSameOrigin, InvalidOriginError } from '@/infrastructure/http/same-origin';
import { errorResponse } from '@/infrastructure/http/api-response';
import { createSupabaseServerClient, requireClaims } from '@/infrastructure/supabase/server';
import { createSupabaseAdminClient } from '@/infrastructure/supabase/admin';
import { SupabasePaymentRepository } from '@/infrastructure/supabase/repositories/supabase-payment-repository';
import { demoPaymentEvent } from '@/infrastructure/payments/demo-payment-provider';

const outcomeSchema = z.object({ outcome: z.enum(['succeeded', 'failed']) }).strict();

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const requestId = randomUUID();
  try {
    const env = getServerEnv();
    if (env.PAYMENT_PROVIDER !== 'demo' || env.DEMO_MODE !== 'true') return errorResponse('NOT_FOUND', 404, requestId);
    assertRequestSameOrigin(request);
    const parsed = routeUuidParamsSchema.safeParse(await context.params);
    if (!parsed.success) return errorResponse('NOT_FOUND', 404, requestId);
    const claims = await requireClaims();
    if (!claims?.sub) return errorResponse('AUTHENTICATION_REQUIRED', 401, requestId);
    if (Number(request.headers.get('content-length') ?? 0) > 1024) return errorResponse('PAYLOAD_TOO_LARGE', 413, requestId);
    let body: unknown;
    try { body = await request.json(); } catch { return errorResponse('INVALID_JSON', 400, requestId); }
    const outcome = outcomeSchema.safeParse(body);
    if (!outcome.success) return errorResponse('INVALID_DEMO_OUTCOME', 422, requestId);

    const client = await createSupabaseServerClient();
    const { data: order, error } = await client.from('orders')
      .select('id,status,total_irr')
      .eq('id', parsed.data.id).eq('user_id', claims.sub).maybeSingle();
    if (error) throw error;
    if (!order) return errorResponse('NOT_FOUND', 404, requestId);
    const admin = createSupabaseAdminClient();
    const { data: payment, error: paymentError } = await admin.from('payments')
      .select('order_id,provider,provider_reference,status,amount_irr').eq('order_id', order.id).maybeSingle();
    if (paymentError) throw paymentError;
    if (!payment || payment.provider !== 'demo' || !payment.provider_reference) return errorResponse('NOT_FOUND', 404, requestId);
    if (payment.amount_irr !== order.total_irr) return errorResponse('PAYMENT_AMOUNT_MISMATCH', 409, requestId);
    if (order.status === 'pending_payment' && payment.status === 'pending') {
      const repository = new SupabasePaymentRepository(admin);
      await repository.applyVerifiedEvent(demoPaymentEvent({ ...payment, provider_reference: payment.provider_reference }, outcome.data.outcome));
    }
    // The receipt reads the committed outcome; a competing/replayed choice never overrides it.
    return NextResponse.json({ receiptUrl: `/orders/${order.id}` }, { headers: { 'Cache-Control': 'private, no-store', 'X-Request-Id': requestId } });
  } catch (error) {
    if (error instanceof InvalidOriginError) return errorResponse('INVALID_ORIGIN', 403, requestId);
    return errorResponse('DEMO_COMPLETION_FAILED', 503, requestId);
  }
}
