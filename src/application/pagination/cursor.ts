import { z } from 'zod';

const cursorPayloadSchema = z.object({
  value: z.union([z.string(), z.number()]),
  id: z.uuid(),
}).strict();

export type CursorPayload = z.infer<typeof cursorPayloadSchema>;

export function encodeCursor(payload: CursorPayload): string {
  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
}

export function decodeCursor(cursor: string): CursorPayload {
  const decoded = Buffer.from(cursor, 'base64url').toString('utf8');
  return cursorPayloadSchema.parse(JSON.parse(decoded) as unknown);
}
