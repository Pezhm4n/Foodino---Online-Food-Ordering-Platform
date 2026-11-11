"use client";

import React from "react";
import styled from "styled-components";
import Link from "next/link";
export interface LandingReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  foodName: string;
  restaurantName: string;
  restaurantSlug: string;
}
import {
  StarIcon,
  ShieldCheckIcon,
  ClockIcon,
  CourierIcon,
  FlameIcon,
  SparkleIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
} from "@/components/ui/FoodVisuals";

const OuterSection = styled.section`
  padding: 4.5rem 1.75rem 5rem;
  background: linear-gradient(180deg, #faf6f0 0%, #f3ece2 100%);
  border-top: 1px solid ${(props) => props.theme.colors.neutral[200]};
  direction: rtl;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    padding: 3rem 1rem 3.5rem;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 1.95rem 0.9rem 2.25rem;
  }
`;

const Container = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 4.5rem;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    gap: 3rem;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    gap: 2.15rem;
  }
`;

const BlockHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.4rem;
  margin-bottom: 1.85rem;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    margin-bottom: 1.15rem;
  }
`;

const Eyebrow = styled.span`
  font-size: 0.78rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary[600]};
`;

const BlockTitle = styled.h2`
  font-size: clamp(1.45rem, 2.5vw, 2rem);
  font-weight: 800;
  color: ${(props) => props.theme.colors.neutral[900]};
  margin: 0;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 1.28rem;
  }
`;

const BlockSubtitle = styled.p`
  font-size: 0.95rem;
  color: ${(props) => props.theme.colors.neutral[600]};
  margin: 0;
  max-width: 60ch;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 0.84rem;
  }
`;

/* ============================================================================
 * ۱. مراحل سفارش در فودینو (How It Works)
 * ========================================================================== */

const StepsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.35rem;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 0.85rem;
  }
`;

const StepCard = styled.div.attrs<{ 'data-landing-card'?: string }>({ 'data-landing-card': '' })`
  background: #ffffff;
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  border-radius: 1.35rem;
  padding: 1.65rem 1.5rem;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  box-shadow: 0 6px 18px -6px rgba(22, 18, 15, 0.05);
  transition: box-shadow 240ms var(--ease-out),
    border-color 240ms var(--ease-out);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      box-shadow: 0 20px 34px -10px rgba(22, 18, 15, 0.12);
      border-color: ${(props) => props.theme.colors.primary[300]};
    }
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 1.15rem 1.1rem;
    border-radius: 1.15rem;
    gap: 0.55rem;
  }
`;

const StepTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StepNumberBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 800;
  background: ${(props) => props.theme.colors.primary[50]};
  color: ${(props) => props.theme.colors.primary[600]};
  border: 1px solid ${(props) => props.theme.colors.primary[200]};
`;

const StepIconCircle = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: ${(props) => props.theme.colors.neutral[900]};
  color: #faf6f0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 240ms var(--ease-out);

  @media (hover: hover) and (pointer: fine) {
    ${StepCard}:hover & {
      background: ${(props) => props.theme.colors.primary[500]};
    }
  }
`;

const StepTitle = styled.h3`
  font-size: 1.12rem;
  font-weight: 800;
  color: ${(props) => props.theme.colors.neutral[900]};
  margin: 0.25rem 0 0;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 1rem;
  }
`;

const StepDesc = styled.p`
  font-size: 0.88rem;
  color: ${(props) => props.theme.colors.neutral[600]};
  line-height: 1.7;
  margin: 0;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 0.82rem;
  }
`;

/* ============================================================================
 * ۲. گرید بنتو استانداردهای فودینو (Asymmetric Bento Grid)
 * ========================================================================== */

const BentoGrid = styled.div`
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 1.35rem;

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 0.9rem;
  }
`;

const DarkFeatureBento = styled.div.attrs<{ 'data-landing-card'?: string }>({ 'data-landing-card': '' })`
  background: linear-gradient(145deg, #16120f 0%, #2b1d16 100%);
  color: #faf6f0;
  border-radius: 1.5rem;
  padding: 2.25rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.75rem;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 22px 44px -14px rgba(22, 18, 15, 0.35);

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 1.25rem 1.1rem;
    border-radius: 1.2rem;
    gap: 1.15rem;
  }
`;

const BentoTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  width: fit-content;
  font-size: 0.76rem;
  font-weight: 700;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  background: rgba(217, 56, 30, 0.24);
  color: #fcd34d;
  border: 1px solid rgba(252, 211, 77, 0.3);
`;

const BentoHeading = styled.h3`
  font-size: 1.5rem;
  font-weight: 800;
  color: #faf6f0;
  margin: 0.75rem 0 0.65rem;
  line-height: 1.35;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 1.18rem;
  }
`;

const BentoText = styled.p`
  font-size: 0.92rem;
  color: rgba(250, 246, 240, 0.78);
  line-height: 1.75;
  margin: 0;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 0.82rem;
  }
`;

const SimulatedUIPanel = styled.div`
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 1.1rem;
  padding: 1rem 1.15rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

const TelemetryLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .pulse {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #4ade80;
    animation: foodinoPulseDot 2s infinite;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  }
`;

const BentoSideStack = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 1.35rem;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    gap: 0.9rem;
  }
`;

const LightBentoCard = styled.div.attrs<{ 'data-landing-card'?: string }>({ 'data-landing-card': '' })`
  background: #ffffff;
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  border-radius: 1.5rem;
  padding: 1.65rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.75rem;
  box-shadow: 0 6px 18px -6px rgba(22, 18, 15, 0.05);
  transition: box-shadow 240ms var(--ease-out),
    border-color 240ms var(--ease-out);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      box-shadow: 0 18px 32px -10px rgba(22, 18, 15, 0.1);
      border-color: ${(props) => props.theme.colors.primary[300]};
    }
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 1.15rem 1.1rem;
    border-radius: 1.2rem;
    gap: 0.55rem;
  }

  h4 {
    font-size: 1.15rem;
    font-weight: 800;
    color: ${(props) => props.theme.colors.neutral[900]};
    margin: 0;

    @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
      font-size: 1rem;
    }
  }

  p {
    font-size: 0.88rem;
    color: ${(props) => props.theme.colors.neutral[600]};
    line-height: 1.7;
    margin: 0;

    @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
      font-size: 0.82rem;
    }
  }
`;

/* ============================================================================
 * ۳. نظرات مشتریان (Customer Reviews)
 * ========================================================================== */

const ReviewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.35rem;

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 0.9rem;
  }
`;

const ReviewCard = styled.article.attrs<{ 'data-landing-card'?: string }>({ 'data-landing-card': '' })`
  background: #ffffff;
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  border-radius: 1.35rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 6px 18px -6px rgba(22, 18, 15, 0.05);
  transition: box-shadow 240ms var(--ease-out),
    border-color 240ms var(--ease-out);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      box-shadow: 0 20px 36px -12px rgba(22, 18, 15, 0.12);
      border-color: ${(props) => props.theme.colors.primary[200]};
    }
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 1.15rem 1.1rem;
    border-radius: 1.15rem;
    gap: 0.8rem;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ReviewerProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const AvatarInitial = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.primary[50]};
  color: ${(props) => props.theme.colors.primary[700]};
  border: 1px solid ${(props) => props.theme.colors.primary[200]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.95rem;
`;

const ReviewerMeta = styled.div`
  display: flex;
  flex-direction: column;

  strong {
    font-size: 0.92rem;
    color: ${(props) => props.theme.colors.neutral[900]};
  }

  span {
    font-size: 0.75rem;
    color: ${(props) => props.theme.colors.success[600]};
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }
`;

const StarsRow = styled.div`
  display: inline-flex;
  gap: 0.15rem;
  color: #e59a11;
`;

const ReviewQuote = styled.p`
  font-size: 0.88rem;
  color: ${(props) => props.theme.colors.neutral[700]};
  line-height: 1.75;
  margin: 0;
  flex: 1;
`;

const OrderedDishTag = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.8rem;
  min-height: 36px;
  background: ${(props) => props.theme.colors.neutral[50]};
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  border-radius: 0.75rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.neutral[800]};
  text-decoration: none;
  transition: border-color 180ms var(--ease-out),
    color 180ms var(--ease-out),
    transform 180ms var(--ease-out);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: ${(props) => props.theme.colors.primary[400]};
      color: ${(props) => props.theme.colors.primary[600]};
      transform: translateX(-2px);
    }
  }

  &:active {
    transform: scale(0.98);
  }
`;

const QualityBadges = ({ reviews, demo = false }: { reviews: readonly LandingReview[]; demo?: boolean }) => {
  const displayedReviews = reviews.map((review) => ({
    id: review.id,
    initial: review.userName.trim().slice(0, 1),
    name: review.userName,
    quote: review.comment,
    dishOrder: [review.foodName, review.restaurantName].filter(Boolean).join(" • "),
    href: `/restaurants/${review.restaurantSlug}`,
    rating: review.rating,
  }));
  return (
    <OuterSection>
      <Container>
        {/* بخش ۱: مراحل سفارش */}
        <div data-landing-reveal>
          <BlockHeader>
            <Eyebrow>مسیر ساده و شفاف</Eyebrow>
            <BlockTitle>چطور در فودینو سفارش دهیم؟</BlockTitle>
            <BlockSubtitle>
              از انتخاب غذا تا پیگیری سفارش، همه‌چیز همین‌جاست
            </BlockSubtitle>
          </BlockHeader>

          <StepsRow>
            <StepCard>
              <StepTopRow>
                <StepNumberBadge>گام اول</StepNumberBadge>
                <StepIconCircle>
                  <SparkleIcon size={20} />
                </StepIconCircle>
              </StepTopRow>
              <StepTitle>غذای دلخواهتان را انتخاب کنید</StepTitle>
              <StepDesc>
                منوی رستوران‌ها را ببینید و توضیحات و قیمت غذاها را مقایسه کنید
                تا انتخاب برایتان راحت‌تر شود.
              </StepDesc>
            </StepCard>

            <StepCard>
              <StepTopRow>
                <StepNumberBadge>گام دوم</StepNumberBadge>
                <StepIconCircle>
                  <ShieldCheckIcon size={20} />
                </StepIconCircle>
              </StepTopRow>
              <StepTitle>سفارشتان را کامل کنید</StepTitle>
              <StepDesc>
                غذاها را به سبد اضافه کنید، یادداشت و کد تخفیف را وارد کنید
                و مبلغ نهایی را پیش از پرداخت ببینید.
              </StepDesc>
            </StepCard>

            <StepCard>
              <StepTopRow>
                <StepNumberBadge>گام سوم</StepNumberBadge>
                <StepIconCircle>
                  <CourierIcon size={20} />
                </StepIconCircle>
              </StepTopRow>
              <StepTitle>مراحل سفارش را دنبال کنید</StepTitle>
              <StepDesc>
                با کد رهگیری ببینید رستوران سفارشتان را پذیرفته، غذا در حال
                آماده‌شدن است یا برایتان ارسال شده است.
              </StepDesc>
            </StepCard>
          </StepsRow>
        </div>

        {/* بخش ۲: استانداردهای طلایی فودینو (Bento) */}
        <div data-landing-reveal>
          <BlockHeader>
            <Eyebrow>انتخاب راحت‌تر، سفارش روشن‌تر</Eyebrow>
            <BlockTitle>هرچه برای سفارش غذا لازم دارید</BlockTitle>
          </BlockHeader>

          <BentoGrid>
            <DarkFeatureBento>
              <div>
                <BentoTag>
                  <FlameIcon size={14} />
                  <span>از انتخاب تا رسیدن غذا</span>
                </BentoTag>
                <BentoHeading>
                  بدانید غذایتان در چه مرحله‌ای است
                </BentoHeading>
                <BentoText>
                  بعد از ثبت سفارش، کد رهگیری همراه شماست. هر وقت خواستید
                  به صفحه سفارش سر بزنید و وضعیت آماده‌سازی و ارسال غذا را
                  ببینید.
                </BentoText>
              </div>

              <SimulatedUIPanel>
                <TelemetryLeft>
                  <span className="pulse" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.88rem" }}>
                      پیگیری سفارش شما
                    </div>
                    <div
                      style={{
                        fontSize: "0.76rem",
                        color: "rgba(250,246,240,0.7)",
                      }}
                    >
                      کد رهگیری را از جزئیات سفارش بردارید
                    </div>
                  </div>
                </TelemetryLeft>
                <Link
                  href="/order-tracking"
                  style={{
                    background: "#D9381E",
                    color: "#FFFFFF",
                    padding: "0.45rem 0.9rem",
                    minHeight: "34px",
                    borderRadius: "999px",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  <span>رهگیری سفارش</span>
                  <ArrowLeftIcon size={13} />
                </Link>
              </SimulatedUIPanel>
            </DarkFeatureBento>

            <BentoSideStack>
              <LightBentoCard>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "#15803D",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                  }}
                >
                  <CheckCircleIcon size={18} />
                  <span>قیمت روشن پیش از پرداخت</span>
                </div>
                <h4>مبلغ سفارشتان را کامل ببینید</h4>
                <p>
                  قیمت غذا، هزینه ارسال و تخفیف را پیش از پرداخت ببینید
                  تا بدانید بابت چه چیزهایی پرداخت می‌کنید.
                </p>
              </LightBentoCard>

              <LightBentoCard>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "#D9381E",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                  }}
                >
                  <ClockIcon size={18} />
                  <span>نظر مشتریان را بخوانید</span>
                </div>
                <h4>با شناخت بیشتری انتخاب کنید</h4>
                <p>
                  امتیاز و نظرهای هر رستوران را کنار منوی آن ببینید
                  و غذایی را انتخاب کنید که به سلیقه شما نزدیک‌تر است.
                </p>
              </LightBentoCard>
            </BentoSideStack>
          </BentoGrid>
        </div>

        {/* بخش ۳: تجربه مشتریان */}
        <div data-landing-reveal>
          <BlockHeader>
            <Eyebrow>صدای مشتریان</Eyebrow>
            <BlockTitle>{demo ? "نمونه تجربه سفارش‌دهندگان" : "تجربه سفارش‌دهندگان"}</BlockTitle>
            <BlockSubtitle>
              {demo ? "این نظرها برای نمایش تجربه سفارش در نسخه نمایشی هستند." : "نظرات ثبت‌شده درباره رستوران‌های فودینو"}
            </BlockSubtitle>
          </BlockHeader>

          <ReviewsGrid>
            {displayedReviews.length === 0 && <ReviewCard><ReviewQuote>هنوز نظری برای نمایش ثبت نشده است.</ReviewQuote></ReviewCard>}
            {displayedReviews.map((review) => (
              <ReviewCard key={review.id}>
                <ReviewHeader>
                  <ReviewerProfile>
                    <AvatarInitial>{review.initial}</AvatarInitial>
                    <ReviewerMeta>
                      <strong>{review.name}</strong>
                      <span>
                        <CheckCircleIcon size={12} />
                        <span>{demo ? "نظر نمایشی" : "نظر ثبت‌شده"}</span>
                      </span>
                    </ReviewerMeta>
                  </ReviewerProfile>
                  <StarsRow aria-label={`امتیاز ${review.rating.toLocaleString("fa-IR")} از ۵`}>
                    {Array.from({ length: Math.max(0, Math.min(5, Math.round(review.rating))) }, (_, index) => <StarIcon key={index} size={14} />)}
                  </StarsRow>
                </ReviewHeader>

                <ReviewQuote>«{review.quote}»</ReviewQuote>

                <OrderedDishTag href={review.href}>
                  <span>{review.dishOrder}</span>
                  <ArrowLeftIcon size={14} />
                </OrderedDishTag>
              </ReviewCard>
            ))}
          </ReviewsGrid>
        </div>
      </Container>
    </OuterSection>
  );
};

export default QualityBadges;
