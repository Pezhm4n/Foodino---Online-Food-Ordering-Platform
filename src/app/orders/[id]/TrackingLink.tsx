'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { TrackRadarIcon } from '@/components/ui/FoodVisuals';
import { trackingTokenSchema } from '@/lib/validation/common';

export default function TrackingLink({ orderId }: Readonly<{ orderId: string }>) {
  const token = useSyncExternalStore(
    () => () => undefined,
    () => {
      try {
        return trackingTokenSchema.safeParse(sessionStorage.getItem(`foodino:tracking:${orderId}`)).data ?? null;
      } catch {
        return null;
      }
    },
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
        <span>پیگیری این سفارش</span>
      </Link>
      <details style={{ marginBlockStart: '0.75rem' }}>
        <summary style={{ cursor: 'pointer', paddingBlock: '0.65rem' }}>نمایش کد رهگیری</summary>
        <p dir="ltr" style={{ overflowWrap: 'anywhere' }}><code>{token}</code></p>
        <button type="button" style={{ minHeight: 44 }} onClick={async () => {
          try {
            await navigator.clipboard.writeText(token);
            toast.success('کد رهگیری کپی شد');
          } catch {
            toast.error('کپی انجام نشد. کد را دستی انتخاب کنید.');
          }
        }}>
          کپی کد رهگیری
        </button>
      </details>
    </div>
  ) : null;
}
