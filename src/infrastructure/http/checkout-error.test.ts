import { describe, expect, it } from 'vitest';
import { checkoutFailure } from './checkout-error';

describe('checkout business failures', () => {
  it('treats a stale, deleted or inaccessible address as a correctable selection', () => {
    expect(checkoutFailure({ message: 'address_not_found', code: '42501' }))
      .toEqual({ code: 'ADDRESS_UNAVAILABLE', status: 422 });
  });

  it('does not mistake generic permission or missing-schema faults for a cart rejection', () => {
    expect(checkoutFailure({ message: 'permission denied for schema api', code: '42501' })).toBeNull();
    expect(checkoutFailure({ message: 'Invalid schema: api', code: 'PGRST106' })).toBeNull();
  });
});
