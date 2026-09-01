'use client';

import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { addCartSelection, assertCartQuantity, type CartSelection } from '@/domain/cart/cart';
import { localCartSchema } from '@/lib/validation/cart';

export interface CartItem extends CartSelection {
  id: string;
  name: string;
  price: number;
  image?: string;
  restaurantName?: string;
}

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName?: string;
}

interface CartContextType {
  state: CartState;
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, quantity: number) => void;
  clearCart: () => void;
  calculateSubtotal: () => number;
  calculateTotal: (deliveryFee?: number) => number;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  getTotalItems: () => number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_ITEM'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: CartState };

const initialState: CartState = { items: [], restaurantId: null };
const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const domainCart = addCartSelection(
        { restaurantId: state.restaurantId, items: state.items },
        action.payload,
      );
      return {
        restaurantId: domainCart.restaurantId,
        restaurantName: state.restaurantName ?? action.payload.restaurantName,
        items: domainCart.items.map((selection) => {
          const presentation = state.items.find((item) =>
            item.productId === selection.productId
            && item.variantId === selection.variantId
            && item.addonIds.join(',') === selection.addonIds.join(',')) ?? action.payload;
          return { ...presentation, ...selection };
        }),
      };
    }
    case 'REMOVE_ITEM': {
      const items = state.items.filter((item) => item.id !== action.payload.id);
      return items.length === 0 ? initialState : { ...state, items };
    }
    case 'UPDATE_ITEM': {
      assertCartQuantity(action.payload.quantity);
      return {
        ...state,
        items: state.items.map((item) => item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item),
      };
    }
    case 'CLEAR_CART': return initialState;
    case 'SET_CART': return action.payload;
    default: return state;
  }
}

function persistedCart(state: CartState) {
  return {
    version: 1 as const,
    restaurantId: state.restaurantId,
    items: state.items.map(({ restaurantId, productId, variantId, addonIds, quantity }) => ({
      restaurantId,
      productId,
      ...(variantId ? { variantId } : {}),
      addonIds,
      quantity,
    })),
  };
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (!savedCart) return;
    try {
      const parsed = localCartSchema.parse(JSON.parse(savedCart));
      dispatch({
        type: 'SET_CART',
        payload: {
          restaurantId: parsed.restaurantId,
          items: parsed.items.map((item) => ({
            ...item,
            id: [item.productId, item.variantId ?? '', item.addonIds.join(',')].join(':'),
            name: 'محصول سبد خرید',
            price: 0,
          })),
        },
      });
    } catch {
      localStorage.removeItem('cart');
    }
  }, []);

  useEffect(() => {
    if (state.items.length === 0) localStorage.removeItem('cart');
    else localStorage.setItem('cart', JSON.stringify(persistedCart(state)));
  }, [state]);

  const removeItem = (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  const updateItem = (id: string, quantity: number) =>
    dispatch({ type: 'UPDATE_ITEM', payload: { id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const calculateSubtotal = () => state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider value={{
      state,
      cartItems: state.items,
      addItem: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
      removeItem,
      updateItem,
      clearCart,
      calculateSubtotal,
      calculateTotal: (deliveryFee = 0) => calculateSubtotal() + deliveryFee,
      increaseQuantity: (id) => {
        const item = state.items.find((candidate) => candidate.id === id);
        if (item) updateItem(id, item.quantity + 1);
      },
      decreaseQuantity: (id) => {
        const item = state.items.find((candidate) => candidate.id === id);
        if (!item) return;
        if (item.quantity === 1) removeItem(id);
        else updateItem(id, item.quantity - 1);
      },
      getTotalItems: () => state.items.reduce((total, item) => total + item.quantity, 0),
    }}>
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider.');
  return context;
}
