import { NextResponse } from 'next/server';
import { getServerEnv } from '@/infrastructure/config/server-env';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';

export async function GET() {
  try {
    getServerEnv();
    const client = await createSupabaseServerClient();
    const { error } = await client.from('restaurants').select('id').limit(1);
    if (error) throw error;
    const { error: apiError } = await client.schema('api').rpc('get_public_tracking', {
      p_token: '0'.repeat(43),
    });
    if (apiError) throw apiError;
    return NextResponse.json({ status: 'ok' }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json({ status: 'unavailable' }, {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}
