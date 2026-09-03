import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { irrToToman, money } from '@/domain/money/money';

export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get('ids');
  if (!idsParam) {
    return NextResponse.json({ items: [] });
  }

  const ids = idsParam.split(',').map((id) => id.trim()).filter(Boolean);
  if (ids.length === 0) {
    return NextResponse.json({ items: [] });
  }

  const client = await createSupabaseServerClient();
  const { data, error } = await client
    .from('products')
    .select('id, name, price_irr, image_path')
    .in('id', ids.slice(0, 50));

  if (error || !data) {
    return NextResponse.json({ items: [] });
  }

  const items = data.map((p) => ({
    productId: p.id,
    name: p.name,
    priceToman: irrToToman(money(p.price_irr)),
    image: p.image_path ?? undefined,
  }));

  return NextResponse.json({ items });
}
