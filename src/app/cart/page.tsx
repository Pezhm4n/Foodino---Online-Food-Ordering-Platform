"use client";

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';

// تعریف ساختار interface برای تم رنگ‌ها
interface ColorObject {
  [key: string]: string;
}

interface ThemeColors {
  primary: ColorObject;
  secondary: ColorObject;
  success: ColorObject;
  error: ColorObject;
  warning: ColorObject;
  neutral: ColorObject;
}

// تعریف ساختار داده برای آیتم سبد خرید
interface CartItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
}

// استایل‌های کامپوننت
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  direction: rtl;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.neutral["700"]};
  margin-bottom: 0.5rem;
`;

const PageDescription = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.neutral["500"]};
  margin-bottom: 2rem;
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: ${props => props.theme.colors.neutral["50"]};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: 2rem;
`;

const EmptyCartTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.neutral["700"]};
  margin-bottom: 1rem;
`;

const EmptyCartDescription = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.neutral["500"]};
  margin-bottom: 2rem;
`;

const BrowseButton = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.colors.primary["500"]};
  color: white;
  font-weight: 500;
  border-radius: ${props => props.theme.borderRadius.md};
  text-decoration: none;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary["400"]};
  }
`;

const CartGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const CartItemsContainer = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const CartList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const CartItemCard = styled.li`
  display: flex;
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.neutral["100"]};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.neutral["100"]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-left: 1rem;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.neutral["700"]};
  margin-bottom: 0.25rem;
`;

const RestaurantName = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.primary["500"]};
  margin-bottom: 0.5rem;
`;

const ItemPrice = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.theme.colors.neutral["700"]};
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1.5rem;
`;

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${props => props.theme.colors.neutral["300"]};
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.neutral["100"]};
  }
`;

const QuantityText = styled.span`
  min-width: 32px;
  text-align: center;
  font-size: 1rem;
  font-weight: 500;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.error["500"]};
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0;
  margin-top: 0.5rem;
  
  &:hover {
    color: ${props => props.theme.colors.error["500"]};
    text-decoration: underline;
  }
`;

const CartSummary = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  position: sticky;
  top: 100px;
`;

const SummaryTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.neutral["700"]};
  margin-bottom: 1.5rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.neutral["100"]};
  }
`;

const SummaryLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.neutral["500"]};
`;

const SummaryValue = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.neutral["700"]};
`;

const TotalRow = styled(SummaryRow)`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.neutral["100"]};
`;

const TotalLabel = styled(SummaryLabel)`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.neutral["700"]};
`;

const TotalValue = styled(SummaryValue)`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary["500"]};
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: ${props => props.theme.colors.primary["500"]};
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-top: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(255, 90, 0, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary["400"]};
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
`;

const CheckoutLink = styled(Link)`
  display: block;
  text-decoration: none;
  position: relative;
  margin-top: 2rem;
  
  &::before {
    content: "→";
    position: absolute;
    right: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0;
    transition: all 0.3s ease;
    color: white;
    font-size: 1.2rem;
    z-index: 2;
  }
  
  &:hover::before {
    opacity: 1;
    right: 1rem;
  }
`;

const EmptyCartIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const BackToRestaurantsButton = styled(Link)`
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  text-decoration: none;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[400]};
  }
`;

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  margin-top: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RestaurantInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background-color: ${props => props.theme.colors.neutral[50]};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: 1rem;
`;

const RestaurantIcon = styled.span`
  font-size: 1.5rem;
`;

const ItemControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Quantity = styled.span`
  min-width: 1.5rem;
  text-align: center;
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

const RemoveIcon = styled.span`
  color: ${props => props.theme.colors.error[500]};
`;

const ClearCartButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  background-color: transparent;
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.neutral[700]};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.error[500]};
    color: ${props => props.theme.colors.error[500]};
  }
`;

// نمونه داده برای نمایش
const sampleCartItems: CartItem[] = [
  {
    id: '1',
    restaurantId: '101',
    restaurantName: 'رستوران پدر خوب',
    name: 'چلو کباب کوبیده',
    price: 185000,
    quantity: 2,
    image: '🍖',
    description: 'چلو کباب کوبیده با سس مخصوص و پنیر موزارلا، قارچ، فلفل دلمه‌ای، زیتون و پپرونی'
  },
  {
    id: '2',
    restaurantId: '101',
    restaurantName: 'رستوران پدر خوب',
    name: 'جوجه کباب',
    price: 165000,
    quantity: 1,
    image: '🍗',
    description: 'جوجه کباب با سس مخصوص و کاهو، گوجه، خیارشور و سس مخصوص'
  },
  {
    id: '3',
    restaurantId: '102',
    restaurantName: 'فست فود برگرلند',
    name: 'برگر دوبل پنیری',
    price: 150000,
    quantity: 1,
    image: '🍔',
    description: 'برگر دوبل پنیری با پنیر چدار، کاهو، گوجه، خیارشور و سس مخصوص'
  }
];

// فرمت‌کننده قیمت به تومان
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
};

// کامپوننت اصلی صفحه سبد خرید
const CartPage = () => {
  // استفاده از کانتکست سبد خرید برای دسترسی به داده‌های واقعی
  const { state, removeItem, increaseQuantity, decreaseQuantity, clearCart, calculateSubtotal, calculateTotal } = useCart();
  const router = useRouter();
  
  // هزینه ارسال ثابت
  const deliveryFee = 15000;
  
  // محاسبه قیمت‌ها
  const subtotal = calculateSubtotal();
  const total = calculateTotal(deliveryFee);
  
  // انتقال به صفحه checkout
  const handleCheckout = () => {
    if (state.items.length > 0) {
      router.push('/checkout');
    }
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>سبد خرید</PageTitle>
        <PageDescription>محصولات انتخابی خود را اینجا مشاهده کنید</PageDescription>
      </PageHeader>
      
      {state.items.length === 0 ? (
        <EmptyCart>
          <EmptyCartIcon>🛒</EmptyCartIcon>
          <EmptyCartTitle>سبد خرید شما خالی است</EmptyCartTitle>
          <EmptyCartDescription>
            به نظر می‌رسد هنوز چیزی به سبد خرید خود اضافه نکرده‌اید.
          </EmptyCartDescription>
          <BackToRestaurantsButton href="/restaurants">
            مشاهده رستوران‌ها
          </BackToRestaurantsButton>
        </EmptyCart>
      ) : (
        <>
          <CartContent>
            <CartItems>
              {state.restaurantName && (
                <RestaurantInfo>
                  <RestaurantIcon>🍽️</RestaurantIcon>
                  <RestaurantName>{state.restaurantName}</RestaurantName>
                </RestaurantInfo>
              )}
              
              {state.items.map(item => (
                <CartItemCard key={item.id}>
                  <ItemDetails>
                    <ItemName>{item.name}</ItemName>
                    <ItemPrice>{formatPrice(item.price)}</ItemPrice>
                  </ItemDetails>
                  <ItemControls>
                    <QuantityControl>
                      <QuantityButton onClick={() => increaseQuantity(item.id)}>+</QuantityButton>
                      <Quantity>{item.quantity}</Quantity>
                      <QuantityButton onClick={() => decreaseQuantity(item.id)}>-</QuantityButton>
                    </QuantityControl>
                    <RemoveButton onClick={() => removeItem(item.id)}>
                      <RemoveIcon>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </RemoveIcon>
                    </RemoveButton>
                  </ItemControls>
                </CartItemCard>
              ))}
            </CartItems>
            
            <CartSummary>
              <SummaryTitle>خلاصه سفارش</SummaryTitle>
              <SummaryRow>
                <SummaryLabel>جمع سبد خرید:</SummaryLabel>
                <SummaryValue>{formatPrice(subtotal)}</SummaryValue>
              </SummaryRow>
              <SummaryRow>
                <SummaryLabel>هزینه ارسال:</SummaryLabel>
                <SummaryValue>{formatPrice(deliveryFee)}</SummaryValue>
              </SummaryRow>
              <TotalRow>
                <TotalLabel>مبلغ قابل پرداخت:</TotalLabel>
                <TotalValue>{formatPrice(total)}</TotalValue>
              </TotalRow>
              
              <CheckoutButton onClick={handleCheckout}>
                ادامه فرایند خرید
              </CheckoutButton>
              
              <ClearCartButton onClick={clearCart}>
                خالی کردن سبد خرید
              </ClearCartButton>
            </CartSummary>
          </CartContent>
        </>
      )}
    </PageContainer>
  );
};

export default CartPage; 