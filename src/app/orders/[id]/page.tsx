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
  if (!claims?.sub) redirect(`/auth?next=/orders/${parsed.data.id}`);

  const client = await createSupabaseServerClient();
  const { data: order, error } = await client
    .from('orders')
    .select('id,status,restaurant_name_snapshot,total_irr,created_at,order_items(product_name_snapshot,quantity,line_total_irr)')
    .eq('id', parsed.data.id)
    .maybeSingle();
  if (error || !order) notFound();

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: 'clamp(1.25rem, 3vw, 2.5rem) clamp(0.75rem, 3vw, 1rem) clamp(2.5rem, 5vw, 4rem)', direction: 'rtl' }}>
      <div style={{ background: 'white', borderRadius: '1rem', padding: 'clamp(1rem, 3vw, 2rem)', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem' }}>
              سفارش #{order.id.slice(0, 8)}
            </h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>رستوران: <strong style={{ color: '#0f172a' }}>{order.restaurant_name_snapshot}</strong></p>
          </div>
          <span style={{
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 700,
            backgroundColor: order.status === 'delivered' ? '#dcfce7' : '#fff7ed',
            color: order.status === 'delivered' ? '#15803d' : '#ea580c',
            border: `1px solid ${order.status === 'delivered' ? '#bbf7d0' : '#fed7aa'}`
          }}>
            {statusLabels[order.status] ?? order.status}
          </span>
        </div>

        <h2 style={{ fontSize: 'clamp(1.05rem, 2.5vw, 1.15rem)', fontWeight: 700, color: '#1e293b', marginBottom: '0.85rem' }}>اقلام سفارش</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
          {(order.order_items ?? []).map((item) => (
            <div key={`${item.product_name_snapshot}-${item.quantity}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: '#f8fafc', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
              <span style={{ fontWeight: 600, color: '#334155' }}>
                {item.product_name_snapshot} <span style={{ color: '#ff5a00', marginRight: '0.25rem' }}>× {item.quantity}</span>
              </span>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>{formatToman(item.line_total_irr)} تومان</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '2px dashed #e2e8f0', paddingTop: '1rem', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', fontWeight: 700, color: '#334155' }}>مبلغ کل پرداختی:</span>
          <span style={{ fontSize: 'clamp(1.1rem, 3vw, 1.25rem)', fontWeight: 800, color: '#ff5a00' }}>{formatToman(order.total_irr)} تومان</span>
        </div>

        <TrackingLink orderId={order.id} />
      </div>
    </div>
  );
}
