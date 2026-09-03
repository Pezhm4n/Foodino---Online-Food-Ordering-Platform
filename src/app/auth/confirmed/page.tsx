"use client";

import React from 'react';
import styled, { keyframes } from 'styled-components';
import Link from 'next/link';

const popIn = keyframes`
  0% {
    transform: scale(0.6);
    opacity: 0;
  }
  70% {
    transform: scale(1.08);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
`;

const PageContainer = styled.main`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.25rem;
  direction: rtl;
`;

const ConfirmationCard = styled.section`
  background: white;
  width: 100%;
  max-width: 520px;
  border-radius: 1.5rem;
  padding: 3rem 2rem 2.5rem;
  box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  text-align: center;
  animation: ${popIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 640px) {
    padding: 2.25rem 1.25rem 2rem;
  }
`;

const SuccessBadge = styled.div`
  width: 88px;
  height: 88px;
  margin: 0 auto 1.75rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.75rem;
  box-shadow: 0 10px 25px rgba(34, 197, 94, 0.25);
  animation: ${float} 3s ease-in-out infinite;
`;

const Title = styled.h1`
  font-size: 1.65rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.75rem;

  @media (max-width: 640px) {
    font-size: 1.4rem;
  }
`;

const Description = styled.p`
  font-size: 0.95rem;
  line-height: 1.75;
  color: #64748b;
  margin: 0 0 2rem;
`;

const FeaturesList = styled.div`
  background: #f8fafc;
  border-radius: 1rem;
  padding: 1.25rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-align: right;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.88rem;
  font-weight: 600;
  color: #334155;

  .icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #ecfdf5;
    color: #10b981;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
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
  background: #ea580c;
  color: white;
  padding: 0.9rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 14px rgba(234, 88, 12, 0.3);
  transition: all 0.2s;

  &:hover {
    background: #c2410c;
    transform: translateY(-1px);
  }
`;

const SecondaryButton = styled(Link)`
  flex: 1;
  background: #f1f5f9;
  color: #334155;
  padding: 0.9rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: #e2e8f0;
    color: #0f172a;
  }
`;

export default function EmailConfirmedPage() {
  return (
    <PageContainer>
      <ConfirmationCard>
        <SuccessBadge aria-hidden="true">🎉</SuccessBadge>

        <Title>ایمیل شما با موفقیت تأیید شد!</Title>
        <Description>
          به خانواده فودینو خوش آمدید! حساب کاربری شما فعال گردید و اکنون می‌توانید لذت یک سفارش گرم و سریع را تجربه کنید.
        </Description>

        <FeaturesList>
          <FeatureItem>
            <span className="icon">✓</span>
            <span>دسترسی به بهترین رستوران‌ها و فست‌فودهای برتر شهر</span>
          </FeatureItem>
          <FeatureItem>
            <span className="icon">✓</span>
            <span>امکان استفاده از کدهای تخفیف و جشنواره‌های ویژه فودینو</span>
          </FeatureItem>
          <FeatureItem>
            <span className="icon">✓</span>
            <span>رهگیری لحظه‌ای موقعیت پیک از آشپزخانه تا درب منزل</span>
          </FeatureItem>
        </FeaturesList>

        <Actions>
          <PrimaryButton href="/restaurants">
            <span>شروع سفارش غذا</span>
            <span aria-hidden="true">←</span>
          </PrimaryButton>
          <SecondaryButton href="/profile">
            <span>مشاهده حساب کاربری</span>
          </SecondaryButton>
        </Actions>
      </ConfirmationCard>
    </PageContainer>
  );
}
