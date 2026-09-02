import Link from 'next/link';
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

function getEstimatedWindow(createdAt: string): { start: string; end: string } {
  try {
    const d = new Date(createdAt);
    const s = new Date(d.getTime() + 30 * 60 * 1000);
    const e = new Date(d.getTime() + 50 * 60 * 1000);
    const opts: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
    return {
      start: s.toLocaleTimeString('fa-IR', opts),
      end: e.toLocaleTimeString('fa-IR', opts),
    };
  } catch {
    return { start: '۳۵', end: '۵۰ دقیقه' };
  }
}

type AddressSnapshot = {
  title?: string;
  recipientName?: string;
  recipient_name?: string;
  addressLine?: string;
  address_line?: string;
  city?: string;
  recipientPhone?: string;
  recipient_phone?: string;
};

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const parsed = routeUuidParamsSchema.safeParse(await params);
  if (!parsed.success) notFound();
  const claims = await requireClaims();
  if (!claims?.sub) redirect(`/auth?next=/orders/${parsed.data.id}`);

  const client = await createSupabaseServerClient();
  const { data: order, error } = await client
    .from('orders')
    .select('id,status,restaurant_name_snapshot,subtotal_irr,delivery_fee_irr,tax_irr,total_irr,address_snapshot,created_at,order_items(product_name_snapshot,quantity,line_total_irr)')
    .eq('id', parsed.data.id)
    .maybeSingle();
  if (error || !order) notFound();

  const address = (order.address_snapshot as AddressSnapshot) || {};
  const recipientName = address.recipientName || address.recipient_name || '';
  const addressLine = address.addressLine || address.address_line || '';
  const deliveryWindow = getEstimatedWindow(order.created_at);

  const stages = [
    { key: 'placed', label: 'ثبت سفارش', icon: '📝', completed: true },
    {
      key: 'preparing',
      label: 'آماده‌سازی',
      icon: '👨‍🍳',
      completed: ['confirmed', 'preparing', 'ready', 'delivering', 'delivered'].includes(order.status),
    },
    {
      key: 'delivering',
      label: 'پیک در مسیر',
      icon: '🛵',
      completed: ['ready', 'delivering', 'delivered'].includes(order.status),
    },
    {
      key: 'delivered',
      label: 'تحویل سفارش',
      icon: '📍',
      completed: order.status === 'delivered',
    },
  ];

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: 'clamp(1.25rem, 3vw, 2.5rem) clamp(0.75rem, 3vw, 1rem) clamp(2.5rem, 5vw, 4rem)', direction: 'rtl' }}>
      <div style={{ background: 'white', borderRadius: '1rem', padding: 'clamp(1rem, 3vw, 2rem)', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Header with status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem' }}>
              سفارش #{order.id.slice(0, 8)}
            </h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
              رستوران: <strong style={{ color: '#0f172a' }}>{order.restaurant_name_snapshot}</strong>
            </p>
          </div>
          <span style={{
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            fontSize: '0.825rem',
            fontWeight: 700,
            backgroundColor: order.status === 'delivered' ? '#dcfce7' : order.status === 'canceled' ? '#fee2e2' : '#fff7ed',
            color: order.status === 'delivered' ? '#15803d' : order.status === 'canceled' ? '#b91c1c' : '#ea580c',
            border: `1px solid ${order.status === 'delivered' ? '#bbf7d0' : order.status === 'canceled' ? '#fecaca' : '#fed7aa'}`
          }}>
            {statusLabels[order.status] ?? order.status}
          </span>
        </div>

        {/* Delivery window banner */}
        {order.status !== 'canceled' && (
          <div style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', border: '1px solid #fed7aa', borderRadius: '0.75rem', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#9a3412', fontWeight: 600 }}>⏱️ زمان تقریبی تحویل سفارش</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#c2410c' }}>
                {deliveryWindow.start} تا {deliveryWindow.end}
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#7c2d12', background: 'rgba(255,255,255,0.8)', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontWeight: 700 }}>
              ارسال اکسپرس فودینو 🚀
            </div>
          </div>
        )}

        {/* Milestones Stepper */}
        {order.status !== 'canceled' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
            {stages.map((stg) => (
              <div key={stg.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.35rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  backgroundColor: stg.completed ? '#ea580c' : '#e2e8f0',
                  color: stg.completed ? 'white' : '#64748b',
                  fontWeight: 700,
                  boxShadow: stg.completed ? '0 2px 6px rgba(234, 88, 12, 0.3)' : 'none',
                }}>
                  {stg.completed ? '✓' : stg.icon}
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: stg.completed ? 700 : 500, color: stg.completed ? '#0f172a' : '#64748b' }}>
                  {stg.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Delivery Address */}
        {addressLine && (
          <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: '0.25rem' }}>📍 نشانی تحویل سفارش</div>
            <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 600 }}>
              {address.city ? `${address.city}، ` : ''}{addressLine}
            </div>
            {recipientName && (
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                تحویل‌گیرنده: {recipientName}
              </div>
            )}
          </div>
        )}

        {/* Order Items */}
        <div>
          <h2 style={{ fontSize: 'clamp(1.05rem, 2.5vw, 1.15rem)', fontWeight: 700, color: '#1e293b', margin: '0 0 0.85rem' }}>اقلام سفارش</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {(order.order_items ?? []).map((item) => (
              <div key={`${item.product_name_snapshot}-${item.quantity}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: '#f8fafc', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
                <span style={{ fontWeight: 600, color: '#334155' }}>
                  {item.product_name_snapshot} <span style={{ color: '#ff5a00', marginRight: '0.25rem' }}>× {item.quantity}</span>
                </span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{formatToman(item.line_total_irr)} تومان</span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Breakdown */}
        <div style={{ borderTop: '2px dashed #e2e8f0', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
            <span>جمع اقلام:</span>
            <span>{formatToman(order.subtotal_irr)} تومان</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
            <span>هزینه ارسال:</span>
            <span>{order.delivery_fee_irr === 0 ? 'رایگان' : `${formatToman(order.delivery_fee_irr)} تومان`}</span>
          </div>
          {order.tax_irr > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>مالیات بر ارزش افزوده:</span>
              <span>{formatToman(order.tax_irr)} تومان</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>مبلغ کل پرداختی:</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ff5a00' }}>{formatToman(order.total_irr)} تومان</span>
          </div>
        </div>

        {/* Actions & Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center', marginTop: '0.5rem' }}>
          <TrackingLink orderId={order.id} />
          
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
            <Link
              href="/profile"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.55rem 1rem',
                background: '#f1f5f9',
                color: '#334155',
                borderRadius: '0.5rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <span>📋</span>
              <span>مشاهده همه سفارش‌ها در پروفایل</span>
            </Link>

            <Link
              href="/restaurants"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.55rem 1rem',
                background: '#fff7ed',
                color: '#ea580c',
                border: '1px solid #fed7aa',
                borderRadius: '0.5rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <span>🍽️</span>
              <span>سفارش جدید از سایر رستوران‌ها</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
