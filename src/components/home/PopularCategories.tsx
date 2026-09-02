"use client";

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const SectionContainer = styled.section`
  padding: 4rem 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 2.25rem 1rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 1.5rem 0.875rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes['3xl']};
  font-weight: 800;
  color: ${props => props.theme.colors.neutral[900]};
  text-align: center;
  margin-bottom: 0.5rem;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1.5rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 1.25rem;
    margin-bottom: 0.35rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  color: ${props => props.theme.colors.neutral[600]};
  text-align: center;
  max-width: 700px;
  margin: 0 auto 2.5rem;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 0.8rem;
    margin-bottom: 1rem;
  }
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    gap: 1rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.6rem;
  }
`;

const CategoryCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 1.25rem;
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  background-color: white;
  border: 1px solid ${props => props.theme.colors.neutral[200]};
  transition: all 0.2s ease;
  text-decoration: none;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 0.75rem 0.5rem;
    border-radius: 0.85rem;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 18px -4px rgba(255, 90, 0, 0.12), 0 4px 8px -2px rgba(0, 0, 0, 0.04);
    border-color: ${props => props.theme.colors.primary[300]};
  }

  &:active {
    transform: scale(0.97);
  }
`;

const IconContainer = styled.div`
  width: 72px;
  height: 72px;
  position: relative;
  margin-bottom: 0.85rem;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary[50]} 0%, ${props => props.theme.colors.primary[100]} 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.25rem;
  transition: transform 0.2s ease;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 48px;
    height: 48px;
    font-size: 1.5rem;
    margin-bottom: 0.4rem;
  }
`;

const CategoryName = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.neutral[900]};
  margin-bottom: 0.35rem;
  text-align: center;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 0.85rem;
    font-weight: 700;
    margin-bottom: 0.15rem;
  }
`;

const ItemCount = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[500]};

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 0.7rem;
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