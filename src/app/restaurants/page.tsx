import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RestaurantGrid, publicCatalogStyles as styles } from '@/components/catalog/PublicCatalog';
import { searchSchema } from '@/lib/validation/search';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { SupabaseCatalogRepository } from '@/infrastructure/supabase/repositories/supabase-catalog-repository';

export const metadata: Metadata = {
  title: 'رستوران‌ها | فودینو',
  description: 'جست‌وجو و مشاهده منوی رستوران‌های فعال فودینو',
  alternates: { canonical: '/restaurants' },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function RestaurantsPage({ searchParams }: Props) {
  const parsed = searchSchema.safeParse(await searchParams);
  if (!parsed.success) notFound();
  const repository = new SupabaseCatalogRepository(await createSupabaseServerClient());
  const [page, categories] = await Promise.all([
    repository.listRestaurants({
      query: parsed.data.q || undefined,
      categorySlug: parsed.data.category,
      sort: parsed.data.sort,
      cursor: parsed.data.cursor,
      limit: 12,
    }),
    repository.listCategories(),
  ]);
  const nextParams = new URLSearchParams();
  if (parsed.data.q) nextParams.set('q', parsed.data.q);
  if (parsed.data.category) nextParams.set('category', parsed.data.category);
  if (parsed.data.sort !== 'relevance') nextParams.set('sort', parsed.data.sort);
  if (page.nextCursor) nextParams.set('cursor', page.nextCursor);

  return <div className={styles.page}>
    <header className={styles.header}><h1>رستوران‌ها</h1><p>نتیجه‌ها مستقیماً از فهرست فعال فودینو خوانده می‌شوند.</p></header>
    <form action="/restaurants" className={styles.search} method="get" role="search">
      <input aria-label="عبارت جست‌وجو" defaultValue={parsed.data.q ?? ''} name="q" placeholder="نام رستوران" />
      <select aria-label="دسته‌بندی" defaultValue={parsed.data.category ?? ''} name="category">
        <option value="">همه دسته‌ها</option>
        {categories.map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}
      </select>
      <select aria-label="مرتب‌سازی" defaultValue={parsed.data.sort} name="sort">
        <option value="relevance">مرتبط‌ترین</option>
        <option value="rating_desc">بالاترین امتیاز</option>
        <option value="delivery_fee_asc">کمترین هزینه ارسال</option>
      </select>
      <button type="submit">جست‌وجو</button>
    </form>
    <RestaurantGrid restaurants={page.items} />
    {page.nextCursor ? <Link className={styles.more} href={`/restaurants?${nextParams}`}>نتایج بیشتر</Link> : null}
  </div>;
}
