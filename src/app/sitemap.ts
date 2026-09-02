import type { MetadataRoute } from 'next';
import { getServerEnv } from '@/infrastructure/config/server-env';
import { createSupabasePublicClient } from '@/infrastructure/supabase/public';
import { SupabaseCatalogRepository } from '@/infrastructure/supabase/repositories/supabase-catalog-repository';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getServerEnv().APP_URL;
  const staticPaths = ['', '/restaurants', '/categories', '/about', '/contact', '/faq'];

  try {
    const repository = new SupabaseCatalogRepository(createSupabasePublicClient());
    const [restaurantPage, categories] = await Promise.all([
      repository.listRestaurants({ sort: 'relevance', limit: 100 }),
      repository.listCategories(),
    ]);
    const menus = await Promise.all(restaurantPage.items.map((restaurant) => repository.listRestaurantMenu(restaurant.id)));
    const paths = [
      ...staticPaths,
      ...restaurantPage.items.map((restaurant) => `/restaurants/${restaurant.slug}`),
      ...categories.map((category) => `/categories/${category.slug}`),
      ...menus.flat().map((product) => `/products/${product.slug}`),
    ];
    return paths.map((path) => ({
      url: new URL(path || '/', baseUrl).toString(),
      changeFrequency: path === '' ? 'daily' : 'weekly',
    }));
  } catch {
    return staticPaths.map((path) => ({
      url: new URL(path || '/', baseUrl).toString(),
      changeFrequency: path === '' ? 'daily' : 'weekly',
    }));
  }
}
