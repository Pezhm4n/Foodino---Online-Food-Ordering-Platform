"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';

// تعریف انواع داده
interface Restaurant {
  id: string;
  name: string;
  icon: string;
  description: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  categories: string[];
}

// استایل‌های صفحه
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  direction: rtl;
  font-family: var(--font-vazirmatn);
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes['2xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.secondary[500]};
`;

const PageDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[700]};
  margin-bottom: 2rem;
`;

const RestaurantsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const RestaurantCard = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.boxShadow.sm};
  overflow: hidden;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.boxShadow.md};
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  box-shadow: ${props => props.theme.boxShadow.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: ${props => props.theme.colors.error[500]};
  cursor: pointer;
  z-index: 10;
  
  &:hover {
    background-color: white;
    transform: scale(1.05);
  }
`;

const RestaurantImageContainer = styled.div`
  height: 180px;
  background-color: ${props => props.theme.colors.primary[400]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
`;

const RestaurantContent = styled.div`
  padding: 1.25rem;
`;

const RestaurantHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const RestaurantName = styled(Link)`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.secondary[500]};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const RestaurantRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.neutral[800]};
`;

const StarIcon = styled.span`
  color: ${props => props.theme.colors.warning[400]};
`;

const RestaurantDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[600]};
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const RestaurantMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: ${props => props.theme.typography.fontSizes.sm};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${props => props.theme.colors.neutral[700]};
`;

const CategoryTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const CategoryTag = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  background-color: ${props => props.theme.colors.neutral[100]};
  color: ${props => props.theme.colors.neutral[700]};
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
`;

const ViewButton = styled(Link)`
  display: block;
  width: 100%;
  padding: 0.75rem 0;
  text-align: center;
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  text-decoration: none;
  font-size: ${props => props.theme.typography.fontSizes.md};
  margin-top: 1rem;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[600]};
  }
`;

const EmptyFavorites = styled.div`
  text-align: center;
  padding: 3rem 1rem;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.secondary[500]};
`;

const EmptyDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[600]};
  margin-bottom: 1.5rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const BrowseButton = styled(Link)`
  display: inline-block;
  padding: 0.75rem 2rem;
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  text-decoration: none;
  font-size: ${props => props.theme.typography.fontSizes.md};
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[600]};
  }
`;

// داده‌های نمونه
const sampleFavorites: Restaurant[] = [
  {
    id: '1',
    name: 'پیتزا شیکاگو',
    icon: '🍕',
    description: 'بهترین پیتزا ایتالیایی با خمیر تازه و مواد درجه یک',
    rating: 4.8,
    deliveryTime: '30-45 دقیقه',
    deliveryFee: '15,000 تومان',
    categories: ['پیتزا', 'فست فود', 'ایتالیایی']
  },
  {
    id: '2',
    name: 'کباب سرای سنتی',
    icon: '🍢',
    description: 'انواع کباب‌های سنتی ایرانی با گوشت تازه و نان داغ',
    rating: 4.6,
    deliveryTime: '40-55 دقیقه',
    deliveryFee: '20,000 تومان',
    categories: ['کباب', 'ایرانی', 'سنتی']
  },
  {
    id: '3',
    name: 'سوشی تاکه',
    icon: '🍣',
    description: 'سوشی‌های ژاپنی اصیل با مواد تازه و سس‌های مخصوص',
    rating: 4.7,
    deliveryTime: '35-50 دقیقه',
    deliveryFee: '25,000 تومان',
    categories: ['سوشی', 'ژاپنی', 'دریایی']
  },
  {
    id: '4',
    name: 'برگر کینگ',
    icon: '🍔',
    description: 'انواع برگرهای آمریکایی با سس‌های خانگی و سیب زمینی تازه',
    rating: 4.5,
    deliveryTime: '25-40 دقیقه',
    deliveryFee: '18,000 تومان',
    categories: ['برگر', 'فست فود', 'آمریکایی']
  }
];

// کامپوننت اصلی
const FavoriteRestaurantsPage = () => {
  const [favorites, setFavorites] = useState<Restaurant[]>(sampleFavorites);

  // حذف رستوران از لیست مورد علاقه‌ها
  const handleRemove = (id: string) => {
    setFavorites(prev => prev.filter(restaurant => restaurant.id !== id));
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>رستوران‌های مورد علاقه</PageTitle>
        <PageDescription>
          رستوران‌هایی که به لیست مورد علاقه‌های خود اضافه کرده‌اید
        </PageDescription>
      </PageHeader>

      {favorites.length > 0 ? (
        <RestaurantsGrid>
          {favorites.map(restaurant => (
            <RestaurantCard key={restaurant.id}>
              <RemoveButton onClick={() => handleRemove(restaurant.id)}>
                ❌
              </RemoveButton>
              <RestaurantImageContainer>
                {restaurant.icon}
              </RestaurantImageContainer>
              <RestaurantContent>
                <RestaurantHeader>
                  <RestaurantName href={`/restaurant/${restaurant.id}`}>
                    {restaurant.name}
                  </RestaurantName>
                  <RestaurantRating>
                    <StarIcon>⭐</StarIcon> {restaurant.rating}
                  </RestaurantRating>
                </RestaurantHeader>
                <RestaurantDescription>
                  {restaurant.description}
                </RestaurantDescription>
                <RestaurantMeta>
                  <MetaItem>
                    <span>🕒</span> {restaurant.deliveryTime}
                  </MetaItem>
                  <MetaItem>
                    <span>🚚</span> {restaurant.deliveryFee}
                  </MetaItem>
                </RestaurantMeta>
                <CategoryTags>
                  {restaurant.categories.map((category, index) => (
                    <CategoryTag key={index}>{category}</CategoryTag>
                  ))}
                </CategoryTags>
                <ViewButton href={`/restaurant/${restaurant.id}`}>
                  مشاهده منو
                </ViewButton>
              </RestaurantContent>
            </RestaurantCard>
          ))}
        </RestaurantsGrid>
      ) : (
        <EmptyFavorites>
          <EmptyIcon>❤️</EmptyIcon>
          <EmptyTitle>هنوز رستوران مورد علاقه‌ای ندارید!</EmptyTitle>
          <EmptyDescription>
            رستوران‌های مورد علاقه خود را با کلیک بر روی آیکون قلب در صفحه رستوران‌ها به این لیست اضافه کنید تا دسترسی سریع‌تری به آنها داشته باشید.
          </EmptyDescription>
          <BrowseButton href="/restaurants">
            مشاهده رستوران‌ها
          </BrowseButton>
        </EmptyFavorites>
      )}
    </PageContainer>
  );
};

export default FavoriteRestaurantsPage; 
