'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';

export default function TrackingLink({ orderId }: Readonly<{ orderId: string }>) {
  const token = useSyncExternalStore(
    () => () => undefined,
    () => sessionStorage.getItem(`foodino:tracking:${orderId}`),
    () => null,
  );
  return token ? (
    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
      <Link
        href={`/track/${token}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#ff5a00',
          color: 'white',
          borderRadius: '0.5rem',
          fontWeight: 700,
          textDecoration: 'none',
          boxShadow: '0 4px 12px rgba(255, 90, 0, 0.25)',
        }}
      >
        <span>⚡ پیگیری زنده وضعیت این سفارش</span>
      </Link>
    </div>
  ) : null;
}
