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

function toAsciiDigits(str: string | null | undefined): string {
  if (!str) return '';
  return str
    .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1728))
    .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1584))
    .trim();
}

export async function updateProfileAction(formData: FormData): Promise<void> {
  await assertSameOrigin();
  const userId = await requireUserId();
  const phone = toAsciiDigits(formData.get('phone') as string);
  const parsed = profileSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    phone: phone || undefined,
  });
  if (!parsed.success) throw new Error('INVALID_INPUT');
  const client = await createSupabaseServerClient();
  const { error } = await client.from('profiles').upsert({
    id: userId,
    first_name: parsed.data.firstName,
    last_name: parsed.data.lastName,
    phone: parsed.data.phone || null,
  });
  if (error) throw new Error('PROFILE_UPDATE_FAILED');
  revalidatePath('/profile');
}

export async function createAddressAction(formData: FormData): Promise<void> {
  await assertSameOrigin();
  const userId = await requireUserId();
  const rawPhone = toAsciiDigits(formData.get('recipientPhone') as string);
  const rawPostal = toAsciiDigits(formData.get('postalCode') as string);

  const parsed = addressSchema.safeParse({
    title: formData.get('title'),
    recipientName: formData.get('recipientName'),
    recipientPhone: rawPhone,
    province: formData.get('province'),
    city: formData.get('city'),
    addressLine: formData.get('addressLine'),
    postalCode: rawPostal,
  });
  if (!parsed.success) {
    console.error('Invalid address input:', parsed.error.format());
    throw new Error('INVALID_INPUT');
  }

  const client = await createSupabaseServerClient();
  
  // Ensure profile row exists to prevent foreign key violation on addresses_user_id_fkey
  const { data: existingProfile } = await client
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  if (!existingProfile) {
    await client.from('profiles').upsert({
      id: userId,
      first_name: (formData.get('recipientName') as string) || 'کاربر',
      last_name: '',
    });
  }

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

  if (error) {
    console.error('Address creation failed in Supabase:', error);
    throw new Error(`ADDRESS_CREATE_FAILED: ${error.message}`);
  }
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
