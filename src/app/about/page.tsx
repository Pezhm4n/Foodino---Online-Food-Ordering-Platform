"use client";

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import SectionReveal from '@/components/home/LandingReveal';
import { actionFeedback, actionFeedbackAttrs, cardIconFeedback } from '@/styles/motion';
import {
  UtensilsIcon,
  CourierIcon,
  ShieldCheckIcon,
  UserIcon,
  StoreIcon,
  ArrowLeftIcon,
} from '@/components/ui/FoodVisuals';

const AboutPageContainer = styled(SectionReveal)`
  max-width: 1180px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 5rem;
  direction: rtl;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 1.5rem 1rem 3.5rem;
  }
`;

const HeroBanner = styled.section`
  background: linear-gradient(135deg, #16120F 0%, #2C211B 100%);
  color: #FAF6F0;
  border-radius: ${props => props.theme.borderRadius['3xl']};
  padding: 3.5rem 2.5rem;
  margin-bottom: 3.5rem;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 2.5rem;
  align-items: center;
  box-shadow: ${props => props.theme.shadows.lg};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    padding: 2.25rem 1.5rem;
    gap: 1.75rem;
  }
`;

const Kicker = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  background: rgba(217, 56, 30, 0.22);
  border: 1px solid rgba(217, 56, 30, 0.45);
  color: #FCA5A5;
  font-size: 0.78rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const PageTitle = styled.h1`
  font-size: clamp(1.85rem, 3.5vw, 2.75rem);
  font-weight: 900;
  color: #ffffff;
  margin: 0 0 1rem;
  line-height: 1.25;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: rgba(250, 246, 240, 0.78);
  line-height: 1.85;
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const StatBox = styled.div`
  padding: 1.25rem;
  border-radius: ${props => props.theme.borderRadius.xl};
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);

  strong {
    display: block;
    font-size: 1.65rem;
    font-weight: 900;
    color: #FBBF24;
    margin-bottom: 0.25rem;
  }

  span {
    font-size: 0.82rem;
    color: rgba(250, 246, 240, 0.72);
  }
`;

const Section = styled.section`
  margin-bottom: 3.5rem;
`;

const SectionHeader = styled.div`
  margin-bottom: 2rem;

  h2 {
    font-size: clamp(1.45rem, 2.5vw, 1.95rem);
    font-weight: 900;
    color: ${props => props.theme.colors.neutral[900]};
    margin: 0 0 0.5rem;
  }

  p {
    font-size: 0.98rem;
    color: ${props => props.theme.colors.neutral[600]};
    line-height: 1.8;
    max-width: 780px;
    margin: 0;
  }
`;

const BentoPillars = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 1.35rem;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const PillarCard = styled.div<{ $accent?: boolean }>`
  background: ${props => (props.$accent ? '#FFF5F2' : '#ffffff')};
  border: 1px solid ${props => (props.$accent ? '#FFD8CE' : props.theme.colors.neutral[200])};
  border-radius: ${props => props.theme.borderRadius['2xl']};
  padding: 1.85rem;
  box-shadow: ${props => props.theme.shadows.xs};
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  ${cardIconFeedback}
`;

const IconContainer = styled.div`
  width: 52px;
  height: 52px;
  background-color: ${props => props.theme.colors.primary[50]};
  border: 1px solid ${props => props.theme.colors.primary[100]};
  color: ${props => props.theme.colors.primary[600]};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FeatureTitle = styled.h3`
  font-size: 1.15rem;
  font-weight: 800;
  color: ${props => props.theme.colors.neutral[900]};
  margin: 0;
`;

const FeatureDescription = styled.p`
  font-size: 0.92rem;
  color: ${props => props.theme.colors.neutral[600]};
  line-height: 1.75;
  margin: 0;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const TeamMemberCard = styled.div`
  background-color: #ffffff;
  border: 1px solid ${props => props.theme.colors.neutral[200]};
  border-radius: ${props => props.theme.borderRadius['2xl']};
  box-shadow: ${props => props.theme.shadows.xs};
  padding: 1.75rem;
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  ${cardIconFeedback}
`;

const AvatarBox = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background: linear-gradient(135deg, #1F1814 0%, #3A2B22 100%);
  color: #FBBF24;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  --feedback-icon-ink: #FDE68A;
`;

const TeamMemberInfo = styled.div`
  flex: 1;
`;

const TeamMemberName = styled.h3`
  font-size: 1.1rem;
  font-weight: 800;
  color: ${props => props.theme.colors.neutral[900]};
  margin: 0 0 0.2rem;
`;

const TeamMemberRole = styled.p`
  font-size: 0.82rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary[600]};
  margin: 0 0 0.65rem;
`;

const TeamMemberDescription = styled.p`
  font-size: 0.88rem;
  color: ${props => props.theme.colors.neutral[600]};
  line-height: 1.7;
  margin: 0;
`;

const TeamLink = styled(Link).attrs<typeof actionFeedbackAttrs>(actionFeedbackAttrs)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 44px;
  padding-inline: 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.primary[700]};
  font-weight: 700;
  text-underline-offset: 0.25em;
  ${actionFeedback}
`;

const JoinSection = styled.div`
  background: linear-gradient(135deg, #D9381E 0%, #96200D 100%);
  border-radius: ${props => props.theme.borderRadius['2xl']};
  padding: 2.75rem 2.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  color: white;
  flex-wrap: wrap;
`;

const JoinText = styled.div`
  max-width: 620px;

  h2 {
    font-size: 1.5rem;
    font-weight: 900;
    margin: 0 0 0.5rem;
    color: #ffffff;
  }

  p {
    font-size: 0.95rem;
    margin: 0;
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.75;
  }
`;

const JoinButton = styled(Link).attrs<typeof actionFeedbackAttrs>(actionFeedbackAttrs)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.9rem 1.75rem;
  background-color: #ffffff;
  color: ${props => props.theme.colors.primary[700]};
  border-radius: ${props => props.theme.borderRadius.xl};
  font-weight: 800;
  font-size: 0.95rem;
  text-decoration: none;
  --action-focus-color: #ffffff;
  ${actionFeedback}
`;

const AboutPage = () => (
  <AboutPageContainer>
    <HeroBanner data-landing-reveal>
      <div>
        <Kicker>سفارش آنلاین غذا</Kicker>
        <PageTitle>درباره فودینو</PageTitle>
        <Subtitle>
          در فودینو می‌توانید منوی رستوران‌ها را کنار هم ببینید، غذای دلخواهتان را سفارش بدهید و تا زمان تحویل از وضعیت سفارش باخبر باشید.
        </Subtitle>
      </div>
      <StatsGrid>
        <StatBox data-landing-card><strong>منو</strong><span>غذاها و قیمت هر رستوران</span></StatBox>
        <StatBox data-landing-card><strong>سبد</strong><span>تعداد و یادداشت هر غذا</span></StatBox>
        <StatBox data-landing-card><strong>ارسال</strong><span>هزینه و زمان تقریبی</span></StatBox>
        <StatBox data-landing-card><strong>پیگیری</strong><span>وضعیت سفارش تا تحویل</span></StatBox>
      </StatsGrid>
    </HeroBanner>

    <Section>
      <SectionHeader data-landing-reveal>
        <h2>از انتخاب غذا تا تحویل</h2>
        <p>رستوران‌ها را بر اساس نوع غذا، امتیاز یا هزینهٔ ارسال پیدا کنید.</p>
      </SectionHeader>
      <BentoPillars>
        <PillarCard $accent data-landing-card>
          <IconContainer data-feedback-icon><UtensilsIcon size={24} /></IconContainer>
          <FeatureTitle>انتخاب از منو</FeatureTitle>
          <FeatureDescription>توضیح، قیمت و گزینه‌های هر غذا را پیش از افزودن به سبد ببینید.</FeatureDescription>
        </PillarCard>
        <PillarCard data-landing-card>
          <IconContainer data-feedback-icon><ShieldCheckIcon size={24} /></IconContainer>
          <FeatureTitle>بررسی مبلغ سفارش</FeatureTitle>
          <FeatureDescription>هزینهٔ ارسال و تخفیف را همراه با مبلغ نهایی پیش از پرداخت ببینید.</FeatureDescription>
        </PillarCard>
        <PillarCard data-landing-card>
          <IconContainer data-feedback-icon><CourierIcon size={24} /></IconContainer>
          <FeatureTitle>پیگیری تا تحویل</FeatureTitle>
          <FeatureDescription>سفارش را از حساب کاربری‌تان باز کنید تا ببینید در چه مرحله‌ای است.</FeatureDescription>
        </PillarCard>
      </BentoPillars>
    </Section>

    <Section>
      <SectionHeader data-landing-reveal>
        <h2>برای شروع</h2>
      </SectionHeader>
      <TeamGrid>
        <TeamMemberCard data-landing-card>
          <AvatarBox data-feedback-icon><StoreIcon size={28} /></AvatarBox>
          <TeamMemberInfo>
            <TeamMemberName>منوی رستوران‌ها</TeamMemberName>
            <TeamMemberRole>برای سفارش تازه</TeamMemberRole>
            <TeamMemberDescription><TeamLink href="/restaurants">دیدن رستوران‌ها <ArrowLeftIcon size={15} /></TeamLink></TeamMemberDescription>
          </TeamMemberInfo>
        </TeamMemberCard>
        <TeamMemberCard data-landing-card>
          <AvatarBox data-feedback-icon><UserIcon size={28} /></AvatarBox>
          <TeamMemberInfo>
            <TeamMemberName>سفارش‌های من</TeamMemberName>
            <TeamMemberRole>برای خریدهای قبلی</TeamMemberRole>
            <TeamMemberDescription><TeamLink href="/profile">رفتن به حساب کاربری <ArrowLeftIcon size={15} /></TeamLink></TeamMemberDescription>
          </TeamMemberInfo>
        </TeamMemberCard>
      </TeamGrid>
    </Section>

    <JoinSection data-landing-reveal>
      <JoinText><h2>پیشنهادی برای فودینو دارید؟</h2><p>برای پیشنهاد همکاری یا گزارش مشکلی در سایت با ما تماس بگیرید.</p></JoinText>
      <JoinButton href="/contact">تماس با فودینو <ArrowLeftIcon size={16} /></JoinButton>
    </JoinSection>
  </AboutPageContainer>
);

export default AboutPage;
