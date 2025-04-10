import React from 'react';
import RestaurantHeader from '@/components/restaurant-detail/RestaurantHeader';
import MenuTabs from '@/components/restaurant-detail/MenuTabs';
import { Metadata } from 'next';

type RestaurantDetailProps = {
  params: {
    slug: string;
  }
}

// داده‌های نمونه برای رستوران‌ها
const restaurantsData = [
  {
    id: 1,
    name: 'پیتزا برتر',
    type: 'فست فود',
    icon: '🍕',
    rating: 4.8,
    tags: ['پیتزا', 'برگر', 'ساندویچ'],
    description: 'بهترین پیتزاهای شهر با طعم‌های مختلف و متنوع. ما از با کیفیت‌ترین مواد اولیه برای تهیه غذاها استفاده می‌کنیم.',
    deliveryTime: '30-45 دقیقه',
    minOrder: '۵۰,۰۰۰ تومان',
    slug: 'best-pizza',
    address: 'تهران، خیابان ولیعصر، خیابان فرشته، پلاک 24',
    workingHours: '12:00 - 23:30',
    contactNumber: '021-12345678',
  },
  {
    id: 2,
    name: 'رستوران ایرانی سنتی',
    type: 'غذای ایرانی',
    icon: '🍖',
    rating: 4.6,
    tags: ['چلوکباب', 'خورشت', 'دیزی'],
    description: 'رستوران سنتی با انواع غذاهای اصیل ایرانی. غذاهای ما با طعم خانگی و با بهترین مواد اولیه تهیه می‌شوند.',
    deliveryTime: '40-55 دقیقه',
    minOrder: '۸۰,۰۰۰ تومان',
    slug: 'traditional-iranian',
    address: 'تهران، خیابان شریعتی، خیابان ملک، پلاک 152',
    workingHours: '11:30 - 23:00',
    contactNumber: '021-87654321',
  },
];

export async function generateMetadata({ params }: RestaurantDetailProps): Promise<Metadata> {
  const restaurant = restaurantsData.find(r => r.slug === params.slug);
  
  if (!restaurant) {
    return {
      title: 'رستوران یافت نشد | فودینو',
    };
  }
  
  return {
    title: `${restaurant.name} | فودینو`,
    description: restaurant.description,
  };
}

export default function RestaurantDetailPage({ params }: RestaurantDetailProps) {
  const restaurant = restaurantsData.find(r => r.slug === params.slug);
  
  if (!restaurant) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">متأسفانه رستوران مورد نظر یافت نشد!</h1>
        <p className="mb-8">رستورانی با این شناسه در سیستم ما موجود نیست.</p>
        <a href="/restaurants" className="bg-primary-500 text-white px-6 py-2 rounded-md">
          بازگشت به لیست رستوران‌ها
        </a>
      </div>
    );
  }
  
  return (
    <div>
      <RestaurantHeader restaurant={restaurant} />
      <MenuTabs restaurant={restaurant} />
    </div>
  );
} 