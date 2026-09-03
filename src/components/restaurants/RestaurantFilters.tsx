"use client";

import React, { useState } from 'react';
import styled from 'styled-components';

const FiltersContainer = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  box-shadow: ${props => props.theme.boxShadow.md};
  position: sticky;
  top: 6rem;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    position: static;
    padding: 1rem;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    border: 1px solid ${props => props.theme.colors.neutral[200]};
    margin-bottom: 1.25rem;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.neutral[100]};
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin-bottom: 1rem;
    padding-bottom: 1rem;
  }
`;

const FilterTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.secondary[500]};
  margin-bottom: 1rem;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 0.975rem;
    margin-bottom: 0.75rem;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    gap: 0.5rem;
  }
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[700]};
  cursor: pointer;
  min-height: 32px;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 0.875rem;
  }
`;

const Checkbox = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  accent-color: ${props => props.theme.colors.primary[500]};
`;

const RangeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RangeSlider = styled.input`
  width: 100%;
  accent-color: ${props => props.theme.colors.primary[500]};
`;

const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[500]};
`;

const RatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    gap: 0.5rem;
  }
`;

const RatingItem = styled.label<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.$isActive ? props.theme.colors.primary[500] : props.theme.colors.neutral[700]};
  font-weight: ${props => props.$isActive ? props.theme.typography.fontWeights.medium : 'normal'};
  cursor: pointer;
  min-height: 32px;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 0.875rem;
  }
`;

const Stars = styled.div`
  display: flex;
`;

const Star = styled.span<{ $filled: boolean }>`
  color: ${props => props.$filled ? props.theme.colors.warning[500] : props.theme.colors.neutral[300]};
`;

const ResetButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: ${props => props.theme.colors.neutral[100]};
  color: ${props => props.theme.colors.neutral[700]};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: background-color 140ms cubic-bezier(0.2, 0, 0, 1),
    transform 120ms cubic-bezier(0.2, 0, 0, 1);
  margin-top: 1rem;
  min-height: 42px;
  user-select: none;
  touch-action: manipulation;
  
  &:hover {
    background-color: ${props => props.theme.colors.neutral[300]};
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin-top: 0.75rem;
    font-size: 0.875rem;
  }
`;

const RestaurantFilters = () => {
  const [priceRange, setPriceRange] = useState('150000');
  const [rating, setRating] = useState<number | null>(null);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  
  const handleCuisineToggle = (cuisine: string) => {
    if (cuisines.includes(cuisine)) {
      setCuisines(cuisines.filter(c => c !== cuisine));
    } else {
      setCuisines([...cuisines, cuisine]);
    }
  };
  
  const handleFeatureToggle = (feature: string) => {
    if (features.includes(feature)) {
      setFeatures(features.filter(f => f !== feature));
    } else {
      setFeatures([...features, feature]);
    }
  };
  
  const resetFilters = () => {
    setPriceRange('150000');
    setRating(null);
    setCuisines([]);
    setFeatures([]);
  };
  
  return (
    <FiltersContainer>
      <FilterSection>
        <FilterTitle>دسته‌بندی غذا</FilterTitle>
        <CheckboxGroup>
          {['فست فود', 'ایرانی', 'سنتی', 'کباب', 'پیتزا', 'ساندویچ', 'سالاد', 'دریایی'].map(cuisine => (
            <CheckboxItem key={cuisine}>
              <Checkbox 
                type="checkbox" 
                checked={cuisines.includes(cuisine)} 
                onChange={() => handleCuisineToggle(cuisine)} 
              />
              {cuisine}
            </CheckboxItem>
          ))}
        </CheckboxGroup>
      </FilterSection>
      
      <FilterSection>
        <FilterTitle>محدوده قیمت (تومان)</FilterTitle>
        <RangeContainer>
          <RangeSlider 
            type="range" 
            min="50000" 
            max="300000" 
            step="10000" 
            value={priceRange} 
            onChange={(e) => setPriceRange(e.target.value)} 
          />
          <RangeLabels>
            <span>۵۰,۰۰۰</span>
            <span>تا {parseInt(priceRange).toLocaleString('fa-IR')}</span>
            <span>۳۰۰,۰۰۰</span>
          </RangeLabels>
        </RangeContainer>
      </FilterSection>
      
      <FilterSection>
        <FilterTitle>امتیاز</FilterTitle>
        <RatingContainer>
          {[5, 4, 3, 2, 1].map(stars => (
            <RatingItem 
              key={stars} 
              $isActive={rating === stars}
              onClick={() => setRating(stars === rating ? null : stars)}
            >
              <Stars>
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} $filled={i <= stars}>★</Star>
                ))}
              </Stars>
              {stars === 5 ? 'عالی' : 
                stars === 4 ? 'خیلی خوب' : 
                stars === 3 ? 'خوب' : 
                stars === 2 ? 'متوسط' : 'ضعیف'}
            </RatingItem>
          ))}
        </RatingContainer>
      </FilterSection>
      
      <FilterSection>
        <FilterTitle>ویژگی‌ها</FilterTitle>
        <CheckboxGroup>
          {['ارسال رایگان', 'دارای تخفیف', 'فروش ویژه', 'رستوران برتر'].map(feature => (
            <CheckboxItem key={feature}>
              <Checkbox 
                type="checkbox" 
                checked={features.includes(feature)} 
                onChange={() => handleFeatureToggle(feature)} 
              />
              {feature}
            </CheckboxItem>
          ))}
        </CheckboxGroup>
      </FilterSection>
      
      <ResetButton onClick={resetFilters}>
        پاک کردن فیلترها
      </ResetButton>
    </FiltersContainer>
  );
};

export default RestaurantFilters; 