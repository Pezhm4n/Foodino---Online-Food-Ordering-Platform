import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RestaurantGrid, publicCatalogStyles as styles } from '@/components/catalog/PublicCatalog';
import { routeSlugParamsSchema } from '@/lib/validation/common';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { SupabaseCatalogRepository } from '@/infrastructure/supabase/repositories/supabase-catalog-repository';

type Props = { params: Promise<{ slug: string }> };
async function load(slug: string) {
  const repository = new SupabaseCatalogRepository(await createSupabaseServerClient());
  const category = await repository.findCategoryBySlug(slug);
  if (!category) return null;
  return { category, page: await repository.listRestaurants({ categorySlug: slug, sort: 'relevance', limit: 24 }) };
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const parsed = routeSlugParamsSchema.safeParse(await params);
  if (!parsed.success) return { title: 'دسته‌بندی یافت نشد | فودینو' };
  const result = await load(parsed.data.slug);
  return result ? { title: `${result.category.name} | فودینو`, description: result.category.description, alternates: { canonical: `/categories/${result.category.slug}` } } : { title: 'دسته‌بندی یافت نشد | فودینو' };
}
export default async function CategoryPage({ params }: Props) {
  const parsed = routeSlugParamsSchema.safeParse(await params);
  if (!parsed.success) notFound();
  const result = await load(parsed.data.slug);
  if (!result) notFound();
  return <div className={styles.page}><header className={styles.header}><h1>{result.category.icon} {result.category.name}</h1><p>{result.category.description}</p></header><RestaurantGrid restaurants={result.page.items} /></div>;
}
