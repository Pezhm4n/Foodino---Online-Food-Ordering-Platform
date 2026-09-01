import { describe, expect, it } from 'vitest';
import { addCartSelection, emptyCart, replaceCartForRestaurant } from './cart';

const pizza = {
  restaurantId: 'restaurant-a',
  productId: 'pizza',
  addonIds: ['cheese'],
  quantity: 1,
} as const;

describe('cart invariant', () => {
  it('merges identical selections and normalizes add-ons', () => {
    const first = addCartSelection(emptyCart(), pizza);
    const second = addCartSelection(first, { ...pizza, addonIds: ['cheese', 'cheese'], quantity: 2 });

    expect(second.items).toEqual([{ ...pizza, addonIds: ['cheese'], quantity: 3 }]);
  });

  it('rejects products from a second restaurant', () => {
    const cart = addCartSelection(emptyCart(), pizza);
    expect(() => addCartSelection(cart, { ...pizza, restaurantId: 'restaurant-b' })).toThrowError(
      /only one restaurant/,
    );
  });

  it('requires explicit replacement for another restaurant', () => {
    expect(replaceCartForRestaurant({ ...pizza, restaurantId: 'restaurant-b' }).restaurantId).toBe(
      'restaurant-b',
    );
  });

  it.each([0, 100, 1.2])('rejects invalid quantity %s', (quantity) => {
    expect(() => addCartSelection(emptyCart(), { ...pizza, quantity })).toThrowError(/between 1 and 99/);
  });
});
