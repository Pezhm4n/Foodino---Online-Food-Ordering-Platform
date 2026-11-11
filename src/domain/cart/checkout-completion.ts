import type { CartSelection } from './cart';

export const CART_REVISION_KEY = 'foodino:cart-revision';
export const CHECKOUT_ATTEMPT_KEY = 'foodino:checkout-attempt';
export const checkoutSubmissionKey = (orderId: string) => `foodino:checkout-submission:${orderId}`;

type CheckoutCart = {
  restaurantId: string | null;
  items: readonly CartSelection[];
  orderNote?: string;
  couponCode?: string;
  appliedCoupon?: { code: string } | null;
};

export function checkoutCartFingerprint(cart: CheckoutCart): string {
  return JSON.stringify({
    restaurantId: cart.restaurantId,
    items: cart.items.map(item => ({
      productId: item.productId,
      variantId: item.variantId ?? '',
      addonIds: [...new Set(item.addonIds)].sort(),
      quantity: item.quantity,
      notes: item.notes?.trim() ?? '',
    })).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))),
    couponCode: (cart.couponCode ?? cart.appliedCoupon?.code ?? '').trim().toUpperCase(),
    orderNote: cart.orderNote?.trim() ?? '',
  });
}

export type CheckoutSubmission = { fingerprint: string; revision: string; attemptId: string };

export function parseCheckoutSubmission(raw: string | null): CheckoutSubmission | null {
  try {
    const value: unknown = JSON.parse(raw ?? 'null');
    if (!value || typeof value !== 'object') return null;
    const candidate = value as Partial<CheckoutSubmission>;
    return typeof candidate.fingerprint === 'string' && typeof candidate.revision === 'string'
      && typeof candidate.attemptId === 'string' ? candidate as CheckoutSubmission : null;
  } catch { return null; }
}

export function canCompleteCheckoutCart(submission: CheckoutSubmission, currentFingerprint: string, persistedFingerprint: string | null, revision: string | null): boolean {
  return submission.fingerprint === currentFingerprint && submission.fingerprint === persistedFingerprint
    && submission.revision === revision;
}
