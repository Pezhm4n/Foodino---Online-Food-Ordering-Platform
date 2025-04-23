"use client";

import React from 'react';
import styled from 'styled-components';
import { CartItem } from '@/types/models';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useFormatPrice } from '@/hooks/useFormatPrice';

const CartContainer = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.boxShadow.md};
  padding: 1.5rem;
  position: sticky;
  top: 6rem;
`;

const CartTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.secondary[500]};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CartEmptyMessage = styled.p`
  text-align: center;
  color: ${props => props.theme.colors.neutral[700]};
  margin: 2rem 0;
`;

const CartItemsList = styled.div`
  margin-bottom: 1.5rem;
  max-height: 400px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.neutral[100]};
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.neutral[300]};
    border-radius: 10px;
  }
`;

const CartItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.neutral[100]};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
  margin-left: 1rem;
`;

const ItemName = styled.h4`
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.secondary[500]};
  margin-bottom: 0.25rem;
`;

const ItemPrice = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[700]};
`;

const ItemControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ItemButton = styled.button`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.neutral[100]};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.neutral[300]};
  }
`;

const ItemQuantity = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.neutral[900]};
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
  font-size: ${props => props.theme.typography.fontSizes.sm};
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
  padding: 1rem;
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(255, 90, 0, 0.2);
  transition: all 0.3s ease;
  margin-bottom: 0.75rem;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[400]};
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(255, 90, 0, 0.3);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 3px 6px rgba(255, 90, 0, 0.2);
  }
  
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
    transition: opacity 0.3s ease;
  }
  
  &:hover::after {
    opacity: 0.6;
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.neutral[300]};
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
    
    &:hover {
      transform: none;
      box-shadow: none;
    }
    
    &::after {
      display: none;
    }
  }
`;

const ClearButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: transparent;
  color: ${props => props.theme.colors.neutral[700]};
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.error[500]};
    color: ${props => props.theme.colors.error[500]};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface Restaurant {
  id: number;
  name: string;
  deliveryTime: string;
  minOrder: string;
  discount?: number;
}

interface CartSectionProps {
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onAddItem: (item: CartItem) => void;
  onClearCart: () => void;
  restaurant: Restaurant;
}

const CartSection = ({ 
  cartItems, 
  onRemoveItem, 
  onAddItem, 
  onClearCart,
  restaurant 
}: CartSectionProps) => {
  const router = useRouter();
  const { formatPrice } = useFormatPrice();
  
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  const subtotal = calculateSubtotal();
  
  const calculateTotal = () => {
    let total = subtotal;
    
    if (restaurant.discount && restaurant.discount > 0) {
      const discountAmount = (subtotal * restaurant.discount) / 100;
      total = subtotal - discountAmount;
    }
    
    return total;
  };
  
  const total = calculateTotal();
  
  const convertPersianToEnglish = (str: string) => {
    if (!str) return '0';
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return str.replace(/[۰-۹]/g, function(match) {
      return persianNumbers.indexOf(match).toString();
    });
  };
  
  const parseMinOrderValue = (minOrderStr: string) => {
    try {
      if (!minOrderStr) return 0;
      // تبدیل اعداد فارسی به انگلیسی
      const englishStr = convertPersianToEnglish(minOrderStr);
      // استخراج فقط اعداد
      const numericStr = englishStr.replace(/[^0-9]/g, '');
      return parseInt(numericStr) || 0;
    } catch (error) {
      console.error('Error parsing min order value:', error);
      return 0; // در صورت خطا، مقدار پیش‌فرض 0 را برمی‌گرداند
    }
  };
  
  const minOrderValue = parseMinOrderValue(restaurant?.minOrder || '0');
  const isMinOrderMet = subtotal >= minOrderValue;
  
  const addItemToCart = (item: CartItem) => {
    onAddItem(item);
  };
  
  const handleCheckout = () => {
    try {
      if (!isMinOrderMet) {
        toast.error(`حداقل سفارش ${restaurant.minOrder} می‌باشد.`);
        return;
      }
      
      localStorage.setItem('restaurant', JSON.stringify({
        id: restaurant.id,
        name: restaurant.name,
        deliveryTime: restaurant.deliveryTime,
        minOrder: restaurant.minOrder,
        discount: restaurant.discount
      }));
      
      if (cartItems.length === 0) {
        toast.error('سبد خرید شما خالی است.');
        return;
      }
      
      router.push('/checkout');
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error('خطایی در فرآیند تکمیل خرید رخ داد. لطفاً دوباره تلاش کنید.');
    }
  };
  
  return (
    <CartContainer>
      <CartTitle>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        سبد خرید من
      </CartTitle>
      
      {cartItems.length === 0 ? (
        <CartEmptyMessage>سبد خرید شما خالی است</CartEmptyMessage>
      ) : (
        <>
          <CartItemsList>
            {cartItems.map(item => (
              <CartItemRow key={item.id}>
                <ItemInfo>
                  <ItemName>{item.name}</ItemName>
                  <ItemPrice>{formatPrice(item.price)}</ItemPrice>
                </ItemInfo>
                <ItemControls>
                  <ItemButton onClick={() => onRemoveItem(item.id)}>-</ItemButton>
                  <ItemQuantity>{item.quantity}</ItemQuantity>
                  <ItemButton onClick={() => addItemToCart(item)}>+</ItemButton>
                </ItemControls>
              </CartItemRow>
            ))}
          </CartItemsList>
          
          <Divider />
          
          <PricingSummary>
            <PricingRow>
              <span>جمع سبد خرید:</span>
              <span>{formatPrice(subtotal)}</span>
            </PricingRow>
            <PricingRow>
              <span>هزینه ارسال:</span>
              <span>{formatPrice(15000)}</span>
            </PricingRow>
            {!isMinOrderMet && (
              <PricingRow style={{ color: '#EF4444' }}>
                <span>حداقل سفارش:</span>
                <span>{restaurant.minOrder}</span>
              </PricingRow>
            )}
            <TotalRow>
              <span>مبلغ قابل پرداخت:</span>
              <span>{formatPrice(total)}</span>
            </TotalRow>
          </PricingSummary>
          
          <CheckoutButton 
            disabled={!isMinOrderMet} 
            onClick={handleCheckout}
          >
            تکمیل خرید
          </CheckoutButton>
          
          <ClearButton onClick={onClearCart} disabled={cartItems.length === 0}>
            پاک کردن سبد خرید
          </ClearButton>
        </>
      )}
    </CartContainer>
  );
};

export default CartSection; 