'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';
import { useCart } from '@/contexts/CartContext';
import type { CheckoutQuote } from '@/application/ports/order-repository';
import type { CheckoutQuoteInput } from '@/lib/validation/checkout';
import { irrToToman, money } from '@/domain/money/money';
import {
  DishArtwork,
  resolveFoodKind,
  MapPinIcon,
  BagIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  InfoIcon,
  TagIcon,
  StoreIcon,
  PlusIcon,
} from '@/components/ui/FoodVisuals';

type Address = Readonly<{ id: string; title: string; city: string; addressLine: string }>;
type QuoteResult = { key: string } & ({ quote: CheckoutQuote } | { error: string });
type CheckoutAttempt = { request: string; id: string; addressId: string };
const ATTEMPT_KEY = 'foodino:checkout-attempt';

function readAttempt(): CheckoutAttempt | null {
  try {
    const stored = JSON.parse(localStorage.getItem(ATTEMPT_KEY) ?? 'null');
    return stored && typeof stored.request === 'string' && typeof stored.id === 'string'
      && typeof stored.addressId === 'string' ? stored : null;
  } catch {
    return null;
  }
}

function forgetAttempt() {
  try {
    localStorage.removeItem(ATTEMPT_KEY);
  } catch {
    // The current page can still discard the in-memory attempt.
  }
}

function isClosedAttempt(code?: string) {
  return code === 'CHECKOUT_ATTEMPT_CLOSED' || code === 'CHECKOUT_REQUEST_CHANGED';
}

function checkoutMessage(code: string) {
  switch (code) {
    case 'INVALID_COUPON': return 'کد تخفیف معتبر نیست. آن را در سبد خرید تغییر دهید.';
    case 'COUPON_MINIMUM_NOT_MET': return 'مبلغ سفارش به حداقل لازم برای این کد تخفیف نمی‌رسد.';
    case 'COUPON_FIRST_ORDER_ONLY': return 'این کد فقط برای اولین سفارش قابل استفاده است.';
    case 'MINIMUM_ORDER_NOT_MET': return 'مبلغ سبد به حداقل سفارش رستوران نمی‌رسد.';
    case 'RESTAURANT_UNAVAILABLE': return 'این رستوران فعلاً سفارش نمی‌پذیرد.';
    case 'CART_ITEM_UNAVAILABLE': return 'یکی از غذاها یا افزودنی‌های سبد دیگر در دسترس نیست.';
    case 'CHECKOUT_TOTAL_CHANGED': return 'مبلغ سفارش تغییر کرد. مبلغ تازه را بررسی و دوباره تأیید کنید.';
    case 'CHECKOUT_REQUEST_CHANGED': return 'مشخصات این تلاش تغییر کرده است. سبد و آدرس را بررسی کنید.';
    case 'CHECKOUT_ATTEMPT_CLOSED': return 'سفارش قبلی بسته شده است. مبلغ سفارش تازه را بررسی کنید.';
    case 'PAYMENT_PROVIDER_UNAVAILABLE': return 'درگاه پرداخت در دسترس نیست. بعداً دوباره تلاش کنید.';
    default: return 'ثبت سفارش انجام نشد. لطفاً دوباره تلاش کنید.';
  }
}

function formatIrr(amount: number) {
  return `${irrToToman(money(amount)).toLocaleString('fa-IR')} تومان`;
}

const Page = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 5rem;
  direction: rtl;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 1.5rem 1rem 3.5rem;
  }
`;

const TopBar = styled.div`
  text-align: center;
  margin-bottom: 2.25rem;
`;

const HeaderTitle = styled.h1`
  font-size: clamp(1.65rem, 3vw, 2.25rem);
  font-weight: 900;
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin: 0 0 1.25rem;
  letter-spacing: -0.02em;
`;

const Stepper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  padding: 0.65rem 1.35rem;
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: 999px;
  box-shadow: ${({ theme }) => theme.shadows.xs};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: 0.4rem;
    padding: 0.5rem 0.9rem;
  }
`;

const Step = styled.div<{ $active?: boolean; $completed?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.88rem;
  font-weight: ${({ $active }) => ($active ? 800 : 600)};
  color: ${({ $active, $completed, theme }) =>
    $active
      ? theme.colors.primary[600]
      : $completed
      ? theme.colors.success[600]
      : theme.colors.neutral[400]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.76rem;
    gap: 0.3rem;
  }
`;

const StepDot = styled.span<{ $active?: boolean; $completed?: boolean }>`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  font-weight: 800;
  background-color: ${({ $active, $completed, theme }) =>
    $completed
      ? theme.colors.success[500]
      : $active
      ? theme.colors.primary[500]
      : theme.colors.neutral[200]};
  color: ${({ $active, $completed, theme }) =>
    $completed || $active ? '#ffffff' : theme.colors.neutral[600]};
`;

const StepDivider = styled.div<{ $completed?: boolean }>`
  width: 36px;
  height: 2px;
  background-color: ${({ $completed, theme }) =>
    $completed ? theme.colors.success[500] : theme.colors.neutral[200]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 14px;
  }
`;

const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: 1.75rem;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Card = styled.section`
  padding: 1.65rem;
  background: #ffffff;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 1.15rem 1rem;
    border-radius: ${({ theme }) => theme.borderRadius.xl};
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[100]};

  h2 {
    font-size: 1.15rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.neutral[900]};
    display: flex;
    align-items: center;
    gap: 0.55rem;
    margin: 0;
  }
`;

const HeaderIconBadge = styled.span`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.primary[50]};
  color: ${({ theme }) => theme.colors.primary[600]};
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const AddressGrid = styled.div`
  display: grid;
  gap: 0.85rem;
`;

const AddressButton = styled.button<{ $selected: boolean }>`
  width: 100%;
  padding: 1.15rem;
  text-align: right;
  cursor: pointer;
  border: 2px solid ${({ $selected, theme }) =>
    $selected ? theme.colors.primary[500] : theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: ${({ $selected, theme }) => ($selected ? theme.colors.primary[50] : '#ffffff')};
  transition: all 0.2s ease;
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[400]};
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
  background: #ffffff;

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
    font-size: 0.98rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.neutral[900]};
    display: block;
    margin-bottom: 0.25rem;
  }

  p {
    font-size: 0.88rem;
    color: ${({ theme }) => theme.colors.neutral[600]};
    margin: 0;
    line-height: 1.6;
  }
`;

const ItemsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ItemRow = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.85rem;
  padding: 0.85rem 1rem;
  background-color: ${({ theme }) => theme.colors.neutral[50]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};

  span.name {
    font-weight: 800;
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.neutral[900]};
  }

  span.qty {
    background: #ffffff;
    border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
    color: ${({ theme }) => theme.colors.primary[600]};
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.82rem;
    font-weight: 800;
    white-space: nowrap;
  }
`;

const ItemRowLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  overflow-wrap: anywhere;
`;

const SummaryCard = styled.aside`
  padding: 1.65rem;
  background: #ffffff;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  box-shadow: ${({ theme }) => theme.shadows.md};
  position: sticky;
  top: 96px;
`;

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: wrap;
  padding: 0.6rem 0;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.neutral[600]};

  strong {
    color: ${({ theme }) => theme.colors.neutral[900]};
    font-weight: 700;
  }

  > a, > button {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    padding-inline: 0.75rem;
    border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background: ${({ theme }) => theme.colors.neutral[50]};
    color: ${({ theme }) => theme.colors.neutral[800]};
    cursor: pointer;
  }
`;

const SummaryTotalRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.85rem;
  padding-top: 1rem;
  border-top: 2px solid ${({ theme }) => theme.colors.neutral[100]};
  font-weight: 900;
  color: ${({ theme }) => theme.colors.neutral[900]};

  span:last-child {
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const NoticeBox = styled.div`
  margin-top: 1rem;
  background: ${({ theme }) => theme.colors.neutral[50]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 0.75rem 0.9rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.neutral[600]};
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  line-height: 1.6;
`;

const PayButton = styled.button`
  width: 100%;
  margin-top: 1.25rem;
  padding: 1rem 1.25rem;
  border: 0;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  font-size: 1rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  box-shadow: ${({ theme }) => theme.shadows.brand};
  transition: all 0.2s ease;
  min-height: 48px;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary[600]};
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
    transform: none;
    box-shadow: none;
  }
`;

const AddAddressLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary[50]};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[100]};
  }
`;

const RestaurantBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.primary[600]};
  background: ${({ theme }) => theme.colors.primary[50]};
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-weight: 700;
`;

export default function CheckoutPage() {
  const router = useRouter();
  const {
    state,
    clearCart,
    appliedCoupon,
  } = useCart();
  const attempt = useRef<CheckoutAttempt | null>(null);
  const [addresses, setAddresses] = useState<readonly Address[]>([]);
  const [selectedAddressId, setAddressId] = useState('');
  const [storedAttempt, setStoredAttempt] = useState<CheckoutAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [addressError, setAddressError] = useState(false);
  const [addressRevision, setAddressRevision] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null);
  const [quoteRevision, setQuoteRevision] = useState(0);
  const couponCode = appliedCoupon?.code;
  const selection = useMemo<CheckoutQuoteInput | null>(() => state.restaurantId && state.items.length > 0 ? {
    restaurantId: state.restaurantId,
    couponCode,
    items: state.items.map(({ productId, variantId, addonIds, quantity, notes }) => ({
      productId, variantId, addonIds: [...addonIds], quantity, notes: notes?.trim() || undefined,
    })),
  } : null, [state.restaurantId, state.items, couponCode]);
  const orderNote = state.orderNote?.trim() || undefined;
  const previousAddress = storedAttempt && addresses.some(address => address.id === storedAttempt.addressId)
    && storedAttempt.request === JSON.stringify({ selection, addressId: storedAttempt.addressId, orderNote })
    ? storedAttempt.addressId : null;
  const addressId = selectedAddressId || previousAddress || addresses[0]?.id || '';
  const request = selection ? JSON.stringify({ selection, addressId, orderNote }) : null;
  const quoteKey = request ? `${quoteRevision}:${request}` : null;
  const currentQuote = quoteResult?.key === quoteKey ? quoteResult : null;
  const quote = currentQuote && 'quote' in currentQuote ? currentQuote.quote : null;

  useEffect(() => {
    const controller = new AbortController();
    void fetch('/api/customer/addresses', { cache: 'no-store', signal: controller.signal }).then(async (response) => {
      if (response.status === 401) {
        if (!controller.signal.aborted) router.push('/auth?next=/checkout');
        return;
      }
      if (!response.ok) throw new Error('ADDRESS_LOAD_FAILED');
      const body = await response.json() as { items: Address[] };
      if (!controller.signal.aborted) {
        setAddresses(body.items);
        setStoredAttempt(readAttempt());
      }
    }).catch(() => {
      if (!controller.signal.aborted) setAddressError(true);
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [router, addressRevision]);

  useEffect(() => {
    if (!selection || !request || !quoteKey || loading) return;
    const controller = new AbortController();
    const previous = attempt.current ?? storedAttempt;
    const previousId = previous?.request === request ? previous.id : undefined;
    void fetch('/api/checkout/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        ...selection,
        ...(previousId ? { idempotencyKey: previousId, addressId, orderNote } : {}),
      }),
    }).then(async (response) => {
      if (response.status === 401) {
        if (!controller.signal.aborted) router.push('/auth?next=/checkout');
        return;
      }
      if (!response.ok) {
        const { code } = await response.json() as { code: string };
        if (!controller.signal.aborted && previousId && isClosedAttempt(code)) {
          forgetAttempt();
          attempt.current = null;
          setStoredAttempt(null);
          setAddressId(addressId);
          setQuoteRevision(value => value + 1);
          toast.error(checkoutMessage(code));
          return;
        }
        if (!controller.signal.aborted) setQuoteResult({
          key: quoteKey,
          error: code === 'CHECKOUT_QUOTE_FAILED' ? 'دریافت مبلغ سفارش انجام نشد.' : checkoutMessage(code),
        });
        return;
      }
      const quote = await response.json() as CheckoutQuote;
      if (!controller.signal.aborted) setQuoteResult({ key: quoteKey, quote });
    }).catch(() => {
      if (!controller.signal.aborted) setQuoteResult({ key: quoteKey, error: 'دریافت مبلغ سفارش انجام نشد.' });
    });
    return () => controller.abort();
  }, [selection, request, quoteKey, loading, router, storedAttempt, addressId, orderNote]);

  async function checkout() {
    if (submitting) return;
    if (!selection || !request || !addressId || !quote) {
      toast.error('سبد خرید و آدرس تحویل را تکمیل کنید.');
      return;
    }
    const previous = attempt.current ?? storedAttempt;
    const id = previous?.request === request ? previous.id : crypto.randomUUID();
    attempt.current = { request, id, addressId };
    try {
      localStorage.setItem(ATTEMPT_KEY, JSON.stringify(attempt.current));
    } catch {
      // The in-memory key still supports retries in this view.
    }
    setSubmitting(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...selection,
          idempotencyKey: id,
          addressId,
          orderNote,
          expectedTotalIrr: quote.totalIrr,
        }),
      });
      if (response.status === 401) {
        router.push('/auth?next=/checkout');
        return;
      }
      const result = await response.json() as {
        orderId?: string;
        trackingToken?: string | null;
        paymentUrl?: string;
        code?: string;
      };
      if (!response.ok || !result.paymentUrl) {
        if (isClosedAttempt(result.code)) {
          forgetAttempt();
          attempt.current = null;
          setStoredAttempt(null);
          setAddressId(addressId);
        }
        if (response.status === 422 || result.code === 'CHECKOUT_TOTAL_CHANGED' || isClosedAttempt(result.code)) {
          setQuoteRevision(value => value + 1);
        }
        throw new Error(result.code ?? 'CHECKOUT_FAILED');
      }
      try {
        if (result.orderId && result.trackingToken) {
          sessionStorage.setItem(`foodino:tracking:${result.orderId}`, result.trackingToken);
        }
      } catch {
        // Storage availability must not interrupt a successful checkout.
      }
      forgetAttempt();
      clearCart();
      window.location.assign(result.paymentUrl);
    } catch (error) {
      toast.error(checkoutMessage(error instanceof Error ? error.message : 'CHECKOUT_FAILED'));
      setSubmitting(false);
    }
  }

  return (
    <Page>
      <TopBar>
        <HeaderTitle>تکمیل و پرداخت سفارش</HeaderTitle>
        <Stepper>
          <Step $completed>
            <StepDot $completed>
              <CheckCircleIcon size={14} />
            </StepDot>
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
      </TopBar>

      <LayoutGrid>
        <MainColumn>
          <Card>
            <SectionHeader>
              <h2>
                <HeaderIconBadge>
                  <MapPinIcon size={18} />
                </HeaderIconBadge>
                <span>آدرس تحویل سفارش</span>
              </h2>
              <AddAddressLink href="/profile">
                <PlusIcon size={14} />
                <span>ثبت آدرس جدید</span>
              </AddAddressLink>
            </SectionHeader>

            {loading ? (
              <p style={{ color: '#6E6055', margin: 0 }}>در حال دریافت آدرس‌های منتخب شما...</p>
            ) : addressError ? (
              <SummaryRow>
                <span role="alert">دریافت آدرس‌ها انجام نشد.</span>
                <button type="button" onClick={() => {
                  setAddressError(false);
                  setLoading(true);
                  setAddressRevision(value => value + 1);
                }}>تلاش دوباره</button>
              </SummaryRow>
            ) : addresses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                <p style={{ marginBottom: '1rem', color: '#6E6055' }}>هنوز هیچ آدرسی در حساب کاربری خود ثبت نکرده‌اید.</p>
                <AddAddressLink href="/profile">
                  ثبت آدرس در پروفایل کاربری
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
                    disabled={submitting}
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
              <h2>
                <HeaderIconBadge>
                  <BagIcon size={18} />
                </HeaderIconBadge>
                <span>اقلام سبد خرید</span>
              </h2>
              {state.restaurantName && (
                <RestaurantBadge>
                  <StoreIcon size={14} />
                  <span>{state.restaurantName}</span>
                </RestaurantBadge>
              )}
            </SectionHeader>

            {state.items.length === 0 ? (
              <p style={{ color: '#6E6055', margin: 0 }}>سبد خرید شما خالی است.</p>
            ) : (
              <ItemsList>
                {state.items.map((item) => {
                  const foodKind = resolveFoodKind(`${item.name} ${state.restaurantName ?? ''}`);
                  return (
                    <ItemRow key={item.id}>
                      <ItemRowLeft>
                        <DishArtwork kind={foodKind} size={42} />
                        <div>
                          <span className="name">{item.name}</span>
                          {item.notes && (
                            <div style={{ fontSize: '0.78rem', color: '#6E6055', marginTop: '0.2rem' }}>
                              یادداشت: {item.notes}
                            </div>
                          )}
                        </div>
                      </ItemRowLeft>
                      <span className="qty">{item.quantity.toLocaleString('fa-IR')} عدد</span>
                    </ItemRow>
                  );
                })}
              </ItemsList>
            )}

            {state.orderNote && (
              <div style={{ marginTop: '0.9rem', padding: '0.7rem 0.95rem', background: '#FAF6F0', borderRadius: '12px', fontSize: '0.85rem', color: '#4A3F37', overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>
                <strong>یادداشت شما برای سفارش:</strong> {state.orderNote}
              </div>
            )}

            {quote?.couponCode && (
              <div style={{ marginTop: '0.75rem', padding: '0.65rem 0.9rem', background: '#ECFDF5', borderRadius: '12px', fontSize: '0.84rem', color: '#15803D', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <TagIcon size={15} />
                <span><strong>کد تخفیف تأییدشده:</strong> {quote.couponCode}</span>
              </div>
            )}
          </Card>
        </MainColumn>

        <SummaryCard>
          <SectionHeader style={{ marginBottom: '1rem' }}>
            <h2>خلاصه صورت‌حساب</h2>
          </SectionHeader>

          {quote ? (
            <>
              <SummaryRow>
                <span>جمع اقلام</span>
                <strong>{formatIrr(quote.subtotalIrr)}</strong>
              </SummaryRow>
              <SummaryRow>
                <span>هزینه ارسال پیک</span>
                <strong>{formatIrr(quote.deliveryFeeIrr)}</strong>
              </SummaryRow>
              {quote.taxIrr > 0 && (
                <SummaryRow>
                  <span>مالیات</span>
                  <strong>{formatIrr(quote.taxIrr)}</strong>
                </SummaryRow>
              )}
              {quote.discountIrr > 0 && (
                <SummaryRow style={{ color: '#15803D' }}>
                  <span>{quote.couponCode === 'FREESHIP' ? 'تخفیف ارسال' : 'تخفیف سفارش'}</span>
                  <strong>- {formatIrr(quote.discountIrr)}</strong>
                </SummaryRow>
              )}
              <SummaryTotalRow>
                <span>مبلغ قابل پرداخت</span>
                <span>{formatIrr(quote.totalIrr)}</span>
              </SummaryTotalRow>
            </>
          ) : (
            <NoticeBox role={currentQuote && 'error' in currentQuote ? 'alert' : 'status'}>
              <InfoIcon size={17} />
              <span>{currentQuote && 'error' in currentQuote
                ? currentQuote.error
                : selection ? 'در حال دریافت مبلغ سفارش از سرور…' : 'سبد خرید شما خالی است.'}</span>
            </NoticeBox>
          )}
          {currentQuote && 'error' in currentQuote && (
            <SummaryRow>
              <Link href="/cart">ویرایش سبد خرید</Link>
              <button type="button" onClick={() => setQuoteRevision(value => value + 1)}>تلاش دوباره</button>
            </SummaryRow>
          )}

          <PayButton
            type="button"
            onClick={checkout}
            disabled={submitting || loading || !addressId || !quote}
          >
            <ShieldCheckIcon size={19} />
            <span>{submitting ? 'در حال اتصال به درگاه پرداخت...' : 'ثبت سفارش و ادامه پرداخت'}</span>
          </PayButton>
        </SummaryCard>
      </LayoutGrid>
    </Page>
  );
}
