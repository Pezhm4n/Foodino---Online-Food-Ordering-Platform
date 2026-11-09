"use client";

import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { motion } from "framer-motion";
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
`;

const BlockHeader = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.4rem;
  margin-bottom: 1.85rem;
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
`;

const BlockSubtitle = styled.p`
  font-size: 0.95rem;
  color: ${(props) => props.theme.colors.neutral[600]};
  margin: 0;
  max-width: 60ch;
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
    gap: 1rem;
  }
`;

const StepCard = styled(motion.div)`
  background: #ffffff;
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  border-radius: 1.35rem;
  padding: 1.65rem 1.5rem;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  box-shadow: 0 6px 18px -6px rgba(22, 18, 15, 0.05);
  transition: transform 240ms var(--ease-out),
    box-shadow 240ms var(--ease-out),
    border-color 240ms var(--ease-out);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 34px -10px rgba(22, 18, 15, 0.12);
      border-color: ${(props) => props.theme.colors.primary[300]};
    }
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
  transition: transform 240ms var(--ease-out),
    background-color 240ms var(--ease-out);

  ${StepCard}:hover & {
    transform: scale(1.08) rotate(-4deg);
    background: ${(props) => props.theme.colors.primary[500]};
  }
`;

const StepTitle = styled.h3`
  font-size: 1.12rem;
  font-weight: 800;
  color: ${(props) => props.theme.colors.neutral[900]};
  margin: 0.25rem 0 0;
`;

const StepDesc = styled.p`
  font-size: 0.88rem;
  color: ${(props) => props.theme.colors.neutral[600]};
  line-height: 1.7;
  margin: 0;
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
  }
`;

const DarkFeatureBento = styled(motion.div)`
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
    padding: 1.5rem 1.25rem;
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
`;

const BentoText = styled.p`
  font-size: 0.92rem;
  color: rgba(250, 246, 240, 0.78);
  line-height: 1.75;
  margin: 0;
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
  }
`;

const BentoSideStack = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 1.35rem;
`;

const LightBentoCard = styled(motion.div)`
  background: #ffffff;
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  border-radius: 1.5rem;
  padding: 1.65rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.75rem;
  box-shadow: 0 6px 18px -6px rgba(22, 18, 15, 0.05);
  transition: transform 240ms var(--ease-out),
    box-shadow 240ms var(--ease-out),
    border-color 240ms var(--ease-out);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 18px 32px -10px rgba(22, 18, 15, 0.1);
      border-color: ${(props) => props.theme.colors.primary[300]};
    }
  }

  h4 {
    font-size: 1.15rem;
    font-weight: 800;
    color: ${(props) => props.theme.colors.neutral[900]};
    margin: 0;
  }

  p {
    font-size: 0.88rem;
    color: ${(props) => props.theme.colors.neutral[600]};
    line-height: 1.7;
    margin: 0;
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
    gap: 1rem;
  }
`;

const ReviewCard = styled(motion.article)`
  background: #ffffff;
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  border-radius: 1.35rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 6px 18px -6px rgba(22, 18, 15, 0.05);
  transition: transform 240ms var(--ease-out),
    box-shadow 240ms var(--ease-out),
    border-color 240ms var(--ease-out);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 36px -12px rgba(22, 18, 15, 0.12);
      border-color: ${(props) => props.theme.colors.primary[200]};
    }
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

  &:hover {
    border-color: ${(props) => props.theme.colors.primary[400]};
    color: ${(props) => props.theme.colors.primary[600]};
    transform: translateX(-2px);
  }
`;

const REVIEWS = [
  {
    id: "rev-1",
    initial: "س",
    name: "سارا محمدی",
    quote:
      "پیتزا مخصوص از پیتزا برتر واقعاً داغ به دستم رسید. خمیرش کاملاً ترد بود و زمان ارسال دقیقاً مطابق چیزی بود که در رهگیری سفارش نشون می‌داد.",
    dishOrder: "پیتزا مخصوص • پیتزا برتر",
    href: "/restaurants/best-pizza",
  },
  {
    id: "rev-2",
    initial: "ک",
    name: "کیوان رضایی",
    quote:
      "دبل چیزبرگر دودی برگرلند فوق‌العاده آبدار و خوش‌طعم بود. بسته‌بندی مقوایی باعث شده بود سیب‌زمینی‌ها اصلاً خمیر نشن.",
    dishOrder: "دبل چیزبرگر دودی • برگرلند",
    href: "/restaurants/burger-land",
  },
  {
    id: "rev-3",
    initial: "ن",
    name: "نگار جاوید",
    quote:
      "سوشی سالمون نروژی از سوشی تاکو با پک خنک‌کننده اختصاصی ارسال شد. تازگی مواد اولیه و شفافیت قیمت‌ها بدون هزینه پنهان عالیه.",
    dishOrder: "سالمون رول • سوشی تاکو",
    href: "/restaurants/sushi-tako",
  },
];

const QualityBadges = () => {
  return (
    <OuterSection>
      <Container>
        {/* بخش ۱: مراحل سفارش */}
        <div>
          <BlockHeader
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.42, ease: [0.23, 1, 0.32, 1] }}
          >
            <Eyebrow>مسیر ساده و شفاف</Eyebrow>
            <BlockTitle>چطور در فودینو سفارش دهیم؟</BlockTitle>
            <BlockSubtitle>
              بدون پیچیدگی و در سه گام کوتاه، غذای شما از تنور رستوران حرکت می‌کند
            </BlockSubtitle>
          </BlockHeader>

          <StepsRow>
            <StepCard
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, delay: 0, ease: [0.23, 1, 0.32, 1] }}
            >
              <StepTopRow>
                <StepNumberBadge>گام اول</StepNumberBadge>
                <StepIconCircle>
                  <SparkleIcon size={20} />
                </StepIconCircle>
              </StepTopRow>
              <StepTitle>انتخاب رستوران و منوی زنده</StepTitle>
              <StepDesc>
                از میان رستوران‌های منتخب، منوی به‌روز، ترکیبات دقیق و ارزش غذایی
                هر بشقاب را بررسی و انتخاب کنید.
              </StepDesc>
            </StepCard>

            <StepCard
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.45,
                delay: 0.08,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              <StepTopRow>
                <StepNumberBadge>گام دوم</StepNumberBadge>
                <StepIconCircle>
                  <ShieldCheckIcon size={20} />
                </StepIconCircle>
              </StepTopRow>
              <StepTitle>شخصی‌سازی و ثبت آنی سفارش</StepTitle>
              <StepDesc>
                سایز، افزودنی‌های دلخواه و کد تخفیف خود را وارد کنید؛ تمامی
                محاسبات قیمت با دقت در سرور انجام می‌شود.
              </StepDesc>
            </StepCard>

            <StepCard
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.45,
                delay: 0.16,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              <StepTopRow>
                <StepNumberBadge>گام سوم</StepNumberBadge>
                <StepIconCircle>
                  <CourierIcon size={20} />
                </StepIconCircle>
              </StepTopRow>
              <StepTitle>پخت تازه و رهگیری لحظه‌ای پیک</StepTitle>
              <StepDesc>
                از لحظه تایید آشپزخانه تا تحویل پیک، وضعیت سفارش را با کد رهگیری
                اختصاصی به‌صورت زنده دنبال کنید.
              </StepDesc>
            </StepCard>
          </StepsRow>
        </div>

        {/* بخش ۲: استانداردهای طلایی فودینو (Bento) */}
        <div>
          <BlockHeader
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.42, ease: [0.23, 1, 0.32, 1] }}
          >
            <Eyebrow>تعهد کیفیت فودینو</Eyebrow>
            <BlockTitle>چرا حرفه‌ای‌ها فودینو را انتخاب می‌کنند؟</BlockTitle>
          </BlockHeader>

          <BentoGrid>
            <DarkFeatureBento
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.48, ease: [0.23, 1, 0.32, 1] }}
            >
              <div>
                <BentoTag>
                  <FlameIcon size={14} />
                  <span>فناوری حفظ دمای سرو</span>
                </BentoTag>
                <BentoHeading>
                  تحویل غذا دقیقاً با همان کیفیت و دمای داخل رستوران
                </BentoHeading>
                <BentoText>
                  تمامی سفیران فودینو مجهز به کیف‌های حرارتی نسل جدید هستند تا
                  پیتزا و کباب با دمای بالای ۶۵ درجه و سالاد و سوشی در محفظه خنک
                  ایزوله به دست شما برسند.
                </BentoText>
              </div>

              <SimulatedUIPanel>
                <TelemetryLeft>
                  <span className="pulse" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.88rem" }}>
                      پایش زنده کیفیت ارسال
                    </div>
                    <div
                      style={{
                        fontSize: "0.76rem",
                        color: "rgba(250,246,240,0.7)",
                      }}
                    >
                      میانگین زمان تحویل امروز: ۲۹ دقیقه
                    </div>
                  </div>
                </TelemetryLeft>
                <Link
                  href="/order-tracking"
                  style={{
                    background: "#D9381E",
                    color: "#FFFFFF",
                    padding: "0.45rem 0.9rem",
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
              <LightBentoCard
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.46,
                  delay: 0.08,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
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
                  <span>شفافیت ۱۰۰٪ مالی</span>
                </div>
                <h4>قیمت‌گذاری رسمی منو بدون کارمزد پنهان</h4>
                <p>
                  مبلغ نهایی سبد خرید شما مستقیماً در سرور فودینو و بر اساس نرخ
                  مصوب رستوران محاسبه می‌شود.
                </p>
              </LightBentoCard>

              <LightBentoCard
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.46,
                  delay: 0.16,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
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
                  <span>مواد اولیه تازه روز</span>
                </div>
                <h4>ممیزی بهداشتی و کیفی آشپزخانه‌ها</h4>
                <p>
                  تنها رستوران‌هایی که امتیاز رضایت بالای ۴.۵ از ۵ را حفظ کنند در
                  فهرست برترین‌های فودینو باقی می‌مانند.
                </p>
              </LightBentoCard>
            </BentoSideStack>
          </BentoGrid>
        </div>

        {/* بخش ۳: تجربه مشتریان */}
        <div>
          <BlockHeader
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.42, ease: [0.23, 1, 0.32, 1] }}
          >
            <Eyebrow>صدای مشتریان</Eyebrow>
            <BlockTitle>تجربه واقعی سفارش‌دهندگان</BlockTitle>
            <BlockSubtitle>
              نظرات ثبت‌شده توسط کاربرانی که سفارش خود را از طریق فودینو دریافت کرده‌اند
            </BlockSubtitle>
          </BlockHeader>

          <ReviewsGrid>
            {REVIEWS.map((review, index) => (
              <ReviewCard
                key={review.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.46,
                  delay: index * 0.08,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                <ReviewHeader>
                  <ReviewerProfile>
                    <AvatarInitial>{review.initial}</AvatarInitial>
                    <ReviewerMeta>
                      <strong>{review.name}</strong>
                      <span>
                        <CheckCircleIcon size={12} />
                        <span>خریدار تأییدشده</span>
                      </span>
                    </ReviewerMeta>
                  </ReviewerProfile>
                  <StarsRow aria-label="امتیاز ۵ از ۵">
                    <StarIcon size={14} />
                    <StarIcon size={14} />
                    <StarIcon size={14} />
                    <StarIcon size={14} />
                    <StarIcon size={14} />
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
