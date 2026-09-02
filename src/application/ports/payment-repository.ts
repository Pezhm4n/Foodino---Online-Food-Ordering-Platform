import type { VerifiedPaymentEvent } from '@/application/payments/payment-provider';

export type AppliedPaymentResult = Readonly<{
  applied: boolean;
  orderId: string | null;
  orderStatus: string | null;
}>;

export interface PaymentRepository {
  attachReference(orderId: string, provider: string, providerReference: string): Promise<void>;
  applyVerifiedEvent(event: VerifiedPaymentEvent): Promise<AppliedPaymentResult>;
}
