import { z } from 'zod';

export const uuidSchema = z.uuid();
export const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const opaqueCursorSchema = z.string().min(8).max(512).regex(/^[A-Za-z0-9_-]+$/);
export const iranPhoneSchema = z.string().trim().regex(/^09\d{9}$/);

export const routeUuidParamsSchema = z.object({ id: uuidSchema });
export const routeSlugParamsSchema = z.object({ slug: slugSchema });
export const trackingTokenParamsSchema = z.object({
  token: z.string().regex(/^[A-Za-z0-9_-]{43}$/),
});
