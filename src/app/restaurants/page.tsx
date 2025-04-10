import React from 'react';
import RestaurantsList from '@/components/restaurants/RestaurantsList';
import RestaurantFilters from '@/components/restaurants/RestaurantFilters';
import SearchSection from '@/components/restaurants/SearchSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'رستوران‌ها | فودینو',
  description: 'لیست بهترین رستوران‌های شهر با امکان سفارش آنلاین',
};

export default function RestaurantsPage() {
  return (
    <div>
      <SearchSection />
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4">
          <RestaurantFilters />
        </div>
        <div className="lg:w-3/4">
          <RestaurantsList />
        </div>
      </div>
    </div>
  );
} 