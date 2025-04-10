"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const HeroContainer = styled.section`
  background-color: ${props => props.theme.colors.neutral[100]};
  padding: 4rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    flex-direction: column;
    padding: 2rem 1rem;
    gap: 2rem;
  }
`;

const ContentContainer = styled.div`
  max-width: 600px;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes['4xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.secondary[500]};
  margin-bottom: 1.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.typography.fontSizes['3xl']};
  }
`;

const Subtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  color: ${props => props.theme.colors.neutral[700]};
  margin-bottom: 2.5rem;
  line-height: 1.7;
`;

const SearchContainer = styled.div`
  display: flex;
  max-width: 500px;
  position: relative;
  flex-direction: column;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 100%;
  }
`;

const SearchInputContainer = styled.div`
  display: flex;
  position: relative;
`;

const SearchError = styled.div`
  color: ${props => props.theme.colors.error["500"]};
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-align: right;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  font-size: ${props => props.theme.typography.fontSizes.md};
  outline: none;
  transition: all 0.2s ease;
  padding-right: 3rem;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px rgba(255, 90, 0, 0.1);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SearchButton = styled.button`
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  border: none;
  padding: 1rem 2rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-right: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[400]};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 0.75rem 1.5rem;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 550px;
  height: 500px;
  background-color: ${props => props.theme.colors.primary[400]};
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${props => props.theme.typography.fontSizes['2xl']};
  
  @media (max-width: ${props => props.theme.breakpoints.xl}) {
    width: 450px;
    height: 400px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    width: 100%;
    height: 350px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  border: none;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  display: inline-block;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[400]};
  }
`;

const SecondaryButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: ${props => props.theme.colors.primary[500]};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.primary[500]};
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  display: inline-block;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[500] + '10'};
  }
`;

const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchError, setSearchError] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    
    if (!searchTerm.trim()) {
      setSearchError('لطفاً عبارت جستجو را وارد کنید');
      return;
    }
    
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <HeroContainer>
      <ContentContainer>
        <Title>سفارش غذای آنلاین از بهترین رستوران‌ها</Title>
        <Subtitle>
          سریع‌ترین سرویس تحویل غذا در شهر شما. غذای مورد علاقه خود را پیدا کنید و با چند کلیک سفارش دهید!
        </Subtitle>
        <form onSubmit={handleSearch}>
          <SearchContainer>
            <SearchInputContainer>
              <SearchInput 
                placeholder="جستجوی غذا یا رستوران..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="جستجوی غذا یا رستوران"
              />
              <SearchIcon>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#9E9E9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 21L16.65 16.65" stroke="#9E9E9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </SearchIcon>
              <SearchButton type="submit">جستجو</SearchButton>
            </SearchInputContainer>
            {searchError && <SearchError>{searchError}</SearchError>}
          </SearchContainer>
        </form>
        <ActionButtons>
          <PrimaryButton href="/restaurants">سفارش غذا</PrimaryButton>
          <SecondaryButton href="/about">درباره ما</SecondaryButton>
        </ActionButtons>
      </ContentContainer>
      
      <ImageContainer>
        تصویر غذا
      </ImageContainer>
    </HeroContainer>
  );
};

export default HeroSection; 