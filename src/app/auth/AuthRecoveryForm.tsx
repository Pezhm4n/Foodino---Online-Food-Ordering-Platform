'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { forgotPasswordAction, resetPasswordAction } from '@/app/auth/actions';
import { FoodinoEmblem, ArrowLeftIcon } from '@/components/ui/FoodVisuals';

const Page = styled.div`
  display: grid;
  min-height: 68vh;
  place-items: center;
  padding: 3rem 1rem;
  direction: rtl;
`;

const Card = styled.section`
  width: min(100%, 28rem);
  padding: 2.5rem 2rem;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  background: #ffffff;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const HeaderWrap = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;

  h1 {
    font-size: 1.5rem;
    font-weight: 900;
    color: ${({ theme }) => theme.colors.neutral[900]};
    margin: 0.75rem 0 0.35rem;
  }

  p {
    font-size: 0.88rem;
    color: ${({ theme }) => theme.colors.neutral[500]};
    margin: 0;
    line-height: 1.6;
  }
`;

const Form = styled.form`
  display: grid;
  gap: 1.15rem;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  font-size: 0.88rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.neutral[800]};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 0.95rem;
  border: 1.5px solid ${({ theme }) => theme.colors.neutral[300]};
  background: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: 0.95rem;
  outline: none;
  direction: ltr;

  &:focus {
    background: #ffffff;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const Button = styled.button`
  padding: 0.85rem 1.25rem;
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.brand};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary[600]};
  }

  &:disabled {
    cursor: wait;
    opacity: 0.65;
  }
`;

const Message = styled.p<{ $error: boolean }>`
  margin: 0;
  padding: 0.75rem 0.9rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: 0.85rem;
  font-weight: 600;
  background: ${({ $error }) => ($error ? '#FEF2F2' : '#ECFDF5')};
  color: ${({ $error, theme }) => ($error ? theme.colors.error[600] : theme.colors.success[600])};
  border: 1px solid ${({ $error }) => ($error ? '#FECACA' : '#A7F3D0')};
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  font-size: 0.88rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.neutral[600]};
  text-decoration: none;
  margin-top: 0.35rem;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

export default function AuthRecoveryForm({ mode }: Readonly<{ mode: 'forgot' | 'reset' }>) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = form.get('email');
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (mode === 'reset' && password !== confirmPassword) {
      setMessage({ text: 'تکرار رمز عبور یکسان نیست.', error: true });
      return;
    }

    setPending(true);
    setMessage(null);
    try {
      const result = mode === 'forgot'
        ? await forgotPasswordAction({ email })
        : await resetPasswordAction({ password });
      if (!result.ok) {
        setMessage({ text: result.message || 'درخواست انجام نشد. اطلاعات را بررسی کنید.', error: true });
        return;
      }
      if (mode === 'forgot') {
        setMessage({
          text: 'اگر حسابی با این ایمیل وجود داشته باشد، لینک بازیابی ارسال می‌شود.',
          error: false,
        });
      } else {
        router.push('/auth?reset=success');
      }
    } catch {
      setMessage({ text: 'درخواست انجام نشد. دوباره تلاش کنید.', error: true });
    } finally {
      setPending(false);
    }
  }

  return (
    <Page>
      <Card>
        <HeaderWrap>
          <FoodinoEmblem size={42} />
          <h1>{mode === 'forgot' ? 'بازیابی رمز عبور' : 'تعیین رمز عبور جدید'}</h1>
          <p>
            {mode === 'forgot'
              ? 'ایمیل حساب کاربری خود را وارد کنید تا لینک امن تغییر رمز ارسال شود.'
              : 'رمز عبور جدید حداقل ۶ کاراکتری خود را وارد و تکرار کنید.'}
          </p>
        </HeaderWrap>
        <Form onSubmit={submit}>
          {mode === 'forgot' ? (
            <Label>
              ایمیل
              <Input name="email" type="email" autoComplete="email" placeholder="user@example.com" required />
            </Label>
          ) : (
            <>
              <Label>
                رمز عبور جدید
                <Input name="password" type="password" minLength={6} autoComplete="new-password" required />
              </Label>
              <Label>
                تکرار رمز عبور
                <Input name="confirmPassword" type="password" minLength={6} autoComplete="new-password" required />
              </Label>
            </>
          )}
          {message && <Message $error={message.error} aria-live="polite">{message.text}</Message>}
          <Button type="submit" disabled={pending}>
            {pending ? 'در حال ارسال...' : mode === 'forgot' ? 'ارسال لینک بازیابی' : 'ذخیره رمز جدید'}
          </Button>
          <BackLink href="/auth">
            <span>بازگشت به ورود</span>
            <ArrowLeftIcon size={14} />
          </BackLink>
        </Form>
      </Card>
    </Page>
  );
}
