"use client";

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const SectionContainer = styled.section`
  padding: 4rem 2rem;
  background-color: ${props => props.theme.colors.neutral[50]};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 3rem 1rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const TitleContainer = styled.div``;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes['3xl']};
  font-weight: 800;
  color: ${props => props.theme.colors.neutral[900]};
  margin-bottom: 0.5rem;
`;

const SectionSubtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[600]};
`;

const ViewAllButton = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: white;
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.neutral[900]};
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary[500]};
    color: ${props => props.theme.colors.primary[500]};
  }
`;

const RestaurantsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const RestaurantCard = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.xl};
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.neutral[200]};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.12);
  }
`;

const CardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 160px;
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  border-bottom: 1px solid ${props => props.theme.colors.neutral[100]};
  transition: transform 0.3s ease;
`;

const RestaurantInfo = styled.div`
  padding: 1.5rem;
`;

const RestaurantName = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.neutral[900]};
  margin-bottom: 0.5rem;
`;

const RestaurantType = styled.span`
  display: block;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[700]};
  margin-bottom: 1rem;
`;

const TagsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  color: ${props => props.theme.colors.neutral[700]};
  background-color: ${props => props.theme.colors.neutral[100]};
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.neutral[100]};
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const StarIcon = styled.span`
  color: ${props => props.theme.colors.warning[500]};
`;

const RatingText = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.neutral[900]};
`;

const DeliveryInfo = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[700]};
`;

// داده‌های نمونه برای رستوران‌ها
const restaurants = [
  {
    id: 1,
    name: 'پیتزا برتر',
    icon: '🍕',
    type: 'فست فود',
    tags: ['پیتزا', 'برگر', 'ساندویچ'],
    rating: 4.8,
    deliveryTime: '30-45 دقیقه',
    slug: 'best-pizza'
  },
  {
    id: 2,
    name: 'رستوران ایرانی سنتی',
    icon: '🍖',
    type: 'غذای ایرانی',
    tags: ['چلوکباب', 'خورشت', 'دیزی'],
    rating: 4.6,
    deliveryTime: '40-55 دقیقه',
    slug: 'traditional-iranian'
  },
  {
    id: 3,
    name: 'سوشی تاکو',
    icon: '🍣',
    type: 'ژاپنی',
    tags: ['سوشی', 'ساشیمی', 'رامن'],
    rating: 4.5,
    deliveryTime: '35-50 دقیقه',
    slug: 'sushi-tako'
  },
  {
    id: 4,
    name: 'سالاد و اسموتی سبز',
    icon: '🥗',
    type: 'سالم و ارگانیک',
    tags: ['سالاد', 'اسموتی', 'دسر'],
    rating: 4.7,
    deliveryTime: '20-35 دقیقه',
    slug: 'green-salad'
  },
];

const TopRestaurants = () => {
  return (
    <SectionContainer>
      <SectionHeader>
        <TitleContainer>
          <SectionTitle>رستوران‌های برتر</SectionTitle>
          <SectionSubtitle>بهترین رستوران‌های شهر با بهترین غذاها</SectionSubtitle>
        </TitleContainer>
        <ViewAllButton href="/restaurants">
          مشاهده همه
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.5rem' }}>
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </ViewAllButton>
      </SectionHeader>
      
      <RestaurantsGrid>
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id}>
            <CardLink href={`/restaurants/${restaurant.slug}`}>
              <ImageContainer>
                {restaurant.icon}
              </ImageContainer>
              <RestaurantInfo>
                <RestaurantName>{restaurant.name}</RestaurantName>
                <RestaurantType>{restaurant.type}</RestaurantType>
                <TagsContainer>
                  {restaurant.tags.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </TagsContainer>
                <CardFooter>
                  <Rating>
                    <StarIcon>★</StarIcon>
                    <RatingText>{restaurant.rating}</RatingText>
                  </Rating>
                  <DeliveryInfo>{restaurant.deliveryTime}</DeliveryInfo>
                </CardFooter>
              </RestaurantInfo>
            </CardLink>
          </RestaurantCard>
        ))}
      </RestaurantsGrid>
    </SectionContainer>
  );
};

export default TopRestaurants; 