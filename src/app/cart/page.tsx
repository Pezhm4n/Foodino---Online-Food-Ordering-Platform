"use client";

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

// کامپوننت‌های استایل شده
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  direction: rtl;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 1.25rem 0.85rem calc(6rem + env(safe-area-inset-bottom, 0px));
  }
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    margin-bottom: 1.25rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  color: ${props => props.theme.colors.neutral[900]};
  margin-bottom: 0.5rem;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 1.45rem;
    margin-bottom: 0.25rem;
  }
`;

const PageDescription = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.neutral[500]};
  margin-bottom: 2rem;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 0.85rem;
    margin-bottom: 1.25rem;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: ${props => props.theme.colors.neutral[50]};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: 2rem;
`;

const EmptyCartTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.neutral[700]};
  margin-bottom: 1rem;
`;

const EmptyCartDescription = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.neutral[500]};
  margin-bottom: 2rem;
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
    gap: 1.25rem;
    margin-top: 1.25rem;
  }
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    gap: 0.65rem;
  }
`;

const CartItemCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 0.75rem;
    border-radius: 0.75rem;
    gap: 0.5rem;
  }
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

const RestaurantName = styled.p`
  font-size: 0.95rem;
  color: ${props => props.theme.colors.primary[500]};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

const ItemImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.neutral[100]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-left: 1rem;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 46px;
    height: 46px;
    font-size: 1.25rem;
    margin-left: 0.5rem;
    flex-shrink: 0;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.neutral[700]};
  margin-bottom: 0.25rem;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 0.95rem;
    margin-bottom: 0.15rem;
  }
`;

const ItemPrice = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.theme.colors.neutral[700]};

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 0.85rem;
  }
`;

const ItemControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    gap: 0.35rem;
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    gap: 0.25rem;
  }
`;

const QuantityButton = styled.button`
  width: 36px;
  height: 36px;
  min-width: 36px;
  min-height: 36px;
  border-radius: 50%;
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.15rem;
  font-weight: 600;
  color: ${props => props.theme.colors.neutral[700]};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.neutral[100]};
    border-color: ${props => props.theme.colors.neutral[400]};
  }

  &:active {
    transform: scale(0.94);
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 32px;
    height: 32px;
    min-width: 32px;
    min-height: 32px;
    font-size: 1rem;
  }
`;

const Quantity = styled.span`
  min-width: 2rem;
  text-align: center;
  font-weight: 700;
  font-size: 1rem;
  color: ${props => props.theme.colors.neutral[900]};

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 0.9rem;
    min-width: 1.5rem;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.error[500]};
  cursor: pointer;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.error[50]};
    color: ${props => props.theme.colors.error[600]};
  }

  &:active {
    transform: scale(0.92);
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 36px;
    height: 36px;
    min-width: 36px;
    min-height: 36px;
  }
`;

const MobileStickyBar = styled.div`
  display: none;
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
    padding: 0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom, 0px));
    z-index: 95;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid ${props => props.theme.colors.neutral[200]};
    direction: rtl;
  }
`;

const MobileCheckoutBtn = styled.button`
  background: ${props => props.theme.colors.primary[500]};
  color: white;
  border: none;
  padding: 0.65rem 1.35rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 700;
  font-size: 0.925rem;
  min-height: 42px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 90, 0, 0.25);
  transition: all 0.2s;

  &:active {
    transform: scale(0.97);
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
  color: ${props => props.theme.colors.neutral[700]};
  margin-bottom: 1.5rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.neutral[100]};
  }
`;

const SummaryLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.neutral[500]};
`;

const SummaryValue = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.neutral[700]};
`;

const TotalRow = styled(SummaryRow)`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.neutral[100]};
`;

const TotalLabel = styled(SummaryLabel)`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.neutral[700]};
`;

const TotalValue = styled(SummaryValue)`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary[500]};
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: ${props => props.theme.colors.primary[500]};
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

const EmptyCartIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

// فرمت‌کننده قیمت به تومان
const formatPrice = (price: number): string => {
  return price.toLocaleString('fa-IR') + ' تومان';
};

// کامپوننت اصلی صفحه سبد خرید
const CartPage = () => {
  const { state, removeItem, increaseQuantity, decreaseQuantity, clearCart, calculateSubtotal, calculateTotal } = useCart();
  const router = useRouter();
  
  // هزینه ارسال ثابت
  const deliveryFee = 15000;
  
  // محاسبه مبلغ کل
  const subtotal = calculateSubtotal();
  const total = calculateTotal(deliveryFee);
  
  // انتقال به صفحه checkout
  const handleCheckout = () => {
    if (state.items.length > 0) {
      // ذخیره اطلاعات سبد خرید در localStorage قبل از انتقال
      router.push('/checkout');
    } else {
      toast.error('سبد خرید شما خالی است');
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
                  {item.image && <ItemImage>{item.image}</ItemImage>}
                  <ItemDetails>
                    <ItemName>{item.name}</ItemName>
                    <ItemPrice>{formatPrice(item.price)}</ItemPrice>
                  </ItemDetails>
                  <ItemControls>
                    <QuantityControl>
                      <QuantityButton onClick={() => decreaseQuantity(item.id)} aria-label="کاهش تعداد">-</QuantityButton>
                      <Quantity>{item.quantity}</Quantity>
                      <QuantityButton onClick={() => increaseQuantity(item.id)} aria-label="افزایش تعداد">+</QuantityButton>
                    </QuantityControl>
                    <RemoveButton onClick={() => removeItem(item.id)} aria-label="حذف از سبد خرید">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
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

          <MobileStickyBar>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>مبلغ قابل پرداخت:</div>
              <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>{formatPrice(total)}</strong>
            </div>
            <MobileCheckoutBtn onClick={handleCheckout}>
              ثبت و ادامه خرید
            </MobileCheckoutBtn>
          </MobileStickyBar>
        </>
      )}
    </PageContainer>
  );
};

export default CartPage; 