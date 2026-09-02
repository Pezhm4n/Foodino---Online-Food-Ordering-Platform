"use client";

import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.boxShadow.md};
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.boxShadow.lg};
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 0.85rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

const FoodImageContainer = styled.div`
  width: 60px;
  height: 60px;
  background-color: ${props => props.theme.colors.neutral[100]};
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 48px;
    height: 48px;
    font-size: 1.5rem;
  }
`;

const FoodInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const FoodName = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.secondary[500]};
  margin-bottom: 0.35rem;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 0.975rem;
  }
`;

const BadgesContainer = styled.div`
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
`;

const Badge = styled.span<{ type: 'popular' | 'spicy' | 'vegetarian' }>`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  padding: 0.15rem 0.45rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  background-color: ${props => 
    props.type === 'popular' 
      ? '#FEF3C7' 
      : props.type === 'spicy' 
        ? '#FEE2E2' 
        : '#DCFCE7'};
  color: ${props => 
    props.type === 'popular' 
      ? '#92400E' 
      : props.type === 'spicy' 
        ? '#9B1C1C' 
        : '#166534'};

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 0.7rem;
  }
`;

const Description = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[700]};
  line-height: 1.6;
  margin-bottom: 1.25rem;
  flex-grow: 1;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 0.8rem;
    line-height: 1.5;
    margin-bottom: 0.75rem;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  gap: 0.75rem;
`;

const Price = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.primary[500]};

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 0.925rem;
  }
`;

const AddButton = styled.button`
  padding: 0.45rem 1rem;
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 600;
  font-size: 0.875rem;
  min-height: 38px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[400]};
  }

  &:active {
    transform: scale(0.96);
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 0.35rem 0.85rem;
    font-size: 0.825rem;
    min-height: 36px;
  }
`;

interface Food {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  popular: boolean;
  spicy: boolean;
  vegetarian: boolean;
}

interface FoodCardProps {
  food: Food;
  onAddToCart: () => void;
}

const FoodCard = ({ food, onAddToCart }: FoodCardProps) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR') + ' تومان';
  };
  
  return (
    <Card>
      <CardContent>
        <Header>
          <FoodInfo>
            <FoodName>{food.name}</FoodName>
            <BadgesContainer>
              {food.popular && <Badge type="popular">محبوب</Badge>}
              {food.spicy && <Badge type="spicy">تند</Badge>}
              {food.vegetarian && <Badge type="vegetarian">گیاهی</Badge>}
            </BadgesContainer>
          </FoodInfo>
          <FoodImageContainer>
            {food.image}
          </FoodImageContainer>
        </Header>
        
        <Description>{food.description}</Description>
        
        <Footer>
          <Price>{formatPrice(food.price)}</Price>
          <AddButton onClick={onAddToCart}>افزودن</AddButton>
        </Footer>
      </CardContent>
    </Card>
  );
};

export default FoodCard; 