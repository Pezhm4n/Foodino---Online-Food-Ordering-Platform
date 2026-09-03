'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { assertSameOrigin } from '@/infrastructure/http/same-origin';
import { getServerEnv } from '@/infrastructure/config/server-env';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { createSupabaseAdminClient } from '@/infrastructure/supabase/admin';
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

function toAsciiDigits(str: string): string {
  return str
    .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1728))
    .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1584));
}

export async function registerAction(input: unknown): Promise<AuthActionResult> {
  await assertSameOrigin();
  const rawInput = typeof input === 'object' && input !== null ? (input as Record<string, unknown>) : {};
  const normalizedInput = {
    ...rawInput,
    phone: typeof rawInput.phone === 'string' ? toAsciiDigits(rawInput.phone.trim()) : rawInput.phone,
  };
  const parsed = registerSchema.safeParse(normalizedInput);
  if (!parsed.success) {
    return {
      ok: false,
      code: 'INVALID_INPUT',
      fieldErrors: formatZodErrors(parsed.error.issues),
      message: 'لطفاً خطاهای مشخص‌شده در فرم را اصلاح فرمایید.',
    };
  }
  const env = getServerEnv();

  // Enforce unique phone number check across profiles
  const adminClient = createSupabaseAdminClient();
  const { data: existingProfile } = await adminClient
    .from('profiles')
    .select('id')
    .eq('phone', parsed.data.phone)
    .maybeSingle();

  if (existingProfile) {
    return {
      ok: false,
      code: 'AUTH_FAILED',
      fieldErrors: { phone: 'این شماره موبایل قبلاً در سیستم ثبت‌نام شده است.' },
      message: 'این شماره موبایل قبلاً در سیستم ثبت شده است. لطفاً وارد شوید.',
    };
  }

  const headerList = await headers();
  const host = headerList.get('x-forwarded-host') || headerList.get('host') || '';
  const proto = headerList.get('x-forwarded-proto') || 'http';
  const currentOrigin = host ? `${proto}://${host}` : env.APP_URL;
  const baseUrl = (currentOrigin.includes('localhost') || currentOrigin.includes('127.0.0.1'))
    ? currentOrigin
    : env.APP_URL;

  const client = await createSupabaseServerClient();
  const { data, error } = await client.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${baseUrl}/auth/callback?next=/auth/confirmed`,
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
    if (msg.includes('should be at least') || msg.includes('minimum_password_length')) {
      const match = /at least (\d+)/.exec(msg);
      const minLength = match ? match[1] : '۶';
      return {
        ok: false,
        code: 'AUTH_FAILED',
        fieldErrors: { password: `رمز عبور باید حداقل ${minLength} کاراکتر باشد.` },
        message: `رمز عبور باید حداقل ${minLength} کاراکتر باشد.`,
      };
    }
    if (msg.includes('password should contain') || msg.includes('characters')) {
      return {
        ok: false,
        code: 'AUTH_FAILED',
        fieldErrors: { password: 'رمز عبور باید شامل حروف انگلیسی و عدد باشد.' },
        message: 'رمز عبور باید شامل حروف انگلیسی و عدد باشد.',
      };
    }
    if (msg.includes('password')) {
      return {
        ok: false,
        code: 'AUTH_FAILED',
        fieldErrors: { password: 'رمز عبور واردشده معتبر نیست.' },
        message: 'رمز عبور واردشده معتبر نیست.',
      };
    }
    if (msg.includes('rate limit') || msg.includes('too many requests')) {
      return {
        ok: false,
        code: 'AUTH_FAILED',
        message: 'تعداد تلاش‌های ناموفق بیش از حد مجاز است. لطفاً دقایقی دیگر تلاش کنید.',
      };
    }
    return {
      ok: false,
      code: 'AUTH_FAILED',
      message: 'ثبت‌نام انجام نشد. لطفاً اطلاعات ورودی را بررسی کرده و دوباره تلاش کنید.',
    };
  }

  // GoTrue returns identities: [] when the user email already exists to protect against enumeration
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    return {
      ok: false,
      code: 'AUTH_FAILED',
      fieldErrors: { email: 'این ایمیل قبلاً در سیستم ثبت‌نام شده است.' },
      message: 'این ایمیل قبلاً در سیستم ثبت شده است. لطفاً از فرم ورود استفاده فرمایید.',
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
  const headerList = await headers();
  const host = headerList.get('x-forwarded-host') || headerList.get('host') || '';
  const proto = headerList.get('x-forwarded-proto') || 'http';
  const currentOrigin = host ? `${proto}://${host}` : env.APP_URL;
  const baseUrl = (currentOrigin.includes('localhost') || currentOrigin.includes('127.0.0.1'))
    ? currentOrigin
    : env.APP_URL;

  // Always return the same result to avoid account enumeration.
  await client.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${baseUrl}/auth/callback?next=/auth/reset-password`,
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
