'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';
import { useCart } from '@/contexts/CartContext';

type Address = Readonly<{ id: string; title: string; city: string; addressLine: string }>;

const Page = styled.main`max-width: 880px; margin: 0 auto; padding: 2rem 1rem;`;
const Card = styled.section`
  margin-bottom: 1rem; padding: 1.5rem; background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
`;
const AddressButton = styled.button<{ $selected: boolean }>`
  width: 100%; margin-top: 0.75rem; padding: 1rem; text-align: right; cursor: pointer;
  border: 2px solid ${({ $selected, theme }) => $selected ? theme.colors.primary[500] : theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md}; background: white;
`;
const PayButton = styled.button`
  width: 100%; padding: 0.9rem; border: 0; cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.success[500]}; color: white;
  &:disabled { cursor: wait; opacity: 0.65; }
`;

export default function CheckoutPage() {
  const router = useRouter();
  const { state, clearCart } = useCart();
  const idempotencyKey = useRef<string | null>(null);
  const [addresses, setAddresses] = useState<readonly Address[]>([]);
  const [addressId, setAddressId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    idempotencyKey.current ??= crypto.randomUUID();
    void fetch('/api/customer/addresses', { cache: 'no-store' }).then(async (response) => {
      if (response.status === 401) {
        router.push('/auth');
        return;
      }
      if (!response.ok) throw new Error('ADDRESS_LOAD_FAILED');
      const body = await response.json() as { items: Address[] };
      setAddresses(body.items);
      setAddressId(body.items[0]?.id ?? '');
    }).catch(() => toast.error('دریافت آدرس‌ها انجام نشد.')).finally(() => setLoading(false));
  }, [router]);

  async function checkout() {
    if (!state.restaurantId || state.items.length === 0 || !addressId || !idempotencyKey.current) {
      toast.error('سبد خرید و آدرس تحویل را تکمیل کنید.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idempotencyKey: idempotencyKey.current,
          addressId,
          restaurantId: state.restaurantId,
          items: state.items.map(({ productId, variantId, addonIds, quantity }) => ({
            productId,
            ...(variantId ? { variantId } : {}),
            addonIds,
            quantity,
          })),
        }),
      });
      const result = await response.json() as {
        orderId?: string;
        trackingToken?: string | null;
        paymentUrl?: string;
        code?: string;
      };
      if (!response.ok || !result.paymentUrl) throw new Error(result.code ?? 'CHECKOUT_FAILED');
      if (result.orderId && result.trackingToken) {
        sessionStorage.setItem(`foodino:tracking:${result.orderId}`, result.trackingToken);
      }
      clearCart();
      window.location.assign(result.paymentUrl);
    } catch {
      toast.error('ثبت سفارش انجام نشد. لطفاً دوباره تلاش کنید.');
      setSubmitting(false);
    }
  }

  return (
    <Page>
      <h1>تکمیل سفارش</h1>
      <Card>
        <h2>آدرس تحویل</h2>
        {loading ? <p>در حال دریافت آدرس‌ها...</p> : addresses.length === 0 ? (
          <p>ابتدا از <Link href="/profile">پروفایل</Link> یک آدرس معتبر ثبت کنید.</p>
        ) : addresses.map((address) => (
          <AddressButton
            type="button"
            key={address.id}
            $selected={address.id === addressId}
            onClick={() => setAddressId(address.id)}
          >
            <strong>{address.title}</strong><br />{address.city}، {address.addressLine}
          </AddressButton>
        ))}
      </Card>
      <Card>
        <h2>اقلام سبد خرید</h2>
        {state.items.length === 0 ? <p>سبد خرید خالی است.</p> : (
          <ul>{state.items.map((item) => <li key={item.id}>{item.name} × {item.quantity}</li>)}</ul>
        )}
        <p>مبلغ نهایی فقط روی سرور و بر اساس قیمت و موجودی لحظه‌ای محاسبه می‌شود.</p>
      </Card>
      <PayButton type="button" onClick={checkout} disabled={submitting || loading || addresses.length === 0}>
        {submitting ? 'در حال ثبت سفارش...' : 'ثبت سفارش و ادامه پرداخت'}
      </PayButton>
    </Page>
  );
}
