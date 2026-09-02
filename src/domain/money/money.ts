import { DomainError } from '@/domain/shared/domain-error';

export const IRR_MULTIPLE = 10;

export type Money = Readonly<{
  amountIrr: number;
  currency: 'IRR';
}>;

export function isValidIrrAmount(amountIrr: number): boolean {
  return (
    Number.isSafeInteger(amountIrr) &&
    amountIrr >= 0 &&
    amountIrr % IRR_MULTIPLE === 0
  );
}

export function money(amountIrr: number): Money {
  if (!isValidIrrAmount(amountIrr)) {
    throw new DomainError(
      'INVALID_MONEY',
      'IRR amount must be a non-negative safe integer divisible by 10.',
    );
  }

  return Object.freeze({ amountIrr, currency: 'IRR' });
}

export function tomanToIrr(amountToman: number): Money {
  if (!Number.isSafeInteger(amountToman) || amountToman < 0) {
    throw new DomainError('INVALID_MONEY', 'Toman amount must be a non-negative safe integer.');
  }

  return money(amountToman * IRR_MULTIPLE);
}

export function irrToToman(value: Money): number {
  return value.amountIrr / IRR_MULTIPLE;
}

export function addMoney(...values: Money[]): Money {
  return money(values.reduce((total, value) => total + value.amountIrr, 0));
}

export function multiplyMoney(value: Money, quantity: number): Money {
  if (!Number.isSafeInteger(quantity) || quantity < 0) {
    throw new DomainError('INVALID_QUANTITY', 'Quantity must be a non-negative safe integer.');
  }

  return money(value.amountIrr * quantity);
}
