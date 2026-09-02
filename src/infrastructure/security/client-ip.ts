import crypto from 'node:crypto';
import type { ServerEnv } from '@/lib/validation/env';

export function getClientIp(headers: Headers, env: ServerEnv): string {
  if (env.NODE_ENV !== 'production') {
    return '127.0.0.1';
  }

  if (env.RATE_LIMIT_ADAPTER === 'vercel') {
    const vercelIp = headers.get('x-vercel-forwarded-for')?.trim();
    if (vercelIp) return vercelIp.split(',')[0].trim();
    const realIp = headers.get('x-real-ip')?.trim();
    if (realIp) return realIp;
  }

  if (env.RATE_LIMIT_ADAPTER === 'trusted-reverse-proxy') {
    const forwardedFor = headers.get('x-forwarded-for');
    if (forwardedFor) {
      const hops = env.TRUSTED_PROXY_HOPS || 1;
      const ips = forwardedFor.split(',').map((ip) => ip.trim());
      const targetIndex = ips.length - hops;
      if (targetIndex >= 0 && ips[targetIndex]) {
        return ips[targetIndex].replace(/:d+$/, '');
      }
      return ips[0].replace(/:d+$/, '');
    }
  }

  return '127.0.0.1';
}

export function hashClientIp(ip: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(ip).digest('hex');
}
