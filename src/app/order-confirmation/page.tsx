import { notFound, permanentRedirect, redirect } from 'next/navigation';
import { uuidSchema } from '@/lib/validation/common';

export default async function LegacyOrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const rawId = typeof params.id === 'string' ? params.id : undefined;
  if (!rawId) {
    redirect('/');
  }

  const parsed = uuidSchema.safeParse(rawId);
  if (parsed.success) {
    permanentRedirect(`/orders/${parsed.data}`);
  }

  notFound();
}

