import React from 'react';
import RestaurantsList from '@/components/restaurants/RestaurantsList';
import RestaurantFilters from '@/components/restaurants/RestaurantFilters';
import SearchSection from '@/components/restaurants/SearchSection';
import { Metadata } from 'next';
import styled from 'styled-components';

const RestaurantsLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;

  @media (min-width: 1024px) {
    flex-direction: row;
  }
`;

const FiltersColumn = styled.aside`
  @media (min-width: 1024px) {
    width: 25%;
  }
`;

const ResultsColumn = styled.section`
  @media (min-width: 1024px) {
    width: 75%;
  }
`;

export const metadata: Metadata = {
  title: 'رستوران‌ها | فودینو',
  description: 'لیست بهترین رستوران‌های شهر با امکان سفارش آنلاین',
};

export default function RestaurantsPage() {
  return (
    <div>
      <SearchSection />
      <RestaurantsLayout>
        <FiltersColumn>
          <RestaurantFilters />
        </FiltersColumn>
        <ResultsColumn>
          <RestaurantsList />
        </ResultsColumn>
      </RestaurantsLayout>
    </div>
  );
} 
