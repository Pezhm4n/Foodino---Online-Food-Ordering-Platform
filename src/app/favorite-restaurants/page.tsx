import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient, requireClaims } from '@/infrastructure/supabase/server';
import FavoriteRestaurantsView from './FavoriteRestaurantsView';

export const metadata: Metadata = {
  title: 'رستوران‌های مورد علاقه | فودینو',
  description: 'لیست رستوران‌های برگزیده و محبوب شما در سامانه سفارش آنلاین غذای فودینو',
};

export default async function FavoriteRestaurantsPage() {
  const claims = await requireClaims();
  if (!claims?.sub) {
    redirect('/auth?next=/favorite-restaurants');
  }

  const client = await createSupabaseServerClient();
  const { data: favoritesData } = await client
    .from('favorites')
    .select(`
      created_at,
      restaurants (
        id,
        name,
        slug,
        description,
        logo_path,
        cover_path,
        rating,
        delivery_fee_irr,
        estimated_delivery_min,
        estimated_delivery_max,
        is_active
      )
    `)
    .order('created_at', { ascending: false });

  const favorites = (favoritesData ?? []).flatMap((item) => {
    const r = item.restaurants;
    return r ? [{
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description || '',
      logoPath: r.logo_path,
      coverPath: r.cover_path,
      rating: Number(r.rating) || 0,
      deliveryFeeIrr: Number(r.delivery_fee_irr) || 0,
      estimatedDeliveryMin: r.estimated_delivery_min || 30,
      estimatedDeliveryMax: r.estimated_delivery_max || 45,
      isActive: r.is_active,
    }] : [];
  });

  return <FavoriteRestaurantsView initialFavorites={favorites} />;
}
