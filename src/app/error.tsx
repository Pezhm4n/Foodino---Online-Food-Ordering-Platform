'use client';

import { useEffect } from 'react';
import { AlertCircleIcon } from '@/components/ui/FoodVisuals';

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('app_boundary_error', { digest: error.digest, message: error.message, stack: error.stack });
  }, [error]);
  return (
    <div
      role="alert"
      style={{
        maxWidth: '36rem',
        margin: '5rem auto',
        padding: '3rem 2rem',
        textAlign: 'center',
        direction: 'rtl',
        background: '#ffffff',
        borderRadius: '1.5rem',
        boxShadow: '0 12px 32px -8px rgba(22, 18, 15, 0.08)',
        border: '1px solid #FECACA',
      }}
    >
      <div
        style={{
          width: '68px',
          height: '68px',
          margin: '0 auto 1.25rem',
          borderRadius: '20px',
          background: '#FEF2F2',
          color: '#DC2626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AlertCircleIcon size={34} />
      </div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#991B1B', marginBottom: '0.75rem' }}>
        مشکلی در بارگذاری رخ داد
      </h1>
      <p style={{ color: '#6E6055', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
        ارتباط با سرور یا دریافت اطلاعات کامل نشد. لطفاً دکمه زیر را برای تلاش مجدد فشار دهید.
      </p>
      <button
        onClick={reset}
        type="button"
        style={{
          padding: '0.8rem 2rem',
          backgroundColor: '#D9381E',
          color: 'white',
          border: 'none',
          borderRadius: '0.85rem',
          fontWeight: 800,
          cursor: 'pointer',
          boxShadow: '0 8px 20px rgba(217, 56, 30, 0.25)',
        }}
      >
        تلاش مجدد
      </button>
    </div>
  );
}
