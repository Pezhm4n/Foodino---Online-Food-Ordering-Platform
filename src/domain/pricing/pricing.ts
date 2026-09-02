import { addMoney, money, multiplyMoney, type Money } from '@/domain/money/money';

export type PricedLine = Readonly<{
  unitPrice: Money;
  quantity: number;
}>;

export type PricingResult = Readonly<{
  subtotal: Money;
  deliveryFee: Money;
  tax: Money;
  total: Money;
}>;

function roundIrrToTen(amount: number): number {
  return Math.round(amount / 10) * 10;
}

export function calculatePricing(
  lines: readonly PricedLine[],
  deliveryFee: Money,
  taxRateBps: number,
): PricingResult {
  if (!Number.isInteger(taxRateBps) || taxRateBps < 0 || taxRateBps > 10_000) {
    throw new RangeError('Tax rate must be an integer between 0 and 10000 basis points.');
  }

  const subtotal = addMoney(...lines.map((line) => multiplyMoney(line.unitPrice, line.quantity)));
  const tax = money(roundIrrToTen((subtotal.amountIrr * taxRateBps) / 10_000));
  const total = addMoney(subtotal, deliveryFee, tax);

  return { subtotal, deliveryFee, tax, total };
}
