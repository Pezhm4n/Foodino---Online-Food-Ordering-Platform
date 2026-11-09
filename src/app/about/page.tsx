"use client";

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import {
  UtensilsIcon,
  CourierIcon,
  ShieldCheckIcon,
  UserIcon,
  StoreIcon,
  ArrowLeftIcon,
} from '@/components/ui/FoodVisuals';

const AboutPageContainer = styled.div`
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

const JoinButton = styled(Link)`
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
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const AboutPage = () => {
  return (
    <AboutPageContainer>
      <HeroBanner>
        <div>
          <Kicker>داستان شکل‌گیری فودینو</Kicker>
          <PageTitle>درباره فودینو؛ پیوند هنر آشپزی و مهندسی لجستیک</PageTitle>
          <Subtitle>
            فودینو در سال ۱۴۰۰ با یک مأموریت روشن متولد شد: رساندن غذای داغ و اصیل از بهترین آشپزخانه‌های شهر به میز کاربران، با استاندارد بسته‌بندی حرفه‌ای و شفافیت کامل در زمان تحویل.
          </Subtitle>
        </div>
        <StatsGrid>
          <StatBox>
            <strong>+۱۲۰</strong>
            <span>آشپزخانه و رستوران منتخب</span>
          </StatBox>
          <StatBox>
            <strong>۳۲ دقیقه</strong>
            <span>میانگین تحویل سفارش در شهر</span>
          </StatBox>
          <StatBox>
            <strong>۹۸.۴٪</strong>
            <span>رضایت از دمای غذای تحویلی</span>
          </StatBox>
          <StatBox>
            <strong>۲۴/۷</strong>
            <span>پشتیبانی مستقیم سفارش‌ها</span>
          </StatBox>
        </StatsGrid>
      </HeroBanner>

      <Section>
        <SectionHeader>
          <h2>فلسفه کاری ما</h2>
          <p>
            ما باور داریم سفارش آنلاین غذا نباید به معنای افت کیفیت یا سرد شدن غذا در مسیر باشد. تمام فرآیندهای فودینو بر پایه سه اصل کلیدی طراحی شده‌اند:
          </p>
        </SectionHeader>

        <BentoPillars>
          <PillarCard $accent>
            <IconContainer>
              <UtensilsIcon size={24} />
            </IconContainer>
            <FeatureTitle>انتخاب سخت‌گیرانه آشپزخانه‌ها</FeatureTitle>
            <FeatureDescription>
              تنها رستوران‌هایی وارد فهرست فودینو می‌شوند که استانداردهای بهداشتی، تازگی مواد اولیه روزانه و بسته‌بندی استاندارد حرارتی را رعایت کنند.
            </FeatureDescription>
          </PillarCard>

          <PillarCard>
            <IconContainer>
              <CourierIcon size={24} />
            </IconContainer>
            <FeatureTitle>لجستیک هوشمند و سریع</FeatureTitle>
            <FeatureDescription>
              تخصیص خودکار نزدیک‌ترین سفیر به آشپزخانه هم‌زمان با مرحله پخت، زمان انتظار غذا پس از آماده‌سازی را به صفر نزدیک می‌کند.
            </FeatureDescription>
          </PillarCard>

          <PillarCard>
            <IconContainer>
              <ShieldCheckIcon size={24} />
            </IconContainer>
            <FeatureTitle>شفافیت مالی و تضمین کیفیت</FeatureTitle>
            <FeatureDescription>
              محاسبه قیمت‌ها مستقیماً روی سرور انجام می‌شود و بیش از ۹۵٪ مشتریان تجربه سفارش خود را عالی ارزیابی کرده‌اند.
            </FeatureDescription>
          </PillarCard>
        </BentoPillars>
      </Section>

      <Section>
        <SectionHeader>
          <h2>تیم راهبری فودینو</h2>
          <p>
            فودینو توسط جمعی از متخصصان صنعت غذا، عملیات لجستیک و مهندسی نرم‌افزار هدایت می‌شود.
          </p>
        </SectionHeader>

        <TeamGrid>
          <TeamMemberCard>
            <AvatarBox>
              <UserIcon size={28} />
            </AvatarBox>
            <TeamMemberInfo>
              <TeamMemberName>محمد علیزاده</TeamMemberName>
              <TeamMemberRole>مدیرعامل و هم‌بنیان‌گذار</TeamMemberRole>
              <TeamMemberDescription>
                با بیش از ۱۰ سال تجربه در صنعت رستوران‌داری و پلتفرم‌های دیجیتال، محمد معمار استانداردهای عملیاتی و تجربه کاربری فودینو است.
              </TeamMemberDescription>
            </TeamMemberInfo>
          </TeamMemberCard>

          <TeamMemberCard>
            <AvatarBox>
              <StoreIcon size={28} />
            </AvatarBox>
            <TeamMemberInfo>
              <TeamMemberName>سارا رضایی</TeamMemberName>
              <TeamMemberRole>مدیر شبکه رستوران‌ها و کنترل کیفیت</TeamMemberRole>
              <TeamMemberDescription>
                سارا مسئول ارزیابی دوره‌ای منوها، کیفیت بسته‌بندی و توسعه همکاری با برترین سرآشپزها و رستوران‌های شهر است.
              </TeamMemberDescription>
            </TeamMemberInfo>
          </TeamMemberCard>
        </TeamGrid>
      </Section>

      <JoinSection>
        <JoinText>
          <h2>همکاری با فودینو</h2>
          <p>
            اگر صاحب رستوران هستید یا علاقه‌مند به فعالیت در تیم فنی و عملیاتی فودینو هستید، مشتاق شنیدن صدای شما هستیم.
          </p>
        </JoinText>
        <JoinButton href="/contact">
          <span>تماس با تیم ما</span>
          <ArrowLeftIcon size={16} />
        </JoinButton>
      </JoinSection>
    </AboutPageContainer>
  );
};

export default AboutPage;
