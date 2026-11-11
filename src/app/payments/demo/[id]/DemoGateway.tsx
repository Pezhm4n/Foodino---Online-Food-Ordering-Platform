'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { BagIcon, CheckCircleIcon, InfoIcon, StoreIcon } from '@/components/ui/FoodVisuals';
import { irrToToman, money } from '@/domain/money/money';

const Page = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: 1.5rem 1rem 4rem;
  direction: rtl;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) { padding: 3rem 1.5rem 5rem; }
`;
const Panel = styled.section`
  padding: 1.25rem;
  background: ${({ theme }) => theme.colors.neutral[50]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  h1 { margin: 0.8rem 0; font-size: clamp(1.65rem, 4vw, 2.25rem); font-weight: 900; color: ${({ theme }) => theme.colors.neutral[900]}; }
  p { line-height: 1.9; margin: 0; color: ${({ theme }) => theme.colors.neutral[600]}; }
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) { padding: 2.25rem; }
`;
const Summary = styled.div`
  margin: 1.5rem 0;
  padding: 1.1rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: white;
  display: grid;
  gap: 1rem;
  > div { display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem; justify-content: space-between; }
  span { display: inline-flex; align-items: center; gap: 0.45rem; color: ${({ theme }) => theme.colors.neutral[600]}; }
  strong { color: ${({ theme }) => theme.colors.neutral[900]}; overflow-wrap: anywhere; }
`;
const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1.25rem 0;
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) { flex-direction: row; }
`;
const Choice = styled.button<{ $secondary?: boolean }>`
  flex: 1;
  min-height: 48px;
  padding: 0.9rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme, $secondary }) => $secondary ? theme.colors.neutral[300] : theme.colors.primary[600]};
  color: ${({ theme, $secondary }) => $secondary ? theme.colors.neutral[900] : '#ffffff'};
  background: ${({ theme, $secondary }) => $secondary ? '#ffffff' : theme.colors.primary[600]};
  font: inherit;
  font-weight: 800;
  cursor: pointer;
  &:hover:not(:disabled) { background: ${({ theme, $secondary }) => $secondary ? theme.colors.neutral[100] : theme.colors.primary[700]}; }
  &:active:not(:disabled) { transform: translateY(1px); }
  &:focus-visible { outline: 3px solid ${({ theme }) => theme.colors.primary[700]}; outline-offset: 3px; }
  &:disabled { opacity: 0.65; cursor: wait; }
`;
const BackLink = styled(Link)`
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary[700]};
  font-weight: 700;
  text-underline-offset: 4px;
  &:hover { color: ${({ theme }) => theme.colors.primary[900]}; }
  &:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
`;

export default function DemoGateway({ orderId, amountIrr, restaurantName }: { orderId: string; amountIrr: number; restaurantName: string }) {
  const router = useRouter();
  const [pending, setPending] = useState<'succeeded' | 'failed' | null>(null);
  const [error, setError] = useState('');

  async function complete(outcome: 'succeeded' | 'failed') {
    if (pending) return;
    setPending(outcome);
    setError('');
    try {
      const response = await fetch(`/payments/demo/${orderId}/complete`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ outcome }) });
      if (response.status === 401) { router.push(`/auth?next=/payments/demo/${orderId}`); return; }
      if (!response.ok) throw new Error('DEMO_COMPLETION_FAILED');
      const body = await response.json() as { receiptUrl: string };
      router.push(body.receiptUrl);
    } catch {
      setError('ثبت نتیجه انجام نشد. دوباره تلاش کنید؛ نتیجهٔ ثبت‌شده تغییر نمی‌کند.');
      setPending(null);
    }
  }

  return <Page><Panel aria-labelledby="demo-title">
    <BagIcon size={32} />
    <h1 id="demo-title">درگاه پرداخت آزمایشی</h1>
    <p>این پرداخت فقط برای نمایش روند سفارش است. هیچ پولی جابه‌جا نمی‌شود و نیازی به اطلاعات کارت بانکی ندارید.</p>
    <Summary>
      <div><span><StoreIcon size={18} />رستوران</span><strong>{restaurantName}</strong></div>
      <div><span>شماره سفارش</span><strong dir="ltr">{orderId.slice(0, 8)}</strong></div>
      <div><span>مبلغ نمایشی سفارش</span><strong>{irrToToman(money(amountIrr)).toLocaleString('fa-IR')} تومان</strong></div>
    </Summary>
    <p><CheckCircleIcon size={17} /> نتیجهٔ پرداخت آزمایشی را انتخاب کنید. با انتخاب ناموفق، سبد خرید برای تلاش دوباره حفظ می‌شود.</p>
    <Actions aria-busy={!!pending}>
      <Choice type="button" disabled={!!pending} onClick={() => complete('succeeded')}>{pending === 'succeeded' ? 'در حال ثبت نتیجه…' : 'پرداخت آزمایشی موفق'}</Choice>
      <Choice type="button" $secondary disabled={!!pending} onClick={() => complete('failed')}>{pending === 'failed' ? 'در حال ثبت نتیجه…' : 'پرداخت آزمایشی ناموفق'}</Choice>
    </Actions>
    {error && <p role="alert"><InfoIcon size={17} /> {error}</p>}
    <BackLink href="/checkout">بازگشت به تکمیل سفارش</BackLink>
  </Panel></Page>;
}
