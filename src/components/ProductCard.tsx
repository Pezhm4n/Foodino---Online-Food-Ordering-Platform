import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import styled from 'styled-components';

const Card = styled.article`
  overflow: hidden;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: white;
  box-shadow: ${({ theme }) => theme.boxShadow.md};
  transition: transform 200ms cubic-bezier(0.2, 0, 0, 1), box-shadow 200ms cubic-bezier(0.2, 0, 0, 1);
  
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${({ theme }) => theme.boxShadow.cardHover || theme.boxShadow.lg};
    }
  }

  &:active {
    transform: scale(0.99);
  }
`;

const ImageLink = styled(Link)`display: block; position: relative;`;
const ImageRegion = styled.div`
  position: relative;
  width: 100%;
  height: 12rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    height: 9.5rem;
  }
`;
const ProductImage = styled(Image)`object-fit: cover;`;
const DiscountBadge = styled.span`
  position: absolute; top: 0.5rem; right: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.error[500]};
  color: white; font-size: 0.75rem; font-weight: 700;
`;
const Rating = styled.span`
  position: absolute; bottom: 0.5rem; left: 0.5rem;
  display: flex; align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: rgba(255, 255, 255, 0.9); font-size: 0.875rem;
`;
const Star = styled.span`margin-left: 0.25rem; color: ${({ theme }) => theme.colors.warning[500]};`;
const Content = styled.div`
  padding: 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.75rem;
  }
`;
const Title = styled.h3`
  overflow: hidden; margin: 0 0 0.25rem; font-size: 1.125rem; font-weight: 700;
  text-overflow: ellipsis; white-space: nowrap;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.975rem;
  }
`;
const Description = styled.p`
  display: -webkit-box; overflow: hidden; margin: 0 0 0.75rem;
  color: ${({ theme }) => theme.colors.neutral[600]}; font-size: 0.875rem;
  -webkit-box-orient: vertical; -webkit-line-clamp: 2;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
  }
`;
const Footer = styled.div`display: flex; align-items: center; justify-content: space-between;`;
const PriceRow = styled.div`display: flex; align-items: center;`;
const OldPrice = styled.span`
  margin-left: 0.5rem; color: ${({ theme }) => theme.colors.neutral[400]};
  font-size: 0.875rem; text-decoration: line-through;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.78rem;
  }
`;
const Price = styled.span`
  color: ${({ theme }) => theme.colors.primary[600]}; font-weight: 700;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.9rem;
  }
`;
const AddButton = styled.button`
  padding: 0.4rem 0.85rem;
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  min-height: 36px;
  transition: transform 120ms cubic-bezier(0.2, 0, 0, 1),
    background-color 140ms cubic-bezier(0.2, 0, 0, 1),
    box-shadow 140ms cubic-bezier(0.2, 0, 0, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  touch-action: manipulation;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
    box-shadow: 0 4px 10px rgba(255, 90, 0, 0.25);
  }

  &:active {
    transform: scale(0.96);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.35rem 0.75rem;
    font-size: 0.8rem;
  }
`;

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    id,
    name,
    price,
    discountedPrice,
    image,
    rating,
    description
  } = product;

  const hasDiscount = discountedPrice !== undefined && discountedPrice < price;
  const discount = hasDiscount ? Math.round((1 - discountedPrice / price) * 100) : 0;

  return (
    <Card>
      <ImageLink href={`/products/${id}`}>
        <ImageRegion>
          <ProductImage
            src={image || '/images/placeholder-food.jpg'} 
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
          />
          {hasDiscount && (
            <DiscountBadge>
              {discount}٪ تخفیف
            </DiscountBadge>
          )}
          <Rating>
            <Star>★</Star>
            <span>{rating}</span>
          </Rating>
        </ImageRegion>
      </ImageLink>
      
      <Content>
        <Link href={`/products/${id}`}>
          <Title>{name}</Title>
        </Link>
        <Description>{description}</Description>
        
        <Footer>
          <div>
            {hasDiscount ? (
              <PriceRow>
                <OldPrice>
                  {formatCurrency(price)}
                </OldPrice>
                <Price>
                  {formatCurrency(discountedPrice)}
                </Price>
              </PriceRow>
            ) : (
              <Price>
                {formatCurrency(price)}
              </Price>
            )}
          </div>
          
          <AddButton
            onClick={(e) => {
              e.preventDefault();
              // اضافه کردن به سبد خرید
              console.log('Adding to cart:', product);
            }}
          >
            افزودن
          </AddButton>
        </Footer>
      </Content>
    </Card>
  );
};

export default ProductCard; 
