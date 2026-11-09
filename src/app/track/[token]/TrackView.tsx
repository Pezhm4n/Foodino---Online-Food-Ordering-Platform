'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import {
  StoreIcon,
  UtensilsIcon,
  CourierIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  TrackRadarIcon,
} from '@/components/ui/FoodVisuals';

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

function getEstimatedDeliveryWindow(createdAt: string): { start: string; end: string } {
  try {
    const created = new Date(createdAt);
    const start = new Date(created.getTime() + 30 * 60 * 1000);
    const end = new Date(created.getTime() + 50 * 60 * 1000);
    const timeOpts: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
    return {
      start: start.toLocaleTimeString('fa-IR', timeOpts),
      end: end.toLocaleTimeString('fa-IR', timeOpts),
    };
  } catch {
    return { start: '۳۵', end: '۵۰ دقیقه' };
  }
}

function getProgressPercent(status: string): number {
  switch (status) {
    case 'pending_payment': return 10;
    case 'confirmed': return 30;
    case 'preparing': return 55;
    case 'ready': return 75;
    case 'delivering': return 90;
    case 'delivered': return 100;
    default: return 0;
  }
}

const PageContainer = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: 1.5rem 1rem 4rem;
  direction: rtl;

  @media (min-width: 768px) {
    padding: 3rem 1.5rem 5rem;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin-bottom: 1.5rem;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 2.1rem;
    margin-bottom: 2rem;
  }
`;

const TrackingCard = styled.section`
  background: #ffffff;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  padding: 1.35rem 1.1rem;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    padding: 2.25rem;
  }
`;

const RestaurantHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  padding-bottom: 1.25rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 0.75rem;

  h2 {
    font-size: 1.3rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.neutral[900]};
    margin: 0;
  }

  span.tag {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.neutral[500]};
    display: block;
    margin-top: 0.25rem;
    font-family: monospace;
  }
`;

const DeliveryWindowCard = styled.div`
  background: linear-gradient(135deg, #1F1814 0%, #31251E 100%);
  color: #FAF6F0;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const DeliveryTimeText = styled.div`
  .label {
    font-size: 0.82rem;
    color: rgba(250, 246, 240, 0.75);
    margin-bottom: 0.3rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-weight: 600;
  }
  .window {
    font-size: 1.45rem;
    font-weight: 900;
    color: #FBBF24;
    letter-spacing: -0.5px;
  }
`;

const CourierVisual = styled.div`
  background: ${({ theme }) => theme.colors.neutral[50]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  .node {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.78rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.neutral[600]};
    z-index: 2;

    .icon-box {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
      color: ${({ theme }) => theme.colors.neutral[500]};
      box-shadow: ${({ theme }) => theme.shadows.xs};
      border: 2px solid ${({ theme }) => theme.colors.neutral[200]};
      transition: all 200ms ease;
    }

    &.active {
      color: ${({ theme }) => theme.colors.neutral[900]};
    }

    &.active .icon-box {
      border-color: ${({ theme }) => theme.colors.primary[500]};
      background: ${({ theme }) => theme.colors.primary[50]};
      color: ${({ theme }) => theme.colors.primary[600]};
      transform: scale(1.06);
    }
  }

  .progress-line {
    position: absolute;
    top: 34px;
    right: 52px;
    left: 52px;
    height: 3px;
    background: ${({ theme }) => theme.colors.neutral[200]};
    z-index: 1;

    .fill {
      height: 100%;
      background: ${({ theme }) => theme.colors.primary[500]};
      border-radius: 9999px;
      transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
  }
`;

const StepperTrack = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 1.5rem 0;
  padding: 0 0.5rem;
`;

const StepItem = styled.div<{ $state: 'completed' | 'current' | 'upcoming' }>`
  display: flex;
  align-items: flex-start;
  gap: 1.15rem;
  position: relative;
  padding-bottom: 1.85rem;

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 34px;
    bottom: 0;
    right: 15px;
    width: 2px;
    background-color: ${({ $state, theme }) =>
      $state === 'completed' ? theme.colors.success[500] : theme.colors.neutral[200]};
  }

  .step-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ $state, theme }) =>
      $state === 'completed'
        ? theme.colors.success[500]
        : $state === 'current'
        ? theme.colors.primary[500]
        : theme.colors.neutral[200]};
    color: white;
    flex-shrink: 0;
    position: relative;
    z-index: 2;
    box-shadow: ${({ $state }) =>
      $state === 'current'
        ? '0 0 0 4px rgba(217, 56, 30, 0.18)'
        : $state === 'completed'
        ? '0 0 0 3px rgba(21, 128, 61, 0.15)'
        : 'none'};
  }

  .step-content {
    flex: 1;
    padding-top: 3px;

    h3 {
      font-size: 0.98rem;
      font-weight: 800;
      color: ${({ $state, theme }) =>
        $state === 'upcoming' ? theme.colors.neutral[400] : theme.colors.neutral[900]};
      margin: 0 0 0.25rem;
    }

    p {
      font-size: 0.85rem;
      color: ${({ theme }) => theme.colors.neutral[500]};
      margin: 0;
      line-height: 1.65;
    }
  }
`;

const StatusPill = styled.div<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 800;
  font-size: 0.88rem;
  background-color: ${({ $status, theme }) =>
    $status === 'delivered' ? theme.colors.success[50] : theme.colors.primary[50]};
  color: ${({ $status, theme }) =>
    $status === 'delivered' ? theme.colors.success[600] : theme.colors.primary[600]};
  border: 1px solid ${({ $status, theme }) =>
    $status === 'delivered' ? theme.colors.success[100] : theme.colors.primary[100]};
`;

const LastUpdated = styled.p`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.neutral[400]};
  margin: 1.5rem 0 0;
  text-align: center;
`;

const BackLink = styled(Link)`
  display: block;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary[600]};
  font-weight: 700;
  text-decoration: none;
  margin-top: 1.5rem;
`;

const stepsSequence = [
  { key: 'confirmed', title: 'سفارش تأیید شد', desc: 'رستوران سفارش شما را دریافت و تأیید کرد.' },
  { key: 'preparing', title: 'در حال آماده‌سازی', desc: 'غذا در آشپزخانه رستوران در حال پخت است.' },
  { key: 'delivering', title: 'تحویل به پیک و ارسال', desc: 'سفیر فودینو با کیف گرم‌نگهدارنده در مسیر نشانی شماست.' },
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
          <p aria-live="polite" style={{ color: '#6E6055', margin: 0 }}>
            در حال دریافت اطلاعات آخرین وضعیت سفارش…
          </p>
        </TrackingCard>
      )}

      {unavailable && (
        <TrackingCard style={{ textAlign: 'center', borderColor: '#FECACA', background: '#FEF2F2' }}>
          <p role="alert" style={{ color: '#991B1B', margin: 0 }}>
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
              {tracking.status === 'delivered' ? <CheckCircleIcon size={16} /> : <TrackRadarIcon size={16} />}
              <span>{labels[tracking.status] ?? tracking.status}</span>
            </StatusPill>
          </RestaurantHeader>

          {tracking.status !== 'canceled' && (
            <>
              {(() => {
                const window = getEstimatedDeliveryWindow(tracking.createdAt);
                const progress = getProgressPercent(tracking.status);
                return (
                  <>
                    <DeliveryWindowCard>
                      <DeliveryTimeText>
                        <div className="label">
                          <ClockIcon size={15} />
                          <span>زمان تقریبی تحویل سفارش</span>
                        </div>
                        <div className="window">{window.start} تا {window.end}</div>
                      </DeliveryTimeText>
                      <div style={{ fontSize: '0.8rem', color: '#FAF6F0', background: 'rgba(255,255,255,0.12)', padding: '0.4rem 0.85rem', borderRadius: '9999px', fontWeight: 700 }}>
                        ارسال اکسپرس فودینو
                      </div>
                    </DeliveryWindowCard>

                    <CourierVisual>
                      <div className="progress-line">
                        <div className="fill" style={{ width: `${progress}%` }} />
                      </div>
                      <div className={`node ${progress >= 25 ? 'active' : ''}`}>
                        <div className="icon-box">
                          <StoreIcon size={19} />
                        </div>
                        <span>رستوران</span>
                      </div>
                      <div className={`node ${progress >= 50 ? 'active' : ''}`}>
                        <div className="icon-box">
                          <UtensilsIcon size={19} />
                        </div>
                        <span>آماده‌سازی</span>
                      </div>
                      <div className={`node ${progress >= 85 ? 'active' : ''}`}>
                        <div className="icon-box">
                          <CourierIcon size={19} />
                        </div>
                        <span>پیک در مسیر</span>
                      </div>
                      <div className={`node ${progress >= 100 ? 'active' : ''}`}>
                        <div className="icon-box">
                          <MapPinIcon size={19} />
                        </div>
                        <span>تحویل شما</span>
                      </div>
                    </CourierVisual>
                  </>
                );
              })()}
            </>
          )}

          {tracking.status === 'canceled' ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#DC2626' }}>
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
                      {state === 'completed' ? <CheckCircleIcon size={15} /> : null}
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
