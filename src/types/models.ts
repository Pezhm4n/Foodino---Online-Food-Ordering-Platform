// مدل‌های داده مشترک برای استفاده در کل برنامه

export interface Restaurant {
  id: string;
  name: string;
  logo?: string;
  icon?: string;
  coverImage?: string;
  description: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number | string;
  minOrder: number | string;
  priceRange?: string;
  categories: string[];
  address?: string;
  contactNumber?: string;
  workingHours?: string;
  type?: string;
  tags?: string[];
  slug?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  icon?: string;
  restaurantId?: string;
  restaurantName?: string;
  popular?: boolean;
  spicy?: boolean;
  vegetarian?: boolean;
}

export interface CartItem extends Partial<MenuItem> {
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurantId?: string;
  restaurantName?: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  count?: number;
  slug?: string;
}

export interface Order {
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

export interface Address {
  id: string;
  title: string;
  details: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addresses: Address[];
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface FilterOption {
  id: string;
  label: string;
}

export interface SizeOption {
  id: string;
  name: string;
  price: number;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
}

export type PaymentMethod = 'credit-card' | 'online-payment' | 'wallet'; 