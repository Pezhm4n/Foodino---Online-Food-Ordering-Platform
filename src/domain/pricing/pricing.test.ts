import { describe, expect, it } from 'vitest';
import { money } from '@/domain/money/money';
import { calculatePricing } from './pricing';

describe('server pricing', () => {
  it('computes subtotal, 9 percent tax and delivery in IRR', () => {
    const result = calculatePricing(
      [
        { unitPrice: money(1_450_000), quantity: 2 },
        { unitPrice: money(200_000), quantity: 1 },
      ],
      money(150_000),
      900,
    );

    expect(result).toEqual({
      subtotal: money(3_100_000),
      deliveryFee: money(150_000),
      tax: money(279_000),
      total: money(3_529_000),
    });
  });

  it('rejects tax rates outside the bps contract', () => {
    expect(() => calculatePricing([], money(0), 10_001)).toThrowError(/basis points/);
  });
});
