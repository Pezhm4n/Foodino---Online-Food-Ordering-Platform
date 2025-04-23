"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import {
  Button,
  FormInput,
  RadioInput,
  RadioLabel,
  StepItem,
  StepLabel,
  StepNumber
} from "@/components/common/StyledComponents";
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useFormatPrice } from '@/hooks/useFormatPrice';

// تعاریف انواع
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// کامپوننت‌های استایل شده
const CheckoutPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const PageTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.secondary[500]};
  margin-bottom: 2rem;
  text-align: center;
`;

const CheckoutContent = styled.div`
  display: flex;
  gap: 2rem;
  direction: rtl;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const CheckoutFormSection = styled.div`
  flex: 2;
`;

const OrderSummarySection = styled.div`
  flex: 1;
  position: sticky;
  top: 2rem;
  height: fit-content;
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  box-shadow: ${props => props.theme.boxShadow.md};
`;

const FormCard = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.boxShadow.md};
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const FormTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.secondary[500]};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormSection = styled.div`
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormField = styled.div`
  flex: 1;
  margin-bottom: 1rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[700]};
`;

const IconContainer = styled.div`
  margin-left: 1rem;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CreditCardForm = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${props => props.theme.colors.neutral[100]};
`;

const OrderItems = styled.div`
  margin-bottom: 1.5rem;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.neutral[100]};
  
  &:last-of-type {
    border-bottom: none;
  }
`;

const ItemInfo = styled.div`
  display: flex;
`;

const ItemQuantity = styled.span`
  color: ${props => props.theme.colors.primary[500]};
  margin-left: 0.5rem;
  min-width: 1.5rem;
`;

const ItemName = styled.span`
  color: ${props => props.theme.colors.neutral[700]};
`;

const ItemPrice = styled.span`
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
  
  &:last-of-type {
    margin-bottom: 0;
    font-weight: ${props => props.theme.typography.fontWeights.bold};
    color: ${props => props.theme.colors.neutral[800]};
  }
`;

const PricingLabel = styled.span`
  color: ${props => props.theme.colors.neutral[700]};
`;

const PricingValue = styled.span``;

const CheckoutSteps = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const BackButton = styled(Button).attrs({ $variant: 'secondary' })``;
const NextButton = styled(Button).attrs({ $variant: 'primary' })``;

const PayButton = styled(Button).attrs({ $variant: 'success' })`
  width: 100%;
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  margin-top: 1rem;
  background-color: ${props => props.theme.colors.success[500]};
  border-radius: 0.75rem;
  transition: transform 0.2s ease, background-color 0.2s ease;
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: ${props => props.theme.colors.success[600]};
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    background-color: ${props => props.theme.colors.success[700]};
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
    font-size: 1.2rem;
    position: sticky;
    bottom: 1rem;
    z-index: 10;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  margin-top: 1rem;
  color: ${props => props.theme.colors.primary[600]};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primary[700]};
    text-decoration: underline;
  }
  
  svg {
    margin-left: 0.5rem;
    transition: transform 0.2s ease;
  }
  
  &:hover svg {
    transform: translateX(-3px);
  }
  
  @media (max-width: 768px) {
    margin-top: 0.75rem;
    font-size: 0.9rem;
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
`;

// تغییر نام به MyStepContent برای جلوگیری از تداخل
const StepContent = styled.div<{ active: boolean }>`
  display: ${({ active }) => (active ? 'block' : 'none')};
  margin-top: 20px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

// نوع پرداخت
type PaymentMethod = 'cash-on-delivery' | 'online-payment' | 'wallet';

// اصلاح PaymentOptionContainer برای استفاده از selected به جای $selected
const PaymentOptionContainer = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid ${props => props.selected ? '#FF5A5F' : '#E0E0E0'};
  border-radius: 8px;
  margin-bottom: 1rem;
  cursor: pointer;
  background-color: ${props => props.selected ? '#FFF0F0' : 'white'};
  transition: all 0.2s ease-in-out;
  
  &:hover {
    border-color: #FF5A5F;
    background-color: #FFEFEF;
  }
`;

// کامپوننت اصلی
const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online-payment');
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  const router = useRouter();
  const { formatPrice } = useFormatPrice();
  
  // محاسبه جمع سبد خرید
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  // محاسبه هزینه‌ها
  const subtotal = calculateSubtotal();
  const deliveryFee = 15000;
  const tax = Math.round(subtotal * 0.09);
  const total = subtotal + deliveryFee + tax;
  
  const handlePayment = async () => {
    if (currentStep !== 2) {
      setCurrentStep(currentStep + 1);
      return;
    }
    
    if (!paymentMethod) {
      alert('لطفاً یک روش پرداخت انتخاب کنید');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // شبیه‌سازی درخواست API برای پرداخت
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // ذخیره اطلاعات سفارش در localStorage
      const orderData = {
        id: `ORDER-${Math.floor(Math.random() * 10000)}`,
        items: cartItems,
        total: total,
        deliveryInfo,
        paymentMethod,
        status: 'پرداخت شده',
        date: new Date().toISOString(),
      };
      
      // ذخیره در localStorage
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      localStorage.setItem('orders', JSON.stringify([...existingOrders, orderData]));
      
      // پاک کردن سبد خرید
      clearCart();
      
      // انتقال به صفحه تایید سفارش
      toast.success('پرداخت با موفقیت انجام شد');
      router.push(`/order-confirmation?id=${orderData.id}`);
    } catch (error) {
      console.error('خطا در پرداخت:', error);
      toast.error('خطا در پرداخت. لطفا دوباره تلاش کنید.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // تغییر مرحله
  const goToNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 2));
  };
  
  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  // تغییر اطلاعات تحویل
  const handleDeliveryInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDeliveryInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <CheckoutPageContainer>
      <PageTitle>تکمیل سفارش</PageTitle>
      
      <CheckoutSteps>
        <StepItem $active={currentStep === 1} $completed={currentStep > 1}>
          <StepNumber $active={currentStep === 1} $completed={currentStep > 1}>
            {currentStep > 1 ? '✓' : '1'}
          </StepNumber>
          <StepLabel $active={currentStep === 1} $completed={currentStep > 1}>اطلاعات ارسال</StepLabel>
        </StepItem>
        
        <StepItem $active={currentStep === 2}>
          <StepNumber $active={currentStep === 2}>2</StepNumber>
          <StepLabel $active={currentStep === 2}>پرداخت و تأیید</StepLabel>
        </StepItem>
      </CheckoutSteps>
      
      <CheckoutContent>
        <CheckoutFormSection>
          <StepContent active={currentStep === 1}>
            <FormCard>
              <FormTitle>
                <IconContainer>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M3.62 8.49C5.59 -0.170 18.42 -0.160 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 9.41 22.48 7.39 20.54C4.63 17.88 1.47 13.57 3.62 8.49Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </IconContainer>
                اطلاعات تحویل
              </FormTitle>
              
              <FormSection>
                <FormRow>
                  <FormField>
                    <FormLabel>نام و نام خانوادگی</FormLabel>
                    <FormInput 
                      type="text" 
                      name="name" 
                      value={deliveryInfo.name} 
                      onChange={handleDeliveryInfoChange} 
                      placeholder="نام گیرنده سفارش" 
                    />
                  </FormField>
                  
                  <FormField>
                    <FormLabel>شماره موبایل</FormLabel>
                    <FormInput 
                      type="tel" 
                      name="phone" 
                      value={deliveryInfo.phone} 
                      onChange={handleDeliveryInfoChange} 
                      placeholder="09xxxxxxxxx" 
                    />
                  </FormField>
                </FormRow>
                
                <FormField>
                  <FormLabel>آدرس کامل</FormLabel>
                  <FormInput 
                    type="text" 
                    name="address" 
                    value={deliveryInfo.address} 
                    onChange={handleDeliveryInfoChange} 
                    placeholder="آدرس دقیق محل تحویل" 
                  />
                </FormField>
                
                <FormField>
                  <FormLabel>توضیحات سفارش (اختیاری)</FormLabel>
                  <FormInput 
                    as="textarea" 
                    name="notes" 
                    value={deliveryInfo.notes} 
                    onChange={handleDeliveryInfoChange} 
                    placeholder="هرگونه توضیحات اضافی برای تحویل سفارش" 
                    style={{ minHeight: '100px' }} 
                  />
                </FormField>
              </FormSection>
              
              <FormActions>
                <BackButton type="button" onClick={() => window.history.back()}>
                  بازگشت به سبد خرید
                </BackButton>
                <NextButton type="button" onClick={goToNextStep}>
                  ادامه به پرداخت
                </NextButton>
              </FormActions>
            </FormCard>
          </StepContent>
          
          <StepContent active={currentStep === 2}>
            <FormCard>
              <FormTitle>
                <IconContainer>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 8.50488H22" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 16.5049H8" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10.5 16.5049H14.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.44 3.50488H17.55C21.11 3.50488 22 4.38488 22 7.89488V16.1049C22 19.6149 21.11 20.4949 17.56 20.4949H6.44C2.89 20.5049 2 19.6249 2 16.1149V7.89488C2 4.38488 2.89 3.50488 6.44 3.50488Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </IconContainer>
                انتخاب روش پرداخت
              </FormTitle>
              
              <PaymentOptionContainer 
                selected={paymentMethod === 'online-payment'} 
                onClick={() => setPaymentMethod('online-payment')}
              >
                <RadioInput 
                  type="radio" 
                  name="payment-method" 
                  id="online-payment" 
                  checked={paymentMethod === 'online-payment'} 
                  onChange={() => setPaymentMethod('online-payment')}
                />
                <IconContainer>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 8.50488H22" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 16.5049H8" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10.5 16.5049H14.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.44 3.50488H17.55C21.11 3.50488 22 4.38488 22 7.89488V16.1049C22 19.6149 21.11 20.4949 17.56 20.4949H6.44C2.89 20.5049 2 19.6249 2 16.1149V7.89488C2 4.38488 2.89 3.50488 6.44 3.50488Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </IconContainer>
                <RadioLabel>پرداخت آنلاین</RadioLabel>
              </PaymentOptionContainer>
              
              <PaymentOptionContainer 
                selected={paymentMethod === 'cash-on-delivery'} 
                onClick={() => setPaymentMethod('cash-on-delivery')}
              >
                <RadioInput 
                  type="radio" 
                  name="payment-method" 
                  id="cash-on-delivery" 
                  checked={paymentMethod === 'cash-on-delivery'} 
                  onChange={() => setPaymentMethod('cash-on-delivery')}
                />
                <IconContainer>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 11.5V13.5C22 17.5 20 19.5 16 19.5H15.5C15.19 19.5 14.89 19.65 14.7 19.9L13.2 22.15C12.54 23.11 11.46 23.11 10.8 22.15L9.3 19.9C9.14 19.69 8.78 19.5 8.5 19.5H8C4 19.5 2 18.5 2 13.5V7.5C2 3.5 4 1.5 8 1.5H12.55" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 3.5V11.5L19 9.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 11.5L15 9.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 8.50001H12" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 13.5H11" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </IconContainer>
                <RadioLabel>پرداخت در محل</RadioLabel>
              </PaymentOptionContainer>
              
              <PaymentOptionContainer 
                selected={paymentMethod === 'wallet'} 
                onClick={() => setPaymentMethod('wallet')}
              >
                <RadioInput 
                  type="radio" 
                  name="payment-method" 
                  id="wallet" 
                  checked={paymentMethod === 'wallet'} 
                  onChange={() => setPaymentMethod('wallet')}
                />
                <IconContainer>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 12.61H19" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 10.28V17.43C19 20.43 17.7 22 14.3 22H5.7C2.3 22 1 20.43 1 17.43V10.28C1 7.58 2.1 6.14 4.85 5.8C5.18 5.76 5.54 5.74 5.9 5.74H14.1C14.46 5.74 14.82 5.76 15.15 5.8C17.9 6.14 19 7.58 19 10.28Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22.9991 6.13V13.28C22.9991 16.28 21.6991 17.85 18.2991 17.85H17.9991V10.28C17.9991 7.58 16.8991 6.14 14.1491 5.8C13.8191 5.76 13.4591 5.74 13.0991 5.74H4.89914V5.56C4.89914 2.56 6.19914 1 9.59914 1H18.1991C21.5991 1 22.9991 2.56 22.9991 5.56V6.13Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.25 16.25H6.75" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.25 16.25H13.75" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </IconContainer>
                <RadioLabel>کیف پول</RadioLabel>
              </PaymentOptionContainer>
              
              {paymentMethod === 'cash-on-delivery' && (
                <CreditCardForm>
                  <FormField>
                    <FormLabel>توضیحات</FormLabel>
                    <FormInput as="textarea" placeholder="در صورت نیاز به توضیحات برای پرداخت در محل" />
                  </FormField>
                </CreditCardForm>
              )}
              
              <FormActions>
                <BackButton type="button" onClick={goToPreviousStep}>
                  بازگشت
                </BackButton>
                <NextButton 
                  onClick={handlePayment} 
                  disabled={isLoading}
                >
                  {isLoading ? 'در حال پردازش...' : currentStep === 3 ? 'پرداخت نهایی' : 'مرحله بعد'}
                </NextButton>
              </FormActions>
            </FormCard>
          </StepContent>
        </CheckoutFormSection>
        
        <OrderSummarySection>
          <FormTitle>خلاصه سفارش</FormTitle>
          
          <OrderItems>
            {cartItems.map(item => (
              <OrderItem key={item.id}>
                <ItemInfo>
                  <ItemQuantity>{item.quantity} ×</ItemQuantity>
                  <ItemName>{item.name}</ItemName>
                </ItemInfo>
                <ItemPrice>{formatPrice(item.price * item.quantity)}</ItemPrice>
              </OrderItem>
            ))}
          </OrderItems>
          
          <Divider />
          
          <PricingSummary>
            <PricingRow>
              <PricingLabel>جمع سفارش</PricingLabel>
              <PricingValue>{formatPrice(subtotal)}</PricingValue>
            </PricingRow>
            <PricingRow>
              <PricingLabel>هزینه ارسال</PricingLabel>
              <PricingValue>{formatPrice(deliveryFee)}</PricingValue>
            </PricingRow>
            <PricingRow>
              <PricingLabel>مالیات بر ارزش افزوده (9%)</PricingLabel>
              <PricingValue>{formatPrice(tax)}</PricingValue>
            </PricingRow>
          </PricingSummary>
          
          <Divider />
          
          <PricingRow>
            <PricingLabel>مبلغ قابل پرداخت</PricingLabel>
            <PricingValue>{formatPrice(total)}</PricingValue>
          </PricingRow>
          
          {currentStep === 2 && (
            <>
              <PayButton onClick={handlePayment} disabled={isLoading}>
                {isLoading ? 'در حال پردازش...' : 'پرداخت'}
              </PayButton>
              <BackLink href="/cart">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                بازگشت به سبد خرید
              </BackLink>
            </>
          )}
        </OrderSummarySection>
      </CheckoutContent>
    </CheckoutPageContainer>
  );
};

export default CheckoutPage; 