import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { errorResponse } from '@/infrastructure/http/api-response';
import { createSupabaseServerClient, requireClaims } from '@/infrastructure/supabase/server';

export async function GET() {
  const requestId = randomUUID();
  const claims = await requireClaims();
  if (!claims?.sub) return errorResponse('AUTHENTICATION_REQUIRED', 401, requestId);
  try {
    const client = await createSupabaseServerClient();
    const { data, error } = await client
      .from('addresses')
      .select('id,title,city,address_line')
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: true });
    if (error) throw error;
    return NextResponse.json({
      items: data.map((address) => ({
        id: address.id,
        title: address.title,
        city: address.city,
        addressLine: address.address_line,
      })),
    }, {
      headers: { 'Cache-Control': 'private, no-store', 'X-Request-Id': requestId },
    });
  } catch {
    return errorResponse('ADDRESS_LOAD_FAILED', 503, requestId);
  }
}
