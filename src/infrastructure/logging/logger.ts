type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'secret',
  'authorization',
  'cookie',
  'key',
  'national_id',
  'nationalcode',
  'cvv',
  'card',
  'recipient_phone',
  'phone',
  'address_line',
]);

export function redactSensitiveData(data: unknown): unknown {
  if (data === null || data === undefined) return data;
  if (typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    return data.map(redactSensitiveData);
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lowerKey)) {
      result[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      result[key] = redactSensitiveData(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

export interface StructuredLogPayload {
  level: LogLevel;
  message: string;
  requestId?: string;
  route?: string;
  latencyMs?: number;
  status?: number;
  errorCode?: string;
  context?: Record<string, unknown>;
}

export const logger = {
  log(payload: StructuredLogPayload) {
    const timestamp = new Date().toISOString();
    const entry = {
      timestamp,
      level: payload.level,
      message: payload.message,
      requestId: payload.requestId,
      route: payload.route,
      latencyMs: payload.latencyMs,
      status: payload.status,
      errorCode: payload.errorCode,
      context: payload.context ? redactSensitiveData(payload.context) : undefined,
    };

    const serialized = JSON.stringify(entry);
    if (payload.level === 'error') {
      console.error(serialized);
    } else if (payload.level === 'warn') {
      console.warn(serialized);
    } else {
      console.log(serialized);
    }
  },

  info(message: string, meta?: Omit<StructuredLogPayload, 'level' | 'message'>) {
    this.log({ level: 'info', message, ...meta });
  },

  warn(message: string, meta?: Omit<StructuredLogPayload, 'level' | 'message'>) {
    this.log({ level: 'warn', message, ...meta });
  },

  error(message: string, meta?: Omit<StructuredLogPayload, 'level' | 'message'>) {
    this.log({ level: 'error', message, ...meta });
  },
};
