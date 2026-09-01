import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.email().trim().toLowerCase().max(254),
  subject: z.string().trim().min(2).max(200),
  message: z.string().trim().min(10).max(5_000),
}).strict();
