'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';

type Tracking = Readonly<{
  status: string;
  restaurantName: string;
  createdAt: string;
  updatedAt: string;
}>;

const labels: Record<string, string> = {
  pending_payment: 'در انتظار پرداخت',
  confirmed: 'سفارش تأیید شد',
  preparing: 'در حال آماده‌سازی',
  ready: 'آماده ارسال',
  delivering: 'در حال ارسال',
  delivered: 'تحویل داده شد',
  canceled: 'لغو شد',
};

const PageContainer = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 1.25rem 0.85rem 3.5rem;
  direction: rtl;

  @media (min-width: 768px) {
    padding: 3rem 1.5rem 5rem;
  }
`;

const Title = styled.h1`
  font-size: 1.35rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin-bottom: 1.25rem;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
`;

const TrackingCard = styled.section`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.07);
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  padding: 1rem 0.85rem;
  margin-bottom: 1.25rem;

  @media (min-width: 768px) {
    padding: 2.25rem;
    margin-bottom: 1.5rem;
  }
`;

const RestaurantHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 0.75rem;

  @media (min-width: 768px) {
    padding-bottom: 1.25rem;
    margin-bottom: 2rem;
  }

  h2 {
    font-size: 1.2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.neutral[900]};
    margin: 0;

    @media (min-width: 768px) {
      font-size: 1.35rem;
    }
  }

  span.tag {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.neutral[500]};
    display: block;
    margin-top: 0.2rem;
  }
`;

const StepperTrack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: relative;
  margin: 1.5rem 0;
  padding-right: 1.25rem;

  @media (min-width: 768px) {
    gap: 1.5rem;
    margin: 2rem 0;
    padding-right: 1.5rem;
  }

  &::before {
    content: '';
    position: absolute;
    top: 14px;
    bottom: 14px;
    right: 25px;
    width: 2px;
    background-color: ${({ theme }) => theme.colors.neutral[200]};

    @media (min-width: 768px) {
      right: 27px;
      width: 3px;
    }
  }
`;

const StepItem = styled.div<{ $state: 'completed' | 'current' | 'upcoming' }>`
  @keyframes pulseGlow {
    0% { box-shadow: 0 0 0 0 rgba(255, 90, 0, 0.4); }
    70% { box-shadow: 0 0 0 8px rgba(255, 90, 0, 0); }
    100% { box-shadow: 0 0 0 0 rgba(255, 90, 0, 0); }
  }

  display: flex;
  align-items: flex-start;
  gap: 1rem;
  position: relative;
  z-index: 1;

  @media (min-width: 768px) {
    gap: 1.25rem;
  }

  .step-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 700;
    background-color: ${({ $state, theme }) =>
      $state === 'completed'
        ? theme.colors.success[500]
        : $state === 'current'
        ? theme.colors.primary[500]
        : theme.colors.neutral[200]};
    color: white;
    flex-shrink: 0;
    animation: ${({ $state }) => ($state === 'current' ? 'pulseGlow 2s infinite' : 'none')};
  }

  .step-content {
    h3 {
      font-size: 0.95rem;
      font-weight: 700;
      color: ${({ $state, theme }) =>
        $state === 'upcoming' ? theme.colors.neutral[400] : theme.colors.neutral[900]};
      margin: 0 0 0.2rem;

      @media (min-width: 768px) {
        font-size: 1rem;
      }
    }

    p {
      font-size: 0.8rem;
      color: ${({ theme }) => theme.colors.neutral[500]};
      margin: 0;
      line-height: 1.5;

      @media (min-width: 768px) {
        font-size: 0.85rem;
      }
    }
  }
`;

const StatusPill = styled.div<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  background-color: ${({ $status }) => ($status === 'delivered' ? '#dcfce7' : '#fff7ed')};
  color: ${({ $status }) => ($status === 'delivered' ? '#15803d' : '#c2410c')};
  border: 1px solid ${({ $status }) => ($status === 'delivered' ? '#bbf7d0' : '#fed7aa')};
`;

const LastUpdated = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.neutral[400]};
  margin: 1.5rem 0 0;
  text-align: center;
`;

const BackLink = styled(Link)`
  display: block;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary[600]};
  font-weight: 600;
  text-decoration: none;
  margin-top: 1.5rem;

  &:hover {
    text-decoration: underline;
  }
`;

const stepsSequence = [
  { key: 'confirmed', title: 'سفارش تأیید شد', desc: 'رستوران سفارش شما را دریافت و تأیید کرد.' },
  { key: 'preparing', title: 'در حال آماده‌سازی', desc: 'غذا در آشپزخانه رستوران در حال پخت است.' },
  { key: 'delivering', title: 'تحویل به پیک و ارسال', desc: 'پیک در مسیر تحویل غذای گرم به نشانی شماست.' },
  { key: 'delivered', title: 'تحویل سفارش', desc: 'سفارش با موفقیت تحویل داده شد. نوش جان!' },
];

function getStepState(stepKey: string, currentStatus: string): 'completed' | 'current' | 'upcoming' {
  const order = ['confirmed', 'preparing', 'delivering', 'delivered'];
  const currentIndex = order.indexOf(currentStatus);
  const stepIndex = order.indexOf(stepKey);

  if (currentStatus === 'delivered') return 'completed';
  if (currentIndex === -1) return 'upcoming';
  if (stepIndex < currentIndex) return 'completed';
  if (stepIndex === currentIndex) return 'current';
  return 'upcoming';
}

export default function TrackView({ token }: Readonly<{ token: string }>) {
  const [tracking, setTracking] = useState<Tracking | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    async function poll() {
      if (!active || document.hidden) return;
      try {
        const response = await fetch(`/api/track/${encodeURIComponent(token)}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('TRACKING_UNAVAILABLE');
        const result = await response.json() as Tracking;
        if (!active) return;
        setTracking(result);
        setUnavailable(false);
        if (result.status !== 'delivered' && result.status !== 'canceled') {
          timer = setTimeout(poll, 10_000);
        }
      } catch {
        if (!active) return;
        setUnavailable(true);
        timer = setTimeout(poll, 10_000);
      }
    }
    function visibilityChanged() {
      if (!document.hidden) void poll();
      else if (timer) clearTimeout(timer);
    }
    document.addEventListener('visibilitychange', visibilityChanged);
    void poll();
    return () => {
      active = false;
      if (timer) clearTimeout(timer);
      document.removeEventListener('visibilitychange', visibilityChanged);
    };
  }, [token]);

  return (
    <PageContainer>
      <Title>وضعیت لحظه‌ای سفارش</Title>
      
      {!tracking && !unavailable && (
        <TrackingCard style={{ textAlign: 'center', padding: '3rem' }}>
          <p aria-live="polite" style={{ color: '#64748b' }}>در حال دریافت اطلاعات آخرین وضعیت سفارش…</p>
        </TrackingCard>
      )}

      {unavailable && (
        <TrackingCard style={{ textAlign: 'center', borderColor: '#fecaca', background: '#fef2f2' }}>
          <p role="alert" style={{ color: '#991b1b', margin: 0 }}>
            اطلاعات سفارش در حال حاضر در دسترس نیست؛ سیستم به صورت خودکار مجدداً تلاش خواهد کرد.
          </p>
        </TrackingCard>
      )}

      {tracking && (
        <TrackingCard aria-live="polite">
          <RestaurantHeader>
            <div>
              <h2>{tracking.restaurantName}</h2>
              <span className="tag">کد رهگیری: {token.slice(0, 10)}…</span>
            </div>
            <StatusPill $status={tracking.status}>
              <span>{tracking.status === 'delivered' ? '✓' : '⚡'}</span>
              <span>{labels[tracking.status] ?? tracking.status}</span>
            </StatusPill>
          </RestaurantHeader>

          {tracking.status === 'canceled' ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#dc2626' }}>
              <h3>این سفارش لغو شده است</h3>
              <p>در صورت کسر وجه، مبلغ ظرف حداکثر ۷۲ ساعت به حساب شما بازخواهد گشت.</p>
            </div>
          ) : (
            <StepperTrack>
              {stepsSequence.map((step) => {
                const state = getStepState(step.key, tracking.status);
                return (
                  <StepItem key={step.key} $state={state}>
                    <div className="step-icon">
                      {state === 'completed' ? '✓' : ''}
                    </div>
                    <div className="step-content">
                      <h3>{step.title}</h3>
                      <p>{step.desc}</p>
                    </div>
                  </StepItem>
                );
              })}
            </StepperTrack>
          )}

          <LastUpdated>
            آخرین به‌روزرسانی:{' '}
            {(() => {
              try {
                const d = new Date(tracking.updatedAt);
                return `${d.toLocaleTimeString('fa-IR')} — ${d.toLocaleDateString('fa-IR')}`;
              } catch {
                return tracking.updatedAt;
              }
            })()}
          </LastUpdated>
        </TrackingCard>
      )}

      <BackLink href="/">بازگشت به صفحه اصلی</BackLink>
    </PageContainer>
  );
}
