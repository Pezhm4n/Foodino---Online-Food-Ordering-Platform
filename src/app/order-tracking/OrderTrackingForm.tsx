'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import {
  TrackRadarIcon,
  CourierIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  AlertCircleIcon,
} from '@/components/ui/FoodVisuals';

const Container = styled.div`
  max-width: 720px;
  margin: 3rem auto;
  padding: 2rem 1.5rem;
  direction: rtl;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin: 1rem auto;
    padding: 1.25rem 1rem 3rem;
  }
`;

const Card = styled.section`
  background: #ffffff;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  padding: 2.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 1.5rem 1.15rem;
    border-radius: ${({ theme }) => theme.borderRadius.xl};
  }
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
`;

const RadarIconBox = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 18px;
  background: linear-gradient(135deg, #1F1814 0%, #33261E 100%);
  color: #FBBF24;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Title = styled.h1`
  font-size: 1.85rem;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin: 0 0 0.25rem;
  letter-spacing: -0.02em;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.45rem;
  }
`;

const SubKicker = styled.span`
  font-size: 0.82rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.neutral[600]};
  font-size: 0.95rem;
  line-height: 1.75;
  margin: 0 0 1.75rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
`;

const Label = styled.label`
  font-size: 0.88rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.neutral[800]};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  font-size: 0.95rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  background: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  direction: ltr;
  text-align: left;
  font-family: monospace;
  color: ${({ theme }) => theme.colors.neutral[900]};
  transition: border-color 0.2s, background-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    background: #ffffff;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const ErrorText = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: ${({ theme }) => theme.colors.error[600]};
  background: ${({ theme }) => theme.colors.error[50]};
  border: 1px solid ${({ theme }) => theme.colors.error[100]};
  padding: 0.5rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0;
`;

const SubmitButton = styled.button`
  padding: 0.95rem 1.5rem;
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: ${({ theme }) => theme.shadows.brand};
  transition: background 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;

  @media (hover: hover) {
    &:hover {
      background: ${({ theme }) => theme.colors.primary[600]};
      transform: translateY(-2px);
    }
  }

  &:active {
    transform: scale(0.98);
  }
`;

const TelemetryHighlights = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.85rem;
  margin-top: 1.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[100]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const HighlightPill = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.75rem 0.9rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.neutral[50]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.neutral[700]};
  font-weight: 600;
`;

const RecentBox = styled.div`
  margin-top: 1.5rem;
  padding: 1rem 1.25rem;
  background: ${({ theme }) => theme.colors.primary[50]};
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const RecentText = styled.span`
  font-size: 0.88rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.neutral[800]};
`;

const RecentLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary[600]};
  text-decoration: none;
  min-height: 34px;
`;

const LinksFooter = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.neutral[600]};
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  min-height: 34px;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getRecentTokenSnapshot(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key?.startsWith('foodino:tracking:')) {
        const val = sessionStorage.getItem(key);
        if (val && /^[A-Za-z0-9_-]{43}$/.test(val)) {
          return val;
        }
      }
    }
  } catch {
    return null;
  }
  return null;
}

function getServerSnapshot(): string | null {
  return null;
}

export default function OrderTrackingForm() {
  const router = useRouter();
  const [tokenInput, setTokenInput] = useState('');
  const [error, setError] = useState('');
  const recentToken = useSyncExternalStore(subscribe, getRecentTokenSnapshot, getServerSnapshot);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const trimmed = tokenInput.trim();
    if (!trimmed) {
      setError('لطفاً کد رهگیری سفارش را وارد کنید.');
      return;
    }
    if (!/^[A-Za-z0-9_-]{43}$/.test(trimmed)) {
      setError('کد رهگیری باید یک رشته ۴۳ حرفی معتبر باشد.');
      return;
    }
    router.push(`/track/${trimmed}`);
  }

  return (
    <Container>
      <Card>
        <HeaderTop>
          <RadarIconBox>
            <TrackRadarIcon size={28} />
          </RadarIconBox>
          <div>
            <SubKicker>تلِمتری زنده فودینو</SubKicker>
            <Title>پیگیری سفارش</Title>
          </div>
        </HeaderTop>

        <Description>
          برای مشاهده وضعیت لحظه‌ای پخت در آشپزخانه و موقعیت سفیر، کد رهگیری ۴۳ حرفی اختصاصی سفارش خود را وارد نمایید.
        </Description>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="tracking-token">کد رهگیری سفارش:</Label>
            <Input
              id="tracking-token"
              type="text"
              placeholder="abc123def456_..."
              aria-label="کد رهگیری سفارش"
              value={tokenInput}
              onChange={(e) => {
                setTokenInput(e.target.value);
                if (error) setError('');
              }}
              autoComplete="off"
              spellCheck={false}
            />
            {error && (
              <ErrorText role="alert">
                <AlertCircleIcon size={16} />
                <span>{error}</span>
              </ErrorText>
            )}
          </FormGroup>

          <SubmitButton type="submit">
            <span>پیگیری سفارش</span>
            <ArrowLeftIcon size={17} />
          </SubmitButton>
        </Form>

        {recentToken && (
          <RecentBox>
            <RecentText>آخرین سفارش ثبت‌شده در این مرورگر:</RecentText>
            <RecentLink href={`/track/${recentToken}`}>
              <span>مشاهده وضعیت سفارش</span>
              <ArrowLeftIcon size={15} />
            </RecentLink>
          </RecentBox>
        )}

        <TelemetryHighlights>
          <HighlightPill>
            <CourierIcon size={18} />
            <span>به‌روزرسانی خودکار هر ۱۰ ثانیه</span>
          </HighlightPill>
          <HighlightPill>
            <ShieldCheckIcon size={18} />
            <span>توکن رمزنگاری‌شده ۲۵۶ بیتی</span>
          </HighlightPill>
        </TelemetryHighlights>

        <LinksFooter>
          <FooterLink href="/profile">مشاهده تمام سفارش‌های من</FooterLink>
          <FooterLink href="/">بازگشت به خانه</FooterLink>
        </LinksFooter>
      </Card>
    </Container>
  );
}
