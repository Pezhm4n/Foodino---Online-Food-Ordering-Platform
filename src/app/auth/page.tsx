"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { vazirmatn } from '@/app/fonts';

// استایل‌های صفحه
const AuthPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1rem;
  direction: rtl;
  font-family: var(--font-vazirmatn);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PageTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes['2xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.secondary[500]};
  margin-bottom: 2rem;
  text-align: center;
`;

const AuthCard = styled.div`
  width: 100%;
  max-width: 500px;
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.boxShadow.md};
  padding: 2rem;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.neutral[300]};
`;

const TabButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 1rem;
  background: none;
  border: none;
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.active ? props.theme.typography.fontWeights.semibold : props.theme.typography.fontWeights.normal};
  color: ${props => props.active ? props.theme.colors.primary[500] : props.theme.colors.neutral[500]};
  border-bottom: 2px solid ${props => props.active ? props.theme.colors.primary[500] : 'transparent'};
  margin-bottom: -1px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--font-vazirmatn);
  
  &:hover {
    color: ${props => props.active ? props.theme.colors.primary[500] : props.theme.colors.primary[400]};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.neutral[700]};
`;

const FormInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-family: var(--font-vazirmatn);
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary[400] + '20'};
  }
`;

const ForgotPassword = styled.a`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.primary[500]};
  text-align: left;
  display: block;
  margin-top: -0.5rem;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled.button`
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  font-size: ${props => props.theme.typography.fontSizes.md};
  padding: 0.75rem;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-family: var(--font-vazirmatn);
  transition: background-color 0.2s;
  margin-top: 1rem;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[400]};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.neutral[300]};
    cursor: not-allowed;
  }
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
  
  &:before, &:after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: ${props => props.theme.colors.neutral[300]};
  }
`;

const SocialButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const SocialButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: white;
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[700]};
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--font-vazirmatn);
  
  &:hover {
    background-color: ${props => props.theme.colors.neutral[50]};
    border-color: ${props => props.theme.colors.neutral[300]};
  }
`;

const SocialIcon = styled.span`
  font-size: 1.25rem;
`;

const TermsText = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[500]};
  text-align: center;
  margin-top: 1.5rem;
  line-height: 1.6;
`;

const TermsLink = styled.a`
  color: ${props => props.theme.colors.primary[500]};
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

// انواع داده
interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

// کامپوننت اصلی
const AuthPage = () => {
  const searchParams = useSearchParams();
  // استیت‌ها
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // تنظیم تب فعال براساس پارامتر URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'register') {
      setActiveTab('register');
    } else {
      setActiveTab('login');
    }
  }, [searchParams]);
  
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  
  const [registerForm, setRegisterForm] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  
  // هندلرها
  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // اینجا کد ارسال فرم ورود به سرور اضافه می‌شود
    
    setTimeout(() => {
      setIsSubmitting(false);
      // پس از ورود موفق، کاربر به صفحه اصلی هدایت می‌شود
      alert('ورود با موفقیت انجام شد!');
      window.location.href = '/';
    }, 1500);
  };
  
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // اینجا کد ارسال فرم ثبت‌نام به سرور اضافه می‌شود
    
    setTimeout(() => {
      setIsSubmitting(false);
      // پس از ثبت‌نام موفق، کاربر به صفحه ورود هدایت می‌شود
      alert('ثبت‌نام با موفقیت انجام شد!');
      setActiveTab('login');
    }, 1500);
  };
  
  return (
    <AuthPageContainer>
      <PageTitle>
        {activeTab === 'login' ? 'ورود به حساب کاربری' : 'ثبت‌نام در فودینو'}
      </PageTitle>
      
      <AuthCard>
        <TabContainer>
          <TabButton 
            active={activeTab === 'login'} 
            onClick={() => setActiveTab('login')}
          >
            ورود
          </TabButton>
          <TabButton 
            active={activeTab === 'register'} 
            onClick={() => setActiveTab('register')}
          >
            ثبت‌نام
          </TabButton>
        </TabContainer>
        
        {activeTab === 'login' ? (
          <>
            <Form onSubmit={handleLoginSubmit}>
              <FormGroup>
                <FormLabel htmlFor="email">ایمیل یا شماره موبایل</FormLabel>
                <FormInput
                  type="text"
                  id="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleLoginInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="password">رمز عبور</FormLabel>
                <FormInput
                  type="password"
                  id="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginInputChange}
                  required
                />
                <ForgotPassword href="#">رمز عبور خود را فراموش کرده‌اید؟</ForgotPassword>
              </FormGroup>
              
              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'در حال ورود...' : 'ورود به حساب کاربری'}
              </SubmitButton>
            </Form>
            
            <OrDivider>یا</OrDivider>
            
            <SocialButtonsContainer>
              <SocialButton type="button">
                <SocialIcon>G</SocialIcon>
                <span>گوگل</span>
              </SocialButton>
            </SocialButtonsContainer>
          </>
        ) : (
          <>
            <Form onSubmit={handleRegisterSubmit}>
              <FormGroup>
                <FormLabel htmlFor="firstName">نام</FormLabel>
                <FormInput
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={registerForm.firstName}
                  onChange={handleRegisterInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="lastName">نام خانوادگی</FormLabel>
                <FormInput
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={registerForm.lastName}
                  onChange={handleRegisterInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="email">ایمیل</FormLabel>
                <FormInput
                  type="email"
                  id="email"
                  name="email"
                  value={registerForm.email}
                  onChange={handleRegisterInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="phone">شماره موبایل</FormLabel>
                <FormInput
                  type="tel"
                  id="phone"
                  name="phone"
                  value={registerForm.phone}
                  onChange={handleRegisterInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="password">رمز عبور</FormLabel>
                <FormInput
                  type="password"
                  id="password"
                  name="password"
                  value={registerForm.password}
                  onChange={handleRegisterInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="confirmPassword">تکرار رمز عبور</FormLabel>
                <FormInput
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterInputChange}
                  required
                />
              </FormGroup>
              
              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
              </SubmitButton>
            </Form>
            
            <OrDivider>یا</OrDivider>
            
            <SocialButtonsContainer>
              <SocialButton type="button">
                <SocialIcon>G</SocialIcon>
                <span>ثبت‌نام با گوگل</span>
              </SocialButton>
            </SocialButtonsContainer>
          </>
        )}
        
        <TermsText>
          با ورود یا ثبت‌نام در فودینو، شما با 
          <TermsLink href="/terms" target="_blank"> قوانین و مقررات </TermsLink>
          سایت موافقت می‌کنید.
        </TermsText>
      </AuthCard>
    </AuthPageContainer>
  );
};

export default AuthPage; 