"use client";

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const SectionContainer = styled.section`
  padding: 4rem 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 3rem 1rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes['3xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.secondary[500]};
  text-align: center;
  margin-bottom: 1rem;
`;

const SectionSubtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  color: ${props => props.theme.colors.neutral[700]};
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3rem;
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const CategoryCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.boxShadow.md};
  background-color: white;
  transition: all 0.3s ease;
  text-decoration: none;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.boxShadow.lg};
  }
`;

const IconContainer = styled.div`
  width: 80px;
  height: 80px;
  position: relative;
  margin-bottom: 1rem;
  background-color: ${props => props.theme.colors.neutral[100]};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary[500]};
  font-size: ${props => props.theme.typography.fontSizes.lg};
`;

const CategoryName = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.neutral[900]};
  margin-bottom: 0.5rem;
  text-align: center;
`;

const ItemCount = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[500]};
`;

// داده‌های نمونه برای دسته‌بندی‌ها
const categories = [
  {
    id: 1,
    name: 'پیتزا',
    icon: '🍕',
    count: '48 رستوران',
    slug: 'pizza'
  },
  {
    id: 2,
    name: 'برگر',
    icon: '🍔',
    count: '32 رستوران',
    slug: 'burger'
  },
  {
    id: 3,
    name: 'غذای ایرانی',
    icon: '🍲',
    count: '56 رستوران',
    slug: 'iranian'
  },
  {
    id: 4,
    name: 'سالاد',
    icon: '🥗',
    count: '24 رستوران',
    slug: 'salad'
  },
  {
    id: 5,
    name: 'سوشی',
    icon: '🍣',
    count: '18 رستوران',
    slug: 'sushi'
  },
  {
    id: 6,
    name: 'نوشیدنی',
    icon: '🥤',
    count: '42 رستوران',
    slug: 'drink'
  },
];

const PopularCategories = () => {
  return (
    <SectionContainer>
      <SectionTitle>دسته‌بندی‌های محبوب</SectionTitle>
      <SectionSubtitle>
        از میان دسته‌بندی‌های مختلف، غذای مورد علاقه خود را انتخاب کنید
      </SectionSubtitle>
      
      <CategoriesGrid>
        {categories.map((category) => (
          <CategoryCard key={category.id} href={`/categories/${category.slug}`}>
            <IconContainer>
              {category.icon}
            </IconContainer>
            <CategoryName>{category.name}</CategoryName>
            <ItemCount>{category.count}</ItemCount>
          </CategoryCard>
        ))}
      </CategoriesGrid>
    </SectionContainer>
  );
};

export default PopularCategories; 