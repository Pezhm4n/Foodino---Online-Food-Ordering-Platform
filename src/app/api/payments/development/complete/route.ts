import { NextResponse, type NextRequest } from 'next/server';
import { getServerEnv } from '@/infrastructure/config/server-env';
import { DevelopmentPaymentProvider } from '@/infrastructure/payments/development-payment-provider';
import { createSupabaseAdminClient } from '@/infrastructure/supabase/admin';
import { SupabasePaymentRepository } from '@/infrastructure/supabase/repositories/supabase-payment-repository';

export async function GET(request: NextRequest) {
  const env = getServerEnv();
  if (env.NODE_ENV === 'production' || env.PAYMENT_PROVIDER !== 'development') {
    return new NextResponse(null, { status: 404 });
  }
  const rawToken = request.nextUrl.searchParams.get('token');
  if (!rawToken || rawToken.length > 2048) return new NextResponse(null, { status: 400 });

  try {
    const provider = new DevelopmentPaymentProvider(env.PAYMENT_CALLBACK_SECRET, env.APP_URL);
    const token = provider.verifyCompletionToken(rawToken);
    const callback = provider.createSuccessfulCallback(token);
    const event = await provider.verifyCallback(callback.rawBody, callback.headers);
    const repository = new SupabasePaymentRepository(createSupabaseAdminClient());
    const result = await repository.applyVerifiedEvent(event);
    const orderId = result.orderId ?? token.orderId;
    return NextResponse.redirect(new URL(`/orders/${orderId}`, env.APP_URL), 303);
  } catch {
    return new NextResponse(null, { status: 400 });
  }
}
