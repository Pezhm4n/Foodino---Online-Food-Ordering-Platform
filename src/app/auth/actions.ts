'use server';

import { redirect } from 'next/navigation';
import { assertSameOrigin } from '@/infrastructure/http/same-origin';
import { getServerEnv } from '@/infrastructure/config/server-env';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from '@/lib/validation/auth';

export type AuthActionResult = Readonly<{
  ok: boolean;
  code?: 'AUTH_FAILED' | 'INVALID_INPUT' | 'EMAIL_CONFIRMATION_REQUIRED';
  fieldErrors?: Record<string, string>;
  message?: string;
}>;

function formatZodErrors(issues: import('zod').ZodIssue[]): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const field = issue.path[0];
    if (typeof field === 'string' && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }
  return fieldErrors;
}

export async function loginAction(input: unknown): Promise<AuthActionResult> {
  await assertSameOrigin();
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      code: 'INVALID_INPUT',
      fieldErrors: formatZodErrors(parsed.error.issues),
      message: 'لطفاً اطلاعات ورودی را بررسی کنید.',
    };
  }
  const client = await createSupabaseServerClient();
  const { error } = await client.auth.signInWithPassword(parsed.data);
  if (error) {
    return {
      ok: false,
      code: 'AUTH_FAILED',
      message: 'ایمیل یا رمز عبور اشتباه است.',
    };
  }
  return { ok: true };
}

export async function registerAction(input: unknown): Promise<AuthActionResult> {
  await assertSameOrigin();
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      code: 'INVALID_INPUT',
      fieldErrors: formatZodErrors(parsed.error.issues),
      message: 'لطفاً خطاهای مشخص‌شده در فرم را اصلاح فرمایید.',
    };
  }
  const env = getServerEnv();
  const client = await createSupabaseServerClient();
  const { data, error } = await client.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${env.APP_URL}/auth/callback?next=/profile`,
      data: {
        first_name: parsed.data.firstName,
        last_name: parsed.data.lastName,
        phone: parsed.data.phone,
      },
    },
  });
  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes('already registered') || msg.includes('user already exists')) {
      return {
        ok: false,
        code: 'AUTH_FAILED',
        fieldErrors: { email: 'این ایمیل قبلاً در سیستم ثبت‌نام شده است.' },
        message: 'این ایمیل قبلاً ثبت‌نام شده است. لطفاً وارد شوید.',
      };
    }
    if (msg.includes('password') && msg.includes('short')) {
      return {
        ok: false,
        code: 'AUTH_FAILED',
        fieldErrors: { password: 'رمز عبور باید قوی‌تر و حداقل ۸ کاراکتر باشد.' },
        message: 'رمز عبور وارد شده ضعیف است.',
      };
    }
    return {
      ok: false,
      code: 'AUTH_FAILED',
      message: error.message || 'ثبت‌نام انجام نشد. لطفاً دوباره تلاش کنید.',
    };
  }
  return data.session
    ? { ok: true, message: 'ثبت‌نام با موفقیت انجام شد.' }
    : {
        ok: true,
        code: 'EMAIL_CONFIRMATION_REQUIRED',
        message: 'لینک فعال‌سازی به ایمیل شما ارسال شد. لطفاً صندوق ورودی خود را بررسی کنید.',
      };
}

export async function forgotPasswordAction(input: unknown): Promise<AuthActionResult> {
  await assertSameOrigin();
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      code: 'INVALID_INPUT',
      fieldErrors: formatZodErrors(parsed.error.issues),
      message: 'لطفاً یک ایمیل معتبر وارد کنید.',
    };
  }
  const env = getServerEnv();
  const client = await createSupabaseServerClient();
  // Always return the same result to avoid account enumeration.
  await client.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${env.APP_URL}/auth/callback?next=/auth/reset-password`,
  });
  return { ok: true, message: 'اگر حسابی با این ایمیل وجود داشته باشد، لینک بازیابی ارسال شد.' };
}

export async function resetPasswordAction(input: unknown): Promise<AuthActionResult> {
  await assertSameOrigin();
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      code: 'INVALID_INPUT',
      fieldErrors: formatZodErrors(parsed.error.issues),
      message: 'رمز عبور باید حداقل ۸ کاراکتر باشد.',
    };
  }
  const client = await createSupabaseServerClient();
  const { error } = await client.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return {
      ok: false,
      code: 'AUTH_FAILED',
      message: 'تغییر رمز عبور انجام نشد. لطفاً دوباره تلاش کنید.',
    };
  }
  return { ok: true, message: 'رمز عبور با موفقیت تغییر کرد.' };
}

export async function logoutAction(): Promise<never> {
  await assertSameOrigin();
  const client = await createSupabaseServerClient();
  await client.auth.signOut();
  redirect('/');
}
