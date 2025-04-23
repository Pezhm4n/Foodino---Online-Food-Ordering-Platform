"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// تعریف انواع داده مورد نیاز
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface Restaurant {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  categories: string[];
  rating: number;
  deliveryTime: string;
  minOrder: number;
  deliveryFee: number;
  address: string;
}

// استایل‌های صفحه
const RestaurantContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const RestaurantHeader = styled.div`
  position: relative;
  height: 250px;
  border-radius: ${props => props.theme.borderRadius.xl};
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: ${props => props.theme.boxShadow.md};
`;

const CoverImage = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.colors.primary[100]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.typography.fontSizes['3xl']};
  color: ${props => props.theme.colors.primary[500]};
`;

const RestaurantInfoContainer = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  padding: 1.5rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const RestaurantInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const RestaurantName = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes['2xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  margin-bottom: 0.5rem;
`;

const RestaurantDetails = styled.div`
  display: flex;
  gap: 1rem;
  font-size: ${props => props.theme.typography.fontSizes.sm};
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const RestaurantActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 0.5rem 1rem;
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[600]};
  }
`;

const ContentSection = styled.div`
  display: flex;
  gap: 2rem;
  direction: rtl;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MenuSection = styled.div`
  flex: 2;
`;

const CartSection = styled.div`
  flex: 1;
  position: sticky;
  top: 2rem;
  height: fit-content;
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  box-shadow: ${props => props.theme.boxShadow.md};
`;

const CategoryNav = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.neutral[100]};
  
  &::-webkit-scrollbar {
    height: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.colors.neutral[300]};
    border-radius: 10px;
  }
`;

const CategoryButton = styled.button<{ active?: boolean }>`
  white-space: nowrap;
  padding: 0.5rem 1rem;
  background-color: ${props => props.active ? props.theme.colors.primary[100] : 'white'};
  color: ${props => props.active ? props.theme.colors.primary[500] : props.theme.colors.neutral[700]};
  border: 1px solid ${props => props.active ? props.theme.colors.primary[100] : props.theme.colors.neutral[200]};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primary[100] : props.theme.colors.neutral[50]};
  }
`;

const CategoryTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  color: ${props => props.theme.colors.secondary[500]};
  margin: 2rem 0 1rem;
`;

const MenuItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const MenuItemCard = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${props => props.theme.boxShadow.sm};
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.boxShadow.md};
  }
`;

const MenuItemImage = styled.div`
  height: 150px;
  background-color: ${props => props.theme.colors.neutral[100]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.typography.fontSizes.xl};
  color: ${props => props.theme.colors.neutral[400]};
`;

const MenuItemContent = styled.div`
  padding: 1rem;
`;

const MenuItemName = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.secondary[500]};
  margin-bottom: 0.5rem;
`;

const MenuItemDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[600]};
  margin-bottom: 1rem;
  min-height: 3rem;
`;

const MenuItemFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MenuItemPrice = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.secondary[500]};
`;

const AddToCartButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[600]};
  }
`;

const CartTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  color: ${props => props.theme.colors.secondary[500]};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CartEmptyMessage = styled.p`
  text-align: center;
  color: ${props => props.theme.colors.neutral[500]};
  margin: 2rem 0;
`;

const CartItemsList = styled.div`
  margin-bottom: 1.5rem;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.neutral[100]};
  
  &:last-of-type {
    border-bottom: none;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.secondary[500]};
  margin-bottom: 0.25rem;
`;

const ItemPrice = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[500]};
`;

const ItemControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ItemButton = styled.button`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: ${props => props.theme.colors.primary[100]};
  color: ${props => props.theme.colors.primary[500]};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[200]};
  }
`;

const ItemQuantity = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[700]};
  min-width: 1rem;
  text-align: center;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px dashed ${props => props.theme.colors.neutral[300]};
  margin: 1.5rem 0;
`;

const PricingSummary = styled.div`
  margin-bottom: 1.5rem;
`;

const PricingRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[700]};
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.secondary[500]};
  margin-top: 1rem;
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[600]};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.neutral[300]};
    cursor: not-allowed;
  }
`;

const ClearButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: white;
  color: ${props => props.theme.colors.neutral[700]};
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  margin-top: 0.75rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.neutral[50]};
  }
`;

const MinOrderMessage = styled.p`
  color: ${props => props.theme.colors.error[500]};
  text-align: center;
  margin-bottom: 1rem;
  font-size: ${props => props.theme.typography.fontSizes.sm};
`;

// داده‌های نمونه برای رستوران
const sampleRestaurant: Restaurant = {
  id: "1",
  name: "رستوران پیتزا آرمان",
  logo: "/restaurant-logo.jpg",
  coverImage: "/restaurant-cover.jpg",
  categories: ["پیتزا", "برگر", "ساندویچ", "سالاد", "نوشیدنی"],
  rating: 4.2,
  deliveryTime: "30-45",
  minOrder: 50000,
  deliveryFee: 10000,
  address: "تهران، خیابان ولیعصر، نرسیده به میدان ونک"
};

// داده‌های نمونه برای منوی رستوران
const sampleMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "پیتزا پپرونی",
    description: "خمیر تازه، سس مخصوص، پنیر موزارلا، پپرونی",
    price: 185000,
    category: "پیتزا"
  },
  {
    id: "2",
    name: "پیتزا مخصوص",
    description: "خمیر تازه، سس مخصوص، پنیر موزارلا، ژامبون، قارچ، فلفل دلمه، زیتون",
    price: 210000,
    category: "پیتزا"
  },
  {
    id: "3",
    name: "پیتزا مرغ و قارچ",
    description: "خمیر تازه، سس مخصوص، پنیر موزارلا، مرغ، قارچ، فلفل دلمه",
    price: 195000,
    category: "پیتزا"
  },
  {
    id: "4",
    name: "برگر کلاسیک",
    description: "گوشت گوساله، کاهو، گوجه، خیارشور، سس مخصوص",
    price: 145000,
    category: "برگر"
  },
  {
    id: "5",
    name: "چیز برگر",
    description: "گوشت گوساله، پنیر چدار، کاهو، گوجه، خیارشور، سس مخصوص",
    price: 165000,
    category: "برگر"
  },
  {
    id: "6",
    name: "دوبل برگر",
    description: "دو لایه گوشت گوساله، دو لایه پنیر چدار، کاهو، گوجه، خیارشور، سس مخصوص",
    price: 210000,
    category: "برگر"
  },
  {
    id: "7",
    name: "ساندویچ مرغ گریل",
    description: "فیله مرغ گریل شده، کاهو، گوجه، خیارشور، سس مخصوص",
    price: 135000,
    category: "ساندویچ"
  },
  {
    id: "8",
    name: "ساندویچ ژامبون",
    description: "ژامبون، پنیر، کاهو، گوجه، خیارشور، سس مخصوص",
    price: 120000,
    category: "ساندویچ"
  },
  {
    id: "9",
    name: "سالاد سزار",
    description: "کاهو، مرغ گریل شده، پنیر پارمزان، نان تست، سس سزار",
    price: 135000,
    category: "سالاد"
  },
  {
    id: "10",
    name: "سالاد فصل",
    description: "کاهو، گوجه، خیار، فلفل دلمه، زیتون، سس رژیمی",
    price: 85000,
    category: "سالاد"
  },
  {
    id: "11",
    name: "نوشابه",
    description: "کوکاکولا، فانتا، اسپرایت (۳۳۰ میلی‌لیتر)",
    price: 15000,
    category: "نوشیدنی"
  },
  {
    id: "12",
    name: "آب معدنی",
    description: "۵۰۰ میلی‌لیتر",
    price: 10000,
    category: "نوشیدنی"
  }
];

export default function RestaurantPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>("همه");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // نمایش منوی فیلتر شده براساس دسته‌بندی
  const filteredMenuItems = activeCategory === "همه" 
    ? sampleMenuItems 
    : sampleMenuItems.filter(item => item.category === activeCategory);
  
  // دسته‌بندی منو
  const categories = ["همه", ...new Set(sampleMenuItems.map(item => item.category))];
  
  // منوی گروه‌بندی شده براساس دسته‌بندی
  const groupedMenuItems = sampleMenuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);
  
  // فرمت قیمت
  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR') + ' تومان';
  };
  
  // افزودن محصول به سبد خرید
  const addToCart = (menuItem: MenuItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === menuItem.id);
      
      if (existingItem) {
        return prevItems.map(item => 
          item.id === menuItem.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...menuItem, quantity: 1 }];
      }
    });
  };
  
  // افزایش تعداد محصول در سبد خرید
  const increaseItemQuantity = (itemId: string) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };
  
  // کاهش تعداد محصول در سبد خرید
  const decreaseItemQuantity = (itemId: string) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === itemId);
      
      if (existingItem && existingItem.quantity === 1) {
        return prevItems.filter(item => item.id !== itemId);
      }
      
      return prevItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };
  
  // حذف تمام محصولات از سبد خرید
  const clearCart = () => {
    setCartItems([]);
  };
  
  // محاسبه جمع قیمت محصولات در سبد خرید
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  const subtotal = calculateSubtotal();
  const deliveryFee = sampleRestaurant.deliveryFee;
  const total = subtotal + deliveryFee;
  const isMinOrderMet = subtotal >= sampleRestaurant.minOrder;
  
  // هدایت به صفحه تکمیل سفارش
  const handleCheckout = () => {
    router.push('/order');
  };
  
  return (
    <RestaurantContainer>
      <RestaurantHeader>
        <CoverImage>🍕</CoverImage>
        <RestaurantInfoContainer>
          <RestaurantInfo>
            <RestaurantName>{sampleRestaurant.name}</RestaurantName>
            <RestaurantDetails>
              <DetailItem>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {sampleRestaurant.rating}
              </DetailItem>
              <DetailItem>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {sampleRestaurant.deliveryTime} دقیقه
              </DetailItem>
              <DetailItem>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                حداقل سفارش: {formatPrice(sampleRestaurant.minOrder)}
              </DetailItem>
            </RestaurantDetails>
          </RestaurantInfo>
          <RestaurantActions>
            <ActionButton>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {sampleRestaurant.address}
            </ActionButton>
          </RestaurantActions>
        </RestaurantInfoContainer>
      </RestaurantHeader>
      
      <ContentSection>
        <MenuSection>
          <CategoryNav>
            {categories.map(category => (
              <CategoryButton 
                key={category} 
                active={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </CategoryButton>
            ))}
          </CategoryNav>
          
          {activeCategory === "همه" ? (
            Object.entries(groupedMenuItems).map(([category, items]) => (
              <div key={category}>
                <CategoryTitle>{category}</CategoryTitle>
                <MenuItemsGrid>
                  {items.map(item => (
                    <MenuItemCard key={item.id}>
                      <MenuItemImage>🍔</MenuItemImage>
                      <MenuItemContent>
                        <MenuItemName>{item.name}</MenuItemName>
                        <MenuItemDescription>{item.description}</MenuItemDescription>
                        <MenuItemFooter>
                          <MenuItemPrice>{formatPrice(item.price)}</MenuItemPrice>
                          <AddToCartButton onClick={() => addToCart(item)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </AddToCartButton>
                        </MenuItemFooter>
                      </MenuItemContent>
                    </MenuItemCard>
                  ))}
                </MenuItemsGrid>
              </div>
            ))
          ) : (
            <MenuItemsGrid>
              {filteredMenuItems.map(item => (
                <MenuItemCard key={item.id}>
                  <MenuItemImage>🍔</MenuItemImage>
                  <MenuItemContent>
                    <MenuItemName>{item.name}</MenuItemName>
                    <MenuItemDescription>{item.description}</MenuItemDescription>
                    <MenuItemFooter>
                      <MenuItemPrice>{formatPrice(item.price)}</MenuItemPrice>
                      <AddToCartButton onClick={() => addToCart(item)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </AddToCartButton>
                    </MenuItemFooter>
                  </MenuItemContent>
                </MenuItemCard>
              ))}
            </MenuItemsGrid>
          )}
        </MenuSection>
        
        <CartSection>
          <CartTitle>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            سبد خرید
          </CartTitle>
          
          {cartItems.length === 0 ? (
            <CartEmptyMessage>سبد خرید شما خالی است</CartEmptyMessage>
          ) : (
            <>
              <CartItemsList>
                {cartItems.map(item => (
                  <CartItem key={item.id}>
                    <ItemInfo>
                      <ItemName>{item.name}</ItemName>
                      <ItemPrice>{formatPrice(item.price)}</ItemPrice>
                    </ItemInfo>
                    <ItemControls>
                      <ItemButton onClick={() => decreaseItemQuantity(item.id)}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </ItemButton>
                      <ItemQuantity>{item.quantity}</ItemQuantity>
                      <ItemButton onClick={() => increaseItemQuantity(item.id)}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </ItemButton>
                    </ItemControls>
                  </CartItem>
                ))}
              </CartItemsList>
              
              <Divider />
              
              <PricingSummary>
                <PricingRow>
                  <span>جمع سفارش:</span>
                  <span>{formatPrice(subtotal)}</span>
                </PricingRow>
                <PricingRow>
                  <span>هزینه ارسال:</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </PricingRow>
                <TotalRow>
                  <span>مبلغ قابل پرداخت:</span>
                  <span>{formatPrice(total)}</span>
                </TotalRow>
              </PricingSummary>
              
              {!isMinOrderMet && (
                <MinOrderMessage>
                  حداقل سفارش {formatPrice(sampleRestaurant.minOrder)} می‌باشد.
                  شما هنوز {formatPrice(sampleRestaurant.minOrder - subtotal)} دیگر نیاز دارید.
                </MinOrderMessage>
              )}
              
              <CheckoutButton 
                disabled={!isMinOrderMet || cartItems.length === 0}
                onClick={handleCheckout}
              >
                تکمیل سفارش
              </CheckoutButton>
              
              {cartItems.length > 0 && (
                <ClearButton onClick={clearCart}>
                  پاک کردن سبد خرید
                </ClearButton>
              )}
            </>
          )}
        </CartSection>
      </ContentSection>
    </RestaurantContainer>
  );
} 