import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        maxWidth: '36rem',
        margin: '5rem auto',
        padding: '3rem 2rem',
        textAlign: 'center',
        direction: 'rtl',
        background: 'white',
        borderRadius: '1.25rem',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0',
      }}
    >
      <div style={{ fontSize: '4rem', marginBottom: '1rem', lineHeight: 1 }}>🍽️</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
        صفحه مورد نظر پیدا نشد
      </h1>
      <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
        متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا به آدرس دیگری منتقل شده است.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link
          href="/"
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
          بازگشت به صفحه اصلی
        </Link>
        <Link
          href="/restaurants"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#f1f5f9',
            color: '#334155',
            borderRadius: '0.5rem',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          مشاهده رستوران‌ها
        </Link>
      </div>
    </div>
  );
}
