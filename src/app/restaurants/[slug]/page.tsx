import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import RestaurantView from '@/components/restaurant-detail/RestaurantView';
import { routeSlugParamsSchema } from '@/lib/validation/common';
import { createSupabaseServerClient, requireClaims } from '@/infrastructure/supabase/server';
import { SupabaseCatalogRepository } from '@/infrastructure/supabase/repositories/supabase-catalog-repository';
import { getServerEnv } from '@/infrastructure/config/server-env';

type RestaurantDetailProps = { params: Promise<{ slug: string }> };

async function getRestaurant(slug: string) {
  const repository = new SupabaseCatalogRepository(await createSupabaseServerClient());
  return repository.findRestaurantBySlug(slug);
}

export async function generateMetadata({ params }: RestaurantDetailProps): Promise<Metadata> {
  const parsed = routeSlugParamsSchema.safeParse(await params);
  if (!parsed.success) return { title: 'رستوران یافت نشد | فودینو' };
  const restaurant = await getRestaurant(parsed.data.slug);
  if (!restaurant) return { title: 'رستوران یافت نشد | فودینو' };
  return {
    title: `${restaurant.name} | فودینو`,
    description: restaurant.description || `سفارش آنلاین از ${restaurant.name}`,
    alternates: { canonical: `/restaurants/${restaurant.slug}` },
    openGraph: { title: restaurant.name, description: restaurant.description, type: 'website' },
  };
}

export default async function RestaurantDetailPage({ params }: RestaurantDetailProps) {
  const parsed = routeSlugParamsSchema.safeParse(await params);
  if (!parsed.success) notFound();
  const client = await createSupabaseServerClient();
  const repository = new SupabaseCatalogRepository(client);
  const restaurant = await repository.findRestaurantBySlug(parsed.data.slug);
  if (!restaurant) notFound();
  const claims = await requireClaims();
  const [products, userFav, reviewsData, canReviewData] = await Promise.all([
    repository.listRestaurantMenu(restaurant.id),
    claims?.sub
      ? client.from('favorites').select('restaurant_id').eq('user_id', claims.sub).eq('restaurant_id', restaurant.id).maybeSingle()
      : Promise.resolve({ data: null }),
    client
      .from('reviews')
      .select('id,user_name,rating,food_name,comment,created_at')
      .eq('restaurant_id', restaurant.id)
      .order('created_at', { ascending: false })
      .limit(30),
    claims?.sub
      ? client
          .from('orders')
          .select('id')
          .eq('user_id', claims.sub)
          .eq('restaurant_id', restaurant.id)
          .in('status', ['confirmed', 'preparing', 'ready', 'delivering', 'delivered'])
          .limit(1)
      : Promise.resolve({ data: [] }),
  ]);
  const isFavorite = Boolean(userFav.data);
  const canReview = Boolean(canReviewData.data && canReviewData.data.length > 0);
  const isLoggedIn = Boolean(claims?.sub);
  const reviews = (reviewsData.data ?? []).map((r) => ({
    id: r.id,
    userName: r.user_name,
    rating: r.rating,
    foodName: r.food_name || undefined,
    comment: r.comment,
    createdAt: new Date(r.created_at).toLocaleDateString('fa-IR'),
  }));

  const structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: restaurant.name,
    description: restaurant.description,
    url: new URL(`/restaurants/${restaurant.slug}`, getServerEnv().APP_URL).toString(),
  }).replace(/</g, '\\u003c');

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: structuredData }} type="application/ld+json" />
      <RestaurantView
        restaurant={restaurant}
        products={products}
        isFavorite={isFavorite}
        reviews={reviews}
        canReview={canReview}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}
