"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { vazirmatn } from '@/app/fonts';
import { categories as allCategoriesData } from '@/data/categories';

// تعریف انواع داده
interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

// استایل‌های صفحه
const CategoriesPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  direction: rtl;
  font-family: var(--font-vazirmatn);
`;

const CategoriesHeader = styled.div`
  margin-bottom: 2rem;
`;

const CategoriesTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes['2xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.secondary[500]};
`;

const CategoriesDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[700]};
  margin-bottom: 2rem;
`;

const CategoriesContent = styled.div`
  display: flex;
  flex-direction: row-reverse;
  gap: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    flex-direction: column;
  }
`;

const CategoriesSidebar = styled.div`
  width: 280px;
  flex-shrink: 0;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    width: 100%;
  }
`;

const CategoriesMainContent = styled.div`
  flex: 1;
`;

const FilterSection = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.boxShadow.sm};
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const FilterTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.secondary[500]};
`;

const SearchFilter = styled.div`
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-family: var(--font-vazirmatn);
`;

const FilterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterItem = styled.label`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  cursor: pointer;
`;

const FilterCheckbox = styled.input`
  margin-left: 0.75rem;
  width: 1rem;
  height: 1rem;
  accent-color: ${props => props.theme.colors.primary[500]};
`;

const FilterLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[700]};
`;

const FilterCount = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[500]};
  margin-right: auto;
`;

const ClearFiltersButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: ${props => props.theme.colors.neutral[100]};
  color: ${props => props.theme.colors.neutral[700]};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  margin-top: 1rem;
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-family: var(--font-vazirmatn);
  
  &:hover {
    background-color: ${props => props.theme.colors.neutral[200]};
  }
`;

const SortSection = styled.div`
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

const SortControls = styled.div`
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
  color: ${props => props.theme.colors.neutral[800]};
  font-family: var(--font-vazirmatn);
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const CategoryCard = styled(Link)`
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

const CategoryImageContainer = styled.div`
  height: 160px;
  background-color: ${props => props.theme.colors.primary[400]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
`;

const CategoryContent = styled.div`
  padding: 1.25rem;
`;

const CategoryName = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.secondary[500]};
`;

const CategoryCount = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[600]};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2.5rem;
  gap: 0.5rem;
`;

const PaginationButton = styled.button<{ active?: boolean }>`
  min-width: 2.5rem;
  height: 2.5rem;
  padding: 0 0.75rem;
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.active 
    ? props.theme.colors.primary[500] 
    : props.theme.colors.neutral[300]};
  background-color: ${props => props.active 
    ? props.theme.colors.primary[500] 
    : 'white'};
  color: ${props => props.active 
    ? 'white' 
    : props.theme.colors.neutral[700]};
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-family: var(--font-vazirmatn);
  
  &:hover:not(:disabled) {
    background-color: ${props => props.active 
      ? props.theme.colors.primary[400] 
      : props.theme.colors.neutral[100]};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyResults = styled.div`
  text-align: center;
  padding: 3rem;
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
`;

// داده‌های نمونه
const allCategories = allCategoriesData;

// فیلترهای نمونه
const filters = [
  { id: 'traditional', name: 'غذاهای سنتی' },
  { id: 'fastfood', name: 'فست فود' },
  { id: 'healthy', name: 'غذاهای سالم' },
  { id: 'vegetarian', name: 'گیاهی' },
  { id: 'breakfast', name: 'صبحانه' },
  { id: 'dessert', name: 'دسر و شیرینی' },
  { id: 'drinks', name: 'نوشیدنی‌ها' },
];
// کامپوننت اصلی
const CategoriesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  // فیلتر کردن دسته‌بندی‌ها
  const filteredCategories = allCategories.filter(category => 
    category.name.includes(searchTerm)
  );
  
  // مرتب‌سازی دسته‌بندی‌ها
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (sortBy === 'popularity') {
      return b.count - a.count;
    }
    if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'name-desc') {
      return b.name.localeCompare(a.name);
    }
    return 0;
  });
  
  // صفحه‌بندی
  const totalPages = Math.ceil(sortedCategories.length / itemsPerPage);
  const currentCategories = sortedCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // تغییر فیلترها
  const handleFilterChange = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
    setCurrentPage(1); // بازگشت به صفحه اول بعد از تغییر فیلتر
  };
  
  // پاک کردن همه فیلترها
  const handleClearFilters = () => {
    setSelectedFilters([]);
    setSearchTerm('');
    setCurrentPage(1);
  };
  
  return (
    <CategoriesPageContainer>
      <CategoriesHeader>
        <CategoriesTitle>دسته‌بندی‌های غذایی</CategoriesTitle>
        <CategoriesDescription>
          دسته‌بندی‌های متنوع برای انتخاب غذای مورد علاقه شما
        </CategoriesDescription>
      </CategoriesHeader>
      
      <CategoriesContent>
        <CategoriesSidebar>
          <FilterSection>
            <FilterTitle>جستجو</FilterTitle>
            <SearchFilter>
              <SearchInput 
                type="text" 
                placeholder="جستجوی دسته‌بندی..." 
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </SearchFilter>
          </FilterSection>
          
          <FilterSection>
            <FilterTitle>نوع غذا</FilterTitle>
            <FilterList>
              {filters.map(filter => (
                <FilterItem key={filter.id}>
                  <FilterCheckbox 
                    type="checkbox"
                    checked={selectedFilters.includes(filter.id)}
                    onChange={() => handleFilterChange(filter.id)}
                  />
                  <FilterLabel>{filter.name}</FilterLabel>
                </FilterItem>
              ))}
            </FilterList>
            {(selectedFilters.length > 0 || searchTerm) && (
              <ClearFiltersButton onClick={handleClearFilters}>
                پاک کردن فیلترها
              </ClearFiltersButton>
            )}
          </FilterSection>
        </CategoriesSidebar>
        
        <CategoriesMainContent>
          <SortSection>
            <ResultCount>
              <ResultHighlight>{filteredCategories.length}</ResultHighlight> دسته‌بندی یافت شد
            </ResultCount>
            <SortControls>
              <SortLabel>مرتب‌سازی بر اساس:</SortLabel>
              <SortSelect 
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="popularity">محبوب‌ترین</option>
                <option value="name-asc">حروف الفبا (الف تا ی)</option>
                <option value="name-desc">حروف الفبا (ی تا الف)</option>
              </SortSelect>
            </SortControls>
          </SortSection>
          
          {currentCategories.length > 0 ? (
            <>
              <CategoriesGrid>
                {currentCategories.map(category => (
                  <CategoryCard href={`/categories/${category.id}`} key={category.id}>
                    <CategoryImageContainer>
                      {category.icon}
                    </CategoryImageContainer>
                    <CategoryContent>
                      <CategoryName>{category.name}</CategoryName>
                      <CategoryCount>{category.count} رستوران</CategoryCount>
                    </CategoryContent>
                  </CategoryCard>
                ))}
              </CategoriesGrid>
              
              {totalPages > 1 && (
                <Pagination>
                  <PaginationButton 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    قبلی
                  </PaginationButton>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <PaginationButton
                      key={index}
                      active={currentPage === index + 1 ? true : undefined}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </PaginationButton>
                  ))}
                  
                  <PaginationButton
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    بعدی
                  </PaginationButton>
                </Pagination>
              )}
            </>
          ) : (
            <EmptyResults>
              <EmptyIcon>🍽️</EmptyIcon>
              <EmptyTitle>نتیجه‌ای یافت نشد!</EmptyTitle>
              <EmptyDescription>
                متأسفانه دسته‌بندی‌ای با معیارهای جستجوی شما پیدا نشد. لطفاً معیارهای جستجو را تغییر دهید.
              </EmptyDescription>
              <ClearFiltersButton onClick={handleClearFilters}>
                پاک کردن فیلترها
              </ClearFiltersButton>
            </EmptyResults>
          )}
        </CategoriesMainContent>
      </CategoriesContent>
    </CategoriesPageContainer>
  );
};

export default CategoriesPage; 