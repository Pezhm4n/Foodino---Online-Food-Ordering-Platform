import { describe, expect, it } from 'vitest';
import { assertPaymentTransition } from './payment-status';

describe('payment state machine', () => {
  it('accepts the success and refund path', () => {
    expect(() => assertPaymentTransition('created', 'pending')).not.toThrow();
    expect(() => assertPaymentTransition('pending', 'succeeded')).not.toThrow();
    expect(() => assertPaymentTransition('succeeded', 'refunded')).not.toThrow();
  });

  it('rejects duplicate and out-of-order transitions', () => {
    expect(() => assertPaymentTransition('succeeded', 'succeeded')).toThrowError(/cannot transition/);
    expect(() => assertPaymentTransition('created', 'succeeded')).toThrowError(/cannot transition/);
    expect(() => assertPaymentTransition('failed', 'pending')).toThrowError(/cannot transition/);
  });
});
