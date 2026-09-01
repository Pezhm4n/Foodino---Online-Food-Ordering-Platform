'use client';

import { useEffect, useState } from 'react';

type Tracking = Readonly<{
  status: string;
  restaurantName: string;
  createdAt: string;
  updatedAt: string;
}>;

const labels: Record<string, string> = {
  pending_payment: 'در انتظار پرداخت',
  confirmed: 'سفارش تأیید شد',
  preparing: 'در حال آماده‌سازی',
  ready: 'آماده ارسال',
  delivering: 'در حال ارسال',
  delivered: 'تحویل شد',
  canceled: 'لغو شد',
};

export default function TrackView({ token }: Readonly<{ token: string }>) {
  const [tracking, setTracking] = useState<Tracking | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    async function poll() {
      if (!active || document.hidden) return;
      try {
        const response = await fetch(`/api/track/${encodeURIComponent(token)}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('TRACKING_UNAVAILABLE');
        const result = await response.json() as Tracking;
        if (!active) return;
        setTracking(result);
        setUnavailable(false);
        if (result.status !== 'delivered' && result.status !== 'canceled') {
          timer = setTimeout(poll, 10_000);
        }
      } catch {
        if (!active) return;
        setUnavailable(true);
        timer = setTimeout(poll, 10_000);
      }
    }
    function visibilityChanged() {
      if (!document.hidden) void poll();
      else if (timer) clearTimeout(timer);
    }
    document.addEventListener('visibilitychange', visibilityChanged);
    void poll();
    return () => {
      active = false;
      if (timer) clearTimeout(timer);
      document.removeEventListener('visibilitychange', visibilityChanged);
    };
  }, [token]);

  return (
    <main style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1>پیگیری سفارش</h1>
      {!tracking && !unavailable && <p aria-live="polite">در حال دریافت وضعیت...</p>}
      {unavailable && <p role="alert">وضعیت سفارش فعلاً در دسترس نیست؛ دوباره تلاش می‌شود.</p>}
      {tracking && (
        <section aria-live="polite">
          <h2>{labels[tracking.status] ?? tracking.status}</h2>
          <p>رستوران: {tracking.restaurantName}</p>
          <p>آخرین به‌روزرسانی: {new Date(tracking.updatedAt).toLocaleString('fa-IR')}</p>
        </section>
      )}
    </main>
  );
}
