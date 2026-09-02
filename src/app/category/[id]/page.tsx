import { notFound, permanentRedirect } from 'next/navigation';
import { resolveLegacyCategoryId } from '@/application/routing/legacy-id-map';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { SupabaseCatalogRepository } from '@/infrastructure/supabase/repositories/supabase-catalog-repository';

export default async function LegacyCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const id = resolveLegacyCategoryId((await params).id);
  if (!id) notFound();
  const category = await new SupabaseCatalogRepository(await createSupabaseServerClient()).findCategoryById(id);
  if (!category) notFound();
  permanentRedirect(`/categories/${category.slug}`);
}
