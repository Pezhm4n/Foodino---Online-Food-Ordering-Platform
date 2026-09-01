import type { Money } from '@/domain/money/money';

export type RestaurantSummary = Readonly<{
  id: string;
  slug: string;
  name: string;
  description: string;
  rating: number;
  minimumOrder: Money;
  deliveryFee: Money;
  deliveryMinutes: Readonly<{ min: number; max: number }>;
}>;

export type ProductSummary = Readonly<{
  id: string;
  restaurantId: string;
  slug: string;
  name: string;
  description: string;
  price: Money;
  imagePath: string | null;
}>;

export type CursorPage<T> = Readonly<{
  items: readonly T[];
  nextCursor: string | null;
}>;

export type RestaurantSort = 'relevance' | 'rating_desc' | 'delivery_fee_asc';

export interface CatalogRepository {
  findRestaurantBySlug(slug: string): Promise<RestaurantSummary | null>;
  listRestaurants(input: Readonly<{
    query?: string;
    sort: RestaurantSort;
    cursor?: string;
    limit: number;
  }>): Promise<CursorPage<RestaurantSummary>>;
  listProductsByRestaurant(
    restaurantId: string,
    input: Readonly<{ cursor?: string; limit: number }>,
  ): Promise<CursorPage<ProductSummary>>;
}
