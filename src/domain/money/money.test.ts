import { describe, expect, it } from 'vitest';
import { addMoney, irrToToman, money, multiplyMoney, tomanToIrr } from './money';

describe('Money', () => {
  it('converts prototype Toman values to IRR exactly', () => {
    expect(tomanToIrr(145_000)).toEqual({ amountIrr: 1_450_000, currency: 'IRR' });
    expect(irrToToman(money(1_450_000))).toBe(145_000);
  });

  it.each([-10, 11, 1.5, Number.MAX_SAFE_INTEGER])('rejects invalid IRR amount %s', (amount) => {
    expect(() => money(amount)).toThrowError(/IRR amount/);
  });

  it('adds and multiplies without losing the money invariant', () => {
    expect(addMoney(money(100), multiplyMoney(money(250), 3)).amountIrr).toBe(850);
  });
});
