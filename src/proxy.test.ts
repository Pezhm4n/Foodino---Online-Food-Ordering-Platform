import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

const mocks = vi.hoisted(() => ({ refresh: vi.fn(), log: vi.fn() }));
vi.mock('@/infrastructure/supabase/proxy', () => ({ refreshSupabaseSession: mocks.refresh }));
vi.mock('@/infrastructure/logging/logger', () => ({ logger: { error: mocks.log } }));
import { proxy } from './proxy';

beforeEach(() => vi.resetAllMocks());

describe('session proxy', () => {
  it('does not call the provider for anonymous requests', async () => {
    const response = await proxy(new NextRequest('https://foodino.example/'));
    expect(mocks.refresh).not.toHaveBeenCalled();
    expect(response.headers.get('x-request-id')).toBeTruthy();
    expect(response.headers.get('x-middleware-request-x-request-id')).toBe(response.headers.get('x-request-id'));
  });

  it.each(['sb-example-auth-token', 'sb-example-auth-token.0'])('refreshes %s and preserves refresh cookies and headers', async (name) => {
    mocks.refresh.mockImplementation(async (request: NextRequest) => {
      const response = NextResponse.next({ request });
      response.cookies.set(name, 'refreshed', { httpOnly: true, secure: true });
      response.headers.set('Cache-Control', 'private, no-store');
      return response;
    });
    const response = await proxy(new NextRequest('https://foodino.example/profile', {
      headers: { cookie: `${name}=expired`, 'x-request-id': 'request-123' },
    }));
    expect(mocks.refresh).toHaveBeenCalledOnce();
    expect(response.cookies.get(name)?.value).toBe('refreshed');
    expect(response.headers.get('Cache-Control')).toBe('private, no-store');
    expect(response.headers.get('x-request-id')).toBe('request-123');
  });

  it('keeps public pages available without caching a failed refresh', async () => {
    mocks.refresh.mockRejectedValue(new Error('network'));
    const response = await proxy(new NextRequest('https://foodino.example/', {
      headers: { cookie: 'sb-example-auth-token=expired' },
    }));
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('private, no-store');
    expect(mocks.log).toHaveBeenCalled();
  });
});
