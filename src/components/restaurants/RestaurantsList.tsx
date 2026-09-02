"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ResultCount = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[700]};
`;

const SortContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SortLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[700]};
`;

const SortSelect = styled.select`
  padding: 0.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  background-color: white;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[900]};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
  }
`;

const RestaurantCard = styled.div`
  display: flex;
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${props => props.theme.boxShadow.md};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.boxShadow.lg};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const CardImage = styled.div`
  width: 250px;
  background-color: ${props => props.theme.colors.primary[400]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${props => props.theme.typography.fontSizes['3xl']};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 100%;
    height: 200px;
  }
`;

const CardContent = styled.div`
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const RestaurantInfo = styled.div``;

const RestaurantName = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.secondary[500]};
  margin-bottom: 0.25rem;
`;

const RestaurantType = styled.span`
  display: block;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[700]};
  margin-bottom: 0.5rem;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${props => props.theme.colors.neutral[50]};
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
`;

const RatingScore = styled.span`
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.secondary[500]};
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

const CardDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[700]};
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const RestaurantMeta = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[700]};
`;

const ViewButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1.5rem;
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[400]};
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PageButton = styled.button<{ $isActive?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  border-radius: 8px;
  margin: 0 4px;
  font-size: 14px;
  font-weight: ${props => props.$isActive ? props.theme.typography.fontWeights.bold : props.theme.typography.fontWeights.medium};
  border: 1px solid ${props => props.$isActive ? props.theme.colors.primary[500] : props.theme.colors.neutral[300]};
  background-color: ${props => props.$isActive ? props.theme.colors.primary[500] : 'white'};
  color: ${props => props.$isActive ? 'white' : props.theme.colors.neutral[700]};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    border-color: ${props => props.theme.colors.primary[500]};
    color: ${props => props.$isActive ? 'white' : props.theme.colors.primary[500]};
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

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
    slug: 'best-pizza'
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
    slug: 'traditional-iranian'
  },
  {
    id: 3,
    name: 'سوشی تاکو',
    type: 'ژاپنی',
    icon: '🍣',
    rating: 4.5,
    tags: ['سوشی', 'ساشیمی', 'رامن'],
    description: 'اولین رستوران تخصصی سوشی در منطقه با طعم اصیل ژاپنی و مواد اولیه تازه. ما هر روز مواد اولیه را تازه تهیه می‌کنیم.',
    deliveryTime: '35-50 دقیقه',
    minOrder: '۱۰۰,۰۰۰ تومان',
    slug: 'sushi-tako'
  },
  {
    id: 4,
    name: 'سالاد و اسموتی سبز',
    type: 'سالم و ارگانیک',
    icon: '🥗',
    rating: 4.7,
    tags: ['سالاد', 'اسموتی', 'دسر'],
    description: 'غذاهای سالم و ارگانیک برای سبک زندگی سالم. تمام مواد اولیه ما ارگانیک و تازه هستند.',
    deliveryTime: '20-35 دقیقه',
    minOrder: '۶۰,۰۰۰ تومان',
    slug: 'green-salad'
  },
  {
    id: 5,
    name: 'کباب خان',
    type: 'کباب',
    icon: '🥩',
    rating: 4.9,
    tags: ['کباب برگ', 'کباب کوبیده', 'جوجه کباب'],
    description: 'بهترین کباب‌های شهر با گوشت تازه و باکیفیت. کباب‌های ما همگی روی آتش ذغال پخته می‌شوند.',
    deliveryTime: '35-45 دقیقه',
    minOrder: '۹۰,۰۰۰ تومان',
    slug: 'kabab-khan'
  },
];

const RestaurantsList = () => {
  const [sortOption, setSortOption] = useState('rating');
  const [currentPage, setCurrentPage] = useState(1);
  
  const sortedRestaurants = [...restaurantsData].sort((a, b) => {
    if (sortOption === 'rating') {
      return b.rating - a.rating;
    } else if (sortOption === 'deliveryTime') {
      return parseInt(a.deliveryTime.split('-')[0]) - parseInt(b.deliveryTime.split('-')[0]);
    }
    return 0;
  });
  
  const totalPages = Math.ceil(sortedRestaurants.length / 5);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <ListContainer>
      <ListHeader>
        <ResultCount>{sortedRestaurants.length} رستوران یافت شد</ResultCount>
        <SortContainer>
          <SortLabel>مرتب‌سازی بر اساس:</SortLabel>
          <SortSelect value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="rating">محبوب‌ترین</option>
            <option value="deliveryTime">سریع‌ترین ارسال</option>
          </SortSelect>
        </SortContainer>
      </ListHeader>
      
      {sortedRestaurants.map(restaurant => (
        <RestaurantCard key={restaurant.id}>
          <CardImage>
            {restaurant.icon}
          </CardImage>
          <CardContent>
            <CardHeader>
              <RestaurantInfo>
                <RestaurantName>{restaurant.name}</RestaurantName>
                <RestaurantType>{restaurant.type}</RestaurantType>
              </RestaurantInfo>
              <Rating>
                <span>★</span>
                <RatingScore>{restaurant.rating}</RatingScore>
              </Rating>
            </CardHeader>
            
            <TagsContainer>
              {restaurant.tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </TagsContainer>
            
            <CardDescription>{restaurant.description}</CardDescription>
            
            <CardFooter>
              <RestaurantMeta>
                <MetaItem>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  زمان تحویل: {restaurant.deliveryTime}
                </MetaItem>
                <MetaItem>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  حداقل سفارش: {restaurant.minOrder}
                </MetaItem>
              </RestaurantMeta>
              
              <ViewButton href={`/restaurants/${restaurant.slug}`}>
                مشاهده منو
              </ViewButton>
            </CardFooter>
          </CardContent>
        </RestaurantCard>
      ))}
      
      {totalPages > 1 && (
        <PaginationContainer>
          <PageButton 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="صفحه قبلی"
          >
            &gt;
          </PageButton>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <PageButton 
              key={page} 
              $isActive={page === currentPage}
              data-active={page === currentPage}
              onClick={() => handlePageChange(page)}
              aria-label={`صفحه ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </PageButton>
          ))}
          
          <PageButton 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="صفحه بعدی"
          >
            &lt;
          </PageButton>
        </PaginationContainer>
      )}
    </ListContainer>
  );
};

export default RestaurantsList; 