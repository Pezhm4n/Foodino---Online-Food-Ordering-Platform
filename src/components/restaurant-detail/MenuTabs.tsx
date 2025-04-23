"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FoodCard from './FoodCard';
import CartSection from './CartSection';
import { useCart } from '@/contexts/CartContext';
import { CartItem } from '@/types/models';
import toast from 'react-hot-toast';

const TabsContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  display: flex;
  gap: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    flex-direction: column;
  }
`;

const MenuContainer = styled.div`
  flex: 1;
`;

const TabButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.neutral[100]};
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    gap: 0.5rem;
  }
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-weight: ${props => props.$active ? props.theme.typography.fontWeights.semibold : props.theme.typography.fontWeights.normal};
  color: ${props => props.$active ? props.theme.colors.primary[500] : props.theme.colors.neutral[700]};
  border-bottom: 2px solid ${props => props.$active ? props.theme.colors.primary[500] : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    color: ${props => props.theme.colors.primary[500]};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 0.75rem 1rem;
  }
`;

const CategoryTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.secondary[500]};
  margin-bottom: 1rem;
  margin-top: 2rem;
  
  &:first-of-type {
    margin-top: 0;
  }
`;

const FoodList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const CartContainer = styled.div`
  width: 350px;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    width: 100%;
  }
`;

// اطلاعات نمونه برای غذاها
const menuData = {
  'main': [
    {
      category: 'پیتزا',
      items: [
        {
          id: 'pizza1',
          name: 'پیتزا مخصوص',
          description: 'پیتزا با خمیر دست‌ساز، سس مخصوص، پنیر موزارلا، ژامبون، قارچ، فلفل دلمه‌ای و زیتون',
          price: 145000,
          image: '🍕',
          popular: true,
          spicy: false,
          vegetarian: false,
        },
        {
          id: 'pizza2',
          name: 'پیتزا پپرونی',
          description: 'پیتزا با خمیر دست‌ساز، سس مخصوص، پنیر موزارلا و پپرونی',
          price: 135000,
          image: '🍕',
          popular: true,
          spicy: true,
          vegetarian: false,
        },
        {
          id: 'pizza3',
          name: 'پیتزا سبزیجات',
          description: 'پیتزا با خمیر دست‌ساز، سس مخصوص، پنیر موزارلا، قارچ، فلفل دلمه‌ای، گوجه و ذرت',
          price: 125000,
          image: '🍕',
          popular: false,
          spicy: false,
          vegetarian: true,
        },
      ]
    },
    {
      category: 'برگر',
      items: [
        {
          id: 'burger1',
          name: 'برگر کلاسیک',
          description: 'برگر دست‌ساز 150 گرمی، پنیر چدار، کاهو، گوجه، خیارشور و سس مخصوص',
          price: 110000,
          image: '🍔',
          popular: true,
          spicy: false,
          vegetarian: false,
        },
        {
          id: 'burger2',
          name: 'چیز برگر',
          description: 'برگر دست‌ساز 150 گرمی، دو لایه پنیر چدار، کاهو، گوجه، خیارشور و سس مخصوص',
          price: 125000,
          image: '🍔',
          popular: true,
          spicy: false,
          vegetarian: false,
        },
      ]
    }
  ],
  'appetizers': [
    {
      category: 'پیش غذا',
      items: [
        {
          id: 'app1',
          name: 'سیب زمینی سرخ کرده',
          description: 'سیب زمینی سرخ شده تازه با سس کچاپ و مایونز',
          price: 45000,
          image: '🍟',
          popular: true,
          spicy: false,
          vegetarian: true,
        },
        {
          id: 'app2',
          name: 'نان سیر',
          description: 'نان تازه با کره سیر و پنیر موزارلا',
          price: 55000,
          image: '🍞',
          popular: false,
          spicy: false,
          vegetarian: true,
        },
      ]
    }
  ],
  'drinks': [
    {
      category: 'نوشیدنی‌ها',
      items: [
        {
          id: 'drink1',
          name: 'نوشابه',
          description: 'کوکاکولا، فانتا، اسپرایت (330 میلی‌لیتر)',
          price: 15000,
          image: '🥤',
          popular: false,
          spicy: false,
          vegetarian: true,
        },
        {
          id: 'drink2',
          name: 'آب معدنی',
          description: 'آب معدنی (500 میلی‌لیتر)',
          price: 10000,
          image: '💧',
          popular: false,
          spicy: false,
          vegetarian: true,
        },
      ]
    }
  ],
  'desserts': [
    {
      category: 'دسرها',
      items: [
        {
          id: 'dessert1',
          name: 'کیک شکلاتی',
          description: 'کیک شکلاتی خانگی با سس شکلات',
          price: 35000,
          image: '🍰',
          popular: true,
          spicy: false,
          vegetarian: true,
        },
        {
          id: 'dessert2',
          name: 'تیرامیسو',
          description: 'دسر ایتالیایی با بیسکویت، پنیر ماسکارپونه و قهوه',
          price: 45000,
          image: '🍮',
          popular: true,
          spicy: false,
          vegetarian: true,
        },
      ]
    }
  ]
};

// Define a food menu item interface
interface FoodMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  popular: boolean;
  spicy: boolean;
  vegetarian: boolean;
}

// Keep the interfaces as they were
interface Restaurant {
  id: number | string;
  name: string;
  type: string;
  icon: string;
  rating: number;
  tags: string[];
  description: string;
  deliveryTime: string;
  minOrder: string | number;
  slug: string;
  address: string;
  workingHours: string;
  contactNumber: string;
}

// Fix CartSection props to match our local state
interface RestaurantForCart {
  id: number;
  name: string;
  deliveryTime: string;
  minOrder: string;
  discount?: number;
}

interface MenuTabsProps {
  restaurant: Restaurant;
}

const MenuTabs = ({ restaurant }: MenuTabsProps) => {
  const [activeTab, setActiveTab] = useState('main');
  const { state, addItem, removeItem, clearCart } = useCart();
  // استفاده مستقیم از کانتکست سبد خرید به جای وضعیت محلی
  const [cartItems, setCartItems] = useState<CartItem[]>(state.items);
  
  // به‌روزرسانی cartItems هر زمان که state.items تغییر می‌کند
  useEffect(() => {
    setCartItems(state.items);
  }, [state.items]);
  
  // Convert our restaurant to the format CartSection expects
  const restaurantForCart: RestaurantForCart = {
    id: typeof restaurant.id === 'string' ? parseInt(restaurant.id) || 0 : restaurant.id,
    name: restaurant.name,
    deliveryTime: restaurant.deliveryTime,
    minOrder: typeof restaurant.minOrder === 'number' ? restaurant.minOrder.toString() : restaurant.minOrder || '0',
    discount: 0
  };
  
  const handleAddToCart = (item: FoodMenuItem) => {
    try {
      const cartItem: CartItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        restaurantId: restaurant.id?.toString(),
        restaurantName: restaurant.name
      };
      
      addItem(cartItem);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('خطایی در افزودن محصول به سبد خرید رخ داد. لطفاً دوباره تلاش کنید.');
    }
  };
  
  const handleRemoveFromCart = (itemId: string) => {
    try {
      removeItem(itemId);
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error('خطایی در حذف محصول از سبد خرید رخ داد. لطفاً دوباره تلاش کنید.');
    }
  };
  
  const handleClearCart = () => {
    try {
      clearCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('خطایی در پاک کردن سبد خرید رخ داد. لطفاً دوباره تلاش کنید.');
    }
  };
  
  const tabs = [
    { id: 'main', label: 'غذای اصلی' },
    { id: 'appetizers', label: 'پیش غذا' },
    { id: 'drinks', label: 'نوشیدنی‌ها' },
    { id: 'desserts', label: 'دسرها' }
  ];
  
  return (
    <TabsContainer>
      <MenuContainer>
        <TabButtons>
          {tabs.map(tab => (
            <TabButton 
              key={tab.id} 
              $active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabButtons>
        
        {menuData[activeTab as keyof typeof menuData].map((category, index) => (
          <div key={index}>
            <CategoryTitle>{category.category}</CategoryTitle>
            <FoodList>
              {category.items.map(item => (
                <FoodCard 
                  key={item.id} 
                  food={item} 
                  onAddToCart={() => handleAddToCart(item as FoodMenuItem)}
                />
              ))}
            </FoodList>
          </div>
        ))}
      </MenuContainer>
      
      <CartContainer>
        <CartSection 
          cartItems={cartItems} 
          onRemoveItem={handleRemoveFromCart}
          onAddItem={(item: CartItem) => handleAddToCart(item as unknown as FoodMenuItem)}
          onClearCart={handleClearCart}
          restaurant={restaurantForCart}
        />
      </CartContainer>
    </TabsContainer>
  );
};

export default MenuTabs; 