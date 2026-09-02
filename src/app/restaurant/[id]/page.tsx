import { notFound, permanentRedirect } from 'next/navigation';
import { resolveLegacyRestaurantId } from '@/application/routing/legacy-id-map';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { SupabaseCatalogRepository } from '@/infrastructure/supabase/repositories/supabase-catalog-repository';

export default async function LegacyRestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const id = resolveLegacyRestaurantId((await params).id);
  if (!id) notFound();
  const restaurant = await new SupabaseCatalogRepository(await createSupabaseServerClient()).findRestaurantById(id);
  if (!restaurant) notFound();
  permanentRedirect(`/restaurants/${restaurant.slug}`);
}
