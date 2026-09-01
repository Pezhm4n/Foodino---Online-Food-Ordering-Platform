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
}>;

const invalidInput: AuthActionResult = { ok: false, code: 'INVALID_INPUT' };
const authFailed: AuthActionResult = { ok: false, code: 'AUTH_FAILED' };

export async function loginAction(input: unknown): Promise<AuthActionResult> {
  await assertSameOrigin();
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return invalidInput;
  const client = await createSupabaseServerClient();
  const { error } = await client.auth.signInWithPassword(parsed.data);
  return error ? authFailed : { ok: true };
}

export async function registerAction(input: unknown): Promise<AuthActionResult> {
  await assertSameOrigin();
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return invalidInput;
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
  if (error) return authFailed;
  return data.session ? { ok: true } : { ok: true, code: 'EMAIL_CONFIRMATION_REQUIRED' };
}

export async function forgotPasswordAction(input: unknown): Promise<AuthActionResult> {
  await assertSameOrigin();
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) return invalidInput;
  const env = getServerEnv();
  const client = await createSupabaseServerClient();
  // Always return the same result to avoid account enumeration.
  await client.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${env.APP_URL}/auth/callback?next=/auth/reset-password`,
  });
  return { ok: true };
}

export async function resetPasswordAction(input: unknown): Promise<AuthActionResult> {
  await assertSameOrigin();
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) return invalidInput;
  const client = await createSupabaseServerClient();
  const { error } = await client.auth.updateUser({ password: parsed.data.password });
  return error ? authFailed : { ok: true };
}

export async function logoutAction(): Promise<never> {
  await assertSameOrigin();
  const client = await createSupabaseServerClient();
  await client.auth.signOut();
  redirect('/');
}
