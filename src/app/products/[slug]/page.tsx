import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DatabaseMenu from '@/components/restaurant-detail/DatabaseMenu';
import { publicCatalogStyles as styles } from '@/components/catalog/PublicCatalog';
import { routeSlugParamsSchema } from '@/lib/validation/common';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { SupabaseCatalogRepository } from '@/infrastructure/supabase/repositories/supabase-catalog-repository';
import { getServerEnv } from '@/infrastructure/config/server-env';

type Props = { params: Promise<{ slug: string }> };
async function load(slug: string) {
  const repository = new SupabaseCatalogRepository(await createSupabaseServerClient());
  const product = await repository.findProductBySlug(slug);
  if (!product) return null;
  const restaurant = await repository.findRestaurantById(product.restaurantId);
  return restaurant ? { product, restaurant } : null;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const parsed = routeSlugParamsSchema.safeParse(await params);
  if (!parsed.success) return { title: 'محصول یافت نشد | فودینو' };
  const result = await load(parsed.data.slug);
  return result ? { title: `${result.product.name} | فودینو`, description: result.product.description, alternates: { canonical: `/products/${result.product.slug}` }, openGraph: { title: result.product.name, description: result.product.description, type: 'website' } } : { title: 'محصول یافت نشد | فودینو' };
}
export default async function ProductPage({ params }: Props) {
  const parsed = routeSlugParamsSchema.safeParse(await params);
  if (!parsed.success) notFound();
  const result = await load(parsed.data.slug);
  if (!result) notFound();
  const productUrl = new URL(`/products/${result.product.slug}`, getServerEnv().APP_URL).toString();
  const structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: result.product.name,
    description: result.product.description,
    url: productUrl,
    offers: {
      '@type': 'Offer',
      price: result.product.price.amountIrr,
      priceCurrency: 'IRR',
      availability: 'https://schema.org/InStock',
      url: productUrl,
    },
  }).replace(/</g, '\\u003c');
  return <main className={styles.page}><script dangerouslySetInnerHTML={{ __html: structuredData }} type="application/ld+json" /><header className={styles.header}><h1>{result.product.name}</h1><p>{result.product.description}</p></header><DatabaseMenu restaurant={{ id: result.restaurant.id, name: result.restaurant.name }} products={[result.product]} /><Link className={styles.back} href={`/restaurants/${result.restaurant.slug}`}>مشاهده منوی {result.restaurant.name}</Link></main>;
}
