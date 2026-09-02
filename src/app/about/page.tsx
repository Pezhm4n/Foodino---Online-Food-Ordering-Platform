"use client";

import React from 'react';
import styled from 'styled-components';

// کامپوننت‌های استایل شده
const AboutPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem 5rem;
  direction: rtl;
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const PageTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  color: ${props => props.theme.colors.neutral[900]};
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  color: ${props => props.theme.colors.neutral[500]};
  margin-bottom: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const Section = styled.section`
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.neutral[900]};
  margin-bottom: 1rem;
  text-align: center;
`;

const SectionDescription = styled.p`
  font-size: 1.05rem;
  color: ${props => props.theme.colors.neutral[600]};
  text-align: center;
  max-width: 800px;
  margin: 0 auto 2.5rem;
  line-height: 1.7;
`;

const FeaturesContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FeatureCard = styled.div`
  flex: 1;
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.boxShadow.md};
  padding: 2rem;
  text-align: center;
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-8px);
  }
`;

const IconContainer = styled.div`
  width: 80px;
  height: 80px;
  background-color: ${props => props.theme.colors.primary[400] + '20'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 2.5rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  color: ${props => props.theme.colors.neutral[900]};
  margin-bottom: 0.75rem;
`;

const FeatureDescription = styled.p`
  font-size: 0.95rem;
  color: ${props => props.theme.colors.neutral[600]};
  line-height: 1.7;
`;

const TeamContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const TeamMemberCard = styled.div`
  width: 280px;
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.boxShadow.md};
  overflow: hidden;
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-8px);
  }
`;

const TeamMemberImage = styled.div`
  height: 280px;
  background-color: ${props => props.theme.colors.neutral[300]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
`;

const TeamMemberInfo = styled.div`
  padding: 1.5rem;
  text-align: center;
`;

const TeamMemberName = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.secondary[500]};
  margin-bottom: 0.5rem;
`;

const TeamMemberRole = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.primary[500]};
  margin-bottom: 1rem;
`;

const TeamMemberDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[500]};
  line-height: 1.6;
`;

const JoinSection = styled.div`
  background-color: ${props => props.theme.colors.primary[500]};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 3rem;
  text-align: center;
  color: white;
  margin-top: 4rem;
`;

const JoinTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  margin-bottom: 1rem;
`;

const JoinDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.md};
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const JoinButton = styled.a`
  display: inline-block;
  padding: 1rem 2rem;
  background-color: white;
  color: ${props => props.theme.colors.primary[500]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  text-decoration: none;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.neutral[100]};
    transform: scale(1.05);
  }
`;

const AboutPage = () => {
  return (
    <AboutPageContainer>
      <HeroSection>
        <PageTitle>درباره فودینو</PageTitle>
        <Subtitle>
          داستان ما از یک ایده ساده شروع شد: ارائه غذای با کیفیت با سرویس‌دهی عالی به مشتریان
        </Subtitle>
      </HeroSection>
      
      <Section>
        <SectionTitle>داستان ما</SectionTitle>
        <SectionDescription>
          فودینو در سال ۱۴۰۰ با هدف ایجاد پلتفرمی برای سفارش آنلاین غذا از رستوران‌های برتر تهران تاسیس شد. ما با تیمی کوچک اما پرانرژی شروع کردیم و امروز به یکی از بزرگترین سرویس‌های سفارش آنلاین غذا تبدیل شده‌ایم. هدف ما ساده است: فراهم کردن بهترین تجربه سفارش غذا برای مشتریان و کمک به رستوران‌ها برای رسیدن به مشتریان بیشتر.
        </SectionDescription>
        
        <FeaturesContainer>
          <FeatureCard>
            <IconContainer>🍽️</IconContainer>
            <FeatureTitle>کیفیت</FeatureTitle>
            <FeatureDescription>
              ما فقط با رستوران‌هایی همکاری می‌کنیم که استانداردهای بالای کیفیت غذا را رعایت می‌کنند و مواد اولیه تازه استفاده می‌کنند.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <IconContainer>⚡</IconContainer>
            <FeatureTitle>سرعت</FeatureTitle>
            <FeatureDescription>
              سیستم هوشمند ما زمان تحویل سفارش را به حداقل می‌رساند و شما می‌توانید غذای خود را در کمترین زمان ممکن دریافت کنید.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <IconContainer>🛡️</IconContainer>
            <FeatureTitle>اعتماد</FeatureTitle>
            <FeatureDescription>
              بیش از ۹۵٪ مشتریان ما تجربه خرید خود را عالی ارزیابی کرده‌اند و مجدداً از سرویس ما استفاده می‌کنند.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesContainer>
      </Section>
      
      <Section>
        <SectionTitle>تیم ما</SectionTitle>
        <SectionDescription>
          فودینو توسط تیمی از متخصصان با تجربه در صنعت غذا و فناوری اداره می‌شود. همه اعضای تیم ما با هدف مشترک ارائه بهترین خدمات به مشتریان کار می‌کنند.
        </SectionDescription>
        
        <TeamContainer>
          <TeamMemberCard>
            <TeamMemberImage>👨‍💼</TeamMemberImage>
            <TeamMemberInfo>
              <TeamMemberName>محمد علیزاده</TeamMemberName>
              <TeamMemberRole>مدیر عامل و بنیان‌گذار</TeamMemberRole>
              <TeamMemberDescription>
                محمد با بیش از ۱۰ سال تجربه در صنعت رستوران‌داری و فناوری، فودینو را با هدف پر کردن شکاف بین رستوران‌های برتر و مشتریان تاسیس کرد.
              </TeamMemberDescription>
            </TeamMemberInfo>
          </TeamMemberCard>
          
          <TeamMemberCard>
            <TeamMemberImage>👩‍💼</TeamMemberImage>
            <TeamMemberInfo>
              <TeamMemberName>سارا رضایی</TeamMemberName>
              <TeamMemberRole>مدیر ارتباط با رستوران‌ها</TeamMemberRole>
              <TeamMemberDescription>
                سارا مسئول برقراری و حفظ ارتباط با رستوران‌های همکار است و با استفاده از تجربه ۸ ساله خود، بهترین رستوران‌ها را برای همکاری انتخاب می‌کند.
              </TeamMemberDescription>
            </TeamMemberInfo>
          </TeamMemberCard>
        </TeamContainer>
      </Section>
      
      <JoinSection>
        <JoinTitle>به فودینو بپیوندید</JoinTitle>
        <JoinDescription>
          اگر به صنعت غذا و فناوری علاقه دارید و می‌خواهید در یک محیط پویا و رو به رشد کار کنید، فودینو منتظر شماست. ما همیشه به دنبال استعدادهای جدید هستیم.
        </JoinDescription>
        <JoinButton href="/contact">تماس با ما</JoinButton>
      </JoinSection>
    </AboutPageContainer>
  );
};

export default AboutPage; 
