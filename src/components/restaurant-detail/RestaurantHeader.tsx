"use client";

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const HeaderContainer = styled.div`
  background-color: white;
  padding: 2rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.neutral[100]};
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const BreadcrumbContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[700]};
`;

const BreadcrumbLink = styled(Link)`
  color: ${props => props.theme.colors.neutral[700]};
  text-decoration: none;
  
  &:hover {
    color: ${props => props.theme.colors.primary[500]};
  }
`;

const BreadcrumbSeparator = styled.span`
  margin: 0 0.25rem;
`;

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const IconContainer = styled.div`
  width: 80px;
  height: 80px;
  background-color: ${props => props.theme.colors.primary[400]};
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${props => props.theme.typography.fontSizes['3xl']};
`;

const RestaurantInfo = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes['2xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.secondary[500]};
  margin-bottom: 0.5rem;
`;

const TagsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
`;

const Tag = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  color: ${props => props.theme.colors.neutral[700]};
  background-color: ${props => props.theme.colors.neutral[100]};
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
`;

const MetaContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[700]};
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.secondary[500]};
`;

const StarIcon = styled.span`
  color: ${props => props.theme.colors.warning[500]};
`;

const ActionContainer = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin-top: 1rem;
  }
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const SaveButton = styled(ActionButton)`
  background-color: white;
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  color: ${props => props.theme.colors.neutral[900]};
  
  &:hover {
    background-color: ${props => props.theme.colors.neutral[100]};
  }
`;

const ShareButton = styled(ActionButton)`
  background-color: white;
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  color: ${props => props.theme.colors.neutral[900]};
  
  &:hover {
    background-color: ${props => props.theme.colors.neutral[100]};
  }
`;

interface Restaurant {
  id: number;
  name: string;
  type: string;
  icon: string;
  rating: number;
  tags: string[];
  description: string;
  deliveryTime: string;
  minOrder: string;
  slug: string;
  address: string;
  workingHours: string;
  contactNumber: string;
}

interface RestaurantHeaderProps {
  restaurant: Restaurant;
}

const RestaurantHeader = ({ restaurant }: RestaurantHeaderProps) => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <BreadcrumbContainer>
          <BreadcrumbLink href="/">خانه</BreadcrumbLink>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbLink href="/restaurants">رستوران‌ها</BreadcrumbLink>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <span>{restaurant.name}</span>
        </BreadcrumbContainer>
        
        <InfoContainer>
          <IconContainer>
            {restaurant.icon}
          </IconContainer>
          
          <RestaurantInfo>
            <Title>{restaurant.name}</Title>
            
            <TagsContainer>
              {restaurant.tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </TagsContainer>
            
            <MetaContainer>
              <Rating>
                <StarIcon>★</StarIcon>
                <span>{restaurant.rating}</span>
              </Rating>
              
              <MetaItem>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                زمان تحویل: {restaurant.deliveryTime}
              </MetaItem>
              
              <MetaItem>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {restaurant.address}
              </MetaItem>
              
              <MetaItem>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                ساعت کاری: {restaurant.workingHours}
              </MetaItem>
            </MetaContainer>
          </RestaurantInfo>
          
          <ActionContainer>
            <SaveButton>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              ذخیره
            </SaveButton>
            
            <ShareButton>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 6L12 2L8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 2V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              اشتراک‌گذاری
            </ShareButton>
          </ActionContainer>
        </InfoContainer>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default RestaurantHeader; 