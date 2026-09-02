import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  AppliedPaymentResult,
  PaymentRepository,
} from '@/application/ports/payment-repository';
import type { VerifiedPaymentEvent } from '@/application/payments/payment-provider';
import type { Database } from '@/infrastructure/supabase/database.types';

export class SupabasePaymentRepository implements PaymentRepository {
  constructor(private readonly admin: SupabaseClient<Database>) {}

  async attachReference(
    orderId: string,
    provider: string,
    providerReference: string,
  ): Promise<void> {
    const { error } = await this.admin.schema('api').rpc('attach_payment_reference', {
      p_order_id: orderId,
      p_provider: provider,
      p_provider_reference: providerReference,
    });
    if (error) throw error;
  }

  async applyVerifiedEvent(event: VerifiedPaymentEvent): Promise<AppliedPaymentResult> {
    const { data, error } = await this.admin.schema('api').rpc('apply_payment_event', {
      p_provider: event.provider,
      p_provider_event_id: event.providerEventId,
      p_provider_reference: event.providerReference,
      p_status: event.status,
      p_amount_irr: event.amountIrr,
      p_payload_hash: `\\x${event.payloadHashHex}`,
    });
    if (error) throw error;
    const result = data[0];
    return {
      applied: result?.applied ?? false,
      orderId: result?.order_id ?? null,
      orderStatus: result?.order_status ?? null,
    };
  }
}
