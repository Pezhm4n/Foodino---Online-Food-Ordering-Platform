"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { vazirmatn } from '@/app/fonts';

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
  priceRange: string;
  minOrder: string;
}

interface MenuItem {
  id: string;
  name: string;
  restaurantId: string;
  restaurantName: string;
  price: number;
  description: string;
  icon: string;
}

interface FilterOption {
  id: string;
  label: string;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes['2xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.secondary[500]};
`;

const SearchInfo = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[700]};
`;

const SearchHighlight = styled.span`
  color: ${props => props.theme.colors.primary[500]};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FiltersContainer = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.boxShadow.sm};
  height: fit-content;
  position: sticky;
  top: 2rem;
`;

const FilterSection = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.secondary[500]};
`;

const FilterOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FilterOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[700]};
  cursor: pointer;
`;

const FilterCheckbox = styled.input`
  width: 1rem;
  height: 1rem;
  cursor: pointer;
`;

const ClearFilters = styled.button`
  width: 100%;
  padding: 0.75rem 0;
  background-color: transparent;
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  color: ${props => props.theme.colors.neutral[700]};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.neutral[100]};
  }
`;

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ResultControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const ResultsCount = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[700]};
`;

const SortContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SortLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[700]};
`;

const SortSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[800]};
  background-color: white;
  cursor: pointer;
`;

const RestaurantCard = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.boxShadow.sm};
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.boxShadow.md};
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const RestaurantImageContainer = styled.div`
  background-color: ${props => props.theme.colors.primary[400]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
  min-height: 200px;
  
  @media (max-width: 576px) {
    min-height: 150px;
  }
`;

const RestaurantContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
`;

const RestaurantHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const RestaurantNameContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const RestaurantName = styled(Link)`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.secondary[500]};
  text-decoration: none;
  margin-bottom: 0.25rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const RestaurantCategories = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const CategoryTag = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  background-color: ${props => props.theme.colors.neutral[100]};
  color: ${props => props.theme.colors.neutral[700]};
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
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
  flex-grow: 1;
`;

const RestaurantMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  font-size: ${props => props.theme.typography.fontSizes.sm};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${props => props.theme.colors.neutral[700]};
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
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[600]};
  }
`;

// اضافه کردن کامپوننت‌های مورد نیاز برای بخش نتایج
const NoResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  text-align: center;
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.boxShadow.md};
`;

const NoResultsIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const NoResultsTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.neutral["700"]};
`;

const NoResultsDescription = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.neutral["500"]};
  max-width: 400px;
`;

const SearchSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.neutral["700"]};
`;

const RestaurantsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MenuItemsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const MenuItemCard = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${props => props.theme.boxShadow.md};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.boxShadow.lg};
  }
`;

const MenuItemLink = styled(Link)`
  display: flex;
  padding: 1rem;
  text-decoration: none;
  color: inherit;
`;

const MenuItemImage = styled.div`
  width: 80px;
  height: 80px;
  background-color: ${props => props.theme.colors.neutral["100"]};
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 1rem;
  font-size: 2rem;
`;

const MenuItemInfo = styled.div`
  flex: 1;
`;

const MenuItemName = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: ${props => props.theme.colors.neutral["800"]};
`;

const MenuItemRestaurant = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.primary["500"]};
  margin-bottom: 0.5rem;
`;

const MenuItemPrice = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.neutral["700"]};
`;

// داده‌های نمونه
const sampleRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'پیتزا شیکاگو',
    icon: '🍕',
    description: 'بهترین پیتزا ایتالیایی با خمیر تازه و مواد درجه یک، طعم بی‌نظیر و خدمات عالی',
    rating: 4.8,
    deliveryTime: '30-45 دقیقه',
    deliveryFee: '15,000 تومان',
    categories: ['پیتزا', 'فست فود', 'ایتالیایی'],
    priceRange: 'متوسط',
    minOrder: '50,000 تومان'
  },
  {
    id: '2',
    name: 'کباب سرای سنتی',
    icon: '🍢',
    description: 'انواع کباب‌های سنتی ایرانی با گوشت تازه و نان داغ، بهترین مزه کباب کوبیده و برگ',
    rating: 4.6,
    deliveryTime: '40-55 دقیقه',
    deliveryFee: '20,000 تومان',
    categories: ['کباب', 'ایرانی', 'سنتی'],
    priceRange: 'گران',
    minOrder: '80,000 تومان'
  },
  {
    id: '3',
    name: 'سوشی تاکه',
    icon: '🍣',
    description: 'سوشی‌های ژاپنی اصیل با مواد تازه و سس‌های مخصوص، طعم واقعی ژاپن',
    rating: 4.7,
    deliveryTime: '35-50 دقیقه',
    deliveryFee: '25,000 تومان',
    categories: ['سوشی', 'ژاپنی', 'دریایی'],
    priceRange: 'گران',
    minOrder: '100,000 تومان'
  },
  {
    id: '4',
    name: 'برگر کینگ',
    icon: '🍔',
    description: 'انواع برگرهای آمریکایی با سس‌های خانگی و سیب زمینی تازه، طعم اصیل برگر',
    rating: 4.5,
    deliveryTime: '25-40 دقیقه',
    deliveryFee: '18,000 تومان',
    categories: ['برگر', 'فست فود', 'آمریکایی'],
    priceRange: 'ارزان',
    minOrder: '40,000 تومان'
  },
  {
    id: '5',
    name: 'فلافل خوشمزه',
    icon: '🧆',
    description: 'بهترین فلافل‌های خانگی با طعم مخصوص و سس تند عربی، لذت یک غذای گیاهی',
    rating: 4.3,
    deliveryTime: '20-35 دقیقه',
    deliveryFee: '10,000 تومان',
    categories: ['فلافل', 'فست فود', 'گیاهی'],
    priceRange: 'ارزان',
    minOrder: '30,000 تومان'
  }
];

const categoryFilters: FilterOption[] = [
  { id: 'pizza', label: 'پیتزا' },
  { id: 'fastfood', label: 'فست فود' },
  { id: 'kebab', label: 'کباب' },
  { id: 'traditional', label: 'سنتی' },
  { id: 'seafood', label: 'دریایی' },
  { id: 'vegetarian', label: 'گیاهی' }
];

const priceFilters: FilterOption[] = [
  { id: 'cheap', label: 'ارزان' },
  { id: 'medium', label: 'متوسط' },
  { id: 'expensive', label: 'گران' }
];

const deliveryTimeFilters: FilterOption[] = [
  { id: 'under30', label: 'کمتر از 30 دقیقه' },
  { id: '30to45', label: 'بین 30 تا 45 دقیقه' },
  { id: 'over45', label: 'بیشتر از 45 دقیقه' }
];

// تابع فرمت‌بندی قیمت
const formatPrice = (price: number) => {
  return price.toLocaleString('fa-IR') + ' تومان';
};

// کامپوننت اصلی
const SearchPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState<'all' | 'restaurants' | 'menu'>('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const query = searchParams.get('q') || '';
    const filter = searchParams.get('filter') || 'all';
    const tab = searchParams.get('tab') || 'all';
    
    setSearchQuery(query);
    setActiveFilter(filter);
    setActiveTab(tab as 'all' | 'restaurants' | 'menu');
    
    // در حالت واقعی، اینجا از API برای جستجو استفاده می‌شود
    const fetchResults = () => {
      setLoading(true);
      
      // شبیه‌سازی تاخیر شبکه
      setTimeout(() => {
        // جستجو در رستوران‌ها
        const filteredRestaurants = sampleRestaurants.filter(restaurant => {
          // فیلتر بر اساس دسته‌بندی
          const matchesFilter = filter === 'all' || restaurant.categories.includes(
            categoryFilters.find(f => f.id === filter)?.label || ''
          );
          
          // جستجو بر اساس متن
          const matchesQuery = !query || 
            restaurant.name.includes(query) || 
            restaurant.description.includes(query) ||
            restaurant.categories.some(cat => cat.includes(query));
          
          return matchesFilter && matchesQuery;
        });
        
        // جستجو در منوی غذاها
        const filteredMenuItems = menuItems.filter(item => {
          // فیلتر بر اساس رستوران‌های فیلتر شده
          const restaurantMatches = filteredRestaurants.some(r => r.id === item.restaurantId);
          
          // جستجو بر اساس متن
          const matchesQuery = !query || 
            item.name.includes(query) || 
            item.description.includes(query);
          
          return restaurantMatches && matchesQuery;
        });
        
        setRestaurants(filteredRestaurants);
        setMenuItems(filteredMenuItems);
        setLoading(false);
      }, 500);
    };
    
    fetchResults();
  }, [searchParams]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (activeFilter !== 'all') params.set('filter', activeFilter);
    if (activeTab !== 'all') params.set('tab', activeTab);
    
    const queryString = params.toString();
    router.push(`/search${queryString ? '?' + queryString : ''}`);
  };
  
  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
    
    const params = new URLSearchParams(searchParams.toString());
    if (filterId !== 'all') {
      params.set('filter', filterId);
    } else {
      params.delete('filter');
    }
    
    router.push(`/search?${params.toString()}`);
  };
  
  const handleTabChange = (tab: 'all' | 'restaurants' | 'menu') => {
    setActiveTab(tab);
    
    const params = new URLSearchParams(searchParams.toString());
    if (tab !== 'all') {
      params.set('tab', tab);
    } else {
      params.delete('tab');
    }
    
    router.push(`/search?${params.toString()}`);
  };
  
  const hasRestaurants = restaurants.length > 0;
  const hasMenuItems = menuItems.length > 0;
  const hasResults = hasRestaurants || hasMenuItems;
  const showRestaurants = activeTab === 'all' || activeTab === 'restaurants';
  const showMenuItems = activeTab === 'all' || activeTab === 'menu';
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>نتایج جستجو</PageTitle>
        {searchQuery && (
          <SearchInfo>
            نتایج جستجو برای: <SearchHighlight>{searchQuery}</SearchHighlight>
          </SearchInfo>
        )}
      </PageHeader>
      
      <ContentContainer>
        <FiltersContainer>
          <FilterSection>
            <FilterTitle>دسته‌بندی</FilterTitle>
            <FilterOptions>
              {categoryFilters.map(category => (
                <FilterOption key={category.id}>
                  <FilterCheckbox 
                    type="checkbox" 
                    id={`category-${category.id}`}
                    checked={activeFilter === category.id}
                    onChange={() => handleFilterChange(category.id)}
                  />
                  {category.label}
                </FilterOption>
              ))}
            </FilterOptions>
          </FilterSection>
          
          <FilterSection>
            <FilterTitle>سطح قیمت</FilterTitle>
            <FilterOptions>
              {priceFilters.map(price => (
                <FilterOption key={price.id}>
                  <FilterCheckbox 
                    type="checkbox" 
                    id={`price-${price.id}`}
                    checked={activeFilter === price.id}
                    onChange={() => handleFilterChange(price.id)}
                  />
                  {price.label}
                </FilterOption>
              ))}
            </FilterOptions>
          </FilterSection>
          
          <FilterSection>
            <FilterTitle>زمان تحویل</FilterTitle>
            <FilterOptions>
              {deliveryTimeFilters.map(time => (
                <FilterOption key={time.id}>
                  <FilterCheckbox 
                    type="checkbox" 
                    id={`time-${time.id}`}
                    checked={activeFilter === time.id}
                    onChange={() => handleFilterChange(time.id)}
                  />
                  {time.label}
                </FilterOption>
              ))}
            </FilterOptions>
          </FilterSection>
          
          <ClearFilters onClick={() => handleFilterChange('all')}>
            حذف همه فیلترها
          </ClearFilters>
        </FiltersContainer>
        
        <ResultsContainer>
          <ResultControls>
            <ResultsCount>
              {restaurants.length + menuItems.length} رستوران یافت شد
            </ResultsCount>
            
            <SortContainer>
              <SortLabel>مرتب‌سازی:</SortLabel>
              <SortSelect 
                value={activeFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
              >
                <option value="rating">محبوب‌ترین</option>
                <option value="deliveryTime">سریع‌ترین ارسال</option>
                <option value="deliveryFee">کمترین هزینه ارسال</option>
              </SortSelect>
            </SortContainer>
          </ResultControls>
          
          {loading ? (
            <NoResultsContainer>
              <NoResultsIcon>⏳</NoResultsIcon>
              <NoResultsTitle>در حال جستجو...</NoResultsTitle>
              <NoResultsDescription>
                لطفاً منتظر بمانید...
              </NoResultsDescription>
            </NoResultsContainer>
          ) : !hasResults ? (
            <NoResultsContainer>
              <NoResultsIcon>🔍</NoResultsIcon>
              <NoResultsTitle>نتیجه‌ای یافت نشد</NoResultsTitle>
              <NoResultsDescription>
                متأسفانه نتیجه‌ای برای جستجوی شما یافت نشد. لطفاً از کلمات کلیدی دیگری استفاده کنید.
              </NoResultsDescription>
            </NoResultsContainer>
          ) : (
            <>
              {showRestaurants && hasRestaurants && (
                <SearchSection>
                  <SectionTitle>
                    رستوران‌ها ({restaurants.length})
                  </SectionTitle>
                  <RestaurantsList>
                    {restaurants.map(restaurant => (
                      <RestaurantCard key={restaurant.id}>
                        <RestaurantImageContainer>
                          {restaurant.icon}
                        </RestaurantImageContainer>
                        <RestaurantContent>
                          <RestaurantHeader>
                            <RestaurantNameContainer>
                              <RestaurantName href={`/restaurant/${restaurant.id}`}>
                                {restaurant.name}
                              </RestaurantName>
                              <RestaurantCategories>
                                {restaurant.categories.map((category, idx) => (
                                  <CategoryTag key={idx}>{category}</CategoryTag>
                                ))}
                              </RestaurantCategories>
                            </RestaurantNameContainer>
                            <RestaurantRating>
                              <span>⭐</span>
                              <span>{restaurant.rating}</span>
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
                          <ViewButton href={`/restaurant/${restaurant.id}`}>
                            مشاهده منو
                          </ViewButton>
                        </RestaurantContent>
                      </RestaurantCard>
                    ))}
                  </RestaurantsList>
                </SearchSection>
              )}
              
              {showMenuItems && hasMenuItems && (
                <SearchSection>
                  <SectionTitle>
                    منوی غذایی ({menuItems.length})
                  </SectionTitle>
                  <MenuItemsList>
                    {menuItems.map(item => (
                      <MenuItemCard key={item.id}>
                        <MenuItemLink href={`/restaurant/${item.restaurantId}?item=${item.id}`}>
                          <MenuItemImage>
                            {item.icon}
                          </MenuItemImage>
                          <MenuItemInfo>
                            <MenuItemName>{item.name}</MenuItemName>
                            <MenuItemRestaurant>{item.restaurantName}</MenuItemRestaurant>
                            <MenuItemPrice>{formatPrice(item.price)}</MenuItemPrice>
                          </MenuItemInfo>
                        </MenuItemLink>
                      </MenuItemCard>
                    ))}
                  </MenuItemsList>
                </SearchSection>
              )}
            </>
          )}
        </ResultsContainer>
      </ContentContainer>
    </PageContainer>
  );
};

export default SearchPage; 