import type { SupabaseClient } from '@supabase/supabase-js';
import { money } from '@/domain/money/money';
import type {
  CatalogRepository,
  CursorPage,
  ProductSummary,
  ProductMenuItem,
  RestaurantSummary,
  RestaurantSort,
  CategorySummary,
} from '@/application/ports/catalog-repository';
import { decodeCursor, encodeCursor } from '@/application/pagination/cursor';
import type { Database } from '@/infrastructure/supabase/database.types';
import { MockCatalogRepository } from '@/infrastructure/mock/mock-catalog-repository';

type RestaurantRow = Database['public']['Tables']['restaurants']['Row'];
type ProductRow = Database['public']['Tables']['products']['Row'];
type CategoryRow = Database['public']['Tables']['categories']['Row'];

function mapRestaurant(row: RestaurantRow): RestaurantSummary {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    rating: row.rating,
    minimumOrder: money(row.minimum_order_irr),
    deliveryFee: money(row.delivery_fee_irr),
    deliveryMinutes: { min: row.estimated_delivery_min, max: row.estimated_delivery_max },
  };
}

function mapProduct(row: ProductRow): ProductSummary {
  return {
    id: row.id,
    restaurantId: row.restaurant_id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: money(row.price_irr),
    imagePath: row.image_path,
  };
}

function mapCategory(row: CategoryRow): CategorySummary {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    icon: row.icon ?? '🍽️',
  };
}

type ProductWithOptions = ProductRow & {
  product_variants: Array<{ id: string; name: string; price_adjustment_irr: number }>;
  product_addons: Array<{ id: string; name: string; price_irr: number }>;
};

function mapProductMenuItem(row: ProductWithOptions): ProductMenuItem {
  return {
    ...mapProduct(row),
    variants: row.product_variants.map((variant) => ({
      id: variant.id,
      name: variant.name,
      priceAdjustmentIrr: variant.price_adjustment_irr,
    })),
    addons: row.product_addons.map((addon) => ({
      id: addon.id,
      name: addon.name,
      priceAdjustmentIrr: addon.price_irr,
    })),
  };
}

function sortColumn(sort: RestaurantSort): 'rating' | 'delivery_fee_irr' | 'created_at' {
  if (sort === 'rating_desc') return 'rating';
  if (sort === 'delivery_fee_asc') return 'delivery_fee_irr';
  return 'created_at';
}

export class SupabaseCatalogRepository implements CatalogRepository {
  private readonly fallback: CatalogRepository;

  constructor(
    private readonly client: SupabaseClient<Database>,
    fallback?: CatalogRepository,
  ) {
    this.fallback = fallback ?? new MockCatalogRepository();
  }

  private isDemoMode(): boolean {
    return process.env.DEMO_MODE === 'true';
  }

  async findRestaurantBySlug(slug: string): Promise<RestaurantSummary | null> {
    if (this.isDemoMode()) {
      return this.fallback.findRestaurantBySlug(slug);
    }
    try {
      const { data, error } = await this.client
        .from('restaurants')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();
      if (error) throw error;
      if (!data) return this.fallback.findRestaurantBySlug(slug);
      return mapRestaurant(data);
    } catch {
      return this.fallback.findRestaurantBySlug(slug);
    }
  }

  async findRestaurantById(id: string): Promise<RestaurantSummary | null> {
    if (this.isDemoMode()) {
      return this.fallback.findRestaurantById(id);
    }
    try {
      const { data, error } = await this.client
        .from('restaurants').select('*').eq('id', id).eq('is_active', true).maybeSingle();
      if (error) throw error;
      if (!data) return this.fallback.findRestaurantById(id);
      return mapRestaurant(data);
    } catch {
      return this.fallback.findRestaurantById(id);
    }
  }

  async findCategoryBySlug(slug: string): Promise<CategorySummary | null> {
    if (this.isDemoMode()) {
      return this.fallback.findCategoryBySlug(slug);
    }
    try {
      const { data, error } = await this.client
        .from('categories').select('*').eq('slug', slug).eq('is_active', true).maybeSingle();
      if (error) throw error;
      if (!data) return this.fallback.findCategoryBySlug(slug);
      return mapCategory(data);
    } catch {
      return this.fallback.findCategoryBySlug(slug);
    }
  }

  async findCategoryById(id: string): Promise<CategorySummary | null> {
    if (this.isDemoMode()) {
      return this.fallback.findCategoryById(id);
    }
    try {
      const { data, error } = await this.client
        .from('categories').select('*').eq('id', id).eq('is_active', true).maybeSingle();
      if (error) throw error;
      if (!data) return this.fallback.findCategoryById(id);
      return mapCategory(data);
    } catch {
      return this.fallback.findCategoryById(id);
    }
  }

  async listCategories(): Promise<readonly CategorySummary[]> {
    if (this.isDemoMode()) {
      return this.fallback.listCategories();
    }
    try {
      const { data, error } = await this.client
        .from('categories').select('*').eq('is_active', true).order('sort_order').order('id');
      if (error) throw error;
      if (!data || data.length === 0) return this.fallback.listCategories();
      return data.map(mapCategory);
    } catch {
      return this.fallback.listCategories();
    }
  }

  private async findProduct(column: 'id' | 'slug', value: string): Promise<ProductMenuItem | null> {
    const { data, error } = await this.client
      .from('products')
      .select('*,product_variants(id,name,price_adjustment_irr),product_addons(id,name,price_irr)')
      .eq(column, value)
      .eq('is_available', true)
      .maybeSingle();
    if (error) throw error;
    return data ? mapProductMenuItem(data) : null;
  }

  async findProductBySlug(slug: string): Promise<ProductMenuItem | null> {
    if (this.isDemoMode()) {
      return this.fallback.findProductBySlug(slug);
    }
    try {
      const res = await this.findProduct('slug', slug);
      if (res) return res;
      return this.fallback.findProductBySlug(slug);
    } catch {
      return this.fallback.findProductBySlug(slug);
    }
  }

  async findProductById(id: string): Promise<ProductMenuItem | null> {
    if (this.isDemoMode()) {
      return this.fallback.findProductById(id);
    }
    try {
      const res = await this.findProduct('id', id);
      if (res) return res;
      return this.fallback.findProductById(id);
    } catch {
      return this.fallback.findProductById(id);
    }
  }

  async listRestaurants(input: {
    query?: string;
    categorySlug?: string;
    sort: RestaurantSort;
    cursor?: string;
    limit: number;
  }): Promise<CursorPage<RestaurantSummary>> {
    if (this.isDemoMode()) {
      return this.fallback.listRestaurants(input);
    }
    try {
      const column = sortColumn(input.sort);
      const ascending = input.sort !== 'rating_desc';
      let query = this.client.from('restaurants').select('*').eq('is_active', true);
      if (input.query) {
        const cleanQuery = input.query.trim().replace(/[%_]/g, '\\$&').replace(/[,()]/g, ' ');
        if (cleanQuery) {
          query = query.or(`normalized_name.ilike.%${cleanQuery}%,description.ilike.%${cleanQuery}%`);
        }
      }
      if (input.categorySlug) {
        const category = await this.findCategoryBySlug(input.categorySlug);
        if (!category) return this.fallback.listRestaurants(input);
        const { data: links, error: linksError } = await this.client
          .from('restaurant_categories').select('restaurant_id').eq('category_id', category.id);
        if (linksError) throw linksError;
        if (links.length === 0) return { items: [], nextCursor: null };
        query = query.in('id', links.map((link) => link.restaurant_id));
      }
      if (input.cursor) {
        const cursor = decodeCursor(input.cursor);
        const safeCursorVal = typeof cursor.value === 'string'
          ? `"${cursor.value.replace(/"/g, '')}"`
          : cursor.value;
        query = ascending
          ? query.or(`${column}.gt.${safeCursorVal},and(${column}.eq.${safeCursorVal},id.gt.${cursor.id})`)
          : query.or(`${column}.lt.${safeCursorVal},and(${column}.eq.${safeCursorVal},id.gt.${cursor.id})`);
      }
      const { data, error } = await query
        .order(column, { ascending })
        .order('id', { ascending: true })
        .limit(input.limit + 1);
      if (error) throw error;
      if (!data || data.length === 0) {
        return this.fallback.listRestaurants(input);
      }

      const hasMore = data.length > input.limit;
      const rows = hasMore ? data.slice(0, input.limit) : data;
      const last = rows.at(-1);
      return {
        items: rows.map(mapRestaurant),
        nextCursor: hasMore && last
          ? encodeCursor({ value: last[column], id: last.id })
          : null,
      };
    } catch {
      return this.fallback.listRestaurants(input);
    }
  }

  async listProductsByRestaurant(
    restaurantId: string,
    input: { cursor?: string; limit: number },
  ): Promise<CursorPage<ProductSummary>> {
    if (this.isDemoMode()) {
      return this.fallback.listProductsByRestaurant(restaurantId, input);
    }
    try {
      let query = this.client
        .from('products')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('is_available', true);
      if (input.cursor) {
        const cursor = decodeCursor(input.cursor);
        const safeCursorVal = typeof cursor.value === 'string'
          ? `"${cursor.value.replace(/"/g, '')}"`
          : cursor.value;
        query = query.or(`created_at.gt.${safeCursorVal},and(created_at.eq.${safeCursorVal},id.gt.${cursor.id})`);
      }
      const { data, error } = await query
        .order('created_at', { ascending: true })
        .order('id', { ascending: true })
        .limit(input.limit + 1);
      if (error) throw error;
      if (!data || data.length === 0) return this.fallback.listProductsByRestaurant(restaurantId, input);
      const hasMore = data.length > input.limit;
      const rows = hasMore ? data.slice(0, input.limit) : data;
      const last = rows.at(-1);
      return {
        items: rows.map(mapProduct),
        nextCursor: hasMore && last ? encodeCursor({ value: last.created_at, id: last.id }) : null,
      };
    } catch {
      return this.fallback.listProductsByRestaurant(restaurantId, input);
    }
  }

  async listRestaurantMenu(restaurantId: string): Promise<readonly ProductMenuItem[]> {
    if (this.isDemoMode()) {
      return this.fallback.listRestaurantMenu(restaurantId);
    }
    try {
      const { data, error } = await this.client
        .from('products')
        .select('*,product_variants(id,name,price_adjustment_irr),product_addons(id,name,price_irr)')
        .eq('restaurant_id', restaurantId)
        .eq('is_available', true)
        .order('created_at', { ascending: true });
      if (error) throw error;
      if (!data || data.length === 0) return this.fallback.listRestaurantMenu(restaurantId);
      return data.map(mapProductMenuItem);
    } catch {
      return this.fallback.listRestaurantMenu(restaurantId);
    }
  }
}

