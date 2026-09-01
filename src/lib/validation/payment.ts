import { z } from 'zod';

export const paymentProviderSchema = z.enum(['development']);

export const paymentCallbackSchema = z.object({
  providerEventId: z.string().trim().min(1).max(255),
  providerReference: z.string().trim().min(1).max(255),
  status: z.enum(['succeeded', 'failed', 'canceled']),
  amountIrr: z.number().int().nonnegative().safe().multipleOf(10),
}).strict();
