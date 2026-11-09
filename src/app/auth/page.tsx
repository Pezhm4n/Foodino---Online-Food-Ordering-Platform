'use client';

import React, { useState, Suspense } from 'react';
import styled from 'styled-components';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginAction, registerAction } from './actions';
import {
  FoodinoEmblem,
  EyeIcon,
  EyeOffIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
} from '@/components/ui/FoodVisuals';

const AuthPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  min-height: calc(100vh - 200px);
  background: ${props => props.theme.colors.neutral[50]};

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 1.5rem 0.85rem 2.5rem;
  }
`;

const AuthCard = styled.div`
  background: #ffffff;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid ${props => props.theme.colors.neutral[200]};
  width: 100%;
  max-width: 480px;
  padding: 2.5rem;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 1.5rem 1.15rem;
    border-radius: ${props => props.theme.borderRadius.xl};
  }
`;

const BrandMarkWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

const PageTitle = styled.h1`
  font-size: 1.65rem;
  font-weight: 900;
  color: ${props => props.theme.colors.neutral[900]};
  margin: 0 0 0.35rem;
  text-align: center;
  letter-spacing: -0.02em;
`;

const PageSub = styled.p`
  font-size: 0.88rem;
  color: ${props => props.theme.colors.neutral[500]};
  text-align: center;
  margin: 0 0 1.65rem;
`;

const TabContainer = styled.div`
  display: flex;
  background: ${props => props.theme.colors.neutral[100]};
  padding: 0.3rem;
  border-radius: ${props => props.theme.borderRadius.xl};
  margin-bottom: 1.75rem;
  border: 1px solid ${props => props.theme.colors.neutral[200]};
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.7rem;
  text-align: center;
  background: ${props => (props.$active ? '#ffffff' : 'transparent')};
  color: ${props => (props.$active ? props.theme.colors.neutral[900] : props.theme.colors.neutral[600])};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: ${props => (props.$active ? 800 : 600)};
  font-size: 0.92rem;
  cursor: pointer;
  box-shadow: ${props => (props.$active ? props.theme.shadows.xs : 'none')};
  transition: color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease;
  min-height: 40px;

  &:hover {
    color: ${props => props.theme.colors.neutral[900]};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FormLabel = styled.label`
  font-size: 0.86rem;
  font-weight: 700;
  color: ${props => props.theme.colors.neutral[800]};
`;

const HintText = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.neutral[500]};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const FormInput = styled.input<{ $hasError?: boolean; $hasToggle?: boolean }>`
  width: 100%;
  padding: ${props => (props.$hasToggle ? '0.8rem 1rem 0.8rem 3.1rem' : '0.8rem 1rem')};
  border: 1.5px solid ${props => (props.$hasError ? props.theme.colors.error[500] : props.theme.colors.neutral[300])};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: 0.95rem;
  background-color: ${props => (props.$hasError ? '#FEF2F2' : props.theme.colors.neutral[50])};
  color: ${props => props.theme.colors.neutral[900]};
  outline: none;
  transition: border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease;

  &:focus {
    background-color: #ffffff;
    border-color: ${props => (props.$hasError ? props.theme.colors.error[500] : props.theme.colors.primary[500])};
    box-shadow: 0 0 0 3px ${props => (props.$hasError ? 'rgba(220, 38, 38, 0.12)' : 'rgba(217, 56, 30, 0.14)')};
  }

  &::placeholder {
    color: ${props => props.theme.colors.neutral[400]};
    font-size: 0.85rem;
  }
`;

const TogglePasswordButton = styled.button`
  position: absolute;
  left: 0.45rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${props => props.theme.colors.neutral[500]};
  cursor: pointer;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: color 0.15s ease, background-color 0.15s ease;

  &:hover {
    color: ${props => props.theme.colors.neutral[800]};
    background-color: ${props => props.theme.colors.neutral[100]};
  }
`;

const FieldErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: ${props => props.theme.colors.error[600]};
  font-size: 0.78rem;
  font-weight: 600;
  margin-top: 0.15rem;
`;

const AlertBanner = styled.div<{ $type: 'error' | 'success' }>`
  padding: 0.85rem 1rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: 1.25rem;
  font-size: 0.85rem;
  font-weight: 600;
  line-height: 1.5;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  background-color: ${props => (props.$type === 'error' ? '#FEF2F2' : '#ECFDF5')};
  border: 1px solid ${props => (props.$type === 'error' ? '#FECACA' : '#A7F3D0')};
  color: ${props => (props.$type === 'error' ? '#991B1B' : '#15803D')};
`;

const ForgotPasswordLink = styled.a`
  font-size: 0.82rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary[600]};
  text-align: left;
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled.button`
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  font-weight: 800;
  font-size: 0.98rem;
  padding: 0.9rem;
  border: none;
  border-radius: ${props => props.theme.borderRadius.xl};
  cursor: pointer;
  transition: background-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
  margin-top: 0.5rem;
  box-shadow: ${props => props.theme.shadows.brand};
  min-height: 48px;

  @media (hover: hover) {
    &:hover:not(:disabled) {
      background-color: ${props => props.theme.colors.primary[600]};
      transform: translateY(-1px);
    }
  }

  &:active:not(:disabled) {
    transform: scale(0.99);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const TermsText = styled.p`
  font-size: 0.78rem;
  color: ${props => props.theme.colors.neutral[500]};
  text-align: center;
  margin-top: 1.5rem;
  line-height: 1.65;
`;

const TermsLink = styled.a`
  color: ${props => props.theme.colors.primary[600]};
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  min-height: 34px;

  &:hover {
    text-decoration: underline;
  }
`;

const SecurityBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  margin-top: 0.85rem;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.neutral[500]};
`;

function toAsciiDigits(str: string): string {
  return str
    .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1728))
    .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1584));
}

const AuthContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(() =>
    searchParams.get('tab') === 'register' ? 'register' : 'login'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [banner, setBanner] = useState<{ text: string; type: 'error' | 'success' } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleTabChange = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    setBanner(null);
    setFieldErrors({});
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateRegisterClient = (): boolean => {
    const errors: Record<string, string> = {};
    if (!registerForm.firstName.trim()) {
      errors.firstName = 'لطفاً نام خود را وارد کنید.';
    }
    if (!registerForm.lastName.trim()) {
      errors.lastName = 'لطفاً نام خانوادگی خود را وارد کنید.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerForm.email.trim())) {
      errors.email = 'فرمت ایمیل نامعتبر است (مثال: user@example.com).';
    }
    const cleanPhone = toAsciiDigits(registerForm.phone.trim());
    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      errors.phone = 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود (مثال: ۰۹۱۲۳۴۵۶۷۸۹).';
    }
    if (registerForm.password.length < 6) {
      errors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد.';
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      errors.confirmPassword = 'تکرار رمز عبور با رمز عبور مطابقت ندارد.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBanner(null);
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!loginForm.email.trim()) errors.email = 'لطفاً ایمیل را وارد کنید.';
    if (!loginForm.password) errors.password = 'لطفاً رمز عبور را وارد کنید.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    const result = await loginAction(loginForm);
    setIsSubmitting(false);

    if (result.ok) {
      router.refresh();
      const nextParam = searchParams.get('next');
      const target = nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/';
      router.push(target);
      return;
    }

    if (result.fieldErrors) {
      setFieldErrors(result.fieldErrors);
    }
    setBanner({
      text: result.message || 'ایمیل یا رمز عبور اشتباه است.',
      type: 'error',
    });
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBanner(null);

    if (!validateRegisterClient()) {
      setBanner({
        text: 'لطفاً خطاهای مشخص‌شده در فرم را اصلاح فرمایید.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);
    const cleanPhone = toAsciiDigits(registerForm.phone.trim());
    const result = await registerAction({
      email: registerForm.email.trim(),
      password: registerForm.password,
      firstName: registerForm.firstName.trim(),
      lastName: registerForm.lastName.trim(),
      phone: cleanPhone,
    });
    setIsSubmitting(false);

    if (result.ok) {
      setBanner({
        text: result.message || (result.code === 'EMAIL_CONFIRMATION_REQUIRED'
          ? 'لینک فعال‌سازی به ایمیل ارسال شد. لطفاً صندوق ورودی خود را بررسی کنید.'
          : 'ثبت‌نام با موفقیت انجام شد! اکنون می‌توانید وارد شوید.'),
        type: 'success',
      });
      setActiveTab('login');
      setLoginForm(prev => ({ ...prev, email: registerForm.email }));
      return;
    }

    if (result.fieldErrors) {
      setFieldErrors(result.fieldErrors);
    }
    setBanner({
      text: result.message || 'ثبت‌نام انجام نشد. اطلاعات را بررسی کنید.',
      type: 'error',
    });
  };

  return (
    <AuthPageContainer>
      <AuthCard>
        <BrandMarkWrap>
          <FoodinoEmblem size={44} />
        </BrandMarkWrap>

        <PageTitle>
          {activeTab === 'login' ? 'ورود به فودینو' : 'ثبت‌نام در فودینو'}
        </PageTitle>
        <PageSub>
          {activeTab === 'login'
            ? 'برای سفارش سریع غذا و رهگیری لحظه‌ای وارد شوید'
            : 'عضویت سریع در خانواده بزرگ مشتریان فودینو'}
        </PageSub>

        <TabContainer role="tablist" aria-label="انتخاب حالت ورود یا ثبت‌نام">
          <TabButton
            type="button"
            role="tab"
            aria-selected={activeTab === 'login'}
            $active={activeTab === 'login'}
            onClick={() => handleTabChange('login')}
          >
            ورود
          </TabButton>
          <TabButton
            type="button"
            role="tab"
            aria-selected={activeTab === 'register'}
            $active={activeTab === 'register'}
            onClick={() => handleTabChange('register')}
          >
            ثبت‌نام
          </TabButton>
        </TabContainer>

        {banner && (
          <AlertBanner $type={banner.type} role="alert">
            {banner.type === 'error' ? <AlertCircleIcon size={18} /> : <CheckCircleIcon size={18} />}
            <span>{banner.text}</span>
          </AlertBanner>
        )}

        {activeTab === 'login' ? (
          <Form method="post" onSubmit={handleLoginSubmit} noValidate>
            <FormGroup>
              <LabelRow>
                <FormLabel htmlFor="email">ایمیل</FormLabel>
              </LabelRow>
              <InputWrapper>
                <FormInput
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  placeholder="example@domain.com"
                  aria-label="ایمیل"
                  dir="ltr"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  $hasError={Boolean(fieldErrors.email)}
                />
              </InputWrapper>
              {fieldErrors.email && (
                <FieldErrorMessage role="alert">
                  <AlertCircleIcon size={14} />
                  <span>{fieldErrors.email}</span>
                </FieldErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <LabelRow>
                <FormLabel htmlFor="password">رمز عبور</FormLabel>
                <ForgotPasswordLink href="/auth/forgot-password">
                  فراموشی رمز عبور؟
                </ForgotPasswordLink>
              </LabelRow>
              <InputWrapper>
                <FormInput
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  aria-label="رمز عبور"
                  dir="ltr"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  $hasError={Boolean(fieldErrors.password)}
                  $hasToggle={true}
                />
                <TogglePasswordButton
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  title={showPassword ? 'مخفی کردن' : 'نمایش رمز'}
                  aria-label={showPassword ? 'مخفی کردن رمز عبور' : 'نمایش رمز عبور'}
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </TogglePasswordButton>
              </InputWrapper>
              {fieldErrors.password && (
                <FieldErrorMessage role="alert">
                  <AlertCircleIcon size={14} />
                  <span>{fieldErrors.password}</span>
                </FieldErrorMessage>
              )}
            </FormGroup>

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'در حال بررسی اطلاعات...' : 'ورود به حساب کاربری'}
            </SubmitButton>
          </Form>
        ) : (
          <Form method="post" onSubmit={handleRegisterSubmit} noValidate>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <FormGroup style={{ flex: 1 }}>
                <FormLabel htmlFor="firstName">نام</FormLabel>
                <FormInput
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="مثال: علی"
                  aria-label="نام"
                  value={registerForm.firstName}
                  onChange={handleRegisterChange}
                  $hasError={Boolean(fieldErrors.firstName)}
                />
                {fieldErrors.firstName && (
                  <FieldErrorMessage role="alert">
                    <AlertCircleIcon size={14} />
                    <span>{fieldErrors.firstName}</span>
                  </FieldErrorMessage>
                )}
              </FormGroup>

              <FormGroup style={{ flex: 1 }}>
                <FormLabel htmlFor="lastName">نام خانوادگی</FormLabel>
                <FormInput
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="مثال: محمدی"
                  aria-label="نام خانوادگی"
                  value={registerForm.lastName}
                  onChange={handleRegisterChange}
                  $hasError={Boolean(fieldErrors.lastName)}
                />
                {fieldErrors.lastName && (
                  <FieldErrorMessage role="alert">
                    <AlertCircleIcon size={14} />
                    <span>{fieldErrors.lastName}</span>
                  </FieldErrorMessage>
                )}
              </FormGroup>
            </div>

            <FormGroup>
              <FormLabel htmlFor="register-email">ایمیل</FormLabel>
              <InputWrapper>
                <FormInput
                  type="email"
                  id="register-email"
                  name="email"
                  autoComplete="email"
                  dir="ltr"
                  placeholder="user@example.com"
                  aria-label="ایمیل"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  $hasError={Boolean(fieldErrors.email)}
                />
              </InputWrapper>
              {fieldErrors.email && (
                <FieldErrorMessage role="alert">
                  <AlertCircleIcon size={14} />
                  <span>{fieldErrors.email}</span>
                </FieldErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <LabelRow>
                <FormLabel htmlFor="phone">شماره موبایل</FormLabel>
                <HintText>۱۱ رقم با ۰۹</HintText>
              </LabelRow>
              <InputWrapper>
                <FormInput
                  type="tel"
                  id="phone"
                  name="phone"
                  autoComplete="tel"
                  dir="ltr"
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  aria-label="شماره موبایل"
                  maxLength={11}
                  value={registerForm.phone}
                  onChange={handleRegisterChange}
                  $hasError={Boolean(fieldErrors.phone)}
                />
              </InputWrapper>
              {fieldErrors.phone && (
                <FieldErrorMessage role="alert">
                  <AlertCircleIcon size={14} />
                  <span>{fieldErrors.phone}</span>
                </FieldErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <LabelRow>
                <FormLabel htmlFor="register-password">رمز عبور</FormLabel>
                <HintText>حداقل ۶ کاراکتر</HintText>
              </LabelRow>
              <InputWrapper>
                <FormInput
                  type={showPassword ? 'text' : 'password'}
                  id="register-password"
                  name="password"
                  autoComplete="new-password"
                  dir="ltr"
                  placeholder="••••••••"
                  aria-label="رمز عبور"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  $hasError={Boolean(fieldErrors.password)}
                  $hasToggle={true}
                />
                <TogglePasswordButton
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  title={showPassword ? 'مخفی کردن' : 'نمایش رمز'}
                  aria-label={showPassword ? 'مخفی کردن رمز عبور' : 'نمایش رمز عبور'}
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </TogglePasswordButton>
              </InputWrapper>
              {fieldErrors.password && (
                <FieldErrorMessage role="alert">
                  <AlertCircleIcon size={14} />
                  <span>{fieldErrors.password}</span>
                </FieldErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="confirmPassword">تکرار رمز عبور</FormLabel>
              <InputWrapper>
                <FormInput
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  autoComplete="new-password"
                  dir="ltr"
                  placeholder="••••••••"
                  aria-label="تکرار رمز عبور"
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange}
                  $hasError={Boolean(fieldErrors.confirmPassword)}
                  $hasToggle={true}
                />
                <TogglePasswordButton
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  title={showPassword ? 'مخفی کردن' : 'نمایش رمز'}
                  aria-label={showPassword ? 'مخفی کردن رمز عبور' : 'نمایش رمز عبور'}
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </TogglePasswordButton>
              </InputWrapper>
              {fieldErrors.confirmPassword && (
                <FieldErrorMessage role="alert">
                  <AlertCircleIcon size={14} />
                  <span>{fieldErrors.confirmPassword}</span>
                </FieldErrorMessage>
              )}
            </FormGroup>

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'در حال ایجاد حساب کاربری...' : 'ثبت‌نام در فودینو'}
            </SubmitButton>
          </Form>
        )}

        <TermsText>
          با ثبت‌نام یا ورود در فودینو، شما با{' '}
          <TermsLink href="/terms" target="_blank">
            قوانین و مقررات
          </TermsLink>{' '}
          سایت موافقت می‌کنید.
        </TermsText>

        <SecurityBadge>
          <ShieldCheckIcon size={14} />
          <span>احراز هویت امن سرور با کوکی‌های محافظت‌شده</span>
        </SecurityBadge>
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
