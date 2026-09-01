"use client";

import React, { Suspense, useState } from 'react';
import styled from 'styled-components';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginAction, registerAction } from '@/app/auth/actions';

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

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 1rem;
  background: none;
  border: none;
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.$active ? props.theme.typography.fontWeights.semibold : props.theme.typography.fontWeights.normal};
  color: ${props => props.$active ? props.theme.colors.primary[500] : props.theme.colors.neutral[500]};
  border-bottom: 2px solid ${props => props.$active ? props.theme.colors.primary[500] : 'transparent'};
  margin-bottom: -1px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--font-vazirmatn);
  
  &:hover {
    color: ${props => props.$active ? props.theme.colors.primary[500] : props.theme.colors.primary[400]};
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

const FormMessage = styled.p<{ $error?: boolean }>`
  margin: 0 0 1rem;
  color: ${({ $error, theme }) => $error ? theme.colors.error[600] : theme.colors.success[600]};
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
const AuthContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  // استیت‌ها
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(() =>
    searchParams.get('tab') === 'register' ? 'register' : 'login'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<{ text: string; error: boolean } | null>(null);
  
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
  
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormMessage(null);
    const result = await loginAction(loginForm);
    setIsSubmitting(false);
    if (result.ok) {
      router.refresh();
      router.push('/');
      return;
    }
    setFormMessage({ text: 'ایمیل یا رمز عبور صحیح نیست.', error: true });
  };
  
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      setFormMessage({ text: 'تکرار رمز عبور با رمز عبور یکسان نیست.', error: true });
      return;
    }
    setIsSubmitting(true);
    setFormMessage(null);
    const result = await registerAction({
      email: registerForm.email,
      password: registerForm.password,
      firstName: registerForm.firstName,
      lastName: registerForm.lastName,
      phone: registerForm.phone,
    });
    setIsSubmitting(false);
    if (result.ok) {
      setFormMessage({
        text: result.code === 'EMAIL_CONFIRMATION_REQUIRED'
          ? 'لینک تأیید به ایمیل شما ارسال شد.'
          : 'ثبت‌نام با موفقیت انجام شد.',
        error: false,
      });
      setActiveTab('login');
      return;
    }
    setFormMessage({ text: 'ثبت‌نام انجام نشد. اطلاعات را بررسی کنید.', error: true });
  };
  
  return (
    <AuthPageContainer>
      <PageTitle>
        {activeTab === 'login' ? 'ورود به حساب کاربری' : 'ثبت‌نام در فودینو'}
      </PageTitle>
      
      <AuthCard>
        <TabContainer>
          <TabButton 
            $active={activeTab === 'login'}
            onClick={() => setActiveTab('login')}
          >
            ورود
          </TabButton>
          <TabButton 
            $active={activeTab === 'register'}
            onClick={() => setActiveTab('register')}
          >
            ثبت‌نام
          </TabButton>
        </TabContainer>
        
        {activeTab === 'login' ? (
          <>
            {formMessage && <FormMessage $error={formMessage.error}>{formMessage.text}</FormMessage>}
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
                <ForgotPassword href="/auth/forgot-password">رمز عبور خود را فراموش کرده‌اید؟</ForgotPassword>
              </FormGroup>
              
              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'در حال ورود...' : 'ورود به حساب کاربری'}
              </SubmitButton>
            </Form>
            
          </>
        ) : (
          <>
            {formMessage && <FormMessage $error={formMessage.error}>{formMessage.text}</FormMessage>}
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

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthContent />
    </Suspense>
  );
}
