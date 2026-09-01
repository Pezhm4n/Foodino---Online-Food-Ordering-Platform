import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { checkoutSchema } from '@/lib/validation/checkout';
import { assertRequestSameOrigin, InvalidOriginError } from '@/infrastructure/http/same-origin';
import { errorResponse } from '@/infrastructure/http/api-response';
import { createSupabaseServerClient, requireClaims } from '@/infrastructure/supabase/server';
import { SupabaseOrderRepository } from '@/infrastructure/supabase/repositories/supabase-order-repository';
import { getPaymentProvider } from '@/infrastructure/payments/provider-factory';
import { PaymentProviderUnavailableError } from '@/application/payments/payment-provider';
import { getServerEnv } from '@/infrastructure/config/server-env';
import { createSupabaseAdminClient } from '@/infrastructure/supabase/admin';
import { SupabasePaymentRepository } from '@/infrastructure/supabase/repositories/supabase-payment-repository';

export async function POST(request: Request) {
  const requestId = randomUUID();
  try {
    assertRequestSameOrigin(request);
    if (Number(request.headers.get('content-length') ?? 0) > 65_536) {
      return errorResponse('PAYLOAD_TOO_LARGE', 413, requestId);
    }
    const claims = await requireClaims();
    if (!claims?.sub) return errorResponse('AUTHENTICATION_REQUIRED', 401, requestId);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse('INVALID_JSON', 400, requestId);
    }
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) return errorResponse('INVALID_CHECKOUT', 422, requestId);

    const client = await createSupabaseServerClient();
    const repository = new SupabaseOrderRepository(client);
    const pendingOrder = await repository.createPending(parsed.data);
    const { data: order, error: orderError } = await client
      .from('orders')
      .select('total_irr')
      .eq('id', pendingOrder.orderId)
      .single();
    if (orderError) throw orderError;

    const admin = createSupabaseAdminClient();
    const { data: currentPayment, error: paymentReadError } = await admin
      .from('payments')
      .select('status')
      .eq('order_id', pendingOrder.orderId)
      .single();
    if (paymentReadError) throw paymentReadError;
    if (currentPayment.status === 'succeeded') {
      const env = getServerEnv();
      return NextResponse.json({
        orderId: pendingOrder.orderId,
        trackingToken: pendingOrder.trackingToken,
        paymentUrl: `${env.APP_URL}/orders/${pendingOrder.orderId}`,
        reused: true,
      }, {
        headers: { 'Cache-Control': 'private, no-store', 'X-Request-Id': requestId },
      });
    }

    const provider = getPaymentProvider();
    const env = getServerEnv();
    const payment = await provider.createPayment({
      orderId: pendingOrder.orderId,
      amountIrr: order.total_irr,
      callbackUrl: `${env.APP_URL}/api/payments/callback/${provider.name}`,
    });
    const paymentRepository = new SupabasePaymentRepository(admin);
    await paymentRepository.attachReference(
      pendingOrder.orderId,
      payment.provider,
      payment.providerReference,
    );

    return NextResponse.json({
      orderId: pendingOrder.orderId,
      trackingToken: pendingOrder.trackingToken,
      paymentUrl: payment.redirectUrl,
      reused: pendingOrder.reused,
    }, {
      status: pendingOrder.reused ? 200 : 201,
      headers: { 'Cache-Control': 'private, no-store', 'X-Request-Id': requestId },
    });
  } catch (error) {
    if (error instanceof InvalidOriginError) return errorResponse('INVALID_ORIGIN', 403, requestId);
    if (error instanceof PaymentProviderUnavailableError) {
      return errorResponse('PAYMENT_PROVIDER_UNAVAILABLE', 503, requestId);
    }
    return errorResponse('CHECKOUT_FAILED', 409, requestId);
  }
}
