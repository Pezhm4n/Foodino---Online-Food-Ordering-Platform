import { describe, expect, it } from 'vitest';
import { money } from '@/domain/money/money';
import { validateAndApplyCoupon } from './coupons';

describe('coupon validation and application', () => {
  it('applies FOODINO percentage coupon up to its max cap', () => {
    // subtotal = 4,000,000 IRR (400,000 Toman)
    // 20% would be 800,000 IRR, capped at 500,000 IRR (50,000 Toman)
    const res = validateAndApplyCoupon('FOODINO', money(4_000_000), money(150_000));
    expect(res.valid).toBe(true);
    if (res.valid) {
      expect(res.discount).toEqual(money(500_000));
    }
  });

  it('applies FOODINO percentage coupon under cap', () => {
    // subtotal = 1,500,000 IRR (150,000 Toman)
    // 20% is 300,000 IRR
    const res = validateAndApplyCoupon('foodino', money(1_500_000), money(150_000));
    expect(res.valid).toBe(true);
    if (res.valid) {
      expect(res.discount).toEqual(money(300_000));
    }
  });

  it('rejects FOODINO if subtotal is below minimum order amount', () => {
    // subtotal = 800,000 IRR (< 1,000,000 IRR min)
    const res = validateAndApplyCoupon('FOODINO', money(800_000), money(150_000));
    expect(res.valid).toBe(false);
    if (!res.valid) {
      expect(res.message).toMatch(/۱۰۰٬۰۰۰/);
    }
  });

  it('applies FREESHIP to cover 100% of delivery fee', () => {
    const res = validateAndApplyCoupon('FREESHIP', money(1_200_000), money(180_000));
    expect(res.valid).toBe(true);
    if (res.valid) {
      expect(res.discount).toEqual(money(180_000));
    }
  });

  it('rejects non-existent coupon codes', () => {
    const res = validateAndApplyCoupon('INVALID_CODE', money(1_000_000), money(100_000));
    expect(res.valid).toBe(false);
    if (!res.valid) {
      expect(res.message).toMatch(/معتبر نمی‌باشد/);
    }
  });
});
