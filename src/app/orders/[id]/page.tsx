import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { routeUuidParamsSchema } from '@/lib/validation/common';
import { createSupabaseServerClient, requireClaims } from '@/infrastructure/supabase/server';
import { irrToToman, money } from '@/domain/money/money';
import TrackingLink from '@/app/orders/[id]/TrackingLink';
import {
  CheckCircleIcon,
  StoreIcon,
  UtensilsIcon,
  CourierIcon,
  MapPinIcon,
  ClockIcon,
  UserIcon,
} from '@/components/ui/FoodVisuals';

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
    .select('id,status,restaurant_name_snapshot,subtotal_irr,delivery_fee_irr,tax_irr,coupon_code,discount_irr,total_irr,order_note,address_snapshot,created_at,order_items(id,product_name_snapshot,quantity,line_total_irr,note)')
    .eq('id', parsed.data.id)
    .maybeSingle();
  if (error || !order) notFound();

  const address = (order.address_snapshot as AddressSnapshot) || {};
  const recipientName = address.recipientName || address.recipient_name || '';
  const addressLine = address.addressLine || address.address_line || '';
  const deliveryWindow = getEstimatedWindow(order.created_at);

  const stages = [
    { key: 'placed', label: 'ثبت سفارش', icon: <StoreIcon size={16} />, completed: true },
    {
      key: 'preparing',
      label: 'آماده‌سازی',
      icon: <UtensilsIcon size={16} />,
      completed: ['confirmed', 'preparing', 'ready', 'delivering', 'delivered'].includes(order.status),
    },
    {
      key: 'delivering',
      label: 'پیک در مسیر',
      icon: <CourierIcon size={16} />,
      completed: ['ready', 'delivering', 'delivered'].includes(order.status),
    },
    {
      key: 'delivered',
      label: 'تحویل سفارش',
      icon: <MapPinIcon size={16} />,
      completed: order.status === 'delivered',
    },
  ];

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', padding: 'clamp(1.5rem, 3vw, 2.75rem) clamp(1rem, 3vw, 1.5rem) clamp(3rem, 5vw, 4.5rem)', direction: 'rtl' }}>
      <div style={{ background: '#ffffff', borderRadius: '1.5rem', padding: 'clamp(1.25rem, 3vw, 2.25rem)', boxShadow: '0 8px 24px rgba(22, 18, 15, 0.06)', border: '1px solid #E6DDD0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Header with status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F3ECE2', paddingBottom: '1.15rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.25rem, 3.5vw, 1.6rem)', fontWeight: 900, color: '#16120F', margin: '0 0 0.35rem' }}>
              سفارش #{order.id.slice(0, 8)}
            </h1>
            <p style={{ margin: 0, color: '#6E6055', fontSize: '0.92rem' }}>
              رستوران: <strong style={{ color: '#16120F' }}>{order.restaurant_name_snapshot}</strong>
            </p>
          </div>
          <span style={{
            padding: '0.4rem 0.95rem',
            borderRadius: '9999px',
            fontSize: '0.84rem',
            fontWeight: 800,
            backgroundColor: order.status === 'delivered' ? '#ECFDF5' : order.status === 'canceled' ? '#FEF2F2' : '#FFF5F2',
            color: order.status === 'delivered' ? '#15803D' : order.status === 'canceled' ? '#DC2626' : '#D9381E',
            border: `1px solid ${order.status === 'delivered' ? '#A7F3D0' : order.status === 'canceled' ? '#FECACA' : '#FFD8CE'}`
          }}>
            {statusLabels[order.status] ?? order.status}
          </span>
        </div>

        {/* Delivery window banner */}
        {order.status !== 'canceled' && (
          <div style={{ background: 'linear-gradient(135deg, #1F1814 0%, #31251E 100%)', color: '#FAF6F0', borderRadius: '1rem', padding: '1.15rem 1.35rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(250, 246, 240, 0.75)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ClockIcon size={15} />
                <span>زمان تقریبی تحویل سفارش</span>
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#FBBF24', marginTop: '0.2rem' }}>
                {deliveryWindow.start} تا {deliveryWindow.end}
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#FAF6F0', background: 'rgba(255,255,255,0.12)', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontWeight: 700 }}>
              ارسال اکسپرس فودینو
            </div>
          </div>
        )}

        {/* Milestones Stepper */}
        {order.status !== 'canceled' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', background: '#FAF6F0', padding: '1.15rem 1rem', borderRadius: '1rem', border: '1px solid #E6DDD0' }}>
            {stages.map((stg) => (
              <div key={stg.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.4rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: stg.completed ? '#D9381E' : '#E6DDD0',
                  color: stg.completed ? 'white' : '#6E6055',
                  fontWeight: 800,
                }}>
                  {stg.completed ? <CheckCircleIcon size={17} /> : stg.icon}
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: stg.completed ? 800 : 600, color: stg.completed ? '#16120F' : '#6E6055' }}>
                  {stg.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Delivery Address */}
        {addressLine && (
          <div style={{ background: '#FAF6F0', padding: '1rem 1.15rem', borderRadius: '1rem', border: '1px solid #E6DDD0' }}>
            <div style={{ fontSize: '0.8rem', color: '#6E6055', fontWeight: 700, marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPinIcon size={15} />
              <span>نشانی تحویل سفارش</span>
            </div>
            <div style={{ fontSize: '0.92rem', color: '#16120F', fontWeight: 700 }}>
              {address.city ? `${address.city}، ` : ''}{addressLine}
            </div>
            {recipientName && (
              <div style={{ fontSize: '0.8rem', color: '#6E6055', marginTop: '0.25rem' }}>
                تحویل‌گیرنده: {recipientName}
              </div>
            )}
          </div>
        )}

        {/* Order Items */}
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#16120F', margin: '0 0 0.85rem' }}>اقلام سفارش</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {(order.order_items ?? []).map((item) => (
              <div key={item.id} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: '#FAF6F0', border: '1px solid #E6DDD0', borderRadius: '0.75rem', fontSize: '0.9rem' }}>
                <span style={{ fontWeight: 700, color: '#2E2620' }}>
                  {item.product_name_snapshot} <span style={{ color: '#D9381E', marginRight: '0.35rem' }}>× {item.quantity.toLocaleString('fa-IR')}</span>
                </span>
                <span style={{ fontWeight: 800, color: '#16120F' }}>{formatToman(item.line_total_irr)} تومان</span>
                {item.note && <span style={{ flexBasis: '100%', overflowWrap: 'anywhere' }}>یادداشت غذا: {item.note}</span>}
              </div>
            ))}
          </div>
          {order.order_note && <p style={{ overflowWrap: 'anywhere' }}>یادداشت سفارش: {order.order_note}</p>}
        </div>

        {/* Financial Breakdown */}
        <div style={{ borderTop: '2px dashed #E6DDD0', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6E6055' }}>
            <span>جمع اقلام:</span>
            <span>{formatToman(order.subtotal_irr)} تومان</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6E6055' }}>
            <span>هزینه ارسال:</span>
            <span>{order.delivery_fee_irr === 0 ? 'رایگان' : `${formatToman(order.delivery_fee_irr)} تومان`}</span>
          </div>
          {order.tax_irr > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6E6055' }}>
              <span>مالیات بر ارزش افزوده:</span>
              <span>{formatToman(order.tax_irr)} تومان</span>
            </div>
          )}
          {order.discount_irr > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#15803D' }}>
              <span>{order.coupon_code === 'FREESHIP' ? 'تخفیف ارسال' : 'تخفیف سفارش'} ({order.coupon_code})</span>
              <span>- {formatToman(order.discount_irr)} تومان</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E6DDD0', paddingTop: '0.85rem', marginTop: '0.25rem' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#16120F' }}>مبلغ کل پرداختی:</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#D9381E' }}>{formatToman(order.total_irr)} تومان</span>
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
                gap: '0.4rem',
                padding: '0.65rem 1.15rem',
                background: '#FAF6F0',
                border: '1px solid #E6DDD0',
                color: '#2E2620',
                borderRadius: '0.75rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <UserIcon size={16} />
              <span>مشاهده همه سفارش‌ها در پروفایل</span>
            </Link>

            <Link
              href="/restaurants"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.65rem 1.15rem',
                background: '#FFF5F2',
                color: '#B82B14',
                border: '1px solid #FFD8CE',
                borderRadius: '0.75rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <UtensilsIcon size={16} />
              <span>سفارش جدید از سایر رستوران‌ها</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
