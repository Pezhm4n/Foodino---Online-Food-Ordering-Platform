import type { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import { trackingTokenSchema } from '@/lib/validation/common';
import OrderTrackingForm from './OrderTrackingForm';

export const metadata: Metadata = {
  title: 'پیگیری سفارش | فودینو',
  description: 'وضعیت آماده‌سازی و ارسال غذای خود را با کد رهگیری در فودینو ببینید.',
};

export default async function OrderTrackingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const rawToken = typeof params.token === 'string' ? params.token : undefined;
  if (rawToken) {
    const parsed = trackingTokenSchema.safeParse(rawToken);
    if (parsed.success) {
      permanentRedirect(`/track/${parsed.data}`);
    }
  }

  return <OrderTrackingForm />;
}
