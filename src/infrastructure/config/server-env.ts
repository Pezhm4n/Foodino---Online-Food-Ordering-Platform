import 'server-only';
import { parseServerEnv, type ServerEnv } from '@/lib/validation/env';

let cachedEnv: ServerEnv | undefined;

export function getServerEnv(): ServerEnv {
  cachedEnv ??= parseServerEnv();
  return cachedEnv;
}
