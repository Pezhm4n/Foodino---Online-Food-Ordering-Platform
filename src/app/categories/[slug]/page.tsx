"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { vazirmatn } from '@/app/fonts';
import { useParams } from 'next/navigation';

// تعریف انواع داده
interface Restaurant {
  id: string;
  name: string;
  logo: string;
  cover: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: string;
  minOrder: string;
  categories: string[];
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  restaurantId: string;
  restaurantName: string;
  category: string;
}

// استایل‌های صفحه
const CategoryPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  direction: rtl;
  font-family: var(--font-vazirmatn);
`;

const CategoryHeader = styled.div`
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconDisplay = styled.div`
  font-size: 3rem;
  width: 80px;
  height: 80px;
  background-color: ${props => props.theme.colors.primary[100]};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const CategoryTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes['2xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.secondary[500]};
`;

const CategoryDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[700]};
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.neutral[200]};
  margin-bottom: 2rem;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-weight: ${props => props.active 
    ? props.theme.typography.fontWeights.semibold 
    : props.theme.typography.fontWeights.normal};
  color: ${props => props.active 
    ? props.theme.colors.primary[500] 
    : props.theme.colors.neutral[600]};
  border-bottom: 2px solid ${props => props.active 
    ? props.theme.colors.primary[500] 
    : 'transparent'};
  transition: all 0.2s;
  
  &:hover {
    color: ${props => props.theme.colors.primary[400]};
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const FilterGroup = styled.div`
  flex: 1;
  min-width: 200px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 100%;
  }
`;

const FilterLabel = styled.label`
  display: block;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[600]};
  margin-bottom: 0.5rem;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-family: var(--font-vazirmatn);
`;

const SearchContainer = styled.div`
  flex: 2;
  min-width: 300px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-family: var(--font-vazirmatn);
  
  &::placeholder {
    color: ${props => props.theme.colors.neutral[500]};
  }
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const ResultCount = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[700]};
`;

const ResultHighlight = styled.span`
  color: ${props => props.theme.colors.secondary[500]};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
`;

const SortContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SortLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[700]};
`;

const SortSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-family: var(--font-vazirmatn);
`;

const RestaurantsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const RestaurantCard = styled(Link)`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.boxShadow.sm};
  overflow: hidden;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.boxShadow.md};
  }
`;

const RestaurantCover = styled.div`
  height: 150px;
  background-color: ${props => props.theme.colors.primary[400]};
  position: relative;
`;

const LogoContainer = styled.div`
  width: 64px;
  height: 64px;
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: white;
  box-shadow: ${props => props.theme.boxShadow.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: -20px;
  right: 20px;
  font-size: 2rem;
`;

const RestaurantContent = styled.div`
  padding: 1.5rem;
  padding-top: 1.75rem;
`;

const RestaurantName = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.secondary[500]};
`;

const RestaurantInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[600]};
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[600]};
`;

const RatingScore = styled.span`
  color: ${props => props.theme.colors.warning[500]};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
`;

const CategoryTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const CategoryTag = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  background-color: ${props => props.theme.colors.neutral[100]};
  color: ${props => props.theme.colors.neutral[700]};
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
`;

const MenuItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const MenuItemCard = styled(Link)`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.boxShadow.sm};
  overflow: hidden;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.boxShadow.md};
  }
`;

const MenuItemImage = styled.div`
  height: 160px;
  background-color: ${props => props.theme.colors.primary[100]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

const MenuItemContent = styled.div`
  padding: 1.25rem;
`;

const MenuItemName = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.secondary[500]};
`;

const MenuItemRestaurant = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[600]};
  margin-bottom: 0.5rem;
`;

const MenuItemPrice = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.primary[500]};
`;

const LoadMoreButton = styled.button`
  display: block;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: ${props => props.theme.colors.primary[500]};
  border: 1px solid ${props => props.theme.colors.primary[500]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--font-vazirmatn);
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[50]};
  }
`;

const NoResultsContainer = styled.div`
  text-align: center;
  padding: 3rem 1rem;
`;

const NoResultsIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.neutral[400]};
`;

const NoResultsTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  margin-bottom: 0.75rem;
  color: ${props => props.theme.colors.neutral[700]};
`;

const NoResultsDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[600]};
  max-width: 500px;
  margin: 0 auto;
`;

// داده‌های نمونه
const categoryData = {
  'pizza': {
    name: 'پیتزا',
    icon: '🍕',
    description: 'انواع پیتزا‌های خوشمزه و لذیذ با مواد اولیه تازه'
  },
  'burger': {
    name: 'برگر',
    icon: '🍔',
    description: 'برگرهای خوشمزه با گوشت تازه و سس‌های مخصوص'
  },
  'iranian': {
    name: 'غذای ایرانی',
    icon: '🍲',
    description: 'غذاهای سنتی و اصیل ایرانی با طعم خانگی'
  },
  'salad': {
    name: 'سالاد',
    icon: '🥗',
    description: 'سالادهای تازه و مغذی با طعم‌های متنوع'
  },
  'sushi': {
    name: 'سوشی',
    icon: '🍣',
    description: 'انواع سوشی‌های تازه و خوشمزه'
  },
  'drink': {
    name: 'نوشیدنی',
    icon: '🥤',
    description: 'انواع نوشیدنی‌های سرد و گرم'
  }
};

// داده‌های نمونه رستوران‌ها
const restaurants = [
  {
    id: 'r1',
    name: 'پیتزا برتر',
    logo: '🍕',
    cover: '',
    rating: 4.8,
    reviewCount: 124,
    deliveryTime: '۳۰ دقیقه',
    deliveryFee: '۱۵,۰۰۰ تومان',
    minOrder: '۸۰,۰۰۰ تومان',
    categories: ['pizza', 'italian']
  },
  {
    id: 'r2',
    name: 'برگرلند',
    logo: '🍔',
    cover: '',
    rating: 4.5,
    reviewCount: 98,
    deliveryTime: '۲۵ دقیقه',
    deliveryFee: '۱۲,۰۰۰ تومان',
    minOrder: '۷۰,۰۰۰ تومان',
    categories: ['burger', 'fastfood']
  },
  {
    id: 'r3',
    name: 'آشپزخانه ایرانی',
    logo: '🍲',
    cover: '',
    rating: 4.7,
    reviewCount: 156,
    deliveryTime: '۴۰ دقیقه',
    deliveryFee: '۱۰,۰۰۰ تومان',
    minOrder: '۱۰۰,۰۰۰ تومان',
    categories: ['iranian', 'traditional']
  },
  {
    id: 'r4',
    name: 'سالاد بار سبز',
    logo: '🥗',
    cover: '',
    rating: 4.6,
    reviewCount: 87,
    deliveryTime: '۲۰ دقیقه',
    deliveryFee: '۸,۰۰۰ تومان',
    minOrder: '۵۰,۰۰۰ تومان',
    categories: ['salad', 'healthy']
  },
  {
    id: 'r5',
    name: 'سوشی توکیو',
    logo: '🍣',
    cover: '',
    rating: 4.9,
    reviewCount: 78,
    deliveryTime: '۳۵ دقیقه',
    deliveryFee: '۲۰,۰۰۰ تومان',
    minOrder: '۱۲۰,۰۰۰ تومان',
    categories: ['sushi', 'japanese']
  },
  {
    id: 'r6',
    name: 'کافه نوش',
    logo: '☕',
    cover: '',
    rating: 4.7,
    reviewCount: 112,
    deliveryTime: '۱۵ دقیقه',
    deliveryFee: '۵,۰۰۰ تومان',
    minOrder: '۳۰,۰۰۰ تومان',
    categories: ['drink', 'coffee']
  }
];

// داده‌های نمونه غذاها
const menuItems = [
  {
    id: 'm1',
    name: 'پیتزا مخصوص',
    description: 'پیتزا با خمیر تازه، سس مخصوص، پنیر موزارلا، قارچ، فلفل دلمه و کالباس',
    price: '۱۲۰,۰۰۰ تومان',
    image: '🍕',
    restaurantId: 'r1',
    restaurantName: 'پیتزا برتر',
    category: 'pizza'
  },
  {
    id: 'm2',
    name: 'چیزبرگر',
    description: 'برگر گوشت گوساله با پنیر چدار، کاهو، گوجه و سس مخصوص',
    price: '۹۵,۰۰۰ تومان',
    image: '🍔',
    restaurantId: 'r2',
    restaurantName: 'برگرلند',
    category: 'burger'
  },
  {
    id: 'm3',
    name: 'چلو کباب کوبیده',
    description: 'دو سیخ کباب کوبیده گوشت گوساله با برنج ایرانی و گوجه کبابی',
    price: '۱۵۰,۰۰۰ تومان',
    image: '🍖',
    restaurantId: 'r3',
    restaurantName: 'آشپزخانه ایرانی',
    category: 'iranian'
  },
  {
    id: 'm4',
    name: 'سالاد سزار',
    description: 'کاهو رومن، سینه مرغ گریل شده، نان سیر، سس سزار و پنیر پارمسان',
    price: '۸۰,۰۰۰ تومان',
    image: '🥗',
    restaurantId: 'r4',
    restaurantName: 'سالاد بار سبز',
    category: 'salad'
  },
  {
    id: 'm5',
    name: 'سوشی ماکی',
    description: 'رول سوشی با برنج ژاپنی، ماهی سالمون و آووکادو',
    price: '۱۴۰,۰۰۰ تومان',
    image: '🍣',
    restaurantId: 'r5',
    restaurantName: 'سوشی توکیو',
    category: 'sushi'
  },
  {
    id: 'm6',
    name: 'آیس لته',
    description: 'قهوه اسپرسو با شیر و یخ',
    price: '۴۵,۰۰۰ تومان',
    image: '☕',
    restaurantId: 'r6',
    restaurantName: 'کافه نوش',
    category: 'drink'
  }
];

const CategoryPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  
  const [activeTab, setActiveTab] = useState('restaurants');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('rating');
  
  // فیلتر کردن رستوران‌ها براساس دسته‌بندی
  const filteredRestaurants = restaurants.filter(restaurant => 
    restaurant.categories.includes(slug)
  );
  
  // فیلتر کردن آیتم‌های منو براساس دسته‌بندی
  const filteredMenuItems = menuItems.filter(item => 
    item.category === slug
  );
  
  // اطلاعات دسته‌بندی فعلی
  const currentCategory = categoryData[slug as keyof typeof categoryData] || {
    name: 'دسته‌بندی',
    icon: '🍽️',
    description: 'رستوران‌ها و غذاهای مرتبط با این دسته‌بندی'
  };
  
  return (
    <CategoryPageContainer>
      <CategoryHeader>
        <IconDisplay>
          {currentCategory.icon}
        </IconDisplay>
        <HeaderContent>
          <CategoryTitle>{currentCategory.name}</CategoryTitle>
          <CategoryDescription>{currentCategory.description}</CategoryDescription>
        </HeaderContent>
      </CategoryHeader>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'restaurants'} 
          onClick={() => setActiveTab('restaurants')}
        >
          رستوران‌ها
        </Tab>
        <Tab 
          active={activeTab === 'foods'} 
          onClick={() => setActiveTab('foods')}
        >
          غذاها
        </Tab>
      </TabsContainer>
      
      <FiltersContainer>
        <SearchContainer>
          <FilterLabel>جستجو</FilterLabel>
          <SearchInput 
            type="text" 
            placeholder={`جستجو در ${currentCategory.name}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        
        {activeTab === 'restaurants' && (
          <>
            <FilterGroup>
              <FilterLabel>ترتیب نمایش</FilterLabel>
              <FilterSelect 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="rating">امتیاز (بالاترین)</option>
                <option value="deliveryTime">زمان تحویل (سریع‌ترین)</option>
                <option value="minOrder">حداقل سفارش (کمترین)</option>
              </FilterSelect>
            </FilterGroup>
          </>
        )}
        
        {activeTab === 'foods' && (
          <>
            <FilterGroup>
              <FilterLabel>ترتیب نمایش</FilterLabel>
              <FilterSelect 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="priceAsc">قیمت (کمترین)</option>
                <option value="priceDesc">قیمت (بیشترین)</option>
                <option value="restaurant">رستوران</option>
              </FilterSelect>
            </FilterGroup>
          </>
        )}
      </FiltersContainer>
      
      <ResultsHeader>
        <ResultCount>
          {activeTab === 'restaurants' 
            ? <><ResultHighlight>{filteredRestaurants.length}</ResultHighlight> رستوران در دسته‌بندی <ResultHighlight>{currentCategory.name}</ResultHighlight></>
            : <><ResultHighlight>{filteredMenuItems.length}</ResultHighlight> غذا در دسته‌بندی <ResultHighlight>{currentCategory.name}</ResultHighlight></>
          }
        </ResultCount>
      </ResultsHeader>
      
      {activeTab === 'restaurants' ? (
        <>
          {filteredRestaurants.length > 0 ? (
            <RestaurantsGrid>
              {filteredRestaurants.map(restaurant => (
                <RestaurantCard key={restaurant.id} href={`/restaurant/${restaurant.id}`}>
                  <RestaurantCover>
                    <LogoContainer>{restaurant.logo}</LogoContainer>
                  </RestaurantCover>
                  <RestaurantContent>
                    <RestaurantName>{restaurant.name}</RestaurantName>
                    <RestaurantInfo>
                      <Rating>
                        <span>⭐</span>
                        <RatingScore>{restaurant.rating}</RatingScore>
                        <span>({restaurant.reviewCount})</span>
                      </Rating>
                      <InfoItem>
                        <span>🚚</span>
                        <span>{restaurant.deliveryTime}</span>
                      </InfoItem>
                      <InfoItem>
                        <span>💰</span>
                        <span>حداقل سفارش: {restaurant.minOrder}</span>
                      </InfoItem>
                    </RestaurantInfo>
                    <CategoryTags>
                      {restaurant.categories.map(cat => (
                        <CategoryTag key={cat}>
                          {categoryData[cat as keyof typeof categoryData]?.name || cat}
                        </CategoryTag>
                      ))}
                    </CategoryTags>
                  </RestaurantContent>
                </RestaurantCard>
              ))}
            </RestaurantsGrid>
          ) : (
            <NoResultsContainer>
              <NoResultsIcon>🔍</NoResultsIcon>
              <NoResultsTitle>هیچ رستورانی یافت نشد</NoResultsTitle>
              <NoResultsDescription>
                متأسفانه هیچ رستورانی در این دسته‌بندی یافت نشد. لطفاً فیلترهای خود را تغییر دهید یا دسته‌بندی دیگری را امتحان کنید.
              </NoResultsDescription>
            </NoResultsContainer>
          )}
        </>
      ) : (
        <>
          {filteredMenuItems.length > 0 ? (
            <MenuItemsGrid>
              {filteredMenuItems.map(item => (
                <MenuItemCard key={item.id} href={`/restaurant/${item.restaurantId}?item=${item.id}`}>
                  <MenuItemImage>{item.image}</MenuItemImage>
                  <MenuItemContent>
                    <MenuItemName>{item.name}</MenuItemName>
                    <MenuItemRestaurant>{item.restaurantName}</MenuItemRestaurant>
                    <MenuItemPrice>{item.price}</MenuItemPrice>
                  </MenuItemContent>
                </MenuItemCard>
              ))}
            </MenuItemsGrid>
          ) : (
            <NoResultsContainer>
              <NoResultsIcon>🔍</NoResultsIcon>
              <NoResultsTitle>هیچ غذایی یافت نشد</NoResultsTitle>
              <NoResultsDescription>
                متأسفانه هیچ غذایی در این دسته‌بندی یافت نشد. لطفاً فیلترهای خود را تغییر دهید یا دسته‌بندی دیگری را امتحان کنید.
              </NoResultsDescription>
            </NoResultsContainer>
          )}
        </>
      )}
    </CategoryPageContainer>
  );
};

export default CategoryPage; 