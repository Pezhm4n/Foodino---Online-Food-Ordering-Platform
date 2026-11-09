"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  DishArtwork,
  resolveFoodKind,
  BagIcon,
  StoreIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  TagIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
} from '@/components/ui/FoodVisuals';

const PageContainer = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 5rem;
  direction: rtl;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 1.5rem 1rem calc(6.5rem + env(safe-area-inset-bottom, 0px));
  }
`;

const PageHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid ${props => props.theme.colors.neutral[200]};

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 1.25rem;
    padding-bottom: 1rem;
  }
`;

const HeaderTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const Kicker = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary[600]};
`;

const PageTitle = styled.h1`
  font-size: clamp(1.65rem, 3vw, 2.25rem);
  font-weight: 900;
  color: ${props => props.theme.colors.neutral[900]};
  letter-spacing: -0.02em;
  margin: 0;
`;

const PageDescription = styled.p`
  font-size: 0.95rem;
  color: ${props => props.theme.colors.neutral[500]};
  margin: 0;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 1rem;
  border-radius: 999px;
  background: #ffffff;
  border: 1px solid ${props => props.theme.colors.neutral[200]};
  color: ${props => props.theme.colors.neutral[700]};
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
  min-height: 34px;
  transition: border-color 0.18s ease, color 0.18s ease, background-color 0.18s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary[400]};
    color: ${props => props.theme.colors.primary[600]};
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(180deg, #ffffff 0%, #FAF6F0 100%);
  border: 1px solid ${props => props.theme.colors.neutral[200]};
  border-radius: ${props => props.theme.borderRadius['2xl']};
  box-shadow: ${props => props.theme.shadows.sm};
  max-width: 620px;
  margin: 1rem auto 2rem;
`;

const EmptyVisualWrap = styled.div`
  width: 96px;
  height: 96px;
  margin: 0 auto 1.25rem;
  border-radius: 28px;
  background: ${props => props.theme.colors.primary[50]};
  border: 1px solid ${props => props.theme.colors.primary[100]};
  color: ${props => props.theme.colors.primary[500]};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyCartTitle = styled.h2`
  font-size: 1.45rem;
  font-weight: 800;
  color: ${props => props.theme.colors.neutral[900]};
  margin-bottom: 0.5rem;
`;

const EmptyCartDescription = styled.p`
  font-size: 0.95rem;
  color: ${props => props.theme.colors.neutral[500]};
  margin-bottom: 1.75rem;
  line-height: 1.7;
`;

const BackToRestaurantsButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.75rem;
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  box-shadow: ${props => props.theme.shadows.brand};
  min-height: 44px;
  transition: background-color 0.18s ease, transform 0.18s ease;

  @media (hover: hover) {
    &:hover {
      background-color: ${props => props.theme.colors.primary[600]};
      transform: translateY(-2px);
    }
  }

  &:active {
    transform: scale(0.98);
  }
`;

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 390px;
  gap: 2rem;
  align-items: start;

  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RestaurantBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, #1F1814 0%, #2C221C 100%);
  color: #FAF6F0;
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.sm};
`;

const RestaurantBannerRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const RestaurantIconBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: #FBBF24;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RestaurantMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;

  span {
    font-size: 0.75rem;
    color: rgba(250, 246, 240, 0.65);
  }

  strong {
    font-size: 1rem;
    font-weight: 800;
    color: #ffffff;
  }
`;

const ItemCountBadge = styled.span`
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  background: rgba(217, 56, 30, 0.25);
  border: 1px solid rgba(217, 56, 30, 0.45);
  color: #FCA5A5;
  font-size: 0.78rem;
  font-weight: 700;
`;

const CartItemCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1.15rem 1.25rem;
  background-color: #ffffff;
  border: 1px solid ${props => props.theme.colors.neutral[200]};
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.xs};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.neutral[300]};
    box-shadow: ${props => props.theme.shadows.sm};
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 0.9rem;
    gap: 0.75rem;
  }
`;

const ItemVisualBox = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 16px;
  background: ${props => props.theme.colors.neutral[50]};
  border: 1px solid ${props => props.theme.colors.neutral[200]};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 56px;
    height: 56px;
    border-radius: 12px;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemName = styled.h3`
  font-size: 1.05rem;
  font-weight: 800;
  color: ${props => props.theme.colors.neutral[900]};
  margin: 0 0 0.3rem;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 0.95rem;
  }
`;

const ItemPriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
`;

const ItemPrice = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary[600]};
`;

const ItemSubtotalTag = styled.span`
  font-size: 0.78rem;
  color: ${props => props.theme.colors.neutral[500]};
  background: ${props => props.theme.colors.neutral[100]};
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
`;

const ItemNoteTag = styled.div`
  margin-top: 0.45rem;
  font-size: 0.78rem;
  color: ${props => props.theme.colors.neutral[600]};
  background: ${props => props.theme.colors.neutral[50]};
  border: 1px solid ${props => props.theme.colors.neutral[200]};
  padding: 0.25rem 0.6rem;
  border-radius: 8px;
  display: inline-block;
`;

const ItemControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    gap: 0.4rem;
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem;
  background: ${props => props.theme.colors.neutral[50]};
  border: 1px solid ${props => props.theme.colors.neutral[200]};
  border-radius: 999px;
`;

const QuantityButton = styled.button`
  width: 34px;
  height: 34px;
  min-width: 34px;
  min-height: 34px;
  border-radius: 50%;
  border: none;
  background-color: #ffffff;
  box-shadow: ${props => props.theme.shadows.xs};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.theme.colors.neutral[800]};
  transition: background-color 0.15s ease, color 0.15s ease, transform 0.15s ease;
  user-select: none;
  touch-action: manipulation;

  &:hover {
    background-color: ${props => props.theme.colors.primary[500]};
    color: #ffffff;
  }

  &:active {
    transform: scale(0.92);
  }
`;

const Quantity = styled.span`
  min-width: 1.85rem;
  text-align: center;
  font-weight: 800;
  font-size: 0.95rem;
  color: ${props => props.theme.colors.neutral[900]};
`;

const RemoveButton = styled.button`
  background: none;
  border: 1px solid transparent;
  color: ${props => props.theme.colors.neutral[400]};
  cursor: pointer;
  width: 38px;
  height: 38px;
  min-width: 38px;
  min-height: 38px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;

  &:hover {
    background-color: ${props => props.theme.colors.error[50]};
    border-color: ${props => props.theme.colors.error[100]};
    color: ${props => props.theme.colors.error[600]};
  }
`;

const OrderNoteContainer = styled.div`
  margin-top: 0.5rem;
  background: #ffffff;
  padding: 1.25rem;
  border-radius: ${props => props.theme.borderRadius.xl};
  border: 1px solid ${props => props.theme.colors.neutral[200]};
`;

const OrderNoteLabel = styled.label`
  display: block;
  font-size: 0.88rem;
  font-weight: 700;
  color: ${props => props.theme.colors.neutral[800]};
  margin-bottom: 0.6rem;
`;

const OrderNoteTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 0.9rem;
  border: 1px solid ${props => props.theme.colors.neutral[200]};
  background: ${props => props.theme.colors.neutral[50]};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: 0.88rem;
  font-family: inherit;
  color: ${props => props.theme.colors.neutral[900]};
  resize: vertical;
  outline: none;
  transition: border-color 0.2s ease, background-color 0.2s ease;

  &:focus {
    background: #ffffff;
    border-color: ${props => props.theme.colors.primary[500]};
  }
`;

const CartSummary = styled.div`
  background-color: #ffffff;
  border: 1px solid ${props => props.theme.colors.neutral[200]};
  border-radius: ${props => props.theme.borderRadius['2xl']};
  box-shadow: ${props => props.theme.shadows.md};
  padding: 1.65rem;
  position: sticky;
  top: 96px;
`;

const SummaryTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 800;
  color: ${props => props.theme.colors.neutral[900]};
  margin: 0 0 1.25rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid ${props => props.theme.colors.neutral[200]};
`;

const SummaryRow = styled.div<{ $isDiscount?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.65rem 0;
  color: ${props => (props.$isDiscount ? props.theme.colors.success[600] : 'inherit')};
`;

const SummaryLabel = styled.span`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.neutral[500]};
`;

const SummaryValue = styled.span`
  font-size: 0.92rem;
  font-weight: 700;
  color: ${props => props.theme.colors.neutral[800]};
`;

const CouponSection = styled.div`
  margin: 1.15rem 0;
  padding: 1rem;
  background-color: ${props => props.theme.colors.neutral[50]};
  border: 1px dashed ${props => props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.xl};
`;

const CouponTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: ${props => props.theme.colors.neutral[800]};
  margin-bottom: 0.65rem;
`;

const CouponInputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const CouponInput = styled.input`
  flex: 1;
  padding: 0.6rem 0.8rem;
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  background: #ffffff;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.85rem;
  outline: none;
  font-family: inherit;
  direction: ltr;
  text-align: right;

  &:focus {
    border-color: ${props => props.theme.colors.primary[500]};
  }

  &:disabled {
    background: ${props => props.theme.colors.neutral[100]};
    color: ${props => props.theme.colors.neutral[500]};
  }
`;

const CouponApplyBtn = styled.button`
  background: ${props => props.theme.colors.neutral[900]};
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary[500]};
  }
`;

const CouponRemoveBtn = styled.button`
  background: ${props => props.theme.colors.error[500]};
  color: white;
  border: none;
  padding: 0.6rem 0.9rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
`;

const QuickCouponsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-top: 0.6rem;
`;

const QuickCouponPill = styled.button`
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.colors.primary[200]};
  background: #ffffff;
  color: ${props => props.theme.colors.primary[600]};
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
  min-height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;

  &:hover {
    background: ${props => props.theme.colors.primary[50]};
    border-color: ${props => props.theme.colors.primary[400]};
  }
`;

const CouponActiveBadge = styled.div`
  margin-top: 0.65rem;
  font-size: 0.8rem;
  color: ${props => props.theme.colors.success[600]};
  background: ${props => props.theme.colors.success[50]};
  border: 1px solid ${props => props.theme.colors.success[100]};
  padding: 0.45rem 0.7rem;
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid ${props => props.theme.colors.neutral[100]};
`;

const TotalLabel = styled.span`
  font-size: 1rem;
  font-weight: 800;
  color: ${props => props.theme.colors.neutral[900]};
`;

const TotalValue = styled.span`
  font-size: 1.25rem;
  font-weight: 900;
  color: ${props => props.theme.colors.primary[600]};
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 0.95rem 1.25rem;
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  font-weight: 800;
  font-size: 1rem;
  border: none;
  border-radius: ${props => props.theme.borderRadius.xl};
  margin-top: 1.35rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: ${props => props.theme.shadows.brand};
  min-height: 48px;
  transition: background-color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;

  @media (hover: hover) {
    &:hover {
      background-color: ${props => props.theme.colors.primary[600]};
      transform: translateY(-2px);
    }
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ClearCartButton = styled.button`
  width: 100%;
  padding: 0.7rem;
  margin-top: 0.75rem;
  background-color: transparent;
  border: 1px solid ${props => props.theme.colors.neutral[200]};
  border-radius: ${props => props.theme.borderRadius.lg};
  color: ${props => props.theme.colors.neutral[600]};
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  min-height: 38px;
  transition: border-color 0.18s ease, color 0.18s ease, background 0.18s ease;

  &:hover {
    border-color: ${props => props.theme.colors.error[500]};
    color: ${props => props.theme.colors.error[600]};
    background: ${props => props.theme.colors.error[50]};
  }
`;

const TrustNote = styled.div`
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-size: 0.76rem;
  color: ${props => props.theme.colors.neutral[500]};
`;

const MobileStickyBar = styled.div`
  display: none;
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: blur(12px);
    box-shadow: 0 -6px 24px rgba(22, 18, 15, 0.1);
    padding: 0.85rem 1rem calc(0.85rem + env(safe-area-inset-bottom, 0px));
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
  padding: 0.7rem 1.4rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: 800;
  font-size: 0.925rem;
  min-height: 44px;
  cursor: pointer;
  box-shadow: ${props => props.theme.shadows.brand};
`;

const formatPrice = (price: number): string => {
  return price.toLocaleString('fa-IR') + ' تومان';
};

const CartPage = () => {
  const {
    state,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    calculateSubtotal,
    calculateTotal,
    appliedCoupon,
    discountToman,
    orderNote,
    setOrderNote,
    applyCouponCode,
    removeCoupon,
  } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const router = useRouter();

  const deliveryFee = 15000;
  const subtotal = calculateSubtotal();
  const total = calculateTotal(deliveryFee);

  const handleCheckout = () => {
    if (state.items.length > 0) {
      router.push('/checkout');
    } else {
      toast.error('سبد خرید شما خالی است');
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <HeaderTitleGroup>
          <Kicker>
            <BagIcon size={15} />
            مدیریت سفارش و صورت‌حساب
          </Kicker>
          <PageTitle>سبد خرید</PageTitle>
          <PageDescription>اقلام انتخابی، کد تخفیف و یادداشت سفارش خود را پیش از پرداخت بررسی کنید.</PageDescription>
        </HeaderTitleGroup>
        <BackLink href="/restaurants">
          <span>افزودن آیتم جدید</span>
          <ArrowLeftIcon size={15} />
        </BackLink>
      </PageHeader>

      {state.items.length === 0 ? (
        <EmptyCart>
          <EmptyVisualWrap>
            <BagIcon size={42} />
          </EmptyVisualWrap>
          <EmptyCartTitle>سبد خرید شما خالی است</EmptyCartTitle>
          <EmptyCartDescription>
            هنوز غذایی به سبد خرید اضافه نکرده‌اید. از منوی رستوران‌های منتخب فودینو، غذای گرم و تازه خود را انتخاب کنید.
          </EmptyCartDescription>
          <BackToRestaurantsButton href="/restaurants">
            <span>مشاهده رستوران‌ها</span>
            <ArrowLeftIcon size={16} />
          </BackToRestaurantsButton>
        </EmptyCart>
      ) : (
        <>
          <CartContent>
            <CartItems>
              {state.restaurantName && (
                <RestaurantBanner>
                  <RestaurantBannerRight>
                    <RestaurantIconBox>
                      <StoreIcon size={20} />
                    </RestaurantIconBox>
                    <RestaurantMeta>
                      <span>سفارش فعال از آشپزخانه</span>
                      <strong>{state.restaurantName}</strong>
                    </RestaurantMeta>
                  </RestaurantBannerRight>
                  <ItemCountBadge>
                    {state.items.reduce((sum, i) => sum + i.quantity, 0).toLocaleString('fa-IR')} قلم غذا
                  </ItemCountBadge>
                </RestaurantBanner>
              )}

              {state.items.map(item => {
                const foodKind = resolveFoodKind(`${item.name} ${state.restaurantName ?? ''}`);
                return (
                  <CartItemCard key={item.id}>
                    <ItemVisualBox>
                      <DishArtwork kind={foodKind} size={54} />
                    </ItemVisualBox>
                    <ItemDetails>
                      <ItemName>{item.name}</ItemName>
                      <ItemPriceRow>
                        <ItemPrice>{formatPrice(item.price)}</ItemPrice>
                        {item.quantity > 1 && (
                          <ItemSubtotalTag>
                            جمع: {formatPrice(item.price * item.quantity)}
                          </ItemSubtotalTag>
                        )}
                      </ItemPriceRow>
                      {item.notes && (
                        <ItemNoteTag>
                          <strong>یادداشت:</strong> {item.notes}
                        </ItemNoteTag>
                      )}
                    </ItemDetails>
                    <ItemControls>
                      <QuantityControl>
                        <QuantityButton
                          type="button"
                          onClick={() => decreaseQuantity(item.id)}
                          aria-label="کاهش تعداد"
                        >
                          <MinusIcon size={14} />
                        </QuantityButton>
                        <Quantity>{item.quantity.toLocaleString('fa-IR')}</Quantity>
                        <QuantityButton
                          type="button"
                          onClick={() => increaseQuantity(item.id)}
                          aria-label="افزایش تعداد"
                        >
                          <PlusIcon size={14} />
                        </QuantityButton>
                      </QuantityControl>
                      <RemoveButton
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label="حذف از سبد خرید"
                      >
                        <TrashIcon size={17} />
                      </RemoveButton>
                    </ItemControls>
                  </CartItemCard>
                );
              })}

              <OrderNoteContainer>
                <OrderNoteLabel htmlFor="order-note-input">
                  یادداشت سفارش برای سرآشپز یا سفیر (اختیاری)
                </OrderNoteLabel>
                <OrderNoteTextarea
                  id="order-note-input"
                  placeholder="مثلاً: بدون پیاز، سس مخصوص بیشتر، زنگ طبقه سوم..."
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  rows={2}
                />
              </OrderNoteContainer>
            </CartItems>

            <CartSummary>
              <SummaryTitle>خلاصه صورت‌حساب</SummaryTitle>
              <SummaryRow>
                <SummaryLabel>جمع اقلام سفارش</SummaryLabel>
                <SummaryValue>{formatPrice(subtotal)}</SummaryValue>
              </SummaryRow>

              {discountToman > 0 && (
                <SummaryRow $isDiscount>
                  <SummaryLabel>تخفیف ({appliedCoupon?.code})</SummaryLabel>
                  <SummaryValue style={{ color: '#15803D', fontWeight: 800 }}>
                    - {formatPrice(discountToman)}
                  </SummaryValue>
                </SummaryRow>
              )}

              <SummaryRow>
                <SummaryLabel>هزینه ارسال پیک</SummaryLabel>
                <SummaryValue>
                  {appliedCoupon?.type === 'free_delivery' ? (
                    <span style={{ color: '#15803D', fontWeight: 800 }}>رایگان</span>
                  ) : (
                    formatPrice(deliveryFee)
                  )}
                </SummaryValue>
              </SummaryRow>

              <CouponSection>
                <CouponTitle>
                  <TagIcon size={15} />
                  <span>کد تخفیف فودینو</span>
                </CouponTitle>
                <CouponInputContainer>
                  <CouponInput
                    type="text"
                    id="coupon-code-input"
                    aria-label="کد تخفیف"
                    placeholder="کد تخفیف (مثلاً FOODINO)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    disabled={!!appliedCoupon}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (!appliedCoupon && couponInput.trim()) {
                          applyCouponCode(couponInput, deliveryFee);
                        }
                      }
                    }}
                  />
                  {appliedCoupon ? (
                    <CouponRemoveBtn type="button" onClick={removeCoupon}>
                      حذف
                    </CouponRemoveBtn>
                  ) : (
                    <CouponApplyBtn
                      type="button"
                      onClick={() => {
                        if (!couponInput.trim()) {
                          toast.error('لطفاً کد تخفیف را وارد کنید');
                          return;
                        }
                        applyCouponCode(couponInput, deliveryFee);
                      }}
                    >
                      اعمال
                    </CouponApplyBtn>
                  )}
                </CouponInputContainer>

                {!appliedCoupon && (
                  <QuickCouponsRow>
                    {['FOODINO', 'WELCOME50', 'FREEDEL'].map(code => (
                      <QuickCouponPill
                        key={code}
                        type="button"
                        onClick={() => {
                          setCouponInput(code);
                          applyCouponCode(code, deliveryFee);
                        }}
                      >
                        {code}
                      </QuickCouponPill>
                    ))}
                  </QuickCouponsRow>
                )}

                {appliedCoupon && (
                  <CouponActiveBadge>
                    <CheckCircleIcon size={15} />
                    <span>کد <strong>{appliedCoupon.code}</strong> فعال شد: {appliedCoupon.description}</span>
                  </CouponActiveBadge>
                )}
              </CouponSection>

              <TotalRow>
                <TotalLabel>مبلغ قابل پرداخت</TotalLabel>
                <TotalValue>{formatPrice(total)}</TotalValue>
              </TotalRow>

              <CheckoutButton type="button" onClick={handleCheckout}>
                <span>ادامه فرایند خرید</span>
                <ArrowLeftIcon size={18} />
              </CheckoutButton>

              <ClearCartButton type="button" onClick={clearCart}>
                خالی کردن سبد خرید
              </ClearCartButton>

              <TrustNote>
                <ShieldCheckIcon size={15} />
                <span>محاسبه دقیق سرور و تضمین کیفیت بسته‌بندی</span>
              </TrustNote>
            </CartSummary>
          </CartContent>

          <MobileStickyBar>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#6E6055' }}>مبلغ قابل پرداخت:</div>
              <strong style={{ fontSize: '1.05rem', color: '#16120F' }}>{formatPrice(total)}</strong>
              {discountToman > 0 && (
                <div style={{ fontSize: '0.72rem', color: '#15803D', fontWeight: 700 }}>
                  با {formatPrice(discountToman)} تخفیف
                </div>
              )}
            </div>
            <MobileCheckoutBtn type="button" onClick={handleCheckout}>
              ثبت و ادامه خرید
            </MobileCheckoutBtn>
          </MobileStickyBar>
        </>
      )}
    </PageContainer>
  );
};

export default CartPage;
