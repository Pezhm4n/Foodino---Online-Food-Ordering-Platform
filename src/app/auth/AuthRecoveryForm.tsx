'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { forgotPasswordAction, resetPasswordAction } from '@/app/auth/actions';

const Page = styled.div`
  display: grid;
  min-height: 60vh;
  place-items: center;
  padding: 3rem 1rem;
  direction: rtl;
`;

const Card = styled.section`
  width: min(100%, 28rem);
  padding: 2.25rem;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: white;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const Form = styled.form`display: grid; gap: 1rem;`;
const Input = styled.input`
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;
const Button = styled.button`
  padding: 0.75rem 1rem;
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  cursor: pointer;
  &:disabled { cursor: wait; opacity: 0.65; }
`;
const Message = styled.p<{ $error: boolean }>`
  color: ${({ $error, theme }) => $error ? theme.colors.error[600] : theme.colors.success[600]};
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
        setMessage({ text: 'درخواست انجام نشد. اطلاعات را بررسی کنید.', error: true });
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
        <h1>{mode === 'forgot' ? 'بازیابی رمز عبور' : 'تعیین رمز عبور جدید'}</h1>
        <Form onSubmit={submit}>
          {mode === 'forgot' ? (
            <label>ایمیل<Input name="email" type="email" autoComplete="email" required /></label>
          ) : (
            <>
              <label>رمز عبور جدید<Input name="password" type="password" minLength={12} autoComplete="new-password" required /></label>
              <label>تکرار رمز عبور<Input name="confirmPassword" type="password" minLength={12} autoComplete="new-password" required /></label>
            </>
          )}
          {message && <Message $error={message.error} aria-live="polite">{message.text}</Message>}
          <Button type="submit" disabled={pending}>
            {pending ? 'در حال ارسال...' : mode === 'forgot' ? 'ارسال لینک بازیابی' : 'ذخیره رمز جدید'}
          </Button>
          <Link href="/auth">بازگشت به ورود</Link>
        </Form>
      </Card>
    </Page>
  );
}
