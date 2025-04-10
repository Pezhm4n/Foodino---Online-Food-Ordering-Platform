"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const OrderPageContainer = styled.div`
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

const OrderContent = styled.div`
  display: flex;
  gap: 2rem;
  direction: rtl;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const OrderDetailsSection = styled.div`
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

const StepContainer = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: ${props => props.theme.boxShadow.sm};
`;

const StepHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StepNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  border-radius: 50%;
  font-weight: ${props => props.theme.typography.fontWeights.bold};
`;

const StepTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.secondary[500]};
`;

const StepNav = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
`;

const StepButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
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

const BackButton = styled(StepButton)`
  background-color: white;
  color: ${props => props.theme.colors.neutral[700]};
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  
  &:hover {
    background-color: ${props => props.theme.colors.neutral[50]};
  }
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

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.md};
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary[400] + '40'};
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.md};
  resize: vertical;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary[400] + '40'};
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const RadioOption = styled.label<{ selected?: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid ${props => props.selected ? props.theme.colors.primary[500] : props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.selected ? props.theme.colors.primary[400] + '20' : 'white'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.selected ? props.theme.colors.primary[400] + '20' : props.theme.colors.neutral[100]};
  }
`;

const RadioInput = styled.input`
  margin-left: 0.5rem;
`;

const RadioLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[700]};
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

const CheckoutButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  font-size: ${props => props.theme.typography.fontSizes.md};
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

const SuccessMessage = styled.div`
  text-align: center;
  margin: 2rem 0;
`;

const SuccessIcon = styled.div`
  margin: 0 auto 1.5rem;
  width: 4rem;
  height: 4rem;
  background-color: ${props => props.theme.colors.success[500]};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
`;

const SuccessTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.success[500]};
  margin-bottom: 1rem;
`;

const SuccessText = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[700]};
  margin-bottom: 2rem;
`;

const SuccessButton = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  text-decoration: none;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[400]};
  }
`;

const sampleOrderItems = [
  { id: "1", name: "پیتزا پپرونی", price: 185000, quantity: 2 },
  { id: "2", name: "نوشابه", price: 15000, quantity: 2 },
  { id: "3", name: "سالاد سزار", price: 135000, quantity: 1 }
];

export default function OrderPage() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [deliveryType, setDeliveryType] = useState<string>("delivery");
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR') + ' تومان';
  };
  
  const calculateSubtotal = () => {
    return sampleOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  const subtotal = calculateSubtotal();
  const deliveryFee = deliveryType === "delivery" ? 10000 : 0;
  const total = subtotal + deliveryFee;
  
  const nextStep = () => {
    setActiveStep(activeStep + 1);
  };
  
  const prevStep = () => {
    setActiveStep(activeStep - 1);
  };
  
  return (
    <OrderPageContainer>
      <PageTitle>تکمیل سفارش</PageTitle>
      
      <OrderContent>
        <OrderDetailsSection>
          {activeStep === 1 && (
            <StepContainer>
              <StepHeader>
                <StepNumber>۱</StepNumber>
                <StepTitle>اطلاعات تحویل</StepTitle>
              </StepHeader>
              
              <FormSection>
                <FormRow>
                  <FormField>
                    <FormLabel>نام و نام خانوادگی</FormLabel>
                    <FormInput type="text" placeholder="نام و نام خانوادگی خود را وارد کنید" />
                  </FormField>
                  <FormField>
                    <FormLabel>شماره همراه</FormLabel>
                    <FormInput type="tel" placeholder="۰۹۱۲۳۴۵۶۷۸۹" />
                  </FormField>
                </FormRow>
                
                <FormField>
                  <FormLabel>نوع تحویل</FormLabel>
                  <RadioGroup>
                    <RadioOption selected={deliveryType === "delivery"} data-selected={deliveryType === "delivery"}>
                      <RadioInput 
                        type="radio" 
                        name="deliveryType" 
                        value="delivery" 
                        checked={deliveryType === "delivery"}
                        onChange={() => setDeliveryType("delivery")}
                      />
                      <RadioLabel>ارسال با پیک</RadioLabel>
                    </RadioOption>
                    <RadioOption selected={deliveryType === "pickup"} data-selected={deliveryType === "pickup"}>
                      <RadioInput 
                        type="radio" 
                        name="deliveryType" 
                        value="pickup" 
                        checked={deliveryType === "pickup"}
                        onChange={() => setDeliveryType("pickup")}
                      />
                      <RadioLabel>دریافت حضوری</RadioLabel>
                    </RadioOption>
                  </RadioGroup>
                </FormField>
                
                {deliveryType === "delivery" && (
                  <>
                    <FormField>
                      <FormLabel>آدرس</FormLabel>
                      <FormInput type="text" placeholder="آدرس خود را وارد کنید" />
                    </FormField>
                    <FormField>
                      <FormLabel>توضیحات آدرس (اختیاری)</FormLabel>
                      <FormTextarea placeholder="توضیحات بیشتر درباره آدرس (پلاک، طبقه، واحد و...)" />
                    </FormField>
                  </>
                )}
              </FormSection>
              
              <StepNav>
                <BackButton as={Link} href="/restaurant/1">
                  بازگشت به رستوران
                </BackButton>
                <StepButton onClick={nextStep}>
                  ادامه
                </StepButton>
              </StepNav>
            </StepContainer>
          )}
          
          {activeStep === 2 && (
            <StepContainer>
              <StepHeader>
                <StepNumber>۲</StepNumber>
                <StepTitle>روش پرداخت</StepTitle>
              </StepHeader>
              
              <FormSection>
                <FormField>
                  <RadioGroup>
                    <RadioOption selected={true} data-selected={true}>
                      <RadioInput 
                        type="radio" 
                        name="paymentMethod" 
                        value="online" 
                        checked={true}
                      />
                      <RadioLabel>پرداخت آنلاین</RadioLabel>
                    </RadioOption>
                    <RadioOption data-selected={false}>
                      <RadioInput 
                        type="radio" 
                        name="paymentMethod" 
                        value="cash"
                      />
                      <RadioLabel>پرداخت در محل</RadioLabel>
                    </RadioOption>
                  </RadioGroup>
                </FormField>
              </FormSection>
              
              <StepNav>
                <BackButton onClick={prevStep}>
                  بازگشت
                </BackButton>
                <StepButton onClick={nextStep}>
                  ادامه
                </StepButton>
              </StepNav>
            </StepContainer>
          )}
          
          {activeStep === 3 && (
            <StepContainer>
              <StepHeader>
                <StepNumber>۳</StepNumber>
                <StepTitle>تایید نهایی</StepTitle>
              </StepHeader>
              
              <FormSection>
                <FormField>
                  <FormLabel>توضیحات سفارش (اختیاری)</FormLabel>
                  <FormTextarea placeholder="توضیحات یا درخواست خاص برای سفارش..." />
                </FormField>
              </FormSection>
              
              <StepNav>
                <BackButton onClick={prevStep}>
                  بازگشت
                </BackButton>
                <StepButton onClick={nextStep}>
                  تایید و پرداخت
                </StepButton>
              </StepNav>
            </StepContainer>
          )}
          
          {activeStep === 4 && (
            <StepContainer>
              <SuccessMessage>
                <SuccessIcon>✓</SuccessIcon>
                <SuccessTitle>سفارش شما با موفقیت ثبت شد</SuccessTitle>
                <SuccessText>
                  سفارش شما با شماره پیگیری <strong>۱۲۳۴۵۶۷۸۹</strong> ثبت شد و به زودی آماده می‌شود.
                  می‌توانید وضعیت سفارش خود را از بخش سفارش‌های من پیگیری کنید.
                </SuccessText>
                <SuccessButton href="/">
                  بازگشت به صفحه اصلی
                </SuccessButton>
              </SuccessMessage>
            </StepContainer>
          )}
        </OrderDetailsSection>
        
        <OrderSummarySection>
          <StepTitle>خلاصه سفارش</StepTitle>
          
          <OrderItems>
            {sampleOrderItems.map(item => (
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
              <span>جمع سفارش:</span>
              <span>{formatPrice(subtotal)}</span>
            </PricingRow>
            {deliveryType === "delivery" && (
              <PricingRow>
                <span>هزینه ارسال:</span>
                <span>{formatPrice(deliveryFee)}</span>
              </PricingRow>
            )}
            <TotalRow>
              <span>مبلغ قابل پرداخت:</span>
              <span>{formatPrice(total)}</span>
            </TotalRow>
          </PricingSummary>
          
          {activeStep === 3 && (
            <CheckoutButton onClick={nextStep}>
              پرداخت {formatPrice(total)}
            </CheckoutButton>
          )}
        </OrderSummarySection>
      </OrderContent>
    </OrderPageContainer>
  );
} 