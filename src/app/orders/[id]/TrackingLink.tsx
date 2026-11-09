'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { TrackRadarIcon } from '@/components/ui/FoodVisuals';

export default function TrackingLink({ orderId }: Readonly<{ orderId: string }>) {
  const token = useSyncExternalStore(
    () => () => undefined,
    () => sessionStorage.getItem(`foodino:tracking:${orderId}`),
    () => null,
  );
  return token ? (
    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
      <Link
        href={`/track/${token}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.8rem 1.5rem',
          backgroundColor: '#D9381E',
          color: 'white',
          borderRadius: '0.85rem',
          fontWeight: 800,
          textDecoration: 'none',
          boxShadow: '0 8px 20px rgba(217, 56, 30, 0.25)',
        }}
      >
        <TrackRadarIcon size={18} />
        <span>پیگیری زنده وضعیت این سفارش</span>
      </Link>
    </div>
  ) : null;
}
