import { describe, expect, it } from 'vitest';
import { decodeCursor, encodeCursor, tryDecodeCursor } from './cursor';

describe('opaque cursor', () => {
  it('round-trips a validated keyset position', () => {
    const value = { value: '2026-09-01T12:00:00.000Z', id: '8b0be7d5-7277-45a4-a957-3ae16c3075f4' };
    expect(decodeCursor(encodeCursor(value))).toEqual(value);
  });

  it('rejects malformed or shape-changing cursor payloads', () => {
    const malformed = Buffer.from(JSON.stringify({ value: 1, id: 'not-a-uuid', admin: true })).toString('base64url');
    expect(() => decodeCursor(malformed)).toThrow();
    expect(tryDecodeCursor(malformed)).toBeNull();
    expect(() => decodeCursor('%%%')).toThrow();
    expect(tryDecodeCursor('%%%')).toBeNull();
  });
});
