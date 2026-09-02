import { notFound, redirect } from 'next/navigation';
import { transitionOrderAction } from '@/app/operator/orders/actions';
import {
  claimsHaveOperatorRole,
  createSupabaseServerClient,
  requireClaims,
} from '@/infrastructure/supabase/server';

const nextStatuses: Record<string, readonly string[]> = {
  pending_payment: ['confirmed', 'canceled'],
  confirmed: ['preparing', 'canceled'],
  preparing: ['ready', 'canceled'],
  ready: ['delivering', 'canceled'],
  delivering: ['delivered'],
};

export default async function OperatorOrdersPage() {
  const claims = await requireClaims();
  if (!claims?.sub) redirect('/auth');
  if (!claimsHaveOperatorRole(claims)) notFound();

  const client = await createSupabaseServerClient();
  const { data: orders, error } = await client
    .from('orders')
    .select('id,status,restaurant_name_snapshot,total_irr,created_at')
    .order('created_at', { ascending: true })
    .limit(100);
  if (error) throw error;

  return (
    <main style={{ maxWidth: '980px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1>صف سفارش‌های اپراتور</h1>
      {orders.length === 0 ? <p>سفارشی در صف نیست.</p> : (
        <ul style={{ display: 'grid', gap: '1rem', padding: 0, listStyle: 'none' }}>
          {orders.map((order) => (
            <li key={order.id} style={{ padding: '1rem', border: '1px solid #ddd' }}>
              <strong>{order.restaurant_name_snapshot}</strong>
              <p>{order.id} — {order.status}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {(nextStatuses[order.status] ?? []).map((status) => (
                  <form action={transitionOrderAction} key={status}>
                    <input type="hidden" name="orderId" value={order.id} />
                    <input type="hidden" name="status" value={status} />
                    <button type="submit">تغییر به {status}</button>
                  </form>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
