"use client";

import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const heroContentFade = keyframes`
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const heroVisualFade = keyframes`
  from {
    opacity: 0;
    transform: scale(0.96) translateY(12px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const HeroContainer = styled.section`
  background: linear-gradient(135deg, ${props => props.theme.colors.neutral[100]} 0%, white 100%);
  padding: 4.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  max-width: 1300px;
  margin: 0 auto;
  gap: 3rem;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    flex-direction: column;
    padding: 2.5rem 1.25rem;
    gap: 2rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 1.25rem 0.875rem 1.5rem;
    gap: 1.25rem;
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  max-width: 620px;
  animation: ${heroContentFade} 500ms cubic-bezier(0.16, 1, 0.3, 1) both;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 100%;
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.theme.colors.primary[50]};
  color: ${props => props.theme.colors.primary[600]};
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.35rem 0.9rem;
  border-radius: 9999px;
  border: 1px solid ${props => props.theme.colors.primary[200]};
  margin-bottom: 1rem;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 0.75rem;
    padding: 0.25rem 0.7rem;
    margin-bottom: 0.65rem;
  }
`;

const Title = styled.h1`
  font-size: 2.75rem;
  font-weight: 800;
  color: ${props => props.theme.colors.neutral[900]};
  margin-bottom: 1.25rem;
  line-height: 1.35;
  
  span {
    color: ${props => props.theme.colors.primary[500]};
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1.85rem;
    margin-bottom: 0.75rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 1.45rem;
    line-height: 1.35;
    margin-bottom: 0.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.neutral[600]};
  margin-bottom: 2rem;
  line-height: 1.8;
  max-width: 540px;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 0.95rem;
    margin-bottom: 1.25rem;
    line-height: 1.6;
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 0.85rem;
    line-height: 1.55;
    margin-bottom: 1rem;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  max-width: 520px;
  width: 100%;
  position: relative;
  flex-direction: column;
`;

const SearchInputContainer = styled.div`
  display: flex;
  position: relative;
  box-shadow: 0 4px 16px -2px rgba(0, 0, 0, 0.07);
  border-radius: ${props => props.theme.borderRadius.xl};
  background: white;
  border: 1.5px solid ${props => props.theme.colors.neutral[200]};
  transition: all 0.2s;

  &:focus-within {
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px rgba(255, 90, 0, 0.15);
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 3rem 1rem 1.25rem;
  border: none;
  background: transparent;
  font-size: 1rem;
  outline: none;
  font-family: inherit;
  direction: rtl;
  text-align: right;
  min-width: 0;

  &::placeholder {
    color: ${props => props.theme.colors.neutral[400]};
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 0.85rem;
    padding: 0.75rem 2.25rem 0.75rem 0.5rem;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 1.1rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.neutral[400]};
  font-size: 1.25rem;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    right: 0.65rem;
    font-size: 1rem;
  }
`;

const SearchButton = styled.button`
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  font-weight: 600;
  border: none;
  padding: 0.85rem 1.75rem;
  min-height: 44px;
  border-radius: ${props => props.theme.borderRadius.lg};
  margin: 0.35rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  font-size: 0.95rem;
  flex-shrink: 0;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[600]};
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 0.55rem 0.95rem;
    font-size: 0.85rem;
    min-height: 38px;
    margin: 0.25rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  width: 100%;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    margin-top: 0.85rem;
    gap: 0.5rem;
  }
`;

const PrimaryButton = styled(Link)`
  padding: 0.85rem 1.75rem;
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  font-weight: 600;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.borderRadius.lg};
  text-decoration: none;
  text-align: center;
  box-shadow: 0 4px 12px rgba(255, 90, 0, 0.22);
  transition: all 0.2s;
  font-size: 0.95rem;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[600]};
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex: 1;
    padding: 0.65rem 0.5rem;
    font-size: 0.85rem;
    min-height: 40px;
  }
`;

const SecondaryButton = styled(Link)`
  padding: 0.85rem 1.75rem;
  background-color: white;
  color: ${props => props.theme.colors.neutral[700]};
  font-weight: 600;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1.5px solid ${props => props.theme.colors.neutral[200]};
  text-decoration: none;
  text-align: center;
  transition: all 0.2s;
  font-size: 0.95rem;
  
  &:hover {
    border-color: ${props => props.theme.colors.neutral[300]};
    background-color: ${props => props.theme.colors.neutral[50]};
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex: 1;
    padding: 0.65rem 0.5rem;
    font-size: 0.85rem;
    min-height: 40px;
  }
`;

// بخش ویژوال دسکتاپ - در موبایل پنهان می‌شود تا اولین ویوپورت خلوت و کاربردی بماند
const VisualShowcase = styled.div`
  position: relative;
  width: 480px;
  height: 440px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${heroVisualFade} 560ms cubic-bezier(0.16, 1, 0.3, 1) 120ms both;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    width: 100%;
    max-width: 440px;
    height: 380px;
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`;

const MainCard = styled.div`
  width: 360px;
  max-width: 100%;
  background: white;
  border-radius: 1.75rem;
  padding: 1.75rem;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  border: 1px solid ${props => props.theme.colors.neutral[200]};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 2;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 1.25rem 1rem;
    border-radius: 1.25rem;
  }
`;

const FoodIconCircle = styled.div`
  width: 130px;
  height: 130px;
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4.5rem;
  margin-bottom: 1.25rem;
  box-shadow: 0 10px 20px -5px rgba(251, 146, 60, 0.3);
  animation: float 4s ease-in-out infinite;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 95px;
    height: 95px;
    font-size: 3.25rem;
    margin-bottom: 0.75rem;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.neutral[900]};
  margin-bottom: 0.35rem;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 1.1rem;
  }
`;

const CardDesc = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.neutral[500]};
  margin-bottom: 1rem;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 0.8rem;
    margin-bottom: 0.75rem;
  }
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-top: 0.85rem;
  border-top: 1px solid ${props => props.theme.colors.neutral[100]};
`;

const FloatingBadge1 = styled.div`
  position: absolute;
  top: 1rem;
  right: -1rem;
  background: white;
  padding: 0.75rem 1.1rem;
  border-radius: 1rem;
  box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.12);
  border: 1px solid ${props => props.theme.colors.neutral[100]};
  display: flex;
  align-items: center;
  gap: 0.6rem;
  z-index: 3;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.neutral[800]};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    right: 0.25rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    top: 0.25rem;
    right: 0;
    padding: 0.45rem 0.75rem;
    font-size: 0.75rem;
    border-radius: 0.75rem;
  }
`;

const FloatingBadge2 = styled.div`
  position: absolute;
  bottom: 1.5rem;
  left: -1rem;
  background: white;
  padding: 0.75rem 1.1rem;
  border-radius: 1rem;
  box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.12);
  border: 1px solid ${props => props.theme.colors.neutral[100]};
  display: flex;
  align-items: center;
  gap: 0.6rem;
  z-index: 3;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.neutral[800]};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    left: 0.25rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    bottom: 0.25rem;
    left: 0;
    padding: 0.45rem 0.75rem;
    font-size: 0.75rem;
    border-radius: 0.75rem;
  }
`;

const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/restaurants');
    }
  };

  return (
    <HeroContainer>
      <ContentContainer>
        <Badge>
          <span>🔥</span> سریع‌ترین پلتفرم سفارش آنلاین غذا
        </Badge>
        
        <Title>
          سفارش آنلاین غذا از <span>بهترین رستوران‌ها</span>
        </Title>
        
        <Subtitle>
          غذای دلخواهت رو از برترین رستوران‌ها، فست‌فودها و کافه‌های شهر انتخاب کن و در کمترین زمان داغ و تازه تحویل بگیر!
        </Subtitle>
        
        <SearchContainer>
          <form onSubmit={handleSearch}>
            <SearchInputContainer>
              <SearchIcon>🔍</SearchIcon>
              <SearchInput
                type="text"
                placeholder="جستجوی نام رستوران، پیتزا، برگر..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchButton type="submit">جستجو</SearchButton>
            </SearchInputContainer>
          </form>
        </SearchContainer>
        
        <ActionButtons>
          <PrimaryButton href="/restaurants">مشاهده رستوران‌ها</PrimaryButton>
          <SecondaryButton href="/categories">دسته‌بندی‌های غذا</SecondaryButton>
        </ActionButtons>
      </ContentContainer>
      
      <VisualShowcase>
        <FloatingBadge1>
          <span style={{ fontSize: '1.25rem' }}>⚡</span>
          <div>
            <div>تحویل اکسپرس</div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a' }}>زیر ۳۰ دقیقه</div>
          </div>
        </FloatingBadge1>

        <MainCard>
          <FoodIconCircle>🍔</FoodIconCircle>
          <CardTitle>برگر دوبل ذغالی با پنیر گودا</CardTitle>
          <CardDesc>گوشت خالص ۱۰۰٪ با سس مخصوص و قارچ</CardDesc>
          <PriceRow>
            <span style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 600 }}>⭐ ۴.۹ (۵۲۰+ نظر)</span>
            <span style={{ fontSize: '0.9rem', color: '#16a34a', fontWeight: 700 }}>تحویل رایگان</span>
          </PriceRow>
        </MainCard>

        <FloatingBadge2>
          <span style={{ fontSize: '1.25rem' }}>🍕</span>
          <div>
            <div>تنوع بی‌نظیر</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>بیش از ۱۰۰ رستوران</div>
          </div>
        </FloatingBadge2>
      </VisualShowcase>
    </HeroContainer>
  );
};

export default HeroSection;
