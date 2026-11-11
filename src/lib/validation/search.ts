import { z } from 'zod';
import { opaqueCursorSchema, slugSchema } from '@/lib/validation/common';
import { tryDecodeCursor } from '@/application/pagination/cursor';

export const searchSorts = ['relevance', 'rating_desc', 'delivery_fee_asc'] as const;
export const MAX_CATALOG_QUERY_LENGTH = 120;

const optionalFormValue = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => (typeof value === 'string' && value.trim() === '' ? undefined : value), schema.optional());

export const searchSchema = z.object({
  q: optionalFormValue(z.string().trim().max(MAX_CATALOG_QUERY_LENGTH)),
  category: optionalFormValue(slugSchema),
  sort: z.enum(searchSorts).default('relevance'),
  cursor: optionalFormValue(
    opaqueCursorSchema.refine((value) => tryDecodeCursor(value) !== null, {
      message: 'Invalid cursor payload',
    }),
  ),
}).strict();
