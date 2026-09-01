import { headers } from 'next/headers';

export class InvalidOriginError extends Error {
  constructor() {
    super('Invalid request origin.');
    this.name = 'InvalidOriginError';
  }
}

export async function assertSameOrigin(): Promise<void> {
  const requestHeaders = await headers();
  const origin = requestHeaders.get('origin');
  const host = requestHeaders.get('host');
  if (!origin || !host) throw new InvalidOriginError();

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    throw new InvalidOriginError();
  }

  if (originHost !== host) throw new InvalidOriginError();
}

export function assertRequestSameOrigin(request: Request): void {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (!origin || !host) throw new InvalidOriginError();
  try {
    if (new URL(origin).host !== host) throw new InvalidOriginError();
  } catch (error) {
    if (error instanceof InvalidOriginError) throw error;
    throw new InvalidOriginError();
  }
}
