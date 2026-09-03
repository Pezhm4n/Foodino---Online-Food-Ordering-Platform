"use client";

import React from "react";
import styled from "styled-components";
import Link from "next/link";
import FavoriteButton from "@/components/common/FavoriteButton";
import type { RestaurantSummary } from "@/application/ports/catalog-repository";
import { irrToToman } from "@/domain/money/money";

interface RestaurantHeroProps {
  restaurant: RestaurantSummary;
  isFavorite: boolean;
}

function getCuisineMeta(name: string) {
  if (name.includes("پیتزا")) {
    return {
      label: "پیتزا و فست‌فود ایتالیایی",
      emoji: "🍕",
      gradient: "linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #f97316 100%)",
      pattern: "radial-gradient(circle, rgba(255,255,255,0.15) 10%, transparent 11%)",
    };
  }
  if (name.includes("برگر")) {
    return {
      label: "برگر دست‌ساز و سوخاری آمریکایی",
      emoji: "🍔",
      gradient: "linear-gradient(135deg, #451a03 0%, #b45309 50%, #d97706 100%)",
      pattern: "radial-gradient(circle, rgba(255,255,255,0.15) 10%, transparent 11%)",
    };
  }
  if (name.includes("سوشی")) {
    return {
      label: "سوشی بار و غذاهای اصیل ژاپنی",
      emoji: "🍣",
      gradient: "linear-gradient(135deg, #0f172a 0%, #0e7490 50%, #06b6d4 100%)",
      pattern: "radial-gradient(circle, rgba(255,255,255,0.18) 10%, transparent 11%)",
    };
  }
  if (name.includes("ایرانی") || name.includes("سنتی") || name.includes("کباب")) {
    return {
      label: "کباب سنتی و خورشت اصیل ایرانی",
      emoji: "🍚",
      gradient: "linear-gradient(135deg, #1e1b4b 0%, #b45309 50%, #ca8a04 100%)",
      pattern: "radial-gradient(circle, rgba(255,255,255,0.15) 10%, transparent 11%)",
    };
  }
  if (name.includes("سالاد") || name.includes("سبز") || name.includes("سالم")) {
    return {
      label: "سالادبار و غذای رژیمی ارگانیک",
      emoji: "🥗",
      gradient: "linear-gradient(135deg, #064e3b 0%, #059669 50%, #10b981 100%)",
      pattern: "radial-gradient(circle, rgba(255,255,255,0.15) 10%, transparent 11%)",
    };
  }
  return {
    label: "رستوران برتر فودینو",
    emoji: "🍽️",
    gradient: "linear-gradient(135deg, #1e293b 0%, #ff5a00 100%)",
    pattern: "none",
  };
}

const HeroWrapper = styled.div`
  margin-bottom: 2rem;
  direction: rtl;
`;

const Breadcrumbs = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 1rem;

  a {
    color: #64748b;
    text-decoration: none;
    transition: color 0.2s;
    &:hover {
      color: #ff5a00;
    }
  }

  span.separator {
    color: #cbd5e1;
    font-size: 0.75rem;
  }

  span.current {
    color: #0f172a;
    font-weight: 600;
  }
`;

const CoverCard = styled.div`
  background: white;
  border-radius: 1.25rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.06);
  overflow: hidden;
`;

const CoverBanner = styled.div<{ $gradient: string }>`
  height: 180px;
  background: ${({ $gradient }) => $gradient};
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 1.5rem 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    height: 130px;
    padding: 1rem;
  }
`;

const ContentContainer = styled.div`
  padding: 1rem 2rem 1.75rem;
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 1rem 1rem 1.25rem;
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: -55px;
  margin-bottom: 1rem;
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-top: -45px;
  }
`;

const AvatarBox = styled.div`
  width: 84px;
  height: 84px;
  border-radius: 1.25rem;
  background: white;
  border: 4px solid white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.75rem;
  user-select: none;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 70px;
    height: 70px;
    border-radius: 1rem;
    font-size: 2.25rem;
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
  gap: 0.35rem;
  margin-bottom: 1.25rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-bottom: 0.85rem;
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: 0.35rem;
  }
`;

const RestaurantTitle = styled.h1`
  font-size: 1.85rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  text-wrap: balance;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.25rem;
  }
`;

const OpenBadge = styled.span`
  background: #dcfce7;
  color: #15803d;
  border: 1px solid #bbf7d0;
  padding: 0.2rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #16a34a;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.68rem;
    padding: 0.12rem 0.45rem;
  }
`;

const CuisinePill = styled.span`
  background: #f1f5f9;
  color: #475569;
  padding: 0.2rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 600;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.68rem;
    padding: 0.12rem 0.45rem;
  }
`;

const Description = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  margin: 0.25rem 0 0;
  line-height: 1.6;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.8rem;
    line-height: 1.45;
  }
`;

const BadgesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  padding-top: 1.25rem;
  border-top: 1px solid #f1f5f9;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.6rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.45rem;
    padding-top: 0.85rem;
  }
`;

const BadgeCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 0.65rem 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0;

  .icon {
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  .texts {
    display: flex;
    flex-direction: column;
    min-width: 0;

    .label {
      font-size: 0.725rem;
      color: #64748b;
      margin-bottom: 0.15rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .value {
      font-size: 0.875rem;
      font-weight: 700;
      color: #0f172a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-variant-numeric: tabular-nums;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.45rem 0.55rem;
    gap: 0.45rem;
    border-radius: 0.6rem;

    .icon {
      font-size: 1.05rem;
    }

    .texts .label {
      font-size: 0.65rem;
      margin-bottom: 0.1rem;
    }

    .texts .value {
      font-size: 0.78rem;
    }
  }
`;

export default function RestaurantHero({ restaurant, isFavorite }: RestaurantHeroProps) {
  const meta = getCuisineMeta(restaurant.name);
  const feeToman = irrToToman(restaurant.deliveryFee);
  const minOrderToman = irrToToman(restaurant.minimumOrder);
  const numberFormatter = new Intl.NumberFormat("fa-IR");

  return (
    <HeroWrapper>
      <Breadcrumbs aria-label="مسیر صفحه">
        <Link href="/">خانه</Link>
        <span className="separator" aria-hidden="true">/</span>
        <Link href="/restaurants">رستوران‌ها</Link>
        <span className="separator" aria-hidden="true">/</span>
        <span className="current" aria-current="page">{restaurant.name}</span>
      </Breadcrumbs>

      <CoverCard>
        <CoverBanner $gradient={meta.gradient} />

        <ContentContainer>
          <TopRow>
            <AvatarBox aria-hidden="true">{meta.emoji}</AvatarBox>
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
              <CuisinePill>{meta.label}</CuisinePill>
            </TitleRow>
            <Description>{restaurant.description}</Description>
          </HeaderInfo>

          <BadgesGrid>
            <BadgeCard>
              <span className="icon" aria-hidden="true">⭐</span>
              <div className="texts">
                <span className="label">امتیاز کاربران</span>
                <span className="value">{numberFormatter.format(restaurant.rating)} از ۵ (۲۴۵)</span>
              </div>
            </BadgeCard>

            <BadgeCard>
              <span className="icon" aria-hidden="true">⏱️</span>
              <div className="texts">
                <span className="label">زمان تحویل</span>
                <span className="value">
                  {numberFormatter.format(restaurant.deliveryMinutes.min)} تا{" "}
                  {numberFormatter.format(restaurant.deliveryMinutes.max)} دقیقه
                </span>
              </div>
            </BadgeCard>

            <BadgeCard>
              <span className="icon" aria-hidden="true">🛵</span>
              <div className="texts">
                <span className="label">هزینه پیک</span>
                <span className="value">
                  {feeToman === 0 ? "رایگان" : `${numberFormatter.format(feeToman)} تومان`}
                </span>
              </div>
            </BadgeCard>

            <BadgeCard>
              <span className="icon" aria-hidden="true">💰</span>
              <div className="texts">
                <span className="label">حداقل خرید</span>
                <span className="value">{numberFormatter.format(minOrderToman)} تومان</span>
              </div>
            </BadgeCard>
          </BadgesGrid>
        </ContentContainer>
      </CoverCard>
    </HeroWrapper>
  );
}
