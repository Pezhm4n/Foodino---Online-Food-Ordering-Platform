import { z } from 'zod';

const cursorPayloadSchema = z.object({
  value: z.union([z.string(), z.number()]),
  id: z.uuid(),
}).strict();

export type CursorPayload = z.infer<typeof cursorPayloadSchema>;

export function encodeCursor(payload: CursorPayload): string {
  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
}

export function tryDecodeCursor(cursor: string): CursorPayload | null {
  try {
    const decoded = Buffer.from(cursor, 'base64url').toString('utf8');
    const parsed = cursorPayloadSchema.safeParse(JSON.parse(decoded));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function decodeCursor(cursor: string): CursorPayload {
  const result = tryDecodeCursor(cursor);
  if (!result) {
    throw new Error('Invalid cursor payload');
  }
  return result;
}
