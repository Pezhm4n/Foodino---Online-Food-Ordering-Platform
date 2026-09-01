import { notFound, redirect } from 'next/navigation';
import { routeUuidParamsSchema } from '@/lib/validation/common';
import { createSupabaseServerClient, requireClaims } from '@/infrastructure/supabase/server';
import { irrToToman, money } from '@/domain/money/money';
import TrackingLink from '@/app/orders/[id]/TrackingLink';

const statusLabels: Record<string, string> = {
  pending_payment: 'در انتظار پرداخت',
  confirmed: 'تأیید شده',
  preparing: 'در حال آماده‌سازی',
  ready: 'آماده ارسال',
  delivering: 'در حال ارسال',
  delivered: 'تحویل شده',
  canceled: 'لغو شده',
};

function formatToman(amountIrr: number): string {
  return new Intl.NumberFormat('fa-IR').format(irrToToman(money(amountIrr)));
}

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const parsed = routeUuidParamsSchema.safeParse(await params);
  if (!parsed.success) notFound();
  const claims = await requireClaims();
  if (!claims?.sub) redirect('/auth');

  const client = await createSupabaseServerClient();
  const { data: order, error } = await client
    .from('orders')
    .select('id,status,restaurant_name_snapshot,total_irr,created_at,order_items(product_name_snapshot,quantity,line_total_irr)')
    .eq('id', parsed.data.id)
    .maybeSingle();
  if (error || !order) notFound();

  return (
    <main style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1>سفارش {order.id}</h1>
      <p>رستوران: {order.restaurant_name_snapshot}</p>
      <p>وضعیت: {statusLabels[order.status] ?? order.status}</p>
      <ul>
        {order.order_items.map((item) => (
          <li key={`${item.product_name_snapshot}-${item.quantity}`}>
            {item.product_name_snapshot} × {item.quantity} — {formatToman(item.line_total_irr)} تومان
          </li>
        ))}
      </ul>
      <strong>مبلغ نهایی: {formatToman(order.total_irr)} تومان</strong>
      <TrackingLink orderId={order.id} />
    </main>
  );
}
