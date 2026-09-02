import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DatabaseMenu from '@/components/restaurant-detail/DatabaseMenu';
import FavoriteButton from '@/components/common/FavoriteButton';
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
  const [products, userFav] = await Promise.all([
    repository.listRestaurantMenu(restaurant.id),
    claims?.sub
      ? client.from('favorites').select('restaurant_id').eq('user_id', claims.sub).eq('restaurant_id', restaurant.id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  const isFavorite = Boolean(userFav.data);
  const structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: restaurant.name,
    description: restaurant.description,
    url: new URL(`/restaurants/${restaurant.slug}`, getServerEnv().APP_URL).toString(),
  }).replace(/</g, '\\u003c');

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: 'clamp(1rem, 3vw, 2rem) clamp(0.75rem, 3vw, 1rem) clamp(2.5rem, 5vw, 4rem)', direction: 'rtl' }}>
      <script dangerouslySetInnerHTML={{ __html: structuredData }} type="application/ld+json" />
      <header style={{ marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.35rem, 4.5vw, 2rem)', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem' }}>{restaurant.name}</h1>
            <p style={{ color: '#475569', fontSize: 'clamp(0.85rem, 2.5vw, 1.05rem)', margin: 0, lineHeight: 1.6 }}>{restaurant.description}</p>
          </div>
          <FavoriteButton
            restaurantId={restaurant.id}
            restaurantName={restaurant.name}
            initialIsFavorite={isFavorite}
            variant="button"
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.85rem', color: '#64748b' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: '#fef3c7', color: '#b45309', padding: '0.2rem 0.55rem', borderRadius: '9999px', fontWeight: 700, fontSize: '0.8rem' }}>
            ⭐ {restaurant.rating}
          </span>
          <span>⏱️ زمان ارسال: {restaurant.deliveryMinutes.min} تا {restaurant.deliveryMinutes.max} دقیقه</span>
        </div>
      </header>
      <h2 style={{ fontSize: 'clamp(1.15rem, 3vw, 1.35rem)', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>منوی غذا</h2>
      {products.length === 0 ? <p style={{ color: '#64748b' }}>در حال حاضر محصول فعالی وجود ندارد.</p> : (
        <DatabaseMenu restaurant={{ id: restaurant.id, name: restaurant.name }} products={products} />
      )}
    </div>
  );
}
