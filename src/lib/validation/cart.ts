import { z } from 'zod';
import { MAX_CART_QUANTITY, MIN_CART_QUANTITY } from '@/domain/cart/cart';
import { uuidSchema } from '@/lib/validation/common';

export const cartSelectionSchema = z.object({
  restaurantId: uuidSchema,
  productId: uuidSchema,
  variantId: uuidSchema.optional(),
  addonIds: z.array(uuidSchema).max(20).default([]),
  quantity: z.number().int().min(MIN_CART_QUANTITY).max(MAX_CART_QUANTITY),
}).strict();

export const localCartSchema = z.object({
  version: z.literal(1),
  restaurantId: uuidSchema.nullable(),
  items: z.array(cartSelectionSchema).max(100),
}).strict().superRefine((cart, context) => {
  if (cart.items.length === 0 && cart.restaurantId !== null) {
    context.addIssue({ code: 'custom', message: 'Empty cart must not have a restaurant.' });
  }

  for (const item of cart.items) {
    if (cart.restaurantId !== item.restaurantId) {
      context.addIssue({ code: 'custom', message: 'All cart items must belong to one restaurant.' });
      break;
    }
  }
});
