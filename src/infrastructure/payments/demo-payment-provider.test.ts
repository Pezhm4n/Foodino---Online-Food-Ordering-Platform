import { describe, expect, it } from 'vitest';
import { DemoPaymentProvider, demoPaymentEvent } from './demo-payment-provider';
import { paymentProviderSchema } from '@/lib/validation/payment';

describe('explicit demo payment provider', () => {
  it('creates an owner gateway with persistent demo provenance', async () => {
    const provider = new DemoPaymentProvider('https://foodino.example');
    expect(await provider.createPayment({ orderId: 'order-id', amountIrr: 1_000_000, callbackUrl: 'https://foodino.example/callback' })).toEqual({
      provider: 'demo', providerReference: 'demo:order-id', redirectUrl: 'https://foodino.example/payments/demo/order-id',
    });
  });
  it('rejects external demo callbacks at both schema and provider boundaries', async () => {
    expect(paymentProviderSchema.safeParse('demo').success).toBe(false);
    await expect(new DemoPaymentProvider('https://foodino.example').verifyCallback()).rejects.toThrow('DEMO_EXTERNAL_CALLBACK_FORBIDDEN');
  });
  it('creates deterministic outcome events using the persisted amount and separate replay IDs', () => {
    const payment = { order_id: 'order', provider_reference: 'demo:order', amount_irr: 123_000 };
    const success = demoPaymentEvent(payment, 'succeeded');
    const failure = demoPaymentEvent(payment, 'failed');
    expect(success).toMatchObject({ provider: 'demo', providerReference: payment.provider_reference, amountIrr: 123_000, status: 'succeeded' });
    expect(success).toEqual(demoPaymentEvent(payment, 'succeeded'));
    expect(success.providerEventId).not.toBe(failure.providerEventId);
    expect(success.payloadHashHex).toMatch(/^[a-f0-9]{64}$/);
  });
});
