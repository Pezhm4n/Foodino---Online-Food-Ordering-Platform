import { describe, expect, it } from 'vitest';
import { DevelopmentPaymentProvider } from './development-payment-provider';

const secret = 'test-callback-secret-with-more-than-32-characters';

describe('DevelopmentPaymentProvider', () => {
  it('creates a deterministic reference and verifies its signed completion callback', async () => {
    const provider = new DevelopmentPaymentProvider(secret, 'http://127.0.0.1:3000');
    const created = await provider.createPayment({
      orderId: '8b0be7d5-7277-45a4-a957-3ae16c3075f4',
      amountIrr: 1_730_500,
      callbackUrl: 'http://127.0.0.1:3000/api/payments/callback/development',
    });
    const token = new URL(created.redirectUrl).searchParams.get('token');
    expect(created.providerReference).toBe('development:8b0be7d5-7277-45a4-a957-3ae16c3075f4');
    expect(token).not.toBeNull();

    const completion = provider.verifyCompletionToken(token!);
    const callback = provider.createSuccessfulCallback(completion);
    const verified = await provider.verifyCallback(callback.rawBody, callback.headers);
    expect(verified).toMatchObject({
      provider: 'development',
      providerEventId: 'completion:8b0be7d5-7277-45a4-a957-3ae16c3075f4',
      status: 'succeeded',
      amountIrr: 1_730_500,
    });
    expect(verified.payloadHashHex).toMatch(/^[a-f0-9]{64}$/);
  });

  it('rejects tampered completion tokens and callback payloads', async () => {
    const provider = new DevelopmentPaymentProvider(secret, 'http://127.0.0.1:3000');
    expect(() => provider.verifyCompletionToken('tampered.invalid')).toThrow('INVALID_TOKEN');
    await expect(provider.verifyCallback(
      JSON.stringify({
        providerEventId: 'event-1',
        providerReference: 'reference-1',
        status: 'succeeded',
        amountIrr: 1000,
      }),
      new Headers({ 'x-foodino-signature': 'invalid' }),
    )).rejects.toThrow('INVALID_SIGNATURE');
  });
});
