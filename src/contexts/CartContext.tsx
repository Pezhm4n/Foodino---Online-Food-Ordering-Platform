"use client";

import React, { createContext, useContext, useEffect, useReducer } from 'react';

// تعریف انواع داده‌ها
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  restaurantId?: string;
  restaurantName?: string;
}

interface CartState {
  items: CartItem[];
  restaurantId?: string;
  restaurantName?: string;
}

interface CartContextType {
  state: CartState;
  cartItems: CartItem[]; // ایجاد رفرنس آسان به آیتم‌های سبد خرید
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

// مقدار اولیه
const initialState: CartState = {
  items: [],
  restaurantId: undefined,
  restaurantName: undefined
};

// کانتکست سبد خرید
const CartContext = createContext<CartContextType | undefined>(undefined);

// ریدیوسر سبد خرید
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (existingItemIndex !== -1) {
        // اگر آیتم قبلاً در سبد خرید بوده، افزایش تعداد
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        
        return {
          ...state,
          items: updatedItems
        };
      } else {
        // اضافه کردن آیتم جدید به سبد خرید
        const newItem = { ...action.payload, quantity: 1 };
        return {
          ...state,
          items: [...state.items, newItem],
          restaurantId: state.restaurantId || action.payload.restaurantId,
          restaurantName: state.restaurantName || action.payload.restaurantName
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (existingItemIndex !== -1) {
        const item = state.items[existingItemIndex];
        
        if (item.quantity > 1) {
          // کاهش تعداد اگر بیشتر از یک است
          const updatedItems = [...state.items];
          updatedItems[existingItemIndex] = {
            ...item,
            quantity: item.quantity - 1
          };
          
          return {
            ...state,
            items: updatedItems
          };
        } else {
          // حذف آیتم اگر فقط یک عدد است
          const updatedItems = state.items.filter(item => item.id !== action.payload.id);
          
          // اگر سبد خرید خالی شد، رستوران را هم ریست کنیم
          if (updatedItems.length === 0) {
            return {
              items: [],
              restaurantId: undefined,
              restaurantName: undefined
            };
          }
          
          return {
            ...state,
            items: updatedItems
          };
        }
      }
      
      return state;
    }
    
    case 'UPDATE_ITEM': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        // حذف آیتم اگر تعداد صفر یا کمتر است
        const updatedItems = state.items.filter(item => item.id !== id);
        
        // اگر سبد خرید خالی شد، رستوران را هم ریست کنیم
        if (updatedItems.length === 0) {
          return {
            items: [],
            restaurantId: undefined,
            restaurantName: undefined
          };
        }
        
        return {
          ...state,
          items: updatedItems
        };
      } else {
        // به‌روزرسانی تعداد
        const updatedItems = state.items.map(item => 
          item.id === id ? { ...item, quantity } : item
        );
        
        return {
          ...state,
          items: updatedItems
        };
      }
    }
    
    case 'CLEAR_CART':
      return {
        items: [],
        restaurantId: undefined,
        restaurantName: undefined
      };
    
    case 'SET_CART':
      return action.payload;
    
    default:
      return state;
  }
};

// پراوایدر کانتکست سبد خرید
export const CartProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  // بارگذاری سبد خرید از localStorage در هنگام لود صفحه
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'SET_CART', payload: parsedCart });
      } catch (error) {
        console.error('خطا در خواندن سبد خرید از localStorage:', error);
      }
    }
  }, []);
  
  // ذخیره سبد خرید در localStorage با هر تغییر
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);
  
  // افزودن آیتم به سبد خرید
  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };
  
  // حذف آیتم از سبد خرید
  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };
  
  // به‌روزرسانی تعداد آیتم
  const updateItem = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_ITEM', payload: { id, quantity } });
  };
  
  // پاک کردن کامل سبد خرید
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    // اطمینان از پاک شدن در localStorage
    localStorage.removeItem('cart');
  };
  
  // افزایش تعداد آیتم
  const increaseQuantity = (id: string) => {
    const item = state.items.find(item => item.id === id);
    if (item) {
      updateItem(id, item.quantity + 1);
    }
  };
  
  // کاهش تعداد آیتم
  const decreaseQuantity = (id: string) => {
    const item = state.items.find(item => item.id === id);
    if (item && item.quantity > 1) {
      updateItem(id, item.quantity - 1);
    } else if (item) {
      removeItem(id);
    }
  };
  
  // محاسبه جمع قیمت محصولات
  const calculateSubtotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  // محاسبه قیمت نهایی با احتساب هزینه ارسال
  const calculateTotal = (deliveryFee: number = 0) => {
    return calculateSubtotal() + deliveryFee;
  };

  // محاسبه تعداد کل آیتم‌ها
  const getTotalItems = () => {
    return state.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  return (
    <CartContext.Provider value={{
      state,
      cartItems: state.items,
      addItem,
      removeItem,
      updateItem,
      clearCart,
      calculateSubtotal,
      calculateTotal,
      increaseQuantity,
      decreaseQuantity,
      getTotalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

// هوک برای استفاده آسان از کانتکست
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart باید درون CartProvider استفاده شود');
  }
  return context;
}; 