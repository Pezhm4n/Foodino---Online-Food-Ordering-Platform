import React from 'react';
import RestaurantHeader from '@/components/restaurant-detail/RestaurantHeader';
import MenuTabs from '@/components/restaurant-detail/MenuTabs';
import { Metadata } from 'next';
import Link from 'next/link';

// تعریف ساختار داده رستوران اگر از ماژول خارجی استفاده نمی‌شود
interface Restaurant {
  id: string;
  slug: string;
  name: string;
  description: string;
  categories: string[];
  priceRange: string;
  rating: number;
  reviewCount: number;
  image: string;
  delivery: {
    fee: string;
    minOrder: string;
    time: string;
  };
  address: string;
}

// داده‌های نمونه رستوران‌ها
const restaurantsData: Restaurant[] = [
  {
    id: '1',
    slug: 'best-pizza',
    name: 'پیتزا برتر',
    description: 'بهترین پیتزا با طعم‌های متنوع و مواد اولیه تازه',
    categories: ['پیتزا', 'ایتالیایی', 'فست فود'],
    priceRange: 'متوسط',
    rating: 4.7,
    reviewCount: 245,
    image: '/images/restaurants/pizza-restaurant.jpg',
    delivery: {
      fee: '15,000 تومان',
      minOrder: '50,000 تومان',
      time: '30-45'
    },
    address: 'خیابان ولیعصر، نرسیده به پارک وی'
  },
  // سایر رستوران‌ها...
];

type RestaurantDetailProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: RestaurantDetailProps): Promise<Metadata> {
  // استفاده از متد async برای دسترسی به params.slug
  const slug = params.slug;
  const restaurant = restaurantsData.find(r => r.slug === slug);

  if (!restaurant) {
    return {
      title: 'رستوران یافت نشد | فودینو',
      description: 'رستوران مورد نظر یافت نشد.',
    };
  }

  return {
    title: `${restaurant.name} | فودینو`,
    description: restaurant.description || `سفارش آنلاین از ${restaurant.name}`,
  };
}

export default async function RestaurantDetailPage({ params }: RestaurantDetailProps) {
  // استفاده از متد async برای دسترسی به params.slug
  const slug = params.slug;
  const restaurant = restaurantsData.find(r => r.slug === slug);

  if (!restaurant) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">متأسفانه رستوران مورد نظر یافت نشد!</h1>
        <p className="mb-8">رستورانی با این شناسه در سیستم ما موجود نیست.</p>
        <Link href="/restaurants" className="bg-primary-500 text-white px-6 py-2 rounded-md">
          بازگشت به لیست رستوران‌ها
        </Link>
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