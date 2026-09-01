import { describe, expect, it } from 'vitest';
import {
  assertActorCanTransition,
  assertCustomerCanCancel,
  assertOrderTransition,
  canTransitionOrder,
} from './order-status';

describe('order state machine', () => {
  it('permits the normal fulfillment path', () => {
    expect(canTransitionOrder('pending_payment', 'confirmed')).toBe(true);
    expect(canTransitionOrder('confirmed', 'preparing')).toBe(true);
    expect(canTransitionOrder('preparing', 'ready')).toBe(true);
    expect(canTransitionOrder('ready', 'delivering')).toBe(true);
    expect(canTransitionOrder('delivering', 'delivered')).toBe(true);
  });

  it('keeps delivered and canceled terminal', () => {
    expect(() => assertOrderTransition('delivered', 'preparing')).toThrowError(/cannot transition/);
    expect(() => assertOrderTransition('canceled', 'confirmed')).toThrowError(/cannot transition/);
  });

  it('lets customers cancel only pending or confirmed orders', () => {
    expect(() => assertActorCanTransition('customer', 'confirmed', 'canceled')).not.toThrow();
    expect(() => assertCustomerCanCancel('preparing')).toThrowError(/cannot cancel/);
  });

  it('limits the payment actor to confirmation', () => {
    expect(() => assertActorCanTransition('payment_system', 'pending_payment', 'confirmed')).not.toThrow();
    expect(() => assertActorCanTransition('payment_system', 'pending_payment', 'canceled')).toThrowError(
      /only confirm/,
    );
  });
});
