import { describe, expect, it } from 'vitest';
import {
  resolveLegacyCategoryId,
  resolveLegacyProductId,
  resolveLegacyRestaurantId,
} from './legacy-id-map';

describe('legacy canonical ID mapping', () => {
  it('maps known numeric prototype IDs to deterministic seed UUIDs', () => {
    expect(resolveLegacyRestaurantId('1')).toBe('20000000-0000-4000-8000-000000000001');
    expect(resolveLegacyCategoryId('2')).toBe('10000000-0000-4000-8000-000000000002');
    expect(resolveLegacyProductId('5')).toBe('30000000-0000-4000-8000-000000000005');
  });

  it('passes valid UUIDs through for database lookup', () => {
    const id = '20000000-0000-4000-8000-000000000001';
    expect(resolveLegacyRestaurantId(id)).toBe(id);
  });

  it('rejects unknown numeric and malformed IDs', () => {
    expect(resolveLegacyRestaurantId('99')).toBeNull();
    expect(resolveLegacyCategoryId('../admin')).toBeNull();
    expect(resolveLegacyProductId('not-an-id')).toBeNull();
  });
});
