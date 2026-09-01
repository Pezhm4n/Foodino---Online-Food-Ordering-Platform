'use server';

import { revalidatePath } from 'next/cache';
import { assertSameOrigin } from '@/infrastructure/http/same-origin';
import {
  claimsHaveOperatorRole,
  createSupabaseServerClient,
  requireClaims,
} from '@/infrastructure/supabase/server';
import { SupabaseOrderRepository } from '@/infrastructure/supabase/repositories/supabase-order-repository';
import { orderStatusSchema } from '@/lib/validation/order';
import { uuidSchema } from '@/lib/validation/common';

export async function transitionOrderAction(formData: FormData): Promise<void> {
  await assertSameOrigin();
  const claims = await requireClaims();
  if (!claimsHaveOperatorRole(claims)) throw new Error('AUTHORIZATION_REQUIRED');
  const orderId = uuidSchema.safeParse(formData.get('orderId'));
  const status = orderStatusSchema.safeParse(formData.get('status'));
  if (!orderId.success || !status.success) throw new Error('INVALID_INPUT');

  const repository = new SupabaseOrderRepository(await createSupabaseServerClient());
  await repository.transition(orderId.data, status.data);
  revalidatePath('/operator/orders');
}
