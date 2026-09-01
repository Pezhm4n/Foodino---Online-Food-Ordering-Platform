import { z } from 'zod';
import { iranPhoneSchema, uuidSchema } from '@/lib/validation/common';

export const profileSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  phone: iranPhoneSchema.optional().or(z.literal('')),
}).strict();

export const addressSchema = z.object({
  title: z.string().trim().min(1).max(80),
  recipientName: z.string().trim().min(1).max(160),
  recipientPhone: iranPhoneSchema,
  province: z.string().trim().min(1).max(100),
  city: z.string().trim().min(1).max(100),
  addressLine: z.string().trim().min(5).max(500),
  postalCode: z.string().trim().regex(/^\d{10}$/),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
}).strict();

export const favoriteSchema = z.object({ restaurantId: uuidSchema }).strict();
