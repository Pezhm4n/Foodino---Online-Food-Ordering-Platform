import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DatabaseMenu from '@/components/restaurant-detail/DatabaseMenu';
import { routeSlugParamsSchema } from '@/lib/validation/common';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { SupabaseCatalogRepository } from '@/infrastructure/supabase/repositories/supabase-catalog-repository';

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
  };
}

export default async function RestaurantDetailPage({ params }: RestaurantDetailProps) {
  const parsed = routeSlugParamsSchema.safeParse(await params);
  if (!parsed.success) notFound();
  const client = await createSupabaseServerClient();
  const repository = new SupabaseCatalogRepository(client);
  const restaurant = await repository.findRestaurantBySlug(parsed.data.slug);
  if (!restaurant) notFound();
  const products = await repository.listRestaurantMenu(restaurant.id);

  return (
    <main style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1rem' }}>
      <header>
        <h1>{restaurant.name}</h1>
        <p>{restaurant.description}</p>
        <p>امتیاز {restaurant.rating} — زمان ارسال {restaurant.deliveryMinutes.min} تا {restaurant.deliveryMinutes.max} دقیقه</p>
      </header>
      <h2>منو</h2>
      {products.length === 0 ? <p>در حال حاضر محصول فعالی وجود ندارد.</p> : (
        <DatabaseMenu restaurant={{ id: restaurant.id, name: restaurant.name }} products={products} />
      )}
    </main>
  );
}
