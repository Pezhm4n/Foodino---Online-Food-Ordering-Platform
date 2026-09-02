"use client";

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const SectionContainer = styled.section`
  padding: 4rem 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 2.5rem 1rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes['3xl']};
  font-weight: 800;
  color: ${props => props.theme.colors.neutral[900]};
  text-align: center;
  margin-bottom: 0.75rem;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 1.45rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  color: ${props => props.theme.colors.neutral[600]};
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3rem;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 0.9rem;
    margin-bottom: 1.75rem;
  }
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    gap: 1.25rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
`;

const CategoryCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  background-color: white;
  border: 1px solid ${props => props.theme.colors.neutral[200]};
  transition: all 0.3s ease;
  text-decoration: none;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 1rem 0.75rem;
    border-radius: 1rem;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px -4px rgba(255, 90, 0, 0.12), 0 8px 16px -4px rgba(0, 0, 0, 0.04);
    border-color: ${props => props.theme.colors.primary[300]};
  }
`;

const IconContainer = styled.div`
  width: 80px;
  height: 80px;
  position: relative;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary[50]} 0%, ${props => props.theme.colors.primary[100]} 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  transition: transform 0.3s ease;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 60px;
    height: 60px;
    font-size: 1.85rem;
    margin-bottom: 0.6rem;
  }
`;

const CategoryName = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.neutral[900]};
  margin-bottom: 0.5rem;
  text-align: center;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 0.95rem;
    margin-bottom: 0.25rem;
  }
`;

const ItemCount = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[500]};

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 0.75rem;
  }
`;

export interface CategoryItem {
  id: string | number;
  name: string;
  icon: string;
  slug: string;
  count?: number | string;
}

// دسته‌بندی‌های استاندارد همگام با دیتابیس
const defaultCategories: CategoryItem[] = [
  {
    id: '10000000-0000-4000-8000-000000000001',
    name: 'پیتزا',
    icon: '🍕',
    count: 1,
    slug: 'pizza',
  },
  {
    id: '10000000-0000-4000-8000-000000000002',
    name: 'برگر',
    icon: '🍔',
    count: 1,
    slug: 'burger',
  },
  {
    id: '10000000-0000-4000-8000-000000000003',
    name: 'غذای ایرانی',
    icon: '🍚',
    count: 1,
    slug: 'iranian',
  },
  {
    id: '10000000-0000-4000-8000-000000000004',
    name: 'سوشی',
    icon: '🍣',
    count: 1,
    slug: 'sushi',
  },
  {
    id: '10000000-0000-4000-8000-000000000005',
    name: 'غذای سالم',
    icon: '🥗',
    count: 1,
    slug: 'healthy',
  },
];

const formatCount = (count?: number | string) => {
  if (count === undefined || count === null) return 'مشاهده رستوران‌ها';
  if (typeof count === 'number') {
    if (count === 0) return 'به زودی';
    return `${count.toLocaleString('fa-IR')} رستوران`;
  }
  return count;
};

interface PopularCategoriesProps {
  initialCategories?: CategoryItem[];
}

const PopularCategories = ({ initialCategories }: PopularCategoriesProps) => {
  const displayCategories = initialCategories && initialCategories.length > 0 
    ? initialCategories 
    : defaultCategories;

  return (
    <SectionContainer>
      <SectionTitle>دسته‌بندی‌های محبوب</SectionTitle>
      <SectionSubtitle>
        از میان دسته‌بندی‌های مختلف، غذای مورد علاقه خود را انتخاب کنید
      </SectionSubtitle>
      
      <CategoriesGrid>
        {displayCategories.map((category) => (
          <CategoryCard key={category.id} href={`/categories/${category.slug}`}>
            <IconContainer>
              {category.icon}
            </IconContainer>
            <CategoryName>{category.name}</CategoryName>
            <ItemCount>{formatCount(category.count)}</ItemCount>
          </CategoryCard>
        ))}
      </CategoriesGrid>
    </SectionContainer>
  );
};

export default PopularCategories; 