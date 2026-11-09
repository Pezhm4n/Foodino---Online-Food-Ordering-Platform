import { z } from 'zod';
import { cartSelectionSchema, couponCodeSchema, ORDER_NOTE_MAX_LENGTH } from '@/lib/validation/cart';
import { uuidSchema } from '@/lib/validation/common';
import { isValidIrrAmount } from '@/domain/money/money';

const orderNoteSchema = z.string().trim().max(ORDER_NOTE_MAX_LENGTH).optional();

const checkoutSelectionSchema = z.object({
  restaurantId: uuidSchema,
  items: z.array(cartSelectionSchema.omit({ restaurantId: true })).min(1).max(100),
  couponCode: couponCodeSchema.optional(),
}).strict();

export const checkoutQuoteSchema = checkoutSelectionSchema.extend({
  idempotencyKey: uuidSchema.optional(),
  addressId: uuidSchema.optional(),
  orderNote: orderNoteSchema,
});

export const checkoutSchema = checkoutSelectionSchema.extend({
  idempotencyKey: uuidSchema,
  addressId: uuidSchema,
  orderNote: orderNoteSchema,
  expectedTotalIrr: z.number().refine(isValidIrrAmount).optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CheckoutQuoteInput = z.infer<typeof checkoutQuoteSchema>;
