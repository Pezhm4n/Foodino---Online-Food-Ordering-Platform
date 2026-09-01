import type { SupabaseClient } from '@supabase/supabase-js';
import { money } from '@/domain/money/money';
import type {
  CatalogRepository,
  CursorPage,
  ProductSummary,
  RestaurantSummary,
  RestaurantSort,
} from '@/application/ports/catalog-repository';
import { decodeCursor, encodeCursor } from '@/application/pagination/cursor';
import type { Database } from '@/infrastructure/supabase/database.types';

type RestaurantRow = Database['public']['Tables']['restaurants']['Row'];
type ProductRow = Database['public']['Tables']['products']['Row'];

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

function sortColumn(sort: RestaurantSort): 'rating' | 'delivery_fee_irr' | 'created_at' {
  if (sort === 'rating_desc') return 'rating';
  if (sort === 'delivery_fee_asc') return 'delivery_fee_irr';
  return 'created_at';
}

export class SupabaseCatalogRepository implements CatalogRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async findRestaurantBySlug(slug: string): Promise<RestaurantSummary | null> {
    const { data, error } = await this.client
      .from('restaurants')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();
    if (error) throw error;
    return data ? mapRestaurant(data) : null;
  }

  async listRestaurants(input: {
    query?: string;
    sort: RestaurantSort;
    cursor?: string;
    limit: number;
  }): Promise<CursorPage<RestaurantSummary>> {
    const column = sortColumn(input.sort);
    const ascending = input.sort !== 'rating_desc';
    let query = this.client.from('restaurants').select('*').eq('is_active', true);
    if (input.query) query = query.ilike('normalized_name', `%${input.query}%`);
    if (input.cursor) {
      const cursor = decodeCursor(input.cursor);
      query = ascending
        ? query.or(`${column}.gt.${cursor.value},and(${column}.eq.${cursor.value},id.gt.${cursor.id})`)
        : query.or(`${column}.lt.${cursor.value},and(${column}.eq.${cursor.value},id.gt.${cursor.id})`);
    }
    const { data, error } = await query
      .order(column, { ascending })
      .order('id', { ascending: true })
      .limit(input.limit + 1);
    if (error) throw error;

    const hasMore = data.length > input.limit;
    const rows = hasMore ? data.slice(0, input.limit) : data;
    const last = rows.at(-1);
    return {
      items: rows.map(mapRestaurant),
      nextCursor: hasMore && last
        ? encodeCursor({ value: last[column], id: last.id })
        : null,
    };
  }

  async listProductsByRestaurant(
    restaurantId: string,
    input: { cursor?: string; limit: number },
  ): Promise<CursorPage<ProductSummary>> {
    let query = this.client
      .from('products')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_available', true);
    if (input.cursor) {
      const cursor = decodeCursor(input.cursor);
      query = query.or(`created_at.gt.${cursor.value},and(created_at.eq.${cursor.value},id.gt.${cursor.id})`);
    }
    const { data, error } = await query
      .order('created_at', { ascending: true })
      .order('id', { ascending: true })
      .limit(input.limit + 1);
    if (error) throw error;
    const hasMore = data.length > input.limit;
    const rows = hasMore ? data.slice(0, input.limit) : data;
    const last = rows.at(-1);
    return {
      items: rows.map(mapProduct),
      nextCursor: hasMore && last ? encodeCursor({ value: last.created_at, id: last.id }) : null,
    };
  }
}
