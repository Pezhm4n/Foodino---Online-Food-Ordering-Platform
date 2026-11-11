const checkoutFailures = {
  address_not_found: { code: 'ADDRESS_UNAVAILABLE', status: 422 },
  invalid_coupon: { code: 'INVALID_COUPON', status: 422 },
  coupon_minimum_not_met: { code: 'COUPON_MINIMUM_NOT_MET', status: 422 },
  coupon_first_order_only: { code: 'COUPON_FIRST_ORDER_ONLY', status: 422 },
  minimum_order_not_met: { code: 'MINIMUM_ORDER_NOT_MET', status: 422 },
  restaurant_unavailable: { code: 'RESTAURANT_UNAVAILABLE', status: 422 },
  product_unavailable: { code: 'CART_ITEM_UNAVAILABLE', status: 422 },
  variant_unavailable: { code: 'CART_ITEM_UNAVAILABLE', status: 422 },
  addon_unavailable: { code: 'CART_ITEM_UNAVAILABLE', status: 422 },
  checkout_total_changed: { code: 'CHECKOUT_TOTAL_CHANGED', status: 409 },
  checkout_request_changed: { code: 'CHECKOUT_REQUEST_CHANGED', status: 409 },
  checkout_attempt_closed: { code: 'CHECKOUT_ATTEMPT_CLOSED', status: 409 },
} as const;

export function checkoutFailure(error: unknown) {
  if (typeof error !== 'object' || error === null || !('message' in error)
    || typeof error.message !== 'string' || !Object.hasOwn(checkoutFailures, error.message)) {
    return null;
  }
  return checkoutFailures[error.message as keyof typeof checkoutFailures];
}
