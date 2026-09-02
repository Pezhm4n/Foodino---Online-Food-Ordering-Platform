'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';
import { useCart } from '@/contexts/CartContext';

type Address = Readonly<{ id: string; title: string; city: string; addressLine: string }>;

const Page = styled.div`
  max-width: 860px;
  margin: 0 auto;
  padding: 2.5rem 1rem 4rem;
  direction: rtl;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 1.25rem 0.85rem 3rem;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin-bottom: 1.5rem;
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }
`;

const Stepper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: 0.35rem;
    margin-bottom: 1.5rem;
  }
`;

const Step = styled.div<{ $active?: boolean; $completed?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  color: ${({ $active, $completed, theme }) =>
    $active
      ? theme.colors.primary[500]
      : $completed
      ? theme.colors.success[600]
      : theme.colors.neutral[400]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.78rem;
    gap: 0.35rem;
  }
`;

const StepDot = styled.span<{ $active?: boolean; $completed?: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  background-color: ${({ $active, $completed, theme }) =>
    $completed
      ? theme.colors.success[500]
      : $active
      ? theme.colors.primary[500]
      : theme.colors.neutral[200]};
  color: white;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 24px;
    height: 24px;
    font-size: 0.72rem;
  }
`;

const StepDivider = styled.div<{ $completed?: boolean }>`
  width: 40px;
  height: 2px;
  background-color: ${({ $completed, theme }) =>
    $completed ? theme.colors.success[500] : theme.colors.neutral[200]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 16px;
  }
`;

const Card = styled.section`
  margin-bottom: 1.5rem;
  padding: 1.75rem;
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 1rem 0.85rem;
    border-radius: 0.85rem;
    margin-bottom: 1rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;

  h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.neutral[900]};
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      font-size: 1.05rem;
    }
  }
`;

const AddressGrid = styled.div`
  display: grid;
  gap: 0.75rem;
`;

const AddressButton = styled.button<{ $selected: boolean }>`
  width: 100%;
  padding: 1.1rem;
  text-align: right;
  cursor: pointer;
  border: 2px solid ${({ $selected, theme }) =>
    $selected ? theme.colors.primary[500] : theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ $selected }) => ($selected ? '#fff7ed' : 'white')};
  transition: all 0.2s ease;
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[400]};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.75rem 0.85rem;
    gap: 0.65rem;
  }
`;

const RadioCircle = styled.span<{ $selected: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${({ $selected, theme }) =>
    $selected ? theme.colors.primary[500] : theme.colors.neutral[300]};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.2rem;
  flex-shrink: 0;

  &::after {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${({ $selected, theme }) =>
      $selected ? theme.colors.primary[500] : 'transparent'};
  }
`;

const AddressContent = styled.div`
  flex: 1;

  strong {
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.neutral[900]};
    display: block;
    margin-bottom: 0.25rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      font-size: 0.9rem;
      margin-bottom: 0.15rem;
    }
  }

  p {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.neutral[600]};
    margin: 0;
    line-height: 1.5;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      font-size: 0.8rem;
    }
  }
`;

const ItemsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
`;

const ItemRow = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1rem;
  background-color: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.95rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.65rem 0.75rem;
    font-size: 0.85rem;
  }

  span.name {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.neutral[800]};
  }

  span.qty {
    background: ${({ theme }) => theme.colors.primary[100]};
    color: ${({ theme }) => theme.colors.primary[700]};
    padding: 0.2rem 0.6rem;
    border-radius: 9999px;
    font-size: 0.85rem;
    font-weight: 600;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      font-size: 0.75rem;
      padding: 0.15rem 0.5rem;
    }
  }
`;

const NoticeBox = styled.div`
  background: ${({ theme }) => theme.colors.neutral[50]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.neutral[600]};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.6rem 0.75rem;
    font-size: 0.78rem;
  }
`;

const PayButton = styled.button`
  width: 100%;
  padding: 1.1rem;
  border: 0;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.success[500]};
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 14px rgba(34, 197, 94, 0.3);
  transition: all 0.2s ease;
  min-height: 44px;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.success[600]};
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
    border-radius: 0.65rem;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
    box-shadow: none;
  }
`;

const AddAddressLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
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
      <HeaderTitle>تکمیل و پرداخت سفارش</HeaderTitle>
      
      <Stepper>
        <Step $completed>
          <StepDot $completed>✓</StepDot>
          <span>سبد خرید</span>
        </Step>
        <StepDivider $completed />
        <Step $active>
          <StepDot $active>۲</StepDot>
          <span>نشانی و پرداخت</span>
        </Step>
        <StepDivider />
        <Step>
          <StepDot>۳</StepDot>
          <span>تأیید سفارش</span>
        </Step>
      </Stepper>

      <Card>
        <SectionHeader>
          <h2>📍 آدرس تحویل سفارش</h2>
          <AddAddressLink href="/profile">+ ثبت آدرس جدید</AddAddressLink>
        </SectionHeader>

        {loading ? (
          <p style={{ color: '#64748b' }}>در حال دریافت آدرس‌ها...</p>
        ) : addresses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <p style={{ marginBottom: '1rem', color: '#64748b' }}>هنوز هیچ آدرسی ثبت نکرده‌اید.</p>
            <AddAddressLink href="/profile" style={{ display: 'inline-block', padding: '0.6rem 1.25rem', backgroundColor: '#ff5a00', color: 'white', borderRadius: '0.5rem' }}>
              ثبت آدرس در پروفایل
            </AddAddressLink>
          </div>
        ) : (
          <AddressGrid>
            {addresses.map((address) => (
              <AddressButton
                type="button"
                key={address.id}
                $selected={address.id === addressId}
                onClick={() => setAddressId(address.id)}
              >
                <RadioCircle $selected={address.id === addressId} />
                <AddressContent>
                  <strong>{address.title}</strong>
                  <p>{address.city}، {address.addressLine}</p>
                </AddressContent>
              </AddressButton>
            ))}
          </AddressGrid>
        )}
      </Card>

      <Card>
        <SectionHeader>
          <h2>🛍️ اقلام سبد خرید</h2>
          {state.restaurantName && (
            <span style={{ fontSize: '0.9rem', color: '#ff5a00', fontWeight: 600 }}>
              {state.restaurantName}
            </span>
          )}
        </SectionHeader>

        {state.items.length === 0 ? (
          <p style={{ color: '#64748b' }}>سبد خرید شما خالی است.</p>
        ) : (
          <ItemsList>
            {state.items.map((item) => (
              <ItemRow key={item.id}>
                <span className="name">{item.name}</span>
                <span className="qty">{item.quantity} عدد</span>
              </ItemRow>
            ))}
          </ItemsList>
        )}

        <NoticeBox>
          <span>ℹ️</span>
          <span>مبلغ و فاکتور نهایی بر اساس قیمت لحظه‌ای و هزینه ارسال در درگاه محاسبه خواهد شد.</span>
        </NoticeBox>
      </Card>

      <PayButton
        type="button"
        onClick={checkout}
        disabled={submitting || loading || addresses.length === 0 || state.items.length === 0}
      >
        <span>🔒</span>
        <span>{submitting ? 'در حال اتصال به درگاه پرداخت...' : 'ثبت سفارش و ادامه پرداخت'}</span>
      </PayButton>
    </Page>
  );
}
