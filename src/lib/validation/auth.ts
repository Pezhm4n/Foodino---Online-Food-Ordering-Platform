import { z } from 'zod';
import { iranPhoneSchema } from '@/lib/validation/common';

const emailSchema = z.string().trim().email('فرمت ایمیل نامعتبر است (مثال: user@example.com)').toLowerCase().max(254);
const passwordSchema = z.string().min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد').max(128, 'رمز عبور بیش از حد طولانی است');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'لطفاً رمز عبور را وارد کنید').max(128),
}).strict();

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().trim().min(1, 'لطفاً نام خود را وارد کنید').max(80, 'نام نباید بیشتر از ۸۰ حرف باشد'),
  lastName: z.string().trim().min(1, 'لطفاً نام خانوادگی خود را وارد کنید').max(80, 'نام خانوادگی نباید بیشتر از ۸۰ حرف باشد'),
  phone: iranPhoneSchema,
}).strict();

export const forgotPasswordSchema = z.object({ email: emailSchema }).strict();
export const resetPasswordSchema = z.object({ password: passwordSchema }).strict();

