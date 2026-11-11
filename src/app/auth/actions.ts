'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { isAuthSessionMissingError } from '@supabase/supabase-js';
import { assertSameOrigin } from '@/infrastructure/http/same-origin';
import { getServerEnv } from '@/infrastructure/config/server-env';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { createSupabaseAdminClient } from '@/infrastructure/supabase/admin';
import { logger } from '@/infrastructure/logging/logger';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from '@/lib/validation/auth';

export type AuthActionResult = Readonly<{
  ok: boolean;
  code?: 'AUTH_FAILED' | 'INVALID_INPUT' | 'EMAIL_CONFIRMATION_REQUIRED' | 'SERVICE_UNAVAILABLE' | 'RATE_LIMITED';
  fieldErrors?: Record<string, string>;
  message?: string;
}>;

function authFailure(operation: string, error: unknown): AuthActionResult {
  const details = error && typeof error === 'object'
    ? error as { code?: string; status?: number }
    : {};
  const code = details.code;
  if (code === 'invalid_credentials') {
    return { ok: false, code: 'AUTH_FAILED', message: 'ایمیل یا رمز عبور اشتباه است.' };
  }
  if (code === 'email_not_confirmed') {
    return { ok: false, code: 'AUTH_FAILED', message: 'برای ورود، ابتدا لینک تأیید ایمیل را باز کنید.' };
  }
  if (details.status === 429 || ['over_request_rate_limit', 'over_email_send_rate_limit', 'over_sms_send_rate_limit'].includes(code ?? '')) {
    return { ok: false, code: 'RATE_LIMITED', message: 'تعداد درخواست‌ها زیاد شده است. لطفاً چند دقیقهٔ دیگر دوباره تلاش کنید.' };
  }
  if (code === 'weak_password') {
    return { ok: false, code: 'AUTH_FAILED', fieldErrors: { password: 'رمز قوی‌تری با ترکیبی از حروف و عدد انتخاب کنید.' }, message: 'رمز قوی‌تری با ترکیبی از حروف و عدد انتخاب کنید.' };
  }
  if (code === 'user_already_exists' || code === 'email_exists') {
    return { ok: false, code: 'AUTH_FAILED', fieldErrors: { email: 'این ایمیل قبلاً ثبت شده است.' }, message: 'این ایمیل قبلاً ثبت شده است. لطفاً وارد شوید.' };
  }
  if (code === 'email_address_invalid') {
    return { ok: false, code: 'INVALID_INPUT', fieldErrors: { email: 'یک نشانی ایمیل معتبر وارد کنید.' }, message: 'یک نشانی ایمیل معتبر وارد کنید.' };
  }
  logger.error('Authentication request failed', {
    route: `/auth/${operation}`,
    errorCode: code ?? 'AUTH_SERVICE_ERROR',
    status: details.status,
  });
  return { ok: false, code: 'SERVICE_UNAVAILABLE', message: 'سرویس حساب کاربری فعلاً در دسترس نیست. لطفاً کمی بعد دوباره تلاش کنید.' };
}

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
  try {
    const client = await createSupabaseServerClient();
    const { error } = await client.auth.signInWithPassword(parsed.data);
    if (error) return authFailure('login', error);
    return { ok: true };
  } catch (error) {
    return authFailure('login', error);
  }
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
  try {
    const env = getServerEnv();
    const adminClient = createSupabaseAdminClient();
    const { data: existingProfile, error: profileError } = await adminClient
      .from('profiles')
      .select('id')
      .eq('phone', parsed.data.phone)
      .maybeSingle();

    if (profileError) return authFailure('register-profile', profileError);

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
    if (error) return authFailure('register', error);
    if (!data.user) return authFailure('register', { code: 'AUTH_USER_MISSING' });

    // Supabase returns an empty identity list for an existing confirmed email.
    if (Array.isArray(data.user.identities) && data.user.identities.length === 0) {
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
  } catch (error) {
    return authFailure('register', error);
  }
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
  try {
    const env = getServerEnv();
    const client = await createSupabaseServerClient();
    const headerList = await headers();
    const host = headerList.get('x-forwarded-host') || headerList.get('host') || '';
    const proto = headerList.get('x-forwarded-proto') || 'http';
    const currentOrigin = host ? `${proto}://${host}` : env.APP_URL;
    const baseUrl = (currentOrigin.includes('localhost') || currentOrigin.includes('127.0.0.1'))
      ? currentOrigin
      : env.APP_URL;

    // Successful requests do not reveal whether the account exists.
    const { error } = await client.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${baseUrl}/auth/callback?next=/auth/reset-password`,
    });
    if (error) return authFailure('forgot-password', error);
    return { ok: true, message: 'اگر حسابی با این ایمیل وجود داشته باشد، لینک بازیابی ارسال شد.' };
  } catch (error) {
    return authFailure('forgot-password', error);
  }
}

export async function resetPasswordAction(input: unknown): Promise<AuthActionResult> {
  await assertSameOrigin();
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      code: 'INVALID_INPUT',
      fieldErrors: formatZodErrors(parsed.error.issues),
      message: 'رمز عبور باید حداقل ۶ نویسه داشته باشد.',
    };
  }
  try {
    const client = await createSupabaseServerClient();
    const { error } = await client.auth.updateUser({ password: parsed.data.password });
    if (error) {
      if (!isAuthSessionMissingError(error) && error.code !== 'session_not_found' && error.code !== 'session_expired' && error.code !== 'same_password') {
        return authFailure('reset-password', error);
      }
      return {
        ok: false,
        code: 'AUTH_FAILED',
        message: error.code === 'same_password'
          ? 'رمز جدید باید با رمز قبلی متفاوت باشد.'
          : 'لینک بازیابی معتبر نیست یا منقضی شده است. دوباره درخواست بازیابی رمز بدهید.',
      };
    }
    return { ok: true, message: 'رمز عبور با موفقیت تغییر کرد.' };
  } catch (error) {
    return authFailure('reset-password', error);
  }
}

export async function logoutAction(): Promise<never> {
  await assertSameOrigin();
  const client = await createSupabaseServerClient();
  await client.auth.signOut();
  redirect('/');
}
