import React from 'react';
import RestaurantHeader from '@/components/restaurant-detail/RestaurantHeader';
import MenuTabs from '@/components/restaurant-detail/MenuTabs';
import { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import { getRestaurantBySlug } from '@/lib/api';

type RestaurantDetailProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: RestaurantDetailProps): Promise<Metadata> {
  const slug = params.slug;
  const restaurant = await getRestaurantBySlug(slug);

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
  const slug = params.slug;
  const restaurant = await getRestaurantBySlug(slug);

  if (!restaurant) {
    return (
      <Container className="py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">متأسفانه رستوران مورد نظر یافت نشد!</h1>
        <p className="mb-8">رستورانی با این شناسه در سیستم ما موجود نیست.</p>
        <Link href="/restaurants" className="bg-primary-500 text-white px-6 py-2 rounded-md">
          بازگشت به لیست رستوران‌ها
        </Link>
      </Container>
    );
  }

  return (
    <div>
      <RestaurantHeader restaurant={restaurant} />
      <MenuTabs restaurant={restaurant} />
    </div>
  );
} 