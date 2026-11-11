import { NextResponse } from 'next/server';
import { searchSchema } from '@/lib/validation/search';
import { MOCK_PRODUCTS, MOCK_RESTAURANTS } from '@/infrastructure/mock/mock-catalog-data';
import { createSupabasePublicClient } from '@/infrastructure/supabase/public';
import { catalogSearchPattern } from '@/infrastructure/supabase/repositories/supabase-catalog-repository';

const limit = 3;

export async function GET(request: Request) {
  const parsed = searchSchema.safeParse({ q: new URL(request.url).searchParams.get('q') ?? undefined });
  if (!parsed.success) return NextResponse.json({ error: 'INVALID_QUERY' }, { status: 400 });
  const term = parsed.data.q?.replaceAll('*', ' ').trim().toLowerCase();
  if (!term || term.length < 2) return NextResponse.json({ restaurants: [], products: [] });

  if (process.env.DEMO_MODE === 'true') {
    const matches = (name: string, description: string) =>
      name.toLowerCase().includes(term) || description.toLowerCase().includes(term);
    return NextResponse.json({
      restaurants: MOCK_RESTAURANTS.filter((r) => matches(r.name, r.description)).slice(0, limit)
        .map(({ id, slug, name, description, rating }) => ({ id, slug, name, description, rating })),
      products: MOCK_PRODUCTS.filter((p) => matches(p.name, p.description)).slice(0, limit).map((p) => ({
        id: p.id, slug: p.slug, name: p.name, description: p.description, priceIrr: p.price.amountIrr,
        restaurantName: MOCK_RESTAURANTS.find((r) => r.id === p.restaurantId)?.name ?? '',
      })),
    });
  }

  const client = createSupabasePublicClient();
  const pattern = catalogSearchPattern(term);
  const filter = 'normalized_name.ilike.' + pattern + ',description.ilike.' + pattern;
  const [restaurants, products] = await Promise.all([
    client.from('restaurants').select('id,slug,name,description,rating')
      .eq('is_active', true).or(filter).order('rating', { ascending: false }).order('id').limit(limit),
    client.from('products').select('id,slug,name,description,price_irr,restaurants!inner(name,is_active)')
      .eq('is_available', true).eq('restaurants.is_active', true).or(filter).order('id').limit(limit),
  ]);
  if (restaurants.error || products.error) {
    return NextResponse.json({ error: 'SUGGESTIONS_UNAVAILABLE' }, { status: 503 });
  }
  return NextResponse.json({
    restaurants: restaurants.data,
    products: products.data.map((p) => ({
      id: p.id, slug: p.slug, name: p.name, description: p.description, priceIrr: p.price_irr,
      restaurantName: p.restaurants.name,
    })),
  }, { headers: { 'Cache-Control': 'public, max-age=15, s-maxage=30' } });
}
