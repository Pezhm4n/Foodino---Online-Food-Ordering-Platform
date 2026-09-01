import { z } from 'zod';
import { iranPhoneSchema } from '@/lib/validation/common';

const emailSchema = z.email().trim().toLowerCase().max(254);
const passwordSchema = z.string().min(12).max(128);

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
}).strict();

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  phone: iranPhoneSchema,
}).strict();

export const forgotPasswordSchema = z.object({ email: emailSchema }).strict();
export const resetPasswordSchema = z.object({ password: passwordSchema }).strict();
