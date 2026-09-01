'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';

export default function TrackingLink({ orderId }: Readonly<{ orderId: string }>) {
  const token = useSyncExternalStore(
    () => () => undefined,
    () => sessionStorage.getItem(`foodino:tracking:${orderId}`),
    () => null,
  );
  return token ? <p><Link href={`/track/${token}`}>پیگیری عمومی این سفارش</Link></p> : null;
}
