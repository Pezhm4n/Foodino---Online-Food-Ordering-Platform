import { z } from 'zod';
import { opaqueCursorSchema, slugSchema } from '@/lib/validation/common';

export const searchSorts = ['relevance', 'rating_desc', 'delivery_fee_asc'] as const;

export const searchSchema = z.object({
  q: z.string().trim().max(120).optional(),
  category: slugSchema.optional(),
  sort: z.enum(searchSorts).default('relevance'),
  cursor: opaqueCursorSchema.optional(),
}).strict();
