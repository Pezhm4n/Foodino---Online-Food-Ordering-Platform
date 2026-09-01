import React from 'react';
import RestaurantHeader from '@/components/restaurant-detail/RestaurantHeader';
import MenuTabs from '@/components/restaurant-detail/MenuTabs';
import { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import { getRestaurantBySlug } from '@/lib/api';
import styled from 'styled-components';

const NotFoundState = styled.div`
  padding: 3rem 0;
  text-align: center;
`;
const NotFoundTitle = styled.h1`margin: 0 0 1rem; font-size: 1.5rem; font-weight: 700;`;
const NotFoundText = styled.p`margin: 0 0 2rem;`;
const RestaurantsLink = styled(Link)`
  display: inline-block; padding: 0.5rem 1.5rem;
  border-radius: 0.375rem;
  background: #0ea5e9; color: white;
`;

type RestaurantDetailProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: RestaurantDetailProps): Promise<Metadata> {
  const { slug } = await params;
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
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);

  if (!restaurant) {
    return (
      <Container>
        <NotFoundState>
          <NotFoundTitle>متأسفانه رستوران مورد نظر یافت نشد!</NotFoundTitle>
          <NotFoundText>رستورانی با این شناسه در سیستم ما موجود نیست.</NotFoundText>
          <RestaurantsLink href="/restaurants">بازگشت به لیست رستوران‌ها</RestaurantsLink>
        </NotFoundState>
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
