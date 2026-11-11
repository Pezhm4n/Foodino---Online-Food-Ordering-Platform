import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthSessionMissingError } from '@supabase/supabase-js';

const mocks = vi.hoisted(() => ({
  origin: vi.fn(),
  client: vi.fn(),
  profile: vi.fn(),
  signIn: vi.fn(),
  signUp: vi.fn(),
  recover: vi.fn(),
  update: vi.fn(),
  log: vi.fn(),
}));
vi.mock('@/infrastructure/http/same-origin', () => ({ assertSameOrigin: mocks.origin }));
vi.mock('@/infrastructure/config/server-env', () => ({ getServerEnv: () => ({ APP_URL: 'https://foodino.example' }) }));
vi.mock('next/headers', () => ({ headers: async () => new Headers({ host: 'foodino.example' }) }));
vi.mock('@/infrastructure/supabase/server', () => ({ createSupabaseServerClient: mocks.client }));
vi.mock('@/infrastructure/supabase/admin', () => ({
  createSupabaseAdminClient: () => ({ from: () => ({ select: () => ({ eq: () => ({ maybeSingle: mocks.profile }) }) }) }),
}));
vi.mock('@/infrastructure/logging/logger', () => ({ logger: { error: mocks.log } }));

import { forgotPasswordAction, loginAction, registerAction, resetPasswordAction } from './actions';

const credentials = { email: 'test@example.com', password: 'test-password-123' };
const registration = { ...credentials, firstName: 'آزمایش', lastName: 'فودینو', phone: '۰۹۱۲۳۴۵۶۷۸۹' };

beforeEach(() => {
  vi.resetAllMocks();
  mocks.client.mockResolvedValue({ auth: {
    signInWithPassword: mocks.signIn,
    signUp: mocks.signUp,
    resetPasswordForEmail: mocks.recover,
    updateUser: mocks.update,
  } });
  mocks.profile.mockResolvedValue({ data: null, error: null });
});

describe('authentication actions', () => {
  it('rejects cross-origin requests before using the provider', async () => {
    mocks.origin.mockRejectedValue(new Error('Invalid request origin'));
    await expect(loginAction(credentials)).rejects.toThrow('Invalid request origin');
    expect(mocks.client).not.toHaveBeenCalled();
  });

  it('validates input before contacting Supabase', async () => {
    expect(await registerAction({ ...registration, email: 'invalid' })).toMatchObject({ ok: false, code: 'INVALID_INPUT' });
    expect(mocks.profile).not.toHaveBeenCalled();
  });

  it('reports invalid credentials without treating an outage as a password error', async () => {
    mocks.signIn.mockResolvedValueOnce({ error: { code: 'invalid_credentials', status: 400 } });
    expect(await loginAction(credentials)).toMatchObject({ code: 'AUTH_FAILED', message: 'ایمیل یا رمز عبور اشتباه است.' });
    mocks.signIn.mockResolvedValueOnce({ error: { status: 503, message: 'unavailable' } });
    expect(await loginAction(credentials)).toMatchObject({ code: 'SERVICE_UNAVAILABLE' });
    expect(mocks.log).toHaveBeenCalledWith('Authentication request failed', {
      route: '/auth/login', errorCode: 'AUTH_SERVICE_ERROR', status: 503,
    });
  });

  it('handles thrown configuration and transport failures without leaking credentials', async () => {
    mocks.client.mockRejectedValue(new Error(`Cannot connect: ${credentials.password}`));
    const result = await loginAction(credentials);
    expect(result.code).toBe('SERVICE_UNAVAILABLE');
    expect(JSON.stringify([result, mocks.log.mock.calls])).not.toContain(credentials.password);
  });

  it('asks the user to confirm their email before signing in', async () => {
    mocks.signIn.mockResolvedValue({ error: { code: 'email_not_confirmed', status: 400 } });
    expect(await loginAction(credentials)).toMatchObject({ ok: false, message: 'برای ورود، ابتدا لینک تأیید ایمیل را باز کنید.' });
  });

  it('does not create an account after a failed profile check', async () => {
    mocks.profile.mockResolvedValue({ data: null, error: { code: 'PGRST205' } });
    expect(await registerAction(registration)).toMatchObject({ ok: false, code: 'SERVICE_UNAVAILABLE' });
    expect(mocks.signUp).not.toHaveBeenCalled();
  });

  it('preserves the phone uniqueness check', async () => {
    mocks.profile.mockResolvedValue({ data: { id: 'existing-user' }, error: null });
    const result = await registerAction(registration);
    expect(result.fieldErrors?.phone).toBeTruthy();
    expect(mocks.signUp).not.toHaveBeenCalled();
  });

  it('normalizes the phone and distinguishes email confirmation from a signed-in session', async () => {
    mocks.signUp.mockResolvedValueOnce({ data: { user: { identities: [{}] }, session: null }, error: null });
    expect(await registerAction(registration)).toMatchObject({ ok: true, code: 'EMAIL_CONFIRMATION_REQUIRED' });
    expect(mocks.signUp).toHaveBeenCalledWith(expect.objectContaining({ options: {
      emailRedirectTo: 'https://foodino.example/auth/callback?next=/auth/confirmed',
      data: { first_name: 'آزمایش', last_name: 'فودینو', phone: '09123456789' },
    } }));
    mocks.signUp.mockResolvedValueOnce({ data: { user: { identities: [{}] }, session: {} }, error: null });
    expect(await registerAction(registration)).toEqual({ ok: true, message: 'ثبت‌نام با موفقیت انجام شد.' });
  });

  it('does not report success without a returned user', async () => {
    mocks.signUp.mockResolvedValue({ data: { user: null, session: null }, error: null });
    expect(await registerAction(registration)).toMatchObject({ ok: false, code: 'SERVICE_UNAVAILABLE' });
  });

  it.each([
    [{ code: 'weak_password', status: 422 }, 'AUTH_FAILED', 'password'],
    [{ code: 'email_exists', status: 422 }, 'AUTH_FAILED', 'email'],
    [{ code: 'email_address_invalid', status: 422 }, 'INVALID_INPUT', 'email'],
  ])('maps provider rejection %j to actionable feedback', async (error, code, field) => {
    mocks.signUp.mockResolvedValue({ data: {}, error });
    const result = await registerAction(registration);
    expect(result.code).toBe(code);
    expect(result.fieldErrors?.[field]).toBeTruthy();
  });

  it('reports throttling distinctly', async () => {
    mocks.signUp.mockResolvedValue({ data: {}, error: { code: 'over_email_send_rate_limit', status: 429 } });
    expect(await registerAction(registration)).toMatchObject({ ok: false, code: 'RATE_LIMITED' });
  });

  it('does not claim a recovery email was sent on provider failure', async () => {
    mocks.recover.mockResolvedValue({ error: { status: 503 } });
    expect(await forgotPasswordAction({ email: credentials.email })).toMatchObject({ ok: false, code: 'SERVICE_UNAVAILABLE' });
    mocks.recover.mockResolvedValue({ error: null });
    expect(await forgotPasswordAction({ email: credentials.email })).toMatchObject({ ok: true });
  });

  it('reports recovery and reset transport failures', async () => {
    mocks.recover.mockRejectedValue(new Error('network'));
    mocks.update.mockRejectedValue(new Error('network'));
    expect(await forgotPasswordAction({ email: credentials.email })).toMatchObject({ ok: false, code: 'SERVICE_UNAVAILABLE' });
    expect(await resetPasswordAction({ password: credentials.password })).toMatchObject({ ok: false, code: 'SERVICE_UNAVAILABLE' });
  });

  it('recognizes a missing recovery session returned by the actual SDK', async () => {
    mocks.update.mockResolvedValue({ error: new AuthSessionMissingError() });
    const result = await resetPasswordAction({ password: credentials.password });
    expect(result).toMatchObject({ ok: false, code: 'AUTH_FAILED', message: 'لینک بازیابی معتبر نیست یا منقضی شده است. دوباره درخواست بازیابی رمز بدهید.' });
    expect(mocks.log).not.toHaveBeenCalled();
  });
});
