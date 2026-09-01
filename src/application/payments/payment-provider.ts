import type { PaymentStatus } from '@/domain/payment/payment-status';

export type CreatePaymentInput = Readonly<{
  orderId: string;
  amountIrr: number;
  callbackUrl: string;
}>;

export type CreatedPayment = Readonly<{
  provider: string;
  providerReference: string;
  redirectUrl: string;
}>;

export type VerifiedPaymentEvent = Readonly<{
  provider: string;
  providerEventId: string;
  providerReference: string;
  status: Extract<PaymentStatus, 'succeeded' | 'failed' | 'canceled'>;
  amountIrr: number;
  payloadHashHex: string;
}>;

export interface PaymentProvider {
  readonly name: string;
  createPayment(input: CreatePaymentInput): Promise<CreatedPayment>;
  verifyCallback(rawBody: string, headers: Headers): Promise<VerifiedPaymentEvent>;
}

export class PaymentProviderUnavailableError extends Error {
  constructor() {
    super('No production payment provider is configured.');
    this.name = 'PaymentProviderUnavailableError';
  }
}
