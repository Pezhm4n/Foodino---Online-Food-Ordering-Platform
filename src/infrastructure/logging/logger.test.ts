import { describe, expect, it } from 'vitest';
import { redactSensitiveData } from './logger';

describe('structured logger sensitive data redaction', () => {
  it('redacts sensitive fields recursively', () => {
    const input = {
      user: {
        id: 'user-123',
        password: 'PlainTextPassword123',
        phone: '09123456789',
      },
      token: 'jwt.token.here',
      secret: 'callback-secret',
      card: '6037991812345678',
      normalField: 'hello world',
      count: 5,
    };

    const redacted = redactSensitiveData(input) as Record<string, unknown>;
    expect(redacted.normalField).toBe('hello world');
    expect(redacted.count).toBe(5);
    expect(redacted.token).toBe('[REDACTED]');
    expect(redacted.secret).toBe('[REDACTED]');
    expect(redacted.card).toBe('[REDACTED]');

    const userObj = redacted.user as Record<string, unknown>;
    expect(userObj.id).toBe('user-123');
    expect(userObj.password).toBe('[REDACTED]');
    expect(userObj.phone).toBe('[REDACTED]');
  });
});
