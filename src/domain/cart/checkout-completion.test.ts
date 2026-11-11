import { describe, expect, it } from 'vitest';
import { canCompleteCheckoutCart, checkoutCartFingerprint, parseCheckoutSubmission } from './checkout-completion';

const cart = { restaurantId: 'restaurant', orderNote: 'زنگ بزنید', couponCode: 'FOODINO', items: [{ restaurantId: 'restaurant', productId: 'pizza', addonIds: ['a', 'b'], quantity: 1, notes: 'بدون پیاز' }] };
const fingerprint = checkoutCartFingerprint(cart);
const submitted = { fingerprint, revision: 'revision-at-submit', attemptId: 'attempt' };

describe('checkout cart completion', () => {
  it('only authorizes the submitted, unchanged persisted and active cart', () => {
    expect(canCompleteCheckoutCart(submitted, fingerprint, fingerprint, submitted.revision)).toBe(true);
    expect(canCompleteCheckoutCart(submitted, fingerprint, null, submitted.revision)).toBe(false);
    expect(canCompleteCheckoutCart(submitted, fingerprint, fingerprint, null)).toBe(false);
  });
  it('preserves an edited cart in the same tab or another tab', () => {
    const changed = checkoutCartFingerprint({ ...cart, items: [{ ...cart.items[0], quantity: 2 }] });
    expect(canCompleteCheckoutCart(submitted, changed, fingerprint, submitted.revision)).toBe(false);
    expect(canCompleteCheckoutCart(submitted, fingerprint, changed, 'new-revision')).toBe(false);
  });
  it('preserves a newly recreated cart even with identical selections', () => {
    expect(canCompleteCheckoutCart(submitted, fingerprint, fingerprint, 'new-revision')).toBe(false);
  });
  it('includes coupon, restaurant, food notes and order notes, while ignoring presentation', () => {
    for (const changed of [{ ...cart, couponCode: '' }, { ...cart, restaurantId: 'other' }, { ...cart, orderNote: 'new' }, { ...cart, items: [{ ...cart.items[0], notes: 'new' }] }]) {
      expect(checkoutCartFingerprint(changed)).not.toBe(fingerprint);
    }
    expect(checkoutCartFingerprint({ ...cart, items: [{ ...cart.items[0], addonIds: ['b', 'a'] }] })).toBe(fingerprint);
  });
  it('rejects corrupt or incomplete submission markers', () => {
    expect(parseCheckoutSubmission('{')).toBeNull();
    expect(parseCheckoutSubmission(JSON.stringify({ fingerprint }))).toBeNull();
    expect(parseCheckoutSubmission(JSON.stringify(submitted))).toEqual(submitted);
  });
});
