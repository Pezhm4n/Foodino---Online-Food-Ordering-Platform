"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { vazirmatn } from '@/app/fonts';

// استایل‌های صفحه
const ProductPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  direction: rtl;
  font-family: var(--font-vazirmatn);
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[500]};
`;

const BreadcrumbLink = styled(Link)`
  color: ${props => props.theme.colors.neutral[500]};
  text-decoration: none;
  
  &:hover {
    color: ${props => props.theme.colors.primary[500]};
    text-decoration: underline;
  }
`;

const BreadcrumbSeparator = styled.span`
  margin: 0 0.25rem;
`;

const ProductContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const ProductImageContainer = styled.div`
  position: relative;
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  background-color: ${props => props.theme.colors.neutral[100]};
  height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.typography.fontSizes['2xl']};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    height: 350px;
  }
`;

const ProductDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const RestaurantInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const RestaurantLogo = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary[400]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  font-size: ${props => props.theme.typography.fontSizes.sm};
`;

const RestaurantName = styled(Link)`
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.neutral[700]};
  text-decoration: none;
  
  &:hover {
    color: ${props => props.theme.colors.primary[500]};
    text-decoration: underline;
  }
`;

const ProductTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes['3xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.secondary[500]};
  margin-bottom: 1rem;
`;

const ProductPrice = styled.div`
  font-size: ${props => props.theme.typography.fontSizes['2xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.primary[500]};
  margin-bottom: 1.5rem;
`;

const Discount = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[500]};
  text-decoration: line-through;
  margin-right: 1rem;
`;

const ProductDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.md};
  line-height: 1.7;
  color: ${props => props.theme.colors.neutral[700]};
  margin-bottom: 2rem;
`;

const OptionsContainer = styled.div`
  margin-bottom: 2rem;
`;

const OptionsTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  margin-bottom: 1rem;
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const OptionItem = styled.div<{ selected: boolean }>`
  border: 2px solid ${props => props.selected ? props.theme.colors.primary[500] : props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary[400]};
  }
`;

const OptionName = styled.div`
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  margin-bottom: 0.25rem;
`;

const OptionPrice = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[500]};
`;

const AddonsContainer = styled.div`
  margin-bottom: 2rem;
`;

const AddonsTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  margin-bottom: 1rem;
`;

const AddonItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.neutral[100]};
  
  &:last-child {
    border-bottom: none;
  }
`;

const AddonInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AddonCheckbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const AddonName = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.md};
`;

const AddonPrice = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const QuantityButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  background: none;
  font-size: ${props => props.theme.typography.fontSizes.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.neutral[50]};
  }
`;

const QuantityValue = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  min-width: 30px;
  text-align: center;
`;

const TotalContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem 0;
  border-top: 1px solid ${props => props.theme.colors.neutral[300]};
  border-bottom: 1px solid ${props => props.theme.colors.neutral[300]};
`;

const TotalLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
`;

const TotalValue = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.primary[500]};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const AddToCartButton = styled.button`
  flex: 2;
  padding: 1rem;
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-family: var(--font-vazirmatn);
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[400]};
  }
`;

const FavoriteButton = styled.button`
  flex: 1;
  padding: 1rem;
  background-color: white;
  color: ${props => props.theme.colors.neutral[700]};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: var(--font-vazirmatn);
  
  &:hover {
    background-color: ${props => props.theme.colors.neutral[50]};
  }
`;

// انواع داده
interface SizeOption {
  id: string;
  name: string;
  price: number;
}

interface Addon {
  id: string;
  name: string;
  price: number;
}

// کامپوننت اصلی
const ProductPage = ({ params }: { params: { id: string } }) => {
  // استیت‌ها
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('1');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // داده‌های نمونه محصول
  const product = {
    id: params.id,
    name: 'پیتزا مخصوص',
    restaurant: {
      id: '123',
      name: 'رستوران ایتالیایی آنتونیو',
      logo: 'آ',
    },
    price: 145000,
    originalPrice: 180000,
    description: 'پیتزا مخصوص با خمیر دست‌ساز، سس مخصوص، پنیر موزارلا، ژامبون، قارچ، فلفل دلمه، زیتون سیاه، و سس کچاپ. تهیه شده با بهترین مواد اولیه و پنیر مخصوص. این پیتزا برای ۲ نفر مناسب است.',
    sizeOptions: [
      { id: '1', name: 'متوسط (۳۰ سانتی‌متر)', price: 0 },
      { id: '2', name: 'بزرگ (۴۰ سانتی‌متر)', price: 40000 },
    ],
    addons: [
      { id: '1', name: 'پنیر اضافه', price: 20000 },
      { id: '2', name: 'ژامبون اضافه', price: 25000 },
      { id: '3', name: 'قارچ اضافه', price: 15000 },
      { id: '4', name: 'فلفل دلمه اضافه', price: 10000 },
    ],
  };
  
  // محاسبات
  const selectedSizeOption = product.sizeOptions.find(option => option.id === selectedSize);
  const sizePrice = selectedSizeOption ? selectedSizeOption.price : 0;
  
  const addonsPrice = selectedAddons.reduce((total, addonId) => {
    const addon = product.addons.find(a => a.id === addonId);
    return total + (addon ? addon.price : 0);
  }, 0);
  
  const totalPrice = (product.price + sizePrice + addonsPrice) * quantity;
  
  // هندلرها
  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };
  
  const handleSizeSelect = (sizeId: string) => {
    setSelectedSize(sizeId);
  };
  
  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons(prev => {
      if (prev.includes(addonId)) {
        return prev.filter(id => id !== addonId);
      } else {
        return [...prev, addonId];
      }
    });
  };
  
  const handleAddToCart = () => {
    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSizeOption,
      addons: product.addons.filter(addon => selectedAddons.includes(addon.id)),
      quantity,
      totalPrice,
    };
    
    console.log('Adding to cart:', cartItem);
    alert('محصول به سبد خرید اضافه شد!');
  };
  
  return (
    <ProductPageContainer>
      <Breadcrumb>
        <BreadcrumbLink href="/">خانه</BreadcrumbLink>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbLink href="/restaurants">رستوران‌ها</BreadcrumbLink>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbLink href={`/restaurant/${product.restaurant.id}`}>{product.restaurant.name}</BreadcrumbLink>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <span>{product.name}</span>
      </Breadcrumb>
      
      <ProductContainer>
        <ProductImageContainer>
          تصویر {product.name}
        </ProductImageContainer>
        
        <ProductDetailsContainer>
          <RestaurantInfo>
            <RestaurantLogo>{product.restaurant.logo}</RestaurantLogo>
            <RestaurantName href={`/restaurant/${product.restaurant.id}`}>
              {product.restaurant.name}
            </RestaurantName>
          </RestaurantInfo>
          
          <ProductTitle>{product.name}</ProductTitle>
          
          <ProductPrice>
            {product.price.toLocaleString()} تومان
            {product.originalPrice > product.price && (
              <Discount>{product.originalPrice.toLocaleString()} تومان</Discount>
            )}
          </ProductPrice>
          
          <ProductDescription>{product.description}</ProductDescription>
          
          <OptionsContainer>
            <OptionsTitle>انتخاب سایز</OptionsTitle>
            <OptionsGrid>
              {product.sizeOptions.map(option => (
                <OptionItem 
                  key={option.id} 
                  selected={selectedSize === option.id}
                  onClick={() => handleSizeSelect(option.id)}
                >
                  <OptionName>{option.name}</OptionName>
                  <OptionPrice>
                    {option.price > 0 
                      ? `+ ${option.price.toLocaleString()} تومان` 
                      : 'بدون هزینه اضافی'}
                  </OptionPrice>
                </OptionItem>
              ))}
            </OptionsGrid>
          </OptionsContainer>
          
          <AddonsContainer>
            <AddonsTitle>افزودنی‌ها</AddonsTitle>
            {product.addons.map(addon => (
              <AddonItem key={addon.id}>
                <AddonInfo>
                  <AddonCheckbox 
                    type="checkbox" 
                    checked={selectedAddons.includes(addon.id)}
                    onChange={() => handleAddonToggle(addon.id)}
                  />
                  <AddonName>{addon.name}</AddonName>
                </AddonInfo>
                <AddonPrice>+ {addon.price.toLocaleString()} تومان</AddonPrice>
              </AddonItem>
            ))}
          </AddonsContainer>
          
          <QuantityContainer>
            <QuantityButton onClick={() => handleQuantityChange(-1)}>-</QuantityButton>
            <QuantityValue>{quantity}</QuantityValue>
            <QuantityButton onClick={() => handleQuantityChange(1)}>+</QuantityButton>
          </QuantityContainer>
          
          <TotalContainer>
            <TotalLabel>قیمت نهایی:</TotalLabel>
            <TotalValue>{totalPrice.toLocaleString()} تومان</TotalValue>
          </TotalContainer>
          
          <ActionButtons>
            <AddToCartButton onClick={handleAddToCart}>
              افزودن به سبد خرید
            </AddToCartButton>
            <FavoriteButton onClick={() => setIsFavorite(!isFavorite)}>
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill={isFavorite ? "#FF5A00" : "none"} 
                stroke={isFavorite ? "#FF5A00" : "currentColor"} 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              علاقه‌مندی
            </FavoriteButton>
          </ActionButtons>
        </ProductDetailsContainer>
      </ProductContainer>
    </ProductPageContainer>
  );
};

export default ProductPage; 