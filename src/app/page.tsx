import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import PopularCategories from '@/components/home/PopularCategories';
import TopRestaurants from '@/components/home/TopRestaurants';
import QualityBadges from '@/components/home/QualityBadges';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PopularCategories />
      <TopRestaurants />
      <QualityBadges />
    </>
  );
} 