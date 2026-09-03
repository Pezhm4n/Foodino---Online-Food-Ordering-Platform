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

const DeliveryWindowCard = styled.div`
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
  border: 1px solid #fed7aa;
  border-radius: 1rem;
  padding: 1.15rem 1.25rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.85rem 1rem;
  }
`;

const DeliveryTimeText = styled.div`
  .label {
    font-size: 0.825rem;
    color: #9a3412;
    margin-bottom: 0.2rem;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-weight: 600;
  }
  .window {
    font-size: 1.35rem;
    font-weight: 800;
    color: #c2410c;
    letter-spacing: -0.5px;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      font-size: 1.15rem;
    }
  }
`;

const CourierVisual = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  .node {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #475569;
    z-index: 2;

    .icon-box {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      background: white;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
      border: 2px solid #e2e8f0;
      transition: all 0.3s;
    }

    &.active .icon-box {
      border-color: #ff5a00;
      background: #fff7ed;
      transform: scale(1.1);
    }
  }

  .progress-line {
    position: absolute;
    top: 30px;
    right: 45px;
    left: 45px;
    height: 3px;
    background: #e2e8f0;
    z-index: 1;

    .fill {
      height: 100%;
      background: #ff5a00;
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

  @media (min-width: 768px) {
    margin: 2rem 0;
    padding: 0 1rem;
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
  gap: 1.25rem;
  position: relative;
  padding-bottom: 2rem;

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 32px;
    bottom: 0;
    right: 15px;
    width: 2px;
    background-color: ${({ $state, theme }) =>
      $state === 'completed' ? theme.colors.success[400] : theme.colors.neutral[200]};
    transition: background-color 0.3s ease;
  }

  .step-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    font-weight: 700;
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
    transition: all 0.3s ease;
    animation: ${({ $state }) => ($state === 'current' ? 'pulseGlow 2s infinite' : 'none')};
  }

  .step-content {
    flex: 1;
    padding-top: 3px;

    h3 {
      font-size: 0.95rem;
      font-weight: 700;
      color: ${({ $state, theme }) =>
        $state === 'upcoming' ? theme.colors.neutral[400] : theme.colors.neutral[900]};
      margin: 0 0 0.3rem;

      @media (min-width: 768px) {
        font-size: 1rem;
      }
    }

    p {
      font-size: 0.825rem;
      color: ${({ theme }) => theme.colors.neutral[500]};
      margin: 0;
      line-height: 1.6;

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

          {tracking.status !== 'canceled' && (
            <>
              {(() => {
                const window = getEstimatedDeliveryWindow(tracking.createdAt);
                const progress = getProgressPercent(tracking.status);
                return (
                  <>
                    <DeliveryWindowCard>
                      <DeliveryTimeText>
                        <div className="label">⏱️ زمان تقریبی تحویل سفارش</div>
                        <div className="window">{window.start} تا {window.end}</div>
                      </DeliveryTimeText>
                      <div style={{ fontSize: '0.825rem', color: '#7c2d12', background: 'rgba(255,255,255,0.8)', padding: '0.35rem 0.75rem', borderRadius: '9999px', fontWeight: 700 }}>
                        ارسال اکسپرس فودینو 🚀
                      </div>
                    </DeliveryWindowCard>

                    <CourierVisual>
                      <div className="progress-line">
                        <div className="fill" style={{ width: `${progress}%` }} />
                      </div>
                      <div className={`node ${progress >= 25 ? 'active' : ''}`}>
                        <div className="icon-box">🏪</div>
                        <span>رستوران</span>
                      </div>
                      <div className={`node ${progress >= 50 ? 'active' : ''}`}>
                        <div className="icon-box">👨‍🍳</div>
                        <span>آماده‌سازی</span>
                      </div>
                      <div className={`node ${progress >= 85 ? 'active' : ''}`}>
                        <div className="icon-box">🛵</div>
                        <span>پیک در مسیر</span>
                      </div>
                      <div className={`node ${progress >= 100 ? 'active' : ''}`}>
                        <div className="icon-box">📍</div>
                        <span>تحویل شما</span>
                      </div>
                    </CourierVisual>
                  </>
                );
              })()}
            </>
          )}

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
