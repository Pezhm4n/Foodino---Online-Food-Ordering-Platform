"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Button as StyledButton,
  LinkButton
} from '@/components/common/StyledComponents';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/Input';

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #334155;
  margin-bottom: 2rem;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 2rem;
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: ${props => props.$active ? 600 : 400};
  color: ${props => props.$active ? '#E11D48' : '#4B5563'};
  border-bottom: 2px solid ${props => props.$active ? '#E11D48' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    color: #E11D48;
  }
`;

const ContentCard = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #6B7280;
`;

const FormGrid = styled.form`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ButtonContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const LoggedOutState = styled.div`
  text-align: center;
  padding: 5rem 1rem;
  max-width: 600px;
  margin: 0 auto;
`;

const LoggedOutTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #334155;
  margin-bottom: 1rem;
`;

const LoggedOutText = styled.p`
  font-size: 1.125rem;
  color: #4B5563;
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  
  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export default function ProfilePage() {
  const { user, isAuthenticated, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      updateUserProfile(formData);
    }
  };

  if (!isAuthenticated) {
    return (
      <ProfileContainer>
        <LoggedOutState>
          <LoggedOutTitle>برای مشاهده پروفایل خود وارد شوید</LoggedOutTitle>
          <LoggedOutText>برای دسترسی به پروفایل کاربری، سفارشات و تنظیمات حساب خود، لطفاً وارد شوید یا ثبت‌نام کنید.</LoggedOutText>
          <ButtonGroup>
            <LinkButton href="/auth?tab=login" $variant="primary">ورود به حساب کاربری</LinkButton>
            <LinkButton href="/auth?tab=register" $variant="secondary">ثبت‌نام</LinkButton>
          </ButtonGroup>
        </LoggedOutState>
      </ProfileContainer>
    );
  }
  
  return (
    <ProfileContainer>
      <Title>پروفایل کاربری</Title>
      
      <TabsContainer>
        <TabButton 
          $active={activeTab === 'profile'} 
          onClick={() => setActiveTab('profile')}
        >
          اطلاعات کاربری
        </TabButton>
        <TabButton 
          $active={activeTab === 'orders'} 
          onClick={() => setActiveTab('orders')}
        >
          سفارشات من
        </TabButton>
        <TabButton 
          $active={activeTab === 'addresses'} 
          onClick={() => setActiveTab('addresses')}
        >
            آدرس‌های من
        </TabButton>
        <TabButton 
          $active={activeTab === 'favorites'} 
          onClick={() => setActiveTab('favorites')}
        >
          علاقه‌مندی‌ها
        </TabButton>
      </TabsContainer>
      
        {activeTab === 'profile' && (
        <ContentCard>
            <SectionTitle>اطلاعات شخصی</SectionTitle>
          <FormGrid onSubmit={handleSubmit}>
            <Input 
              label="نام" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleInputChange} 
              placeholder="نام خود را وارد کنید"
            />
            <Input 
              label="نام خانوادگی" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleInputChange} 
              placeholder="نام خانوادگی خود را وارد کنید"
            />
            <Input 
              label="ایمیل" 
              name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
              placeholder="ایمیل خود را وارد کنید"
            />
            <Input 
              label="شماره تلفن" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
              placeholder="شماره تلفن خود را وارد کنید"
            />
            <ButtonContainer>
              <StyledButton type="submit" $variant="primary">ذخیره تغییرات</StyledButton>
            </ButtonContainer>
          </FormGrid>
        </ContentCard>
        )}
        
        {activeTab === 'orders' && (
        <ContentCard>
          <SectionTitle>سفارشات من</SectionTitle>
          <EmptyState>
            <div>شما هنوز سفارشی ثبت نکرده‌اید.</div>
            <LinkButton href="/restaurants" $variant="primary" style={{ marginTop: '1rem' }}>مشاهده رستوران‌ها</LinkButton>
          </EmptyState>
        </ContentCard>
        )}
        
        {activeTab === 'addresses' && (
        <ContentCard>
            <SectionTitle>آدرس‌های من</SectionTitle>
          <EmptyState>
            <div>شما هنوز آدرسی ثبت نکرده‌اید.</div>
            <StyledButton $variant="primary" style={{ marginTop: '1rem' }}>افزودن آدرس جدید</StyledButton>
          </EmptyState>
        </ContentCard>
      )}
      
      {activeTab === 'favorites' && (
        <ContentCard>
          <SectionTitle>رستوران‌های مورد علاقه</SectionTitle>
          <EmptyState>
            <div>شما هنوز رستورانی را به علاقه‌مندی‌ها اضافه نکرده‌اید.</div>
            <LinkButton href="/restaurants" $variant="primary" style={{ marginTop: '1rem' }}>مشاهده رستوران‌ها</LinkButton>
          </EmptyState>
        </ContentCard>
      )}
    </ProfileContainer>
  );
} 