'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('app_boundary_error', { digest: error.digest }); }, [error]);
  return (
    <div
      role="alert"
      style={{
        maxWidth: '36rem',
        margin: '5rem auto',
        padding: '3rem 2rem',
        textAlign: 'center',
        direction: 'rtl',
        background: 'white',
        borderRadius: '1.25rem',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
        border: '1px solid #fee2e2',
      }}
    >
      <div style={{ fontSize: '3.5rem', marginBottom: '1rem', lineHeight: 1 }}>⚠️</div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#991b1b', marginBottom: '0.75rem' }}>
        مشکلی در بارگذاری رخ داد
      </h1>
      <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
        ارتباط با سرور یا دریافت اطلاعات کامل نشد. لطفاً دکمه زیر را برای تلاش مجدد فشار دهید.
      </p>
      <button
        onClick={reset}
        type="button"
        style={{
          padding: '0.75rem 2rem',
          backgroundColor: '#ff5a00',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(255, 90, 0, 0.25)',
        }}
      >
        تلاش مجدد
      </button>
    </div>
  );
}
