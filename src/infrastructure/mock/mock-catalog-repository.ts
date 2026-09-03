import type {
  CatalogRepository,
  CategorySummary,
  CursorPage,
  ProductMenuItem,
  ProductSummary,
  RestaurantSort,
  RestaurantSummary,
} from '@/application/ports/catalog-repository';
import { encodeCursor, tryDecodeCursor } from '@/application/pagination/cursor';
import {
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
  MOCK_RESTAURANTS,
} from './mock-catalog-data';

export class MockCatalogRepository implements CatalogRepository {
  async findRestaurantBySlug(slug: string): Promise<RestaurantSummary | null> {
    const restaurant = MOCK_RESTAURANTS.find((r) => r.slug === slug);
    return restaurant ?? null;
  }

  async findRestaurantById(id: string): Promise<RestaurantSummary | null> {
    const restaurant = MOCK_RESTAURANTS.find((r) => r.id === id);
    return restaurant ?? null;
  }

  async findCategoryBySlug(slug: string): Promise<CategorySummary | null> {
    const category = MOCK_CATEGORIES.find((c) => c.slug === slug);
    return category ?? null;
  }

  async findCategoryById(id: string): Promise<CategorySummary | null> {
    const category = MOCK_CATEGORIES.find((c) => c.id === id);
    return category ?? null;
  }

  async listCategories(): Promise<readonly CategorySummary[]> {
    return MOCK_CATEGORIES;
  }

  async findProductBySlug(slug: string): Promise<ProductMenuItem | null> {
    const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
    return product ?? null;
  }

  async findProductById(id: string): Promise<ProductMenuItem | null> {
    const product = MOCK_PRODUCTS.find((p) => p.id === id);
    return product ?? null;
  }

  async listRestaurants(input: Readonly<{
    query?: string;
    categorySlug?: string;
    sort: RestaurantSort;
    cursor?: string;
    limit: number;
  }>): Promise<CursorPage<RestaurantSummary>> {
    let filtered = [...MOCK_RESTAURANTS];

    if (input.categorySlug) {
      const category = MOCK_CATEGORIES.find((c) => c.slug === input.categorySlug);
      if (category) {
        filtered = filtered.filter((r) => r.categoryIds.includes(category.id));
      }
    }

    if (input.query && input.query.trim()) {
      const q = input.query.trim().toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.slug.toLowerCase().includes(q),
      );
    }

    if (input.sort === 'rating_desc') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (input.sort === 'delivery_fee_asc') {
      filtered.sort((a, b) => a.deliveryFee.amountIrr - b.deliveryFee.amountIrr);
    }

    let startIndex = 0;
    if (input.cursor) {
      const decoded = tryDecodeCursor(input.cursor);
      if (decoded) {
        const foundIndex = filtered.findIndex((r) => r.id === decoded.id);
        if (foundIndex >= 0) {
          startIndex = foundIndex + 1;
        }
      }
    }

    const pageSize = Math.max(1, input.limit || 12);
    const pagedItems = filtered.slice(startIndex, startIndex + pageSize);
    const hasMore = startIndex + pageSize < filtered.length;
    const lastItem = pagedItems[pagedItems.length - 1];

    const nextCursor = hasMore && lastItem
      ? encodeCursor({
          value: input.sort === 'rating_desc' ? lastItem.rating : input.sort === 'delivery_fee_asc' ? lastItem.deliveryFee.amountIrr : lastItem.slug,
          id: lastItem.id,
        })
      : null;

    return {
      items: pagedItems,
      nextCursor,
    };
  }

  async listProductsByRestaurant(
    restaurantId: string,
    input: Readonly<{ cursor?: string; limit: number }>,
  ): Promise<CursorPage<ProductSummary>> {
    const products = MOCK_PRODUCTS.filter((p) => p.restaurantId === restaurantId);
    let startIndex = 0;
    if (input.cursor) {
      const decoded = tryDecodeCursor(input.cursor);
      if (decoded) {
        const foundIndex = products.findIndex((p) => p.id === decoded.id);
        if (foundIndex >= 0) startIndex = foundIndex + 1;
      }
    }
    const pageSize = Math.max(1, input.limit || 20);
    const pagedItems = products.slice(startIndex, startIndex + pageSize);
    const hasMore = startIndex + pageSize < products.length;
    const lastItem = pagedItems[pagedItems.length - 1];

    return {
      items: pagedItems,
      nextCursor: hasMore && lastItem ? encodeCursor({ value: lastItem.price.amountIrr, id: lastItem.id }) : null,
    };
  }

  async listRestaurantMenu(restaurantId: string): Promise<readonly ProductMenuItem[]> {
    return MOCK_PRODUCTS.filter((p) => p.restaurantId === restaurantId);
  }
}
