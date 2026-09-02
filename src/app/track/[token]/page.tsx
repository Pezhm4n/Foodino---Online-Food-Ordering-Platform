import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TrackView from '@/app/track/[token]/TrackView';
import { trackingTokenParamsSchema } from '@/lib/validation/common';

export const metadata: Metadata = {
  title: 'پیگیری سفارش | فودینو',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default async function TrackingPage({ params }: { params: Promise<{ token: string }> }) {
  const parsed = trackingTokenParamsSchema.safeParse(await params);
  if (!parsed.success) notFound();
  return <TrackView token={parsed.data.token} />;
}
