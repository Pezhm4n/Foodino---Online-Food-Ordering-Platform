"use client";

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const FooterContainer = styled.footer`
  background-color: ${props => props.theme.colors.secondary[900]};
  color: ${props => props.theme.colors.neutral[300]};
  padding: 4rem 2rem 2rem;
  border-top: 1px solid ${props => props.theme.colors.secondary[800]};
  direction: rtl;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 2.25rem 1rem 1.5rem;
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
  gap: 2.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const BrandSection = styled(FooterSection)`
  p {
    font-size: 0.95rem;
    line-height: 1.7;
    color: ${props => props.theme.colors.neutral[400]};
    margin: 1rem 0 1.25rem;

    @media (max-width: ${props => props.theme.breakpoints.sm}) {
      font-size: 0.875rem;
      margin: 0.5rem 0 1rem;
    }
  }
`;

const FooterTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: white;
  margin-bottom: 1.25rem;
  position: relative;
  display: inline-block;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 1.05rem;
    margin-bottom: 0.75rem;
  }

  &::after {
    content: '';
    display: block;
    width: 24px;
    height: 3px;
    background-color: ${props => props.theme.colors.primary[500]};
    border-radius: 2px;
    margin-top: 0.4rem;
  }
`;

const FooterLink = styled(Link)`
  color: ${props => props.theme.colors.neutral[400]};
  text-decoration: none;
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 36px;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 0.875rem;
    margin-bottom: 0.35rem;
    min-height: 34px;
  }
  
  &:hover {
    color: ${props => props.theme.colors.primary[400]};
    transform: translateX(-4px);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: white;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[500]};
    border-color: ${props => props.theme.colors.primary[500]};
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.85rem;
  font-size: 0.925rem;
  color: ${props => props.theme.colors.neutral[400]};
  line-height: 1.6;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 0.85rem;
    margin-bottom: 0.65rem;
    gap: 0.5rem;
  }

  span.icon {
    color: ${props => props.theme.colors.primary[400]};
    flex-shrink: 0;
    font-size: 1.1rem;
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 3.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  color: ${props => props.theme.colors.neutral[500]};
  font-size: 0.875rem;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    margin-top: 1.75rem;
    padding-top: 1.25rem;
    font-size: 0.8rem;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <BrandSection>
          <FooterTitle>فودینو</FooterTitle>
          <p>سفارش آنلاین غذای خود را در سریع‌ترین زمان ممکن با بهترین کیفیت از برترین رستوران‌های شهر تحویل بگیرید.</p>
          <SocialLinks>
            <SocialIcon href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="فیس‌بوک فودینو">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </SocialIcon>
            <SocialIcon href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="توییتر فودینو">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M23 3.00005C22.0424 3.67552 20.9821 4.19216 19.86 4.53005C19.2577 3.83756 18.4573 3.34674 17.567 3.12397C16.6767 2.90121 15.7395 2.95724 14.8821 3.2845C14.0247 3.61176 13.2884 4.19445 12.773 4.95376C12.2575 5.71308 11.9877 6.61238 12 7.53005V8.53005C10.2426 8.57561 8.50127 8.18586 6.93101 7.39549C5.36074 6.60513 4.01032 5.43868 3 4.00005C3 4.00005 -1 13 8 17C5.94053 18.398 3.48716 19.099 1 19C10 24 21 19 21 7.50005C20.9991 7.2215 20.9723 6.94364 20.92 6.67005C21.9406 5.66354 22.6608 4.39276 23 3.00005Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </SocialIcon>
            <SocialIcon href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="اینستاگرام فودینو">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4078 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61991 14.1902 8.22773 13.4229 8.09406 12.5922C7.9604 11.7615 8.09206 10.9099 8.47032 10.1584C8.84858 9.40685 9.45418 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87659 12.63 8C13.4789 8.12588 14.2648 8.52146 14.8717 9.12831C15.4785 9.73515 15.8741 10.5211 16 11.37Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="16.5" cy="7.5" r="1.5" fill="white"/>
              </svg>
            </SocialIcon>
          </SocialLinks>
        </BrandSection>
        
        <FooterSection>
          <FooterTitle>دسترسی سریع</FooterTitle>
          <FooterLink href="/">خانه</FooterLink>
          <FooterLink href="/restaurants">رستوران‌ها</FooterLink>
          <FooterLink href="/categories">دسته‌بندی‌ها</FooterLink>
          <FooterLink href="/profile">حساب کاربری</FooterLink>
          <FooterLink href="/cart">سبد خرید</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>اطلاعات</FooterTitle>
          <FooterLink href="/about">درباره ما</FooterLink>
          <FooterLink href="/contact">تماس با ما</FooterLink>
          <FooterLink href="/faq">سوالات متداول</FooterLink>
          <FooterLink href="/terms">قوانین و مقررات</FooterLink>
          <FooterLink href="/privacy">حریم خصوصی</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>تماس با ما</FooterTitle>
          <ContactItem>
            <span className="icon">📍</span>
            <span>تهران، خیابان ولیعصر، خیابان بهشتی، پلاک ۴۵</span>
          </ContactItem>
          <ContactItem>
            <span className="icon">📞</span>
            <span dir="ltr">۰۲۱-۱۲۳۴۵۶۷۸</span>
          </ContactItem>
          <ContactItem>
            <span className="icon">✉️</span>
            <span>info@foodino.ir</span>
          </ContactItem>
        </FooterSection>
      </FooterContent>
      
      <Copyright>
        © {new Date().toLocaleDateString('fa-IR', { year: 'numeric' })} فودینو — تمامی حقوق محفوظ است.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer; 