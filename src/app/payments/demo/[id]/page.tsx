import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { routeUuidParamsSchema } from '@/lib/validation/common';
import { getServerEnv } from '@/infrastructure/config/server-env';
import { createSupabaseServerClient, requireClaims } from '@/infrastructure/supabase/server';
import { createSupabaseAdminClient } from '@/infrastructure/supabase/admin';
import DemoGateway from './DemoGateway';

export const metadata: Metadata = { title: 'درگاه پرداخت آزمایشی | فودینو', robots: { index: false, follow: false } };

export default async function DemoPaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const env = getServerEnv();
  if (env.PAYMENT_PROVIDER !== 'demo' || env.DEMO_MODE !== 'true') notFound();
  const parsed = routeUuidParamsSchema.safeParse(await params);
  if (!parsed.success) notFound();
  const claims = await requireClaims();
  if (!claims?.sub) redirect(`/auth?next=/payments/demo/${parsed.data.id}`);
  const client = await createSupabaseServerClient();
  const { data: order, error } = await client.from('orders')
    .select('id,status,total_irr,restaurant_name_snapshot')
    .eq('id', parsed.data.id).eq('user_id', claims.sub).maybeSingle();
  if (error || !order) notFound();
  const { data: payment, error: paymentError } = await createSupabaseAdminClient().from('payments')
    .select('provider,status').eq('order_id', order.id).maybeSingle();
  if (paymentError || payment?.provider !== 'demo') notFound();
  if (order.status !== 'pending_payment' || payment.status !== 'pending') redirect(`/orders/${order.id}`);
  return <DemoGateway orderId={order.id} amountIrr={order.total_irr} restaurantName={order.restaurant_name_snapshot} />;
}
