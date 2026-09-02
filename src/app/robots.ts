import type { MetadataRoute } from 'next';
import { getServerEnv } from '@/infrastructure/config/server-env';

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/checkout', '/profile', '/operator/', '/orders/', '/track/'] }], sitemap: new URL('/sitemap.xml', getServerEnv().APP_URL).toString() };
}
