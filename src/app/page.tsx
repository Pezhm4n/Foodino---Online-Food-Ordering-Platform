import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import PopularCategories, { type CategoryItem } from '@/components/home/PopularCategories';
import FeaturedDishes from '@/components/home/FeaturedDishes';
import TopRestaurants from '@/components/home/TopRestaurants';
import QualityBadges from '@/components/home/QualityBadges';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';

export default async function HomePage() {
  let categories: CategoryItem[] = [];
  try {
    const client = await createSupabaseServerClient();
    const { data: categoriesData } = await client
      .from('categories')
      .select(`
        id,
        name,
        slug,
        icon,
        sort_order,
        restaurant_categories (
          restaurants (
            id,
            is_active
          )
        )
      `)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (categoriesData && categoriesData.length > 0) {
      categories = categoriesData.map((cat) => {
        const activeCount = (cat.restaurant_categories ?? []).filter(
          (rc) => rc.restaurants?.is_active
        ).length;
        return {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon || '🍽️',
          count: activeCount,
        };
      });
    }
  } catch {
    // Falls back gracefully to defaultCategories inside PopularCategories
  }

  return (
    <>
      <HeroSection />
      <PopularCategories initialCategories={categories.length > 0 ? categories : undefined} />
      <FeaturedDishes />
      <TopRestaurants />
      <QualityBadges />
    </>
  );
} 