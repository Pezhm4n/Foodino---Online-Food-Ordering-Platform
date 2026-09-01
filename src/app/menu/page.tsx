"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';

// کامپوننت‌های استایل شده
const MenuPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
`;

const RestaurantBanner = styled.div`
  width: 100%;
  height: 200px;
  background-color: ${props => props.theme.colors.primary[400] + '20'};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: 1.5rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const BannerContent = styled.div`
  position: relative;
  z-index: 1;
  color: ${props => props.theme.colors.primary[500]};
  font-size: 4rem;
`;

const RestaurantInfo = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

const RestaurantName = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.secondary[500]};
  margin-bottom: 0.5rem;
`;

const RestaurantDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[500]};
  margin-bottom: 1rem;
  max-width: 60%;
  margin-left: auto;
  margin-right: auto;
`;

const RestaurantMeta = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[500]};
`;

const MetaIcon = styled.span`
  display: inline-flex;
  align-items: center;
  color: ${props => props.theme.colors.primary[500]};
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  margin-bottom: 2rem;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.neutral[100]};
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary[500]};
    border-radius: 10px;
  }
`;

const CategoryTab = styled.button<{ active?: boolean }>`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.active ? props.theme.colors.primary[500] : 'white'};
  color: ${props => props.active ? 'white' : props.theme.colors.neutral[700]};
  border: 1px solid ${props => props.active ? props.theme.colors.primary[500] : props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-weight: ${props => props.active ? props.theme.typography.fontWeights.medium : props.theme.typography.fontWeights.normal};
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primary[500] : props.theme.colors.neutral[100]};
  }
`;

const MenuContent = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MenuItemsSection = styled.div`
  flex: 2;
`;

const CartSection = styled.div`
  flex: 1;
  
  @media (max-width: 768px) {
    order: -1;
  }
`;

const CategorySection = styled.div`
  margin-bottom: 2rem;
`;

const CategoryTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.secondary[500]};
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.neutral[100]};
`;

const MenuItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const MenuItem = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.boxShadow.sm};
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.boxShadow.md};
  }
`;

const MenuItemImage = styled.div`
  height: 160px;
  background-color: ${props => props.theme.colors.neutral[300]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
`;

const MenuItemContent = styled.div`
  padding: 1rem;
`;

const MenuItemName = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.neutral[700]};
  margin-bottom: 0.5rem;
`;

const MenuItemDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[500]};
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MenuItemFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MenuItemPrice = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.primary[500]};
`;

const AddToCartButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[400]};
  }
`;

const CartContainer = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.boxShadow.md};
  padding: 1.5rem;
  position: sticky;
  top: 2rem;
`;

const CartTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.secondary[500]};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CartIcon = styled.span`
  font-size: 1.25rem;
`;

const CartItems = styled.div`
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

const CartItemInfo = styled.div`
  display: flex;
`;

const CartItemQuantity = styled.span`
  color: ${props => props.theme.colors.primary[500]};
  margin-left: 0.5rem;
  min-width: 1.5rem;
`;

const CartItemName = styled.span`
  color: ${props => props.theme.colors.neutral[700]};
`;

const CartItemPrice = styled.span`
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.neutral[700]};
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
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.neutral[300]};
`;

const CartButton = styled(Link)`
  display: block;
  width: 100%;
  padding: 1rem;
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  font-size: ${props => props.theme.typography.fontSizes.md};
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[400]};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.neutral[300]};
    cursor: not-allowed;
  }
`;

const EmptyCartMessage = styled.div`
  text-align: center;
  padding: 2rem 0;
  color: ${props => props.theme.colors.neutral[500]};
`;

// تعریف انواع داده
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  emoji: string;
}

interface Category {
  id: string;
  name: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// داده‌های نمونه
const categories: Category[] = [
  { id: "all", name: "همه" },
  { id: "appetizers", name: "پیش غذا" },
  { id: "main-course", name: "غذای اصلی" },
  { id: "pizza", name: "پیتزا" },
  { id: "burger", name: "برگر" },
  { id: "sides", name: "مخلفات" },
  { id: "dessert", name: "دسر" },
  { id: "drinks", name: "نوشیدنی" }
];

const menuItems: MenuItem[] = [
  // پیتزا
  {
    id: "1",
    name: "پیتزا پپرونی",
    description: "خمیر تازه، پپرونی، پنیر موزارلا، سس گوجه فرنگی",
    price: 185000,
    category: "pizza",
    emoji: "🍕"
  },
  {
    id: "2",
    name: "پیتزا مخصوص",
    description: "خمیر تازه، ژامبون گوشت، قارچ، فلفل دلمه، پنیر موزارلا، سس گوجه فرنگی",
    price: 195000,
    category: "pizza",
    emoji: "🍕"
  },
  {
    id: "3",
    name: "پیتزا مارگاریتا",
    description: "خمیر تازه، گوجه تازه، ریحان، پنیر موزارلا، سس گوجه فرنگی",
    price: 145000,
    category: "pizza",
    emoji: "🍕"
  },
  
  // برگر
  {
    id: "4",
    name: "همبرگر کلاسیک",
    description: "گوشت گوساله، کاهو، گوجه، خیارشور، پیاز، سس مخصوص",
    price: 145000,
    category: "burger",
    emoji: "🍔"
  },
  {
    id: "5",
    name: "چیزبرگر",
    description: "گوشت گوساله، پنیر چدار، کاهو، گوجه، خیارشور، پیاز، سس مخصوص",
    price: 165000,
    category: "burger",
    emoji: "🍔"
  },
  {
    id: "6",
    name: "دبل برگر",
    description: "دو لایه گوشت گوساله، دو لایه پنیر چدار، کاهو، گوجه، خیارشور، پیاز، سس مخصوص",
    price: 205000,
    category: "burger",
    emoji: "🍔"
  },
  
  // پیش غذا
  {
    id: "7",
    name: "سالاد سزار",
    description: "کاهو، مرغ گریل شده، سس سزار، پنیر پارمزان، کروتان",
    price: 135000,
    category: "appetizers",
    emoji: "🥗"
  },
  {
    id: "8",
    name: "سوپ جو",
    description: "جو، هویج، کرفس، پیاز، مرغ، جعفری",
    price: 85000,
    category: "appetizers",
    emoji: "🍲"
  },
  
  // مخلفات
  {
    id: "9",
    name: "سیب زمینی سرخ کرده",
    description: "سیب زمینی سرخ شده با نمک دریایی",
    price: 85000,
    category: "sides",
    emoji: "🍟"
  },
  {
    id: "10",
    name: "پیاز سوخاری",
    description: "حلقه‌های پیاز سوخاری با سس مخصوص",
    price: 75000,
    category: "sides",
    emoji: "🧅"
  },
  
  // دسر
  {
    id: "11",
    name: "تیرامیسو",
    description: "بیسکوییت قهوه، خامه، پنیر ماسکارپونه، پودر کاکائو",
    price: 115000,
    category: "dessert",
    emoji: "🍰"
  },
  {
    id: "12",
    name: "چیزکیک",
    description: "چیزکیک با سس توت فرنگی",
    price: 125000,
    category: "dessert",
    emoji: "🍰"
  },
  
  // نوشیدنی
  {
    id: "13",
    name: "نوشابه",
    description: "۳۳۰ میلی‌لیتر",
    price: 15000,
    category: "drinks",
    emoji: "🥤"
  },
  {
    id: "14",
    name: "آب معدنی",
    description: "۵۰۰ میلی‌لیتر",
    price: 10000,
    category: "drinks",
    emoji: "💧"
  },
  {
    id: "15",
    name: "دوغ",
    description: "دوغ خانگی با نعناع و پونه",
    price: 25000,
    category: "drinks",
    emoji: "🥛"
  }
];

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // فیلتر محصولات بر اساس دسته‌بندی فعال
  const filteredItems = activeCategory === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);
  
  // گروه‌بندی محصولات بر اساس دسته‌بندی
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);
  
  // افزودن محصول به سبد خرید
  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return prevCart.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      } else {
        return [...prevCart, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
      }
    });
  };
  
  // محاسبه قیمت کل سبد خرید
  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  // فرمت قیمت
  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR') + ' تومان';
  };
  
  return (
    <MenuPageContainer>
      <PageHeader>
        <RestaurantBanner>
          <BannerContent>🍔</BannerContent>
        </RestaurantBanner>
        
        <RestaurantInfo>
          <RestaurantName>رستوران برگر کینگ</RestaurantName>
          <RestaurantDescription>
            بهترین برگرها و پیتزاهای شهر با مواد اولیه تازه و با کیفیت، آماده سرو به شما
          </RestaurantDescription>
          
          <RestaurantMeta>
            <MetaItem>
              <MetaIcon>⭐</MetaIcon> ۴.۹ (۱۲۳ نظر)
            </MetaItem>
            <MetaItem>
              <MetaIcon>🕒</MetaIcon> ۳۰-۴۵ دقیقه
            </MetaItem>
            <MetaItem>
              <MetaIcon>📍</MetaIcon> میدان ونک، خیابان ملاصدرا
            </MetaItem>
          </RestaurantMeta>
        </RestaurantInfo>
        
        <CategoryTabs>
          {categories.map(category => (
            <CategoryTab 
              key={category.id} 
              active={activeCategory === category.id}
              data-active={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </CategoryTab>
          ))}
        </CategoryTabs>
      </PageHeader>
      
      <MenuContent>
        <MenuItemsSection>
          {Object.entries(groupedItems).map(([categoryId, items]) => {
            const category = categories.find(c => c.id === categoryId);
            return (
              <CategorySection key={categoryId}>
                <CategoryTitle>{category?.name}</CategoryTitle>
                <MenuItemsGrid>
                  {items.map(item => (
                    <MenuItem key={item.id}>
                      <MenuItemImage>{item.emoji}</MenuItemImage>
                      <MenuItemContent>
                        <MenuItemName>{item.name}</MenuItemName>
                        <MenuItemDescription>{item.description}</MenuItemDescription>
                        <MenuItemFooter>
                          <MenuItemPrice>{formatPrice(item.price)}</MenuItemPrice>
                          <AddToCartButton onClick={() => addToCart(item)}>
                            افزودن
                          </AddToCartButton>
                        </MenuItemFooter>
                      </MenuItemContent>
                    </MenuItem>
                  ))}
                </MenuItemsGrid>
              </CategorySection>
            );
          })}
        </MenuItemsSection>
        
        <CartSection>
          <CartContainer>
            <CartTitle>
              <CartIcon>🛒</CartIcon> سبد خرید
            </CartTitle>
            
            {cart.length === 0 ? (
              <EmptyCartMessage>سبد خرید شما خالی است</EmptyCartMessage>
            ) : (
              <>
                <CartItems>
                  {cart.map(item => (
                    <CartItem key={item.id}>
                      <CartItemInfo>
                        <CartItemQuantity>{item.quantity} ×</CartItemQuantity>
                        <CartItemName>{item.name}</CartItemName>
                      </CartItemInfo>
                      <CartItemPrice>{formatPrice(item.price * item.quantity)}</CartItemPrice>
                    </CartItem>
                  ))}
                </CartItems>
                
                <Divider />
                
                <PricingSummary>
                  <PricingRow>
                    <span>جمع سفارش:</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </PricingRow>
                  <TotalRow>
                    <span>مبلغ قابل پرداخت:</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </TotalRow>
                </PricingSummary>
                
                <CartButton href="/cart">
                  تکمیل سفارش
                </CartButton>
              </>
            )}
          </CartContainer>
        </CartSection>
      </MenuContent>
    </MenuPageContainer>
  );
};

export default MenuPage; 
