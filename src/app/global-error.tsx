'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="fa" dir="rtl"><body><main role="alert" style={{ maxWidth: '42rem', margin: '4rem auto', padding: '1rem', textAlign: 'center' }}><h1>فودینو موقتاً در دسترس نیست</h1><button onClick={reset} type="button">تلاش دوباره</button></main></body></html>;
}
