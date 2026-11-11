'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import type { PublicTracking } from '@/application/ports/order-repository';
import type { OrderStatus } from '@/domain/order/order-status';
import { CheckCircleIcon, ClockIcon, CourierIcon, MapPinIcon, StoreIcon, TrackRadarIcon, UtensilsIcon } from '@/components/ui/FoodVisuals';

const labels: Record<OrderStatus, string> = {
  pending_payment: 'در انتظار پرداخت',
  confirmed: 'سفارش تأیید شد',
  preparing: 'در حال آماده‌سازی',
  ready: 'آماده ارسال',
  delivering: 'پیک در مسیر است',
  delivered: 'تحویل داده شد',
  canceled: 'سفارش لغو شد',
};

const demoLabels: Record<OrderStatus, string> = {
  pending_payment: 'در انتظار پرداخت آزمایشی',
  confirmed: 'سفارش آزمایشی تأیید شد',
  preparing: 'نمایش آماده‌سازی غذا',
  ready: 'نمایش آمادگی ارسال',
  delivering: 'نمایش مسیر پیک',
  delivered: 'نمایش تحویل تکمیل شد',
  canceled: 'سفارش آزمایشی لغو شد',
};

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
`;

const TrackingSummary = styled.div`
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

const SummaryTime = styled.div`
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
  align-items: flex-start;
  justify-content: space-between;
  position: relative;

  @media (max-width: 420px) {
    padding-inline: 0.5rem;
  }

  @media (prefers-reduced-motion: reduce) {
    .node .icon-box, .progress-line .fill { transition: none; }
  }

  .node {
    flex: 1;
    min-width: 0;
    text-align: center;
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
      transition: border-color 200ms ease, background-color 200ms ease, color 200ms ease;
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
    top: calc(1.25rem + 20.5px);
    inset-inline: calc(12.5% + 1.125rem);
    @media (max-width: 420px) {
      inset-inline: calc(12.5% + 0.375rem);
    }
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

const StepperTrack = styled.ol`
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 1.5rem 0;
  padding: 0 0.5rem;
  list-style: none;
`;

const StepItem = styled.li<{ $state: 'completed' | 'current' | 'upcoming' }>`
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
        $state === 'upcoming' ? theme.colors.neutral[600] : theme.colors.neutral[900]};
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

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  color: ${({ theme }) => theme.colors.primary[700]};
  font-weight: 700;
`;

const TrackingNotice = styled.p<{ $tone: 'error' | 'warning' }>`
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 0.85rem 1rem;
  background: ${({ theme, $tone }) => theme.colors[$tone][50]};
  color: ${({ theme, $tone }) => theme.colors[$tone][800]};
  margin: 0 0 0.85rem;

  &:last-child { margin-bottom: 0; }
`;

const steps = [
  { key: 'confirmed', description: 'پرداخت تأیید شد و سفارش ثبت شد.' },
  { key: 'preparing', description: 'آماده‌سازی غذا در آشپزخانهٔ رستوران.' },
  { key: 'ready', description: 'غذا آمادهٔ ارسال شد.' },
  { key: 'delivering', description: 'سفارش به پیک سپرده شده است.' },
  { key: 'delivered', description: 'سفارش به مقصد رسیده است. نوش جان!' },
] as const;

const demoDescriptions: Record<(typeof steps)[number]['key'], string> = {
  confirmed: 'پرداخت آزمایشی موفق ثبت شد. هیچ پولی جابه‌جا نشده است.',
  preparing: 'این مرحله فقط نمایش آماده‌سازی است؛ غذای واقعی آماده نمی‌شود.',
  ready: 'نمایش آماده بودن سفارش؛ ارسال واقعی انجام نمی‌شود.',
  delivering: 'مسیر پیک فقط نمایشی است؛ پیک واقعی اعزام نمی‌شود.',
  delivered: 'روند نمایشی تحویل پایان یافته است؛ تحویل واقعی انجام نشده است.',
};

const progressNodes = [
  { step: 0, title: 'رستوران', icon: StoreIcon },
  { step: 1, title: 'آماده‌سازی', icon: UtensilsIcon },
  { step: 3, title: 'در مسیر', icon: CourierIcon },
  { step: 4, title: 'تحویل', icon: MapPinIcon },
];

const refreshInterval = 10_000;
export default function TrackView({ token }: Readonly<{ token: string }>) {
  const [tracking, setTracking] = useState<PublicTracking | null>(null);
  const [problem, setProblem] = useState<'missing' | 'offline' | null>(null);

  useEffect(() => {
    let terminal = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let request: AbortController | undefined;
    let delay = refreshInterval;

    function pause() {
      clearTimeout(timer);
      request?.abort();
      request = undefined;
    }

    async function poll() {
      if (terminal || document.hidden || request) return;
      const controller = new AbortController();
      request = controller;
      try {
        const response = await fetch('/api/track/' + encodeURIComponent(token), {
          cache: 'no-store',
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        if (response.status === 404) {
          terminal = true;
          setProblem('missing');
          return;
        }
        if (!response.ok) throw new Error('Tracking request failed');
        const result = await response.json() as PublicTracking;
        if (controller.signal.aborted) return;
        setTracking(result);
        setProblem(null);
        terminal = result.status === 'delivered' || result.status === 'canceled';
        delay = refreshInterval;
      } catch {
        if (controller.signal.aborted) return;
        setProblem('offline');
        delay = Math.min(delay * 2, 60_000);
      } finally {
        if (!controller.signal.aborted) {
          request = undefined;
          if (!terminal && !document.hidden) timer = setTimeout(poll, delay);
        }
      }
    }

    function visibilityChanged() {
      if (document.hidden) pause();
      else void poll();
    }

    document.addEventListener('visibilitychange', visibilityChanged);
    void poll();
    return () => {
      pause();
      document.removeEventListener('visibilitychange', visibilityChanged);
    };
  }, [token]);

  const currentStep = steps.findIndex((step) => step.key === tracking?.status);
  const reachedNodes = progressNodes.filter((node) => node.step <= currentStep).length;
  const progress = Math.max(0, reachedNodes - 1) / (progressNodes.length - 1);
  const statusLabels = tracking?.isDemo ? demoLabels : labels;

  return (
    <PageContainer>
      <Title>{tracking?.isDemo ? 'پیگیری سفارش آزمایشی' : 'پیگیری سفارش'}</Title>
      <TrackingCard aria-label="وضعیت سفارش">
        {problem === 'missing' ? (
          <TrackingNotice $tone="error" role="alert">این سفارش پیدا نشد. کد رهگیری را بررسی کنید.</TrackingNotice>
        ) : (
          <>
            {problem === 'offline' && (
              <TrackingNotice $tone="warning" role="status">فعلاً نمی‌توانیم وضعیت سفارش را بررسی کنیم. تا کمی دیگر دوباره تلاش می‌کنیم.</TrackingNotice>
            )}
            {!tracking && !problem && <p role="status">در حال بررسی وضعیت سفارش…</p>}
            {tracking && (
              <>
                {tracking.isDemo && <TrackingNotice $tone="warning">
                  <strong>این سفارش آزمایشی است.</strong> هیچ پولی جابه‌جا نشده است. مراحل آماده‌سازی، مسیر پیک و تحویل فقط نمایشی هستند و ارسال واقعی انجام نمی‌شود.
                </TrackingNotice>}
                <RestaurantHeader>
                  <h2>{tracking.restaurantName}</h2>
                  <StatusPill role="status" $status={tracking.status}><TrackRadarIcon size={16} />{statusLabels[tracking.status]}</StatusPill>
                </RestaurantHeader>
                <TrackingSummary>
                  <SummaryTime>
                    <div className="label"><ClockIcon size={16} /> آخرین تغییر سفارش</div>
                    <time className="window" dateTime={tracking.updatedAt}>
                      {new Date(tracking.updatedAt).toLocaleString('fa-IR', { dateStyle: 'medium', timeStyle: 'short' })}
                    </time>
                  </SummaryTime>
                </TrackingSummary>
                {tracking.status !== 'canceled' && (
                  <>
                    <CourierVisual aria-hidden="true">
                      <div className="progress-line"><div className="fill" style={{ width: progress * 100 + '%' }} /></div>
                      {progressNodes.map(({ step, title, icon: Icon }) => (
                        <div key={step} className={'node' + (step <= currentStep ? ' active' : '')}>
                          <span className="icon-box"><Icon size={19} /></span>
                          <span>{title}</span>
                        </div>
                      ))}
                    </CourierVisual>
                    <StepperTrack aria-label="مراحل سفارش">
                      {steps.map((step, index) => {
                        const state = index < currentStep || tracking.status === 'delivered'
                          ? 'completed' : index === currentStep ? 'current' : 'upcoming';
                        return (
                          <StepItem key={step.key} $state={state} aria-current={index === currentStep ? 'step' : undefined}>
                            <span className="step-icon" aria-hidden="true">{state === 'completed' ? <CheckCircleIcon size={16} /> : null}</span>
                            <div className="step-content">
                              <h3>{!tracking.isDemo && step.key === 'preparing' ? 'آماده‌سازی غذا' : statusLabels[step.key]}</h3>
                              {state !== 'upcoming' && <p>{tracking.isDemo ? demoDescriptions[step.key] : step.description}</p>}
                            </div>
                          </StepItem>
                        );
                      })}
                    </StepperTrack>
                  </>
                )}
              </>
            )}
          </>
        )}
      </TrackingCard>
      <BackLink href="/order-tracking">پیگیری سفارش دیگر</BackLink>
    </PageContainer>
  );
}
