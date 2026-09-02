'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('app_boundary_error', { digest: error.digest }); }, [error]);
  return <main role="alert" style={{ maxWidth: '42rem', margin: '4rem auto', padding: '1rem', textAlign: 'center' }}><h1>مشکلی پیش آمد</h1><p>دریافت اطلاعات کامل نشد. لطفاً دوباره تلاش کنید.</p><button onClick={reset} type="button">تلاش دوباره</button></main>;
}
