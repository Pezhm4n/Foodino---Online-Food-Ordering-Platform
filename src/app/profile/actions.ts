'use server';

import { revalidatePath } from 'next/cache';
import { assertSameOrigin } from '@/infrastructure/http/same-origin';
import { createSupabaseServerClient, requireClaims } from '@/infrastructure/supabase/server';
import { addressSchema, favoriteSchema, profileSchema } from '@/lib/validation/customer';
import { uuidSchema } from '@/lib/validation/common';

async function requireUserId(): Promise<string> {
  const claims = await requireClaims();
  if (!claims?.sub) throw new Error('AUTHENTICATION_REQUIRED');
  return claims.sub;
}

export async function updateProfileAction(formData: FormData): Promise<void> {
  await assertSameOrigin();
  const userId = await requireUserId();
  const parsed = profileSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    phone: formData.get('phone'),
  });
  if (!parsed.success) throw new Error('INVALID_INPUT');
  const client = await createSupabaseServerClient();
  const { error } = await client.from('profiles').update({
    first_name: parsed.data.firstName,
    last_name: parsed.data.lastName,
    phone: parsed.data.phone || null,
  }).eq('id', userId);
  if (error) throw new Error('PROFILE_UPDATE_FAILED');
  revalidatePath('/profile');
}

export async function createAddressAction(formData: FormData): Promise<void> {
  await assertSameOrigin();
  const userId = await requireUserId();
  const parsed = addressSchema.safeParse({
    title: formData.get('title'),
    recipientName: formData.get('recipientName'),
    recipientPhone: formData.get('recipientPhone'),
    province: formData.get('province'),
    city: formData.get('city'),
    addressLine: formData.get('addressLine'),
    postalCode: formData.get('postalCode'),
  });
  if (!parsed.success) throw new Error('INVALID_INPUT');
  const client = await createSupabaseServerClient();
  const { error } = await client.from('addresses').insert({
    user_id: userId,
    title: parsed.data.title,
    recipient_name: parsed.data.recipientName,
    recipient_phone: parsed.data.recipientPhone,
    province: parsed.data.province,
    city: parsed.data.city,
    address_line: parsed.data.addressLine,
    postal_code: parsed.data.postalCode,
  });
  if (error) throw new Error('ADDRESS_CREATE_FAILED');
  revalidatePath('/profile');
}

export async function deleteAddressAction(formData: FormData): Promise<void> {
  await assertSameOrigin();
  await requireUserId();
  const parsed = uuidSchema.safeParse(formData.get('addressId'));
  if (!parsed.success) throw new Error('INVALID_INPUT');
  const client = await createSupabaseServerClient();
  const { error } = await client.from('addresses').delete().eq('id', parsed.data);
  if (error) throw new Error('ADDRESS_DELETE_FAILED');
  revalidatePath('/profile');
}

export async function removeFavoriteAction(formData: FormData): Promise<void> {
  await assertSameOrigin();
  await requireUserId();
  const parsed = favoriteSchema.safeParse({ restaurantId: formData.get('restaurantId') });
  if (!parsed.success) throw new Error('INVALID_INPUT');
  const client = await createSupabaseServerClient();
  const { error } = await client.from('favorites').delete().eq('restaurant_id', parsed.data.restaurantId);
  if (error) throw new Error('FAVORITE_DELETE_FAILED');
  revalidatePath('/profile');
  revalidatePath('/favorite-restaurants');
}

export async function toggleFavoriteAction(restaurantId: string): Promise<{ isFavorite: boolean }> {
  await assertSameOrigin();
  const userId = await requireUserId();
  const parsed = uuidSchema.safeParse(restaurantId);
  if (!parsed.success) throw new Error('INVALID_INPUT');

  const client = await createSupabaseServerClient();
  const { data: existing } = await client
    .from('favorites')
    .select('restaurant_id')
    .eq('user_id', userId)
    .eq('restaurant_id', parsed.data)
    .maybeSingle();

  if (existing) {
    const { error } = await client
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('restaurant_id', parsed.data);
    if (error) throw new Error('FAVORITE_DELETE_FAILED');
    revalidatePath('/profile');
    revalidatePath('/favorite-restaurants');
    return { isFavorite: false };
  } else {
    const { error } = await client
      .from('favorites')
      .insert({
        user_id: userId,
        restaurant_id: parsed.data,
      });
    if (error) throw new Error('FAVORITE_INSERT_FAILED');
    revalidatePath('/profile');
    revalidatePath('/favorite-restaurants');
    return { isFavorite: true };
  }
}

export async function getUserFavoriteRestaurantIdsAction(): Promise<string[]> {
  const claims = await requireClaims();
  if (!claims?.sub) return [];
  const client = await createSupabaseServerClient();
  const { data } = await client
    .from('favorites')
    .select('restaurant_id')
    .eq('user_id', claims.sub);
  return (data ?? []).map((row) => row.restaurant_id);
}
