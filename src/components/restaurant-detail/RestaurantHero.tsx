"use client";

import React from "react";
import styled from "styled-components";
import Link from "next/link";
import FavoriteButton from "@/components/common/FavoriteButton";
import type { RestaurantSummary } from "@/application/ports/catalog-repository";
import { irrToToman } from "@/domain/money/money";
import {
  DishArtwork,
  resolveFoodKind,
  FOOD_VISUAL_PALETTE,
  StarIcon,
  ClockIcon,
  CourierIcon,
  WalletIcon,
  SparkleIcon,
} from "@/components/ui/FoodVisuals";

interface RestaurantHeroProps {
  restaurant: RestaurantSummary;
  isFavorite: boolean;
}

function getCuisineLabel(name: string) {
  if (name.includes("پیتزا")) return "پیتزا ناپولیتن و فست‌فود ایتالیایی";
  if (name.includes("برگر")) return "برگر دست‌ساز ذغالی و سوخاری";
  if (name.includes("سوشی")) return "سوشی بار و آشپزی اصیل ژاپنی";
  if (
    name.includes("ایرانی") ||
    name.includes("سنتی") ||
    name.includes("کباب")
  )
    return "کباب زعفرانی و خورشت اصیل ایرانی";
  if (
    name.includes("سالاد") ||
    name.includes("سبز") ||
    name.includes("سالم")
  )
    return "سالادبار و غذای رژیمی ارگانیک";
  return "رستوران منتخب فودینو";
}

const HeroWrapper = styled.div`
  margin-bottom: 1.75rem;
  direction: rtl;
`;

const Breadcrumbs = styled.nav`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.45rem;
  font-size: 0.84rem;
  color: ${({ theme }) => theme.colors.neutral[500]};
  margin-bottom: 0.85rem;

  a {
    color: ${({ theme }) => theme.colors.neutral[500]};
    text-decoration: none;
    font-weight: 500;
    min-height: 34px;
    min-width: 36px;
    padding: 0 0.45rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: color 0.18s;
    &:hover {
      color: ${({ theme }) => theme.colors.primary[500]};
    }
  }

  span.separator {
    color: ${({ theme }) => theme.colors.neutral[300]};
    font-size: 0.75rem;
  }

  span.current {
    color: ${({ theme }) => theme.colors.neutral[900]};
    font-weight: 700;
  }
`;

const CoverCard = styled.div`
  background: #ffffff;
  border-radius: 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  box-shadow: 0 12px 32px -10px rgba(22, 18, 15, 0.08);
  overflow: hidden;
  animation: foodinoFadeUp 440ms var(--ease-out) both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const CoverBanner = styled.div<{ $bgStart: string; $bgEnd: string }>`
  height: 196px;
  background: linear-gradient(
    135deg,
    ${({ $bgStart }) => $bgStart} 0%,
    ${({ $bgEnd }) => $bgEnd} 100%
  );
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2.25rem;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
      rgba(255, 255, 255, 0.14) 1px,
      transparent 1px
    );
    background-size: 18px 18px;
    opacity: 0.35;
    pointer-events: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    height: 124px;
    padding: 0.85rem 1rem;
  }
`;

const CoverBannerArt = styled.div`
  position: absolute;
  left: 2.5rem;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.92;
  pointer-events: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    left: 0.65rem;
    transform: translateY(-50%) scale(0.68);
  }
`;

const CoverBadgePill = styled.div`
  position: absolute;
  top: 1.15rem;
  right: 1.5rem;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(22, 18, 15, 0.65);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #faf6f0;
  padding: 0.32rem 0.8rem;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 700;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    top: 0.75rem;
    right: 0.85rem;
    font-size: 0.68rem;
    padding: 0.25rem 0.65rem;
  }
`;

const ContentContainer = styled.div`
  padding: 1rem 2rem 1.85rem;
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.75rem 0.95rem 1.15rem;
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: -54px;
  margin-bottom: 1.1rem;
  gap: 1rem;
  position: relative;
  z-index: 3;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-top: -38px;
    margin-bottom: 0.85rem;
  }
`;

const AvatarBox = styled.div<{ $bgStart: string; $bgEnd: string }>`
  width: 88px;
  height: 88px;
  border-radius: 1.35rem;
  background: linear-gradient(
    145deg,
    ${({ $bgStart }) => $bgStart} 0%,
    ${({ $bgEnd }) => $bgEnd} 100%
  );
  border: 4px solid #ffffff;
  box-shadow: 0 12px 28px -6px rgba(22, 18, 15, 0.24);
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 64px;
    height: 64px;
    border-radius: 1rem;

    svg {
      width: 48px;
      height: 48px;
    }
  }
`;

const ActionSide = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .desktop-fav {
    display: inline-flex;
  }
  .mobile-fav {
    display: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    .desktop-fav {
      display: none;
    }
    .mobile-fav {
      display: inline-flex;
    }
  }
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin-bottom: 1.35rem;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
`;

const RestaurantTitle = styled.h1`
  font-size: clamp(1.45rem, 2.6vw, 2rem);
  font-weight: 900;
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.32rem;
  }
`;

const OpenBadge = styled.span`
  background: ${({ theme }) => theme.colors.success[50]};
  color: ${({ theme }) => theme.colors.success[700]};
  border: 1px solid ${({ theme }) => theme.colors.success[200]};
  padding: 0.22rem 0.7rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.success[500]};
    animation: foodinoPulseDot 2.2s infinite;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  }
`;

const CuisinePill = styled.span`
  background: ${({ theme }) => theme.colors.neutral[100]};
  color: ${({ theme }) => theme.colors.neutral[700]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  padding: 0.22rem 0.7rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 600;
`;

const Description = styled.p`
  font-size: 0.94rem;
  color: ${({ theme }) => theme.colors.neutral[600]};
  margin: 0.15rem 0 0;
  line-height: 1.7;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.85rem;
  }
`;

const BadgesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.85rem;
  padding-top: 1.25rem;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[100]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.55rem;
    padding-top: 1rem;
  }
`;

const BadgeCard = styled.div`
  background: ${({ theme }) => theme.colors.neutral[50]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: 0.9rem;
  padding: 0.75rem 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-width: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.55rem 0.65rem;
    gap: 0.45rem;
    border-radius: 0.75rem;
  }

  .icon-box {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: #ffffff;
    border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
    color: ${({ theme }) => theme.colors.primary[600]};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      width: 30px;
      height: 30px;
      border-radius: 8px;

      svg {
        width: 15px;
        height: 15px;
      }
    }
  }

  .texts {
    display: flex;
    flex-direction: column;
    min-width: 0;

    .label {
      font-size: 0.74rem;
      color: ${({ theme }) => theme.colors.neutral[500]};
      margin-bottom: 0.12rem;

      @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        font-size: 0.68rem;
      }
    }

    .value {
      font-size: 0.88rem;
      font-weight: 800;
      color: ${({ theme }) => theme.colors.neutral[900]};
      font-variant-numeric: tabular-nums;
      line-height: 1.35;

      @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        font-size: 0.76rem;
      }
    }
  }
`;

export default function RestaurantHero({
  restaurant,
  isFavorite,
}: RestaurantHeroProps) {
  const kind = resolveFoodKind(
    restaurant.slug,
    restaurant.name,
    restaurant.description
  );
  const palette = FOOD_VISUAL_PALETTE[kind];
  const cuisineLabel = getCuisineLabel(restaurant.name);
  const feeToman = irrToToman(restaurant.deliveryFee);
  const minOrderToman = irrToToman(restaurant.minimumOrder);
  const numberFormatter = new Intl.NumberFormat("fa-IR");

  return (
    <HeroWrapper>
      <Breadcrumbs aria-label="مسیر صفحه">
        <Link href="/">خانه</Link>
        <span className="separator" aria-hidden="true">
          /
        </span>
        <Link href="/restaurants">رستوران‌ها</Link>
        <span className="separator" aria-hidden="true">
          /
        </span>
        <span className="current" aria-current="page">
          {restaurant.name}
        </span>
      </Breadcrumbs>

      <CoverCard>
        <CoverBanner $bgStart={palette.bgStart} $bgEnd={palette.bgEnd}>
          <CoverBadgePill>
            <SparkleIcon size={13} style={{ color: "#FCD34D" }} />
            <span>{palette.label} • پخت روز</span>
          </CoverBadgePill>
          <CoverBannerArt aria-hidden="true">
            <DishArtwork kind={kind} size={156} variant="hero" />
          </CoverBannerArt>
        </CoverBanner>

        <ContentContainer>
          <TopRow>
            <AvatarBox
              $bgStart={palette.bgStart}
              $bgEnd={palette.bgEnd}
              aria-hidden="true"
            >
              <DishArtwork kind={kind} size={68} variant="thumb" />
            </AvatarBox>
            <ActionSide>
              <div className="desktop-fav">
                <FavoriteButton
                  restaurantId={restaurant.id}
                  restaurantName={restaurant.name}
                  initialIsFavorite={isFavorite}
                  variant="button"
                />
              </div>
              <div className="mobile-fav">
                <FavoriteButton
                  restaurantId={restaurant.id}
                  restaurantName={restaurant.name}
                  initialIsFavorite={isFavorite}
                  variant="icon"
                  size="md"
                />
              </div>
            </ActionSide>
          </TopRow>

          <HeaderInfo>
            <TitleRow>
              <RestaurantTitle>{restaurant.name}</RestaurantTitle>
              <OpenBadge>سفارش می‌پذیرد</OpenBadge>
              <CuisinePill>{cuisineLabel}</CuisinePill>
            </TitleRow>
            <Description>{restaurant.description}</Description>
          </HeaderInfo>

          <BadgesGrid>
            <BadgeCard>
              <span className="icon-box" style={{ color: "#E59A11" }}>
                <StarIcon size={18} />
              </span>
              <div className="texts">
                <span className="label">امتیاز کاربران</span>
                <span className="value">
                  {numberFormatter.format(restaurant.rating)} از ۵ (۲۴۵)
                </span>
              </div>
            </BadgeCard>

            <BadgeCard>
              <span className="icon-box">
                <ClockIcon size={18} />
              </span>
              <div className="texts">
                <span className="label">زمان تحویل</span>
                <span className="value">
                  {numberFormatter.format(restaurant.deliveryMinutes.min)} تا{" "}
                  {numberFormatter.format(restaurant.deliveryMinutes.max)} دقیقه
                </span>
              </div>
            </BadgeCard>

            <BadgeCard>
              <span className="icon-box">
                <CourierIcon size={18} />
              </span>
              <div className="texts">
                <span className="label">هزینه پیک</span>
                <span className="value">
                  {feeToman === 0
                    ? "رایگان"
                    : `${numberFormatter.format(feeToman)} تومان`}
                </span>
              </div>
            </BadgeCard>

            <BadgeCard>
              <span className="icon-box">
                <WalletIcon size={18} />
              </span>
              <div className="texts">
                <span className="label">حداقل خرید</span>
                <span className="value">
                  {numberFormatter.format(minOrderToman)} تومان
                </span>
              </div>
            </BadgeCard>
          </BadgesGrid>
        </ContentContainer>
      </CoverCard>
    </HeroWrapper>
  );
}
