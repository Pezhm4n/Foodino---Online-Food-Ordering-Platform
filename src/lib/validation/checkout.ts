import { z } from 'zod';
import { cartSelectionSchema } from '@/lib/validation/cart';
import { uuidSchema } from '@/lib/validation/common';

export const checkoutSchema = z.object({
  idempotencyKey: uuidSchema,
  addressId: uuidSchema,
  restaurantId: uuidSchema,
  items: z.array(cartSelectionSchema.omit({ restaurantId: true })).min(1).max(100),
}).strict();

export type CheckoutInput = z.infer<typeof checkoutSchema>;
