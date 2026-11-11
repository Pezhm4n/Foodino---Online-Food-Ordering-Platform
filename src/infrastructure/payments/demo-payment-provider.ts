import { createHash } from 'node:crypto';
import type { CreatePaymentInput, CreatedPayment, PaymentProvider, VerifiedPaymentEvent } from '@/application/payments/payment-provider';

export type DemoOutcome = 'succeeded' | 'failed';

export class DemoPaymentProvider implements PaymentProvider {
  readonly name = 'demo';

  constructor(private readonly appUrl: string) {}

  async createPayment(input: CreatePaymentInput): Promise<CreatedPayment> {
    return {
      provider: this.name,
      providerReference: `demo:${input.orderId}`,
      redirectUrl: new URL(`/payments/demo/${input.orderId}`, this.appUrl).toString(),
    };
  }

  async verifyCallback(): Promise<VerifiedPaymentEvent> {
    throw new Error('DEMO_EXTERNAL_CALLBACK_FORBIDDEN');
  }
}

// Inputs come from the authenticated owner's database record, never from the browser's amount.
export function demoPaymentEvent(payment: { order_id: string; provider_reference: string; amount_irr: number }, status: DemoOutcome): VerifiedPaymentEvent {
  const payload = JSON.stringify({ reference: payment.provider_reference, amountIrr: payment.amount_irr, status });
  return {
    provider: 'demo',
    providerEventId: `demo:${payment.order_id}:${status}`,
    providerReference: payment.provider_reference,
    amountIrr: payment.amount_irr,
    status,
    payloadHashHex: createHash('sha256').update(payload).digest('hex'),
  };
}
