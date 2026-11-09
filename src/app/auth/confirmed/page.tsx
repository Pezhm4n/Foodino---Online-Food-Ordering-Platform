"use client";

import React from 'react';
import styled, { keyframes } from 'styled-components';
import Link from 'next/link';
import {
  CheckCircleIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
} from '@/components/ui/FoodVisuals';

const popIn = keyframes`
  0% {
    transform: scale(0.85);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const PageContainer = styled.main`
  min-height: 78vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.25rem;
  direction: rtl;
`;

const ConfirmationCard = styled.section`
  background: #ffffff;
  width: 100%;
  max-width: 520px;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: 2.75rem 2.25rem 2.25rem;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  text-align: center;
  animation: ${popIn} 0.35s cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 640px) {
    padding: 2rem 1.25rem;
  }
`;

const SuccessBadge = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  border-radius: 24px;
  background: ${({ theme }) => theme.colors.success[50]};
  border: 1px solid ${({ theme }) => theme.colors.success[100]};
  color: ${({ theme }) => theme.colors.success[600]};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 1.65rem;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin: 0 0 0.75rem;
`;

const Description = styled.p`
  font-size: 0.95rem;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.neutral[600]};
  margin: 0 0 1.75rem;
`;

const FeaturesList = styled.div`
  background: ${({ theme }) => theme.colors.neutral[50]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: 1.25rem;
  margin-bottom: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-align: right;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.88rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.neutral[800]};

  .icon {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.success[50]};
    color: ${({ theme }) => theme.colors.success[600]};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;

  @media (min-width: 640px) {
    flex-direction: row-reverse;
  }
`;

const PrimaryButton = styled(Link)`
  flex: 1;
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  padding: 0.9rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  font-weight: 800;
  font-size: 0.95rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: ${({ theme }) => theme.shadows.brand};
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
    transform: translateY(-1px);
  }
`;

const SecondaryButton = styled(Link)`
  flex: 1;
  background: ${({ theme }) => theme.colors.neutral[100]};
  color: ${({ theme }) => theme.colors.neutral[800]};
  padding: 0.9rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral[200]};
  }
`;

export default function EmailConfirmedPage() {
  return (
    <PageContainer>
      <ConfirmationCard>
        <SuccessBadge aria-hidden="true">
          <ShieldCheckIcon size={40} />
        </SuccessBadge>

        <Title>ایمیل شما با موفقیت تأیید شد!</Title>
        <Description>
          به خانواده فودینو خوش آمدید! حساب کاربری شما فعال گردید و اکنون می‌توانید لذت یک سفارش گرم و سریع را تجربه کنید.
        </Description>

        <FeaturesList>
          <FeatureItem>
            <span className="icon">
              <CheckCircleIcon size={15} />
            </span>
            <span>دسترسی به بهترین رستوران‌ها و آشپزخانه‌های برتر شهر</span>
          </FeatureItem>
          <FeatureItem>
            <span className="icon">
              <CheckCircleIcon size={15} />
            </span>
            <span>امکان استفاده از کدهای تخفیف و جشنواره‌های ویژه فودینو</span>
          </FeatureItem>
          <FeatureItem>
            <span className="icon">
              <CheckCircleIcon size={15} />
            </span>
            <span>رهگیری لحظه‌ای موقعیت پیک از آشپزخانه تا درب منزل</span>
          </FeatureItem>
        </FeaturesList>

        <Actions>
          <PrimaryButton href="/restaurants">
            <span>شروع سفارش غذا</span>
            <ArrowLeftIcon size={16} />
          </PrimaryButton>
          <SecondaryButton href="/profile">
            <span>مشاهده حساب کاربری</span>
          </SecondaryButton>
        </Actions>
      </ConfirmationCard>
    </PageContainer>
  );
}
