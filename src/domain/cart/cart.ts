import { DomainError } from '@/domain/shared/domain-error';

export const MIN_CART_QUANTITY = 1;
export const MAX_CART_QUANTITY = 99;

export type CartSelection = Readonly<{
  restaurantId: string;
  productId: string;
  variantId?: string;
  addonIds: readonly string[];
  quantity: number;
}>;

export type Cart = Readonly<{
  restaurantId: string | null;
  items: readonly CartSelection[];
}>;

export const emptyCart = (): Cart => ({ restaurantId: null, items: [] });

export function assertCartQuantity(quantity: number): void {
  if (!Number.isInteger(quantity) || quantity < MIN_CART_QUANTITY || quantity > MAX_CART_QUANTITY) {
    throw new DomainError(
      'INVALID_QUANTITY',
      `Cart quantity must be between ${MIN_CART_QUANTITY} and ${MAX_CART_QUANTITY}.`,
    );
  }
}

function normalizeSelection(selection: CartSelection): CartSelection {
  assertCartQuantity(selection.quantity);
  return {
    ...selection,
    addonIds: [...new Set(selection.addonIds)].sort(),
  };
}

function selectionKey(selection: CartSelection): string {
  return [
    selection.productId,
    selection.variantId ?? '',
    [...selection.addonIds].sort().join(','),
  ].join(':');
}

export function addCartSelection(cart: Cart, input: CartSelection): Cart {
  const selection = normalizeSelection(input);

  if (cart.restaurantId !== null && cart.restaurantId !== selection.restaurantId) {
    throw new DomainError(
      'CART_RESTAURANT_CONFLICT',
      'A cart may contain products from only one restaurant.',
    );
  }

  const key = selectionKey(selection);
  const existingIndex = cart.items.findIndex((item) => selectionKey(item) === key);
  if (existingIndex === -1) {
    return {
      restaurantId: selection.restaurantId,
      items: [...cart.items, selection],
    };
  }

  const existing = cart.items[existingIndex];
  const quantity = existing.quantity + selection.quantity;
  assertCartQuantity(quantity);

  return {
    restaurantId: selection.restaurantId,
    items: cart.items.map((item, index) =>
      index === existingIndex ? { ...item, quantity } : item,
    ),
  };
}

export function replaceCartForRestaurant(selection: CartSelection): Cart {
  return addCartSelection(emptyCart(), selection);
}
