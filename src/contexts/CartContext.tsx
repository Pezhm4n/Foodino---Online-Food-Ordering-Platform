'use client';

import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { addCartSelection, assertCartQuantity, type CartSelection } from '@/domain/cart/cart';
import { DomainError } from '@/domain/shared/domain-error';
import { localCartSchema } from '@/lib/validation/cart';
import { toast } from 'react-hot-toast';

import { validateAndApplyCoupon, type Coupon } from '@/domain/pricing/coupons';
import { money } from '@/domain/money/money';

export interface CartItem extends CartSelection {
  id: string;
  name: string;
  price: number;
  image?: string;
  restaurantName?: string;
  notes?: string;
}

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName?: string;
  appliedCoupon?: Coupon | null;
  discountToman: number;
  orderNote?: string;
}

interface CartContextType {
  state: CartState;
  cartItems: CartItem[];
  appliedCoupon: Coupon | null;
  discountToman: number;
  orderNote: string;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, quantity: number) => void;
  updateItemNotes: (id: string, notes: string) => void;
  setOrderNote: (note: string) => void;
  applyCouponCode: (code: string, deliveryFeeToman?: number) => { success: boolean; message: string };
  removeCoupon: () => void;
  clearCart: () => void;
  calculateSubtotal: () => number;
  calculateDiscount: () => number;
  calculateTotal: (deliveryFee?: number) => number;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  getTotalItems: () => number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_ITEM'; payload: { id: string; quantity: number } }
  | { type: 'UPDATE_ITEM_NOTES'; payload: { id: string; notes: string } }
  | { type: 'APPLY_COUPON'; payload: { coupon: Coupon; discountToman: number } }
  | { type: 'REMOVE_COUPON' }
  | { type: 'SET_ORDER_NOTE'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: CartState };

const initialState: CartState = {
  items: [],
  restaurantId: null,
  appliedCoupon: null,
  discountToman: 0,
  orderNote: '',
};
const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      try {
        const domainCart = addCartSelection(
          { restaurantId: state.restaurantId, items: state.items },
          action.payload,
        );
        return {
          ...state,
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
      } catch (err) {
        if (err instanceof DomainError && err.code === 'CART_RESTAURANT_CONFLICT') {
          toast.error('شما تنها می‌توانید از یک رستوران در هر لحظه سفارش دهید');
          return state;
        }
        throw err;
      }
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
    case 'UPDATE_ITEM_NOTES': {
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, notes: action.payload.notes } : item,
        ),
      };
    }
    case 'APPLY_COUPON': {
      return {
        ...state,
        appliedCoupon: action.payload.coupon,
        discountToman: action.payload.discountToman,
      };
    }
    case 'REMOVE_COUPON': {
      return {
        ...state,
        appliedCoupon: null,
        discountToman: 0,
      };
    }
    case 'SET_ORDER_NOTE': {
      return {
        ...state,
        orderNote: action.payload,
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
    items: state.items.map(({ restaurantId, productId, variantId, addonIds, quantity, notes }) => ({
      restaurantId,
      productId,
      ...(variantId ? { variantId } : {}),
      addonIds,
      quantity,
      ...(notes ? { notes } : {}),
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
          appliedCoupon: null,
          discountToman: 0,
          orderNote: '',
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
  const calculateDiscount = () => state.discountToman;
  const calculateTotal = (deliveryFee = 0) =>
    Math.max(0, calculateSubtotal() - state.discountToman + deliveryFee);

  const applyCouponCode = (code: string, deliveryFeeToman = 0) => {
    const subtotalToman = calculateSubtotal();
    const subtotalIrr = money(subtotalToman * 10);
    const deliveryFeeIrr = money(deliveryFeeToman * 10);

    const res = validateAndApplyCoupon(code, subtotalIrr, deliveryFeeIrr);
    if (!res.valid) {
      toast.error(res.message);
      return { success: false, message: res.message };
    }

    const discountToman = res.discount.amountIrr / 10;
    dispatch({
      type: 'APPLY_COUPON',
      payload: { coupon: res.coupon, discountToman },
    });
    toast.success(res.message);
    return { success: true, message: res.message };
  };

  const removeCoupon = () => {
    dispatch({ type: 'REMOVE_COUPON' });
    toast.success('کد تخفیف حذف شد');
  };

  const updateItemNotes = (id: string, notes: string) => {
    dispatch({ type: 'UPDATE_ITEM_NOTES', payload: { id, notes } });
  };

  const setOrderNote = (note: string) => {
    dispatch({ type: 'SET_ORDER_NOTE', payload: note });
  };

  return (
    <CartContext.Provider value={{
      state,
      cartItems: state.items,
      appliedCoupon: state.appliedCoupon ?? null,
      discountToman: state.discountToman,
      orderNote: state.orderNote ?? '',
      addItem: (item) => {
        if (state.restaurantId && state.restaurantId !== item.restaurantId) {
          toast.error(
            `سبد خرید شما شامل غذا از ${state.restaurantName || 'رستوران دیگری'} است. برای سفارش جدید، ابتدا سبد خرید را خالی کنید.`,
            { duration: 4500 }
          );
          return;
        }
        dispatch({ type: 'ADD_ITEM', payload: item });
        toast.success(`${item.name} به سبد خرید اضافه شد`);
      },
      removeItem,
      updateItem,
      updateItemNotes,
      setOrderNote,
      applyCouponCode,
      removeCoupon,
      clearCart,
      calculateSubtotal,
      calculateDiscount,
      calculateTotal,
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
