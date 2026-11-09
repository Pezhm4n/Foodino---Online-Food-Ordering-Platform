"use client";

import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { motion } from "framer-motion";
import FavoriteButton from "@/components/common/FavoriteButton";
import {
  DishArtwork,
  resolveFoodKind,
  FOOD_VISUAL_PALETTE,
  StarIcon,
  ClockIcon,
  CourierIcon,
  ArrowLeftIcon,
} from "@/components/ui/FoodVisuals";

const SectionContainer = styled.section`
  padding: 4rem 1.75rem;
  background-color: ${(props) => props.theme.colors.neutral[50]};
  direction: rtl;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    padding: 2.5rem 1rem;
  }
`;

const SectionHeader = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  max-width: 1240px;
  margin: 0 auto 2.25rem;
  gap: 1rem;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 1.35rem;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const Eyebrow = styled.span`
  font-size: 0.78rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary[600]};
`;

const SectionTitle = styled.h2`
  font-size: clamp(1.45rem, 2.5vw, 2rem);
  font-weight: 800;
  color: ${(props) => props.theme.colors.neutral[900]};
  margin: 0;
`;

const SectionSubtitle = styled.p`
  font-size: 0.95rem;
  color: ${(props) => props.theme.colors.neutral[600]};
  margin: 0;
`;

const ViewAllButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.6rem 1.15rem;
  background-color: #ffffff;
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  border-radius: ${(props) => props.theme.borderRadius.full};
  font-size: 0.9rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.neutral[800]};
  text-decoration: none;
  transition: transform 180ms var(--ease-out),
    border-color 180ms var(--ease-out),
    color 180ms var(--ease-out);

  &:hover {
    border-color: ${(props) => props.theme.colors.primary[400]};
    color: ${(props) => props.theme.colors.primary[600]};
    transform: translateX(-3px);
  }
`;

const RestaurantsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.35rem;
  max-width: 1240px;
  margin: 0 auto;

  @media (max-width: 1080px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const RestaurantCard = styled(motion.article)`
  background-color: #ffffff;
  border-radius: 1.35rem;
  overflow: hidden;
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  box-shadow: 0 6px 18px -6px rgba(22, 18, 15, 0.06);
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform 240ms var(--ease-out),
    box-shadow 240ms var(--ease-out),
    border-color 240ms var(--ease-out);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translateY(-6px);
      box-shadow: 0 24px 40px -12px rgba(22, 18, 15, 0.15);
      border-color: ${(props) => props.theme.colors.primary[300]};
    }
  }
`;

const CardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const CoverStage = styled.div<{ $bgStart: string; $bgEnd: string }>`
  position: relative;
  width: 100%;
  height: 148px;
  background: linear-gradient(
    135deg,
    ${(props) => props.$bgStart} 0%,
    ${(props) => props.$bgEnd} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
      rgba(255, 255, 255, 0.12) 1px,
      transparent 1px
    );
    background-size: 16px 16px;
    opacity: 0.35;
  }
`;

const CoverArtworkMotion = styled.div`
  position: relative;
  z-index: 2;
  transition: transform 280ms var(--ease-out);

  ${RestaurantCard}:hover & {
    transform: scale(1.09) translateY(-3px) rotate(-2deg);
  }
`;

const StatusPill = styled.span`
  position: absolute;
  top: 0.85rem;
  right: 0.85rem;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(22, 18, 15, 0.72);
  backdrop-filter: blur(8px);
  color: #faf6f0;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  border: 1px solid rgba(255, 255, 255, 0.15);

  span.dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #4ade80;
    animation: foodinoPulseDot 2.2s infinite;
  }
`;

const RatingFloatingBadge = styled.span`
  position: absolute;
  bottom: 0.75rem;
  right: 0.85rem;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: #ffffff;
  color: ${(props) => props.theme.colors.neutral[900]};
  padding: 0.22rem 0.6rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 800;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const RestaurantInfo = styled.div`
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const RestaurantName = styled.h3`
  font-size: 1.12rem;
  font-weight: 800;
  color: ${(props) => props.theme.colors.neutral[900]};
  margin: 0 0 0.25rem;
  transition: color 180ms var(--ease-out);

  ${RestaurantCard}:hover & {
    color: ${(props) => props.theme.colors.primary[600]};
  }
`;

const RestaurantType = styled.span`
  display: block;
  font-size: 0.82rem;
  color: ${(props) => props.theme.colors.neutral[600]};
  margin-bottom: 0.85rem;
`;

const TagsContainer = styled.div`
  display: flex;
  gap: 0.4rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  font-size: 0.72rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.neutral[700]};
  background-color: ${(props) => props.theme.colors.neutral[100]};
  padding: 0.2rem 0.6rem;
  border-radius: ${(props) => props.theme.borderRadius.full};
`;

const CardFooter = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.85rem;
  border-top: 1px solid ${(props) => props.theme.colors.neutral[100]};
  font-size: 0.78rem;
  color: ${(props) => props.theme.colors.neutral[600]};
  font-weight: 600;
`;

const MetaChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
`;

const restaurants = [
  {
    id: "20000000-0000-4000-8000-000000000001",
    name: "پیتزا برتر",
    cuisineClue: "pizza",
    type: "پیتزا ناپولیتن و فست‌فود ایتالیایی",
    tags: ["پیتزا تنوری", "نان سیر", "پپرونی"],
    rating: "۴.۸",
    deliveryTime: "۳۰ تا ۴۵ دقیقه",
    deliveryFee: "۱۵,۰۰۰ تومان",
    slug: "best-pizza",
  },
  {
    id: "20000000-0000-4000-8000-000000000002",
    name: "برگرلند",
    cuisineClue: "burger",
    type: "برگر دست‌ساز ذغالی و سوخاری",
    tags: ["چیزبرگر دودی", "ماشروم برگر", "سوخاری"],
    rating: "۴.۶",
    deliveryTime: "۲۵ تا ۴۰ دقیقه",
    deliveryFee: "۱۸,۰۰۰ تومان",
    slug: "burger-land",
  },
  {
    id: "20000000-0000-4000-8000-000000000004",
    name: "رستوران ایرانی سنتی",
    cuisineClue: "iranian",
    type: "کباب‌های زعفرانی و خورشت‌های اصیل",
    tags: ["چلوکباب کوبیده", "جوجه زعفرانی", "قورمه‌سبزی"],
    rating: "۴.۷",
    deliveryTime: "۴۰ تا ۵۵ دقیقه",
    deliveryFee: "۲۰,۰۰۰ تومان",
    slug: "traditional-iranian",
  },
  {
    id: "20000000-0000-4000-8000-000000000003",
    name: "سوشی تاکو",
    cuisineClue: "sushi",
    type: "سوشی، ساشیمی و نودل‌های آسیایی",
    tags: ["سالمون رول", "کریسپی رول", "نودل"],
    rating: "۴.۹",
    deliveryTime: "۳۵ تا ۵۰ دقیقه",
    deliveryFee: "۲۰,۰۰۰ تومان",
    slug: "sushi-tako",
  },
];

const TopRestaurants = () => {
  return (
    <SectionContainer>
      <SectionHeader
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.42, ease: [0.23, 1, 0.32, 1] }}
      >
        <TitleContainer>
          <Eyebrow>آشپزخانه‌های دارای نشان کیفیت</Eyebrow>
          <SectionTitle>رستوران‌های برتر فودینو</SectionTitle>
          <SectionSubtitle>
            برترین رستوران‌های شهر بر اساس امتیاز مشتریان و سرعت آماده‌سازی
          </SectionSubtitle>
        </TitleContainer>
        <ViewAllButton href="/restaurants">
          <span>مشاهده همه رستوران‌ها</span>
          <ArrowLeftIcon size={15} />
        </ViewAllButton>
      </SectionHeader>

      <RestaurantsGrid>
        {restaurants.map((restaurant, index) => {
          const kind = resolveFoodKind(restaurant.cuisineClue, restaurant.name);
          const palette = FOOD_VISUAL_PALETTE[kind];

          return (
            <RestaurantCard
              key={restaurant.id}
              initial={{ opacity: 0, y: 22, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.46,
                delay: index * 0.07,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  zIndex: 10,
                }}
              >
                <FavoriteButton
                  restaurantId={restaurant.id}
                  restaurantName={restaurant.name}
                  size="sm"
                />
              </div>
              <CardLink href={`/restaurants/${restaurant.slug}`}>
                <CoverStage
                  $bgStart={palette.bgStart}
                  $bgEnd={palette.bgEnd}
                >
                  <StatusPill>
                    <span className="dot" />
                    <span>سفارش می‌پذیرد</span>
                  </StatusPill>
                  <CoverArtworkMotion>
                    <DishArtwork kind={kind} size={112} variant="thumb" />
                  </CoverArtworkMotion>
                  <RatingFloatingBadge>
                    <StarIcon size={13} style={{ color: "#E59A11" }} />
                    <span>{restaurant.rating}</span>
                  </RatingFloatingBadge>
                </CoverStage>

                <RestaurantInfo>
                  <RestaurantName>{restaurant.name}</RestaurantName>
                  <RestaurantType>{restaurant.type}</RestaurantType>
                  <TagsContainer>
                    {restaurant.tags.map((tag, idx) => (
                      <Tag key={idx}>{tag}</Tag>
                    ))}
                  </TagsContainer>
                  <CardFooter>
                    <MetaChip>
                      <ClockIcon size={14} />
                      <span>{restaurant.deliveryTime}</span>
                    </MetaChip>
                    <MetaChip>
                      <CourierIcon size={14} />
                      <span>{restaurant.deliveryFee}</span>
                    </MetaChip>
                  </CardFooter>
                </RestaurantInfo>
              </CardLink>
            </RestaurantCard>
          );
        })}
      </RestaurantsGrid>
    </SectionContainer>
  );
};

export default TopRestaurants;
