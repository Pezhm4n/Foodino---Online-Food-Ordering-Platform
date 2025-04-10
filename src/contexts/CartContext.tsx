"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CartItem } from '@/types/models';

// تعریف تایپ اکشن‌های مختلف برای سبد خرید
type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'INCREASE_QUANTITY'; payload: { id: string } }
  | { type: 'DECREASE_QUANTITY'; payload: { id: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'INIT_CART'; payload: CartItem[] };

// تایپ استیت سبد خرید
interface CartState {
  items: CartItem[];
  restaurantId?: string;
  restaurantName?: string;
}

// تایپ کانتکست سبد خرید
interface CartContextType {
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  calculateSubtotal: () => number;
  calculateTotal: (deliveryFee: number) => number;
  getTotalItems: () => number;
}

// مقدار اولیه برای استیت سبد خرید
const initialState: CartState = {
  items: [],
  restaurantId: undefined,
  restaurantName: undefined,
};

// کاهنده (reducer) برای مدیریت تغییرات سبد خرید
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      // اگر رستوران سبد خرید تعیین نشده یا رستوران جدید با رستوران قبلی یکسان است
      const isFromSameRestaurant = !state.restaurantId || state.restaurantId === action.payload.restaurantId;

      // اگر رستوران متفاوت است، سبد را پاک کن و آیتم جدید را اضافه کن
      if (!isFromSameRestaurant && action.payload.restaurantId) {
        return {
          items: [action.payload],
          restaurantId: action.payload.restaurantId,
          restaurantName: action.payload.restaurantName,
        };
      }

      if (existingItemIndex > -1) {
        // اگر آیتم قبلاً در سبد وجود دارد، تعداد آن را افزایش بده
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity,
        };
        return {
          ...state,
          items: updatedItems,
        };
      } else {
        // اگر آیتم جدید است، آن را به سبد اضافه کن
        return {
          ...state,
          items: [...state.items, action.payload],
          restaurantId: state.restaurantId || action.payload.restaurantId,
          restaurantName: state.restaurantName || action.payload.restaurantName,
        };
      }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
        // اگر همه آیتم‌ها حذف شدند، اطلاعات رستوران را پاک کن
        restaurantId: state.items.length === 1 ? undefined : state.restaurantId,
        restaurantName: state.items.length === 1 ? undefined : state.restaurantName,
      };

    case 'INCREASE_QUANTITY': {
      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      return {
        ...state,
        items: updatedItems,
      };
    }

    case 'DECREASE_QUANTITY': {
      const updatedItems = state.items
        .map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);

      return {
        ...state,
        items: updatedItems,
        // اگر همه آیتم‌ها حذف شدند، اطلاعات رستوران را پاک کن
        restaurantId: updatedItems.length === 0 ? undefined : state.restaurantId,
        restaurantName: updatedItems.length === 0 ? undefined : state.restaurantName,
      };
    }

    case 'CLEAR_CART':
      return initialState;

    case 'INIT_CART':
      // برای بازیابی سبد خرید از حافظه محلی
      if (action.payload.length === 0) {
        return initialState;
      }
      
      const firstItem = action.payload[0];
      return {
        items: action.payload,
        restaurantId: firstItem.restaurantId,
        restaurantName: firstItem.restaurantName,
      };

    default:
      return state;
  }
};

// ایجاد کانتکست
const CartContext = createContext<CartContextType | undefined>(undefined);

// کامپوننت ارائه‌دهنده کانتکست
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // بازیابی سبد خرید از localStorage هنگام لود صفحه
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        dispatch({ type: 'INIT_CART', payload: parsedCart });
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }
  }, []);

  // ذخیره سبد خرید در localStorage هنگام تغییر
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  // توابع مدیریت سبد خرید
  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const increaseQuantity = (id: string) => {
    dispatch({ type: 'INCREASE_QUANTITY', payload: { id } });
  };

  const decreaseQuantity = (id: string) => {
    dispatch({ type: 'DECREASE_QUANTITY', payload: { id } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // محاسبه مجموع قیمت آیتم‌ها
  const calculateSubtotal = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // محاسبه قیمت کل با احتساب هزینه ارسال
  const calculateTotal = (deliveryFee: number) => {
    return calculateSubtotal() + deliveryFee;
  };

  // محاسبه تعداد کل آیتم‌ها
  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        calculateSubtotal,
        calculateTotal,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// هوک برای استفاده از کانتکست
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 