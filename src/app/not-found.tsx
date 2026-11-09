import Link from 'next/link';
import { UtensilsIcon, ArrowLeftIcon } from '@/components/ui/FoodVisuals';

export default function NotFound() {
  return (
    <div
      style={{
        maxWidth: '36rem',
        margin: '5rem auto',
        padding: '3rem 2rem',
        textAlign: 'center',
        direction: 'rtl',
        background: '#ffffff',
        borderRadius: '1.5rem',
        boxShadow: '0 12px 32px -8px rgba(22, 18, 15, 0.08)',
        border: '1px solid #E6DDD0',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          margin: '0 auto 1.25rem',
          borderRadius: '22px',
          background: '#FFF5F2',
          border: '1px solid #FFD8CE',
          color: '#D9381E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <UtensilsIcon size={34} />
      </div>
      <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#16120F', marginBottom: '0.75rem' }}>
        صفحه پیدا نشد
      </h1>
      <p style={{ color: '#6E6055', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '2rem' }}>
        متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا به آدرس دیگری منتقل شده است.
      </p>
      <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link
          href="/"
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
          <span>بازگشت به صفحه اصلی</span>
          <ArrowLeftIcon size={16} />
        </Link>
        <Link
          href="/restaurants"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.8rem 1.5rem',
            backgroundColor: '#FAF6F0',
            border: '1px solid #E6DDD0',
            color: '#2E2620',
            borderRadius: '0.85rem',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          مشاهده رستوران‌ها
        </Link>
      </div>
    </div>
  );
}
