import { describe, expect, it } from 'vitest';
import { safeInternalPath } from './internal-path';

describe('authentication return paths', () => {
  it.each([null, '', '//outside.example', '/\\outside.example', '/\t/outside.example', 'https://outside.example', 'javascript:alert(1)'])('rejects unsafe destination %j', (path) => {
    expect(safeInternalPath(path)).toBe('/');
  });

  it.each(['/profile', '/checkout?step=address', '/auth/reset-password', '/restaurants#menu'])('preserves internal destination %s', (path) => {
    expect(safeInternalPath(path)).toBe(path);
    expect(new URL(safeInternalPath(path), 'https://foodino.example').origin).toBe('https://foodino.example');
  });
});
