import Link from 'next/link';

export default function NotFound() {
  return <main style={{ maxWidth: '42rem', margin: '4rem auto', padding: '1rem', textAlign: 'center' }}><h1>صفحه پیدا نشد</h1><p>نشانی واردشده وجود ندارد یا دیگر در دسترس نیست.</p><Link href="/">بازگشت به صفحه اصلی</Link></main>;
}
