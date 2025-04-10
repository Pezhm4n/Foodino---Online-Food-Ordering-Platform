"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import {
  RadioOption,
  RadioInput,
  StepContent,
  StepItem,
  StepNumber,
  StepLabel,
  FormInput,
  Button
} from '@/components/common/StyledComponents';

// کامپوننت‌های استایل شده
const CheckoutPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
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

const FormIcon = styled.span`
  color: ${props => props.theme.colors.primary[500]};
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

const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
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
const CheckoutButton = styled(Button).attrs({ $variant: 'primary' })`
  width: 100%;
  margin-top: 1rem;
`;

// تعریف انواع داده
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// داده‌های نمونه
const sampleCartItems: CartItem[] = [
  { id: '1', name: 'پیتزا قارچ و گوشت', price: 158000, quantity: 1 },
  { id: '2', name: 'نوشابه', price: 12000, quantity: 2 },
  { id: '3', name: 'سالاد سزار', price: 45000, quantity: 1 }
];

// نوع پرداخت
type PaymentMethod = 'credit-card' | 'online-payment' | 'wallet';

// کامپوننت اصلی
const CheckoutPage = () => {
  // استیت‌ها
  const [cartItems] = useState<CartItem[]>(sampleCartItems);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online-payment');
  const [currentStep, setCurrentStep] = useState(1);
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  
  // محاسبه جمع سبد خرید
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  // فرمت قیمت‌ها
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };
  
  // محاسبه هزینه‌ها
  const subtotal = calculateSubtotal();
  const deliveryFee = 15000;
  const tax = Math.round(subtotal * 0.09);
  const total = subtotal + deliveryFee + tax;
  
  // پردازش پرداخت
  const handlePayment = () => {
    alert('سفارش شما با موفقیت ثبت شد!');
    // انتقال به صفحه پیگیری سفارش یا خانه
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
          <StepContent $active={currentStep === 1}>
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
          
          <StepContent $active={currentStep === 2}>
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
              
              <RadioGroup>
                <RadioOption $selected={paymentMethod === 'online-payment'}>
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
                </RadioOption>
                
                <RadioOption $selected={paymentMethod === 'credit-card'}>
                  <RadioInput 
                    type="radio" 
                    name="payment-method" 
                    id="credit-card" 
                    checked={paymentMethod === 'credit-card'} 
                    onChange={() => setPaymentMethod('credit-card')}
                  />
                  <IconContainer>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 9H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 10.9699V13.03C22 13.58 21.56 14.0299 21 14.0499H19.0399C17.9599 14.0499 16.97 13.2599 16.88 12.1799C16.82 11.5499 17.0599 10.9599 17.4799 10.5499C17.8499 10.1699 18.36 9.94995 18.92 9.94995H21C21.56 9.96995 22 10.4199 22 10.9699Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 8.5V3.5C2 2.91 2.44 2.5 3 2.5H13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12V15.5C2 16.09 2.44 16.5 3 16.5H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16.88 12.18C16.97 13.26 17.96 14.05 19.04 14.05H21V17.5C21 19.99 19.99 21 17.5 21H6.5C4.01 21 3 19.99 3 17.5V8.5C3 6.01 4.01 5 6.5 5H17.5C19.99 5 21 6.01 21 8.5V9.95H18.92C18.36 9.95 17.85 10.17 17.48 10.55C17.06 10.96 16.82 11.55 16.88 12.18Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </IconContainer>
                  <RadioLabel>کارت به کارت</RadioLabel>
                </RadioOption>
                
                <RadioOption $selected={paymentMethod === 'wallet'}>
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
                </RadioOption>
              </RadioGroup>
              
              {paymentMethod === 'credit-card' && (
                <CreditCardForm>
                  <FormField>
                    <FormLabel>شماره کارت</FormLabel>
                    <FormInput type="text" placeholder="شماره کارت 16 رقمی" />
                  </FormField>
                </CreditCardForm>
              )}
              
              <FormActions>
                <BackButton type="button" onClick={goToPreviousStep}>
                  بازگشت
                </BackButton>
                <NextButton type="button" onClick={handlePayment}>
                  پرداخت و ثبت سفارش
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
            <CheckoutButton onClick={handlePayment}>
              پرداخت و ثبت سفارش
            </CheckoutButton>
          )}
        </OrderSummarySection>
      </CheckoutContent>
    </CheckoutPageContainer>
  );
};

export default CheckoutPage; 