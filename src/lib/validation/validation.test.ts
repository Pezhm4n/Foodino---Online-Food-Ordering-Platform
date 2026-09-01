import { describe, expect, it } from 'vitest';
import { checkoutSchema } from './checkout';
import { localCartSchema } from './cart';
import { searchSchema } from './search';
import { serverEnvSchema } from './env';

const uuidA = '8b0be7d5-7277-45a4-a957-3ae16c3075f4';
const uuidB = '4bdcbcb6-3c5b-48b5-82c1-a340b9355bba';

describe('boundary validation', () => {
  it('accepts checkout identifiers and rejects client supplied prices', () => {
    const valid = {
      idempotencyKey: uuidA,
      addressId: uuidB,
      restaurantId: uuidA,
      items: [{ productId: uuidB, addonIds: [], quantity: 1 }],
    };

    expect(checkoutSchema.safeParse(valid).success).toBe(true);
    expect(checkoutSchema.safeParse({ ...valid, total: 1 }).success).toBe(false);
    expect(checkoutSchema.safeParse({ ...valid, items: [{ ...valid.items[0], quantity: 100 }] }).success).toBe(false);
  });

  it('rejects a mixed-restaurant local cart', () => {
    const result = localCartSchema.safeParse({
      version: 1,
      restaurantId: uuidA,
      items: [{ restaurantId: uuidB, productId: uuidA, addonIds: [], quantity: 1 }],
    });
    expect(result.success).toBe(false);
  });

  it('allowlists search sorting', () => {
    expect(searchSchema.parse({ sort: 'rating_desc' }).sort).toBe('rating_desc');
    expect(searchSchema.safeParse({ sort: 'DROP TABLE restaurants' }).success).toBe(false);
  });

  it('fails closed for development payments in production', () => {
    const result = serverEnvSchema.safeParse({
      NODE_ENV: 'production',
      APP_URL: 'https://foodino.example',
      SUPABASE_URL: 'https://project.supabase.co',
      SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_abcdefghijklmnopqrstuvwxyz',
      SUPABASE_SECRET_KEY: 'sb_secret_abcdefghijklmnopqrstuvwxyz',
      PAYMENT_PROVIDER: 'development',
      PAYMENT_CALLBACK_SECRET: 'x'.repeat(32),
      SMTP_CONFIGURED: 'false',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path[0])).toEqual(
        expect.arrayContaining(['PAYMENT_PROVIDER', 'RATE_LIMIT_ADAPTER', 'SMTP_CONFIGURED']),
      );
    }
  });
});
