import { describe, it, expect } from 'vitest';
import { MockCatalogRepository } from './mock-catalog-repository';

describe('MockCatalogRepository', () => {
  const repository = new MockCatalogRepository();

  it('lists all categories with icons and slugs', async () => {
    const categories = await repository.listCategories();
    expect(categories.length).toBeGreaterThan(0);
    expect(categories.some((c) => c.slug === 'pizza')).toBe(true);
    expect(categories.some((c) => c.slug === 'burger')).toBe(true);
  });

  it('finds category by slug and id', async () => {
    const bySlug = await repository.findCategoryBySlug('pizza');
    expect(bySlug).not.toBeNull();
    expect(bySlug?.name).toBe('پیتزا');

    const byId = await repository.findCategoryById(bySlug!.id);
    expect(byId?.slug).toBe('pizza');
  });

  it('lists restaurants with category filter and search query', async () => {
    const all = await repository.listRestaurants({ sort: 'relevance', limit: 10 });
    expect(all.items.length).toBeGreaterThan(0);

    const filteredByCategory = await repository.listRestaurants({
      categorySlug: 'pizza',
      sort: 'relevance',
      limit: 10,
    });
    expect(filteredByCategory.items.length).toBeGreaterThan(0);
    expect(filteredByCategory.items[0].slug).toBe('best-pizza');

    const filteredByQuery = await repository.listRestaurants({
      query: 'برگرلند',
      sort: 'relevance',
      limit: 10,
    });
    expect(filteredByQuery.items.length).toBe(1);
    expect(filteredByQuery.items[0].slug).toBe('burger-land');
  });

  it('sorts restaurants by rating', async () => {
    const sorted = await repository.listRestaurants({ sort: 'rating_desc', limit: 10 });
    for (let i = 0; i < sorted.items.length - 1; i++) {
      expect(sorted.items[i].rating).toBeGreaterThanOrEqual(sorted.items[i + 1].rating);
    }
  });

  it('finds restaurant by slug and lists its full menu', async () => {
    const restaurant = await repository.findRestaurantBySlug('burger-land');
    expect(restaurant).not.toBeNull();
    expect(restaurant?.name).toBe('برگرلند');

    const menu = await repository.listRestaurantMenu(restaurant!.id);
    expect(menu.length).toBeGreaterThan(0);
    expect(menu.some((p) => p.slug === 'burger-land-classic')).toBe(true);
  });

  it('finds product by slug with variants and addons', async () => {
    const product = await repository.findProductBySlug('best-pizza-special');
    expect(product).not.toBeNull();
    expect(product?.name).toBe('پیتزا مخصوص اسپشیال');
    expect(product?.variants.length).toBeGreaterThan(0);
    expect(product?.addons.length).toBeGreaterThan(0);
  });
});
