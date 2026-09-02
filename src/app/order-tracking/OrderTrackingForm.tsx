'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 680px;
  margin: 3rem auto;
  padding: 2rem 1.5rem;
  direction: rtl;
`;

const Card = styled.section`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  padding: 2.25rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin-bottom: 0.75rem;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.neutral[600]};
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.85rem 1rem;
  font-size: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  direction: ltr;
  text-align: left;
  font-family: monospace;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.error[500]};
  font-size: 0.85rem;
  margin: 0;
`;

const SubmitButton = styled.button`
  padding: 0.85rem 1.5rem;
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const RecentBox = styled.div`
  margin-top: 2rem;
  padding: 1rem 1.25rem;
  background: ${({ theme }) => theme.colors.neutral[50]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RecentText = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

const RecentLink = styled(Link)`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary[600]};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const LinksFooter = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
`;

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.neutral[600]};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
    text-decoration: underline;
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
        <Title>پیگیری سفارش</Title>
        <Description>
          برای مشاهده وضعیت لحظه‌ای سفارش، کد رهگیری ۴۳ حرفی اختصاصی خود را وارد نمایید.
        </Description>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="tracking-token">کد رهگیری سفارش:</Label>
            <Input
              id="tracking-token"
              type="text"
              placeholder="مثال: abc123def456_..."
              value={tokenInput}
              onChange={(e) => {
                setTokenInput(e.target.value);
                if (error) setError('');
              }}
              autoComplete="off"
              spellCheck={false}
            />
            {error && <ErrorText role="alert">{error}</ErrorText>}
          </FormGroup>

          <SubmitButton type="submit">پیگیری سفارش</SubmitButton>
        </Form>

        {recentToken && (
          <RecentBox>
            <RecentText>آخرین سفارش ثبت‌شده در این مرورگر:</RecentText>
            <RecentLink href={`/track/${recentToken}`}>مشاهده وضعیت سفارش</RecentLink>
          </RecentBox>
        )}

        <LinksFooter>
          <FooterLink href="/profile">مشاهده تمام سفارش‌های من</FooterLink>
          <FooterLink href="/">بازگشت به خانه</FooterLink>
        </LinksFooter>
      </Card>
    </Container>
  );
}
