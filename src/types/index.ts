export * from './models';

// تعریف نوع رستوران
export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  description: string;
  categories: string[];
  priceRange: string;
  rating: number;
  reviewCount: number;
  image: string;
  logo: string;
  coverImage: string;
  deliveryTime: string;
  deliveryFee: string;
  minOrder: string;
  address: string;
  workingHours: string;
  type: string;
  icon: string;
  tags: string[];
  contactNumber: string;
}

// تعریف نوع محصول
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  image: string;
  category: string;
  restaurant: string;
  rating: number;
  isAvailable: boolean;
  variants: ProductVariant[];
  options: ProductOption[];
}

// تعریف نوع گزینه محصول
export interface ProductOption {
  id: string;
  name: string;
  price: number;
}

// تعریف نوع تنوع محصول
export interface ProductVariant {
  id: string;
  name: string;
  priceAdjustment: number;
}

// تعریف نوع سفارش
export interface Order {
  id: string;
  restaurant: {
    id: string;
    name: string;
    logo: string;
  };
  items: OrderItem[];
  status: OrderStatus;
  orderDate: string;
  deliveryTime: string;
  deliveryAddress: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
}

// تعریف نوع آیتم سفارش
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  options?: string[];
}

// وضعیت‌های ممکن سفارش
export type OrderStatus = 
  | 'pending'    // در انتظار تایید
  | 'confirmed'  // تایید شده
  | 'preparing'  // در حال آماده‌سازی
  | 'ready'      // آماده برای تحویل
  | 'delivering' // در حال ارسال
  | 'delivered'  // تحویل داده شده
  | 'cancelled'  // لغو شده 