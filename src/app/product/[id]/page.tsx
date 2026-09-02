import { notFound, permanentRedirect } from 'next/navigation';
import { resolveLegacyProductId } from '@/application/routing/legacy-id-map';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { SupabaseCatalogRepository } from '@/infrastructure/supabase/repositories/supabase-catalog-repository';

export default async function LegacyProductPage({ params }: { params: Promise<{ id: string }> }) {
  const id = resolveLegacyProductId((await params).id);
  if (!id) notFound();
  const repository = new SupabaseCatalogRepository(await createSupabaseServerClient());
  const product = await repository.findProductById(id);
  if (!product) notFound();
  const restaurant = await repository.findRestaurantById(product.restaurantId);
  if (!restaurant) notFound();
  permanentRedirect(`/products/${product.slug}`);
}
