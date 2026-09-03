import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { irrToToman, money } from '@/domain/money/money';
import { MOCK_PRODUCTS } from '@/infrastructure/mock/mock-catalog-data';

export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get('ids');
  if (!idsParam) {
    return NextResponse.json({ items: [] });
  }

  const ids = idsParam.split(',').map((id) => id.trim()).filter(Boolean);
  if (ids.length === 0) {
    return NextResponse.json({ items: [] });
  }

  try {
    const client = await createSupabaseServerClient();
    const { data, error } = await client
      .from('products')
      .select('id, name, price_irr, image_path')
      .in('id', ids.slice(0, 50));

    if (!error && data && data.length > 0) {
      const items = data.map((p) => ({
        productId: p.id,
        name: p.name,
        priceToman: irrToToman(money(p.price_irr)),
        image: p.image_path ?? undefined,
      }));
      return NextResponse.json({ items });
    }
  } catch {
    // Fall back to mock products below
  }

  const mockMatches = MOCK_PRODUCTS.filter((p) => ids.includes(p.id));
  const items = mockMatches.map((p) => ({
    productId: p.id,
    name: p.name,
    priceToman: irrToToman(p.price),
    image: p.imagePath ?? undefined,
  }));

  return NextResponse.json({ items });
}
