import { DomainError } from '@/domain/shared/domain-error';

export const paymentStatuses = [
  'created',
  'pending',
  'succeeded',
  'failed',
  'canceled',
  'refunded',
] as const;

export type PaymentStatus = (typeof paymentStatuses)[number];

const transitions: Readonly<Record<PaymentStatus, readonly PaymentStatus[]>> = {
  created: ['pending'],
  pending: ['succeeded', 'failed', 'canceled'],
  succeeded: ['refunded'],
  failed: [],
  canceled: [],
  refunded: [],
};

export function assertPaymentTransition(from: PaymentStatus, to: PaymentStatus): void {
  if (!transitions[from].includes(to)) {
    throw new DomainError(
      'INVALID_PAYMENT_TRANSITION',
      `Payment cannot transition from ${from} to ${to}.`,
    );
  }
}
