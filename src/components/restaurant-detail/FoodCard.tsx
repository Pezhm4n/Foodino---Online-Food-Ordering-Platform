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
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
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
`;

const FoodInfo = styled.div`
  flex: 1;
  margin-right: 1rem;
`;

const FoodName = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.secondary[500]};
  margin-bottom: 0.5rem;
`;

const BadgesContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Badge = styled.span<{ type: 'popular' | 'spicy' | 'vegetarian' }>`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  padding: 0.2rem 0.5rem;
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
`;

const Description = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[700]};
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const Price = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.primary[500]};
`;

const AddButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[400]};
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