"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { vazirmatn } from '@/app/fonts';

// تعریف ساختار داده برای مراحل پیگیری سفارش
interface OrderStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  current: boolean;
  time?: string;
}

// تعریف ساختار داده برای سفارش
interface Order {
  id: string;
  trackingNumber: string;
  restaurantName: string;
  restaurantId?: string;
  orderDate: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'processing' | 'preparing' | 'delivering' | 'delivered' | 'canceled';
  estimatedDeliveryTime?: string;
  delivery?: {
    person: {
      name: string;
      phone: string;
    };
  };
}

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

// استایل‌های صفحه
const TrackingPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  direction: rtl;
  font-family: var(--font-vazirmatn);
`;

const TrackingHeader = styled.div`
  margin-bottom: 2rem;
`;

const TrackingTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes['2xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.secondary[500]};
`;

const TrackingInfo = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[700]};
`;

const TrackingContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const TrackingMainContent = styled.div`
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    order: 2;
  }
`;

const TrackingSidebar = styled.div`
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    order: 1;
  }
`;

const TrackingForm = styled.form`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.boxShadow.sm};
`;

const TrackingFormTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.secondary[500]};
`;

const TrackingFormField = styled.div`
  margin-bottom: 1rem;
`;

const TrackingFormLabel = styled.label`
  display: block;
  font-size: ${props => props.theme.typography.fontSizes.md};
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.neutral[700]};
`;

const TrackingFormInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-family: var(--font-vazirmatn);
`;

const TrackingFormButton = styled.button`
  width: 100%;
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-family: var(--font-vazirmatn);
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[400]};
  }
`;

const OrderDetails = styled.div`
  padding: 1.5rem;
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.boxShadow.sm};
  margin-bottom: 2rem;
`;

const OrderDetailsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.neutral[100]};
`;

const OrderId = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.secondary[500]};
`;

const OrderStatus = styled.div<{ status: 'processing' | 'preparing' | 'delivering' | 'delivered' | 'canceled' }>`
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  background-color: ${props => {
    switch (props.status) {
      case 'processing':
        return props.theme.colors.warning[100];
      case 'preparing':
        return props.theme.colors.warning[100];
      case 'delivering':
        return props.theme.colors.primary[100] || '#FFE8D9';
      case 'delivered':
        return props.theme.colors.success[100];
      case 'canceled':
        return props.theme.colors.error[100];
      default:
        return props.theme.colors.neutral[200];
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'processing':
        return props.theme.colors.warning[700] || '#B45309';
      case 'preparing':
        return props.theme.colors.warning[700] || '#B45309';
      case 'delivering':
        return props.theme.colors.primary[700] || '#C2410C';
      case 'delivered':
        return props.theme.colors.success[700] || '#15803D';
      case 'canceled':
        return props.theme.colors.error[700] || '#B91C1C';
      default:
        return props.theme.colors.neutral[700];
    }
  }};
`;

const OrderInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const OrderInfoItem = styled.div`
  margin-bottom: 0.5rem;
`;

const OrderInfoLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[500]};
  display: block;
  margin-bottom: 0.25rem;
`;

const OrderInfoValue = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[900]};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

const OrderActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const OrderButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.colors.neutral[100]};
  color: ${props => props.theme.colors.neutral[700]};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  flex: 1;
  font-family: var(--font-vazirmatn);
  
  &:hover {
    background-color: ${props => props.theme.colors.neutral[200]};
  }
`;

const CancelButton = styled(OrderButton)`
  background-color: ${props => props.theme.colors.error[100]};
  color: ${props => props.theme.colors.error[700]};
  
  &:hover {
    background-color: ${props => props.theme.colors.error[200]};
  }
`;

const ContactButton = styled(OrderButton)`
  background-color: ${props => props.theme.colors.primary[100]};
  color: ${props => props.theme.colors.primary[700]};
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[200]};
  }
`;

const TrackingSteps = styled.div`
  padding: 1.5rem;
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.boxShadow.sm};
`;

const TrackingStepsTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.secondary[500]};
`;

const StepsList = styled.div`
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 18px;
    width: 2px;
    background-color: ${props => props.theme.colors.neutral[200]};
    z-index: 1;
  }
`;

const Step = styled.div<{ active: boolean; completed: boolean }>`
  position: relative;
  padding-right: 2.5rem;
  padding-bottom: 2rem;
  z-index: 2;
  
  &:last-child {
    padding-bottom: 0;
  }

  &:after {
    content: '';
    position: absolute;
    right: 19px;
    top: 38px;
    bottom: 0;
    width: 2px;
    background-color: ${props => props.completed 
      ? props.theme.colors.success["500"]
      : props.theme.colors.neutral["100"]};
  }

  &:last-child:after {
    display: none;
  }
`;

const StepIcon = styled.div<{ active: boolean; completed: boolean }>`
  position: absolute;
  right: 0;
  top: 0;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color: ${props => 
    props.completed
      ? props.theme.colors.success["500"]
      : props.active
        ? props.theme.colors.primary["500"]
        : props.theme.colors.neutral["100"]
  };
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => 
    props.completed || props.active
      ? 'white'
      : props.theme.colors.neutral["400"]
  };
  font-size: 1.25rem;
  box-shadow: ${props => 
    props.active
      ? `0 0 0 4px ${props.theme.colors.primary["100"]}`
      : 'none'
  };
`;

const StepContent = styled.div`
  padding-right: 1rem;
`;

const StepTitle = styled.h4<{ active: boolean; completed: boolean }>`
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  margin-bottom: 0.25rem;
  color: ${props => 
    props.active
      ? props.theme.colors.primary["600"]
      : props.completed
        ? props.theme.colors.success["600"]
        : props.theme.colors.neutral["600"]
  };
`;

const StepDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[600]};
  margin-bottom: 0.5rem;
`;

const StepTime = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[500]};
`;

const OrderItemsList = styled.div`
  margin-top: 1.5rem;
`;

const OrderItem = styled.div`
  display: flex;
  padding: 1rem 0;
  border-top: 1px solid ${props => props.theme.colors.neutral[100]};
  
  &:last-child {
    border-bottom: 1px solid ${props => props.theme.colors.neutral[100]};
  }
`;

const OrderItemImage = styled.div`
  width: 60px;
  height: 60px;
  background-color: ${props => props.theme.colors.primary[400]};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-left: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${props => props.theme.typography.fontSizes.md};
`;

const OrderItemDetails = styled.div`
  flex: 1;
`;

const OrderItemName = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  margin-bottom: 0.25rem;
  color: ${props => props.theme.colors.secondary[500]};
`;

const OrderItemRestaurant = styled(Link)`
  display: block;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[600]};
  margin-bottom: 0.5rem;
  text-decoration: none;
  
  &:hover {
    color: ${props => props.theme.colors.primary[500]};
    text-decoration: underline;
  }
`;

const OrderItemPrice = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.neutral[800]};
`;

const OrderItemQuantity = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[500]};
  margin-top: 0.25rem;
`;

const DeliveryMap = styled.div`
  margin-top: 2rem;
  height: 300px;
  background-color: ${props => props.theme.colors.neutral[100]};
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.neutral[400]};
  font-size: ${props => props.theme.typography.fontSizes.lg};
`;

const OrderSummary = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.boxShadow.sm};
  padding: 1.5rem;
`;

const OrderSummaryTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.neutral[100]};
  color: ${props => props.theme.colors.secondary[500]};
`;

const PriceItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const PriceLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[700]};
`;

const PriceValue = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[900]};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

const TotalPrice = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.neutral[100]};
`;

const TotalLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.secondary[500]};
`;

const TotalValue = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.primary[500]};
`;

const DeliveryInfo = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.boxShadow.sm};
  padding: 1.5rem;
  margin-top: 1.5rem;
`;

const DeliveryInfoTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.neutral[100]};
  color: ${props => props.theme.colors.secondary[500]};
`;

const DeliveryInfoItem = styled.div`
  margin-bottom: 1rem;
`;

const DeliveryInfoLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[500]};
  margin-bottom: 0.25rem;
`;

const DeliveryInfoValue = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[900]};
`;

const DeliveryPersonInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.neutral[100]};
`;

const DeliveryPersonAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.neutral[300]};
  margin-left: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.neutral[500]};
`;

const DeliveryPersonDetails = styled.div`
  flex: 1;
`;

const DeliveryPersonName = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  margin-bottom: 0.25rem;
  color: ${props => props.theme.colors.secondary[500]};
`;

const DeliveryPersonContact = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[600]};
`;

const DeliveryPersonCallButton = styled.button`
  background-color: ${props => props.theme.colors.success[500]};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 0.5rem 1rem;
  font-family: var(--font-vazirmatn);
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.success[600]};
  }
`;

const NoOrderContainer = styled.div`
  padding: 3rem;
  text-align: center;
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.boxShadow.sm};
`;

const NoOrderEmoji = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const NoOrderTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.secondary[500]};
`;

const NoOrderText = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[700]};
  margin-bottom: 1.5rem;
`;

const BackToHomeButton = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  text-decoration: none;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[400]};
  }
`;

// تابع فرمت‌کننده قیمت به تومان
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
};

// تابع مترجم وضعیت سفارش به فارسی
const translateOrderStatus = (status: Order['status']): string => {
  switch (status) {
    case 'processing':
      return 'در حال پردازش';
    case 'preparing':
      return 'در حال آماده‌سازی';
    case 'delivering':
      return 'در حال ارسال';
    case 'delivered':
      return 'تحویل داده شده';
    case 'canceled':
      return 'لغو شده';
    default:
      return '';
  }
};

// نمونه داده برای نمایش
const sampleOrder: Order = {
  id: 'ord-123456',
  trackingNumber: '123456',
  restaurantName: 'رستوران پدر خوب',
  orderDate: '۱۴۰۲/۰۴/۱۵ - ۱۵:۳۰',
  items: [
    {
      name: 'چلو کباب کوبیده',
      quantity: 2,
      price: 185000
    },
    {
      name: 'جوجه کباب',
      quantity: 1,
      price: 165000
    },
    {
      name: 'نوشابه',
      quantity: 3,
      price: 15000
    }
  ],
  totalAmount: 580000,
  status: 'delivering',
  estimatedDeliveryTime: '۱۶:۱۵ - ۱۶:۳۰'
};

// کامپوننت اصلی صفحه پیگیری سفارش
const OrderTrackingPage: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [order, setOrder] = useState<Order | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState<boolean>(false);
  
  // در حالت واقعی، این تابع باید با API ارتباط برقرار کند
  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!trackingNumber.trim()) {
      setError('لطفاً شماره پیگیری را وارد کنید.');
      return;
    }
    
    setIsSearching(true);
    
    // شبیه‌سازی جستجوی سفارش
    setTimeout(() => {
      if (trackingNumber === '123456') {
        setOrder(sampleOrder);
      } else {
        setOrder(null);
        setError('سفارشی با این شماره پیگیری یافت نشد.');
      }
      setIsSearching(false);
    }, 1000);
  };
  
  // عملکرد لغو سفارش
  const handleCancelOrder = () => {
    if (!order) return;
    
    setCancellingOrder(true);
    
    // شبیه‌سازی لغو سفارش
    setTimeout(() => {
      setOrder({
        ...order,
        status: 'canceled'
      });
      setCancellingOrder(false);
      alert('درخواست لغو سفارش شما با موفقیت ثبت شد.');
    }, 1000);
  };
  
  // عملکرد تماس با پشتیبانی
  const handleContactSupport = () => {
    alert('در حال اتصال به پشتیبانی... شماره تماس: 021-12345678');
  };
  
  // عملکرد تماس با پیک
  const handleCallDelivery = () => {
    if (!order || !order.delivery) return;
    
    alert(`در حال برقراری تماس با پیک ${order.delivery.person.name} به شماره ${order.delivery.person.phone}`);
  };
  
  // ایجاد آرایه مراحل سفارش بر اساس وضعیت فعلی
  const getOrderSteps = (): OrderStep[] => {
    if (!order) return [];
    
    const steps: OrderStep[] = [
      {
        id: 1,
        title: 'سفارش ثبت شد',
        description: 'سفارش شما با موفقیت ثبت شده و در انتظار تأیید رستوران است.',
        icon: '📝',
        completed: true,
        current: order.status === 'processing',
        time: '۱۵:۳۰'
      },
      {
        id: 2,
        title: 'در حال آماده‌سازی',
        description: 'رستوران سفارش شما را تأیید کرده و در حال آماده‌سازی آن است.',
        icon: '👨‍🍳',
        completed: ['preparing', 'delivering', 'delivered'].includes(order.status),
        current: order.status === 'preparing',
        time: '۱۵:۴۵'
      },
      {
        id: 3,
        title: 'در حال ارسال',
        description: 'سفارش شما آماده شده و پیک در حال رساندن آن به آدرس شماست.',
        icon: '🛵',
        completed: ['delivered'].includes(order.status),
        current: order.status === 'delivering',
        time: '۱۶:۰۰'
      },
      {
        id: 4,
        title: 'تحویل داده شد',
        description: 'سفارش شما با موفقیت تحویل داده شده است. نوش جان!',
        icon: '✅',
        completed: order.status === 'delivered',
        current: order.status === 'delivered',
        time: '۱۶:۱۵'
      }
    ];
    
    // اگر سفارش لغو شده باشد
    if (order.status === 'canceled') {
      return [
        {
          id: 1,
          title: 'سفارش لغو شد',
          description: 'متأسفانه سفارش شما به دلایلی لغو شده است.',
          icon: '❌',
          completed: true,
          current: true
        }
      ];
    }
    
    return steps;
  };
  
  return (
    <TrackingPageContainer>
      <TrackingHeader>
        <TrackingTitle>پیگیری سفارش</TrackingTitle>
        <TrackingInfo>
          وضعیت سفارش خود را با وارد کردن شماره پیگیری بررسی کنید
        </TrackingInfo>
      </TrackingHeader>
      
      <TrackingContent>
        <TrackingMainContent>
          {order ? (
            <>
              <OrderDetails>
                <OrderDetailsHeader>
                  <OrderId>سفارش #{order.trackingNumber}</OrderId>
                  <OrderStatus status={order.status}>
                    {translateOrderStatus(order.status)}
                  </OrderStatus>
                </OrderDetailsHeader>
                
                <OrderInfo>
                  <OrderInfoItem>
                    <OrderInfoLabel>تاریخ سفارش</OrderInfoLabel>
                    <OrderInfoValue>{order.orderDate}</OrderInfoValue>
                  </OrderInfoItem>
                  <OrderInfoItem>
                    <OrderInfoLabel>رستوران</OrderInfoLabel>
                    <OrderInfoValue>{order.restaurantName}</OrderInfoValue>
                  </OrderInfoItem>
                </OrderInfo>
                
                <OrderItemsList>
                  {order.items.map((item, index) => (
                    <OrderItem key={index}>
                      <OrderItemImage>🍔</OrderItemImage>
                      <OrderItemDetails>
                        <OrderItemName>{item.name}</OrderItemName>
                        <OrderItemRestaurant href={`/restaurant/${order.restaurantId || '#'}`}>
                          {order.restaurantName}
                        </OrderItemRestaurant>
                        <OrderItemPrice>{formatPrice(item.price * item.quantity)}</OrderItemPrice>
                        <OrderItemQuantity>{item.quantity} عدد</OrderItemQuantity>
                      </OrderItemDetails>
                    </OrderItem>
                  ))}
                </OrderItemsList>
                
                {order.status !== 'delivered' && order.status !== 'canceled' && (
                  <OrderActions>
                    {order.status === 'processing' || order.status === 'preparing' || order.status === 'delivering' ? (
                      <CancelButton onClick={handleCancelOrder} disabled={cancellingOrder}>
                        {cancellingOrder ? 'در حال لغو سفارش...' : 'درخواست لغو سفارش'}
                      </CancelButton>
                    ) : null}
                    <ContactButton onClick={handleContactSupport}>
                      تماس با پشتیبانی
                    </ContactButton>
                  </OrderActions>
                )}
              </OrderDetails>
              
              <TrackingSteps>
                <TrackingStepsTitle>وضعیت سفارش</TrackingStepsTitle>
                <StepsList>
                  {getOrderSteps().map((step, index, array) => (
                    <Step 
                      key={step.id} 
                      active={step.current}
                      completed={step.completed}
                    >
                      <StepIcon 
                        active={step.current} 
                        completed={step.completed}
                      >
                        {step.icon}
                      </StepIcon>
                      <StepContent>
                        <StepTitle 
                          active={step.current} 
                          completed={step.completed}
                        >
                          {step.title}
                        </StepTitle>
                        <StepDescription>
                          {step.description}
                        </StepDescription>
                        {step.time && <StepTime>{step.time}</StepTime>}
                      </StepContent>
                    </Step>
                  ))}
                </StepsList>
              </TrackingSteps>
              
              {order.status === 'delivering' && (
                <DeliveryMap>
                  نقشه مسیر پیک (در حال بارگذاری...)
                </DeliveryMap>
              )}
            </>
          ) : (
            <NoOrderContainer>
              <NoOrderEmoji>🔍</NoOrderEmoji>
              <NoOrderTitle>سفارشی یافت نشد!</NoOrderTitle>
              <NoOrderText>
                برای پیگیری سفارش، کد پیگیری خود را وارد کنید.
              </NoOrderText>
              <BackToHomeButton href="/">
                بازگشت به صفحه اصلی
              </BackToHomeButton>
            </NoOrderContainer>
          )}
        </TrackingMainContent>
        
        <TrackingSidebar>
          <TrackingForm onSubmit={handleTrackOrder}>
            <TrackingFormTitle>شماره پیگیری سفارش خود را وارد کنید</TrackingFormTitle>
            <TrackingFormField>
              <TrackingFormLabel>کد پیگیری سفارش</TrackingFormLabel>
              <TrackingFormInput 
                type="text" 
                placeholder="مثال: 123456"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                dir="ltr"
              />
            </TrackingFormField>
            <TrackingFormButton type="submit" disabled={isSearching}>
              {isSearching ? 'در حال جستجو...' : 'پیگیری سفارش'}
            </TrackingFormButton>
          </TrackingForm>
          
          {order && (
            <>
              <OrderSummary>
                <OrderSummaryTitle>خلاصه سفارش</OrderSummaryTitle>
                <PriceItem>
                  <PriceLabel>جمع سفارش</PriceLabel>
                  <PriceValue>{formatPrice(order.totalAmount)}</PriceValue>
                </PriceItem>
                <TotalPrice>
                  <TotalLabel>مبلغ قابل پرداخت</TotalLabel>
                  <TotalValue>{formatPrice(order.totalAmount)}</TotalValue>
                </TotalPrice>
              </OrderSummary>
              
              <DeliveryInfo>
                <DeliveryInfoTitle>اطلاعات تحویل</DeliveryInfoTitle>
                <DeliveryInfoItem>
                  <DeliveryInfoLabel>زمان تخمینی تحویل</DeliveryInfoLabel>
                  <DeliveryInfoValue>{order.estimatedDeliveryTime}</DeliveryInfoValue>
                </DeliveryInfoItem>
                
                {order.status === 'delivering' && order.delivery && (
                  <DeliveryPersonInfo>
                    <DeliveryPersonAvatar>👨</DeliveryPersonAvatar>
                    <DeliveryPersonDetails>
                      <DeliveryPersonName>{order.delivery.person.name}</DeliveryPersonName>
                      <DeliveryPersonContact>{order.delivery.person.phone}</DeliveryPersonContact>
                    </DeliveryPersonDetails>
                    <DeliveryPersonCallButton onClick={handleCallDelivery}>
                      تماس
                    </DeliveryPersonCallButton>
                  </DeliveryPersonInfo>
                )}
              </DeliveryInfo>
            </>
          )}
        </TrackingSidebar>
      </TrackingContent>
    </TrackingPageContainer>
  );
};

export default OrderTrackingPage; 