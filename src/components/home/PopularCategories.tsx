"use client";

import React from "react";
import styled from "styled-components";
import Link from "next/link";
import {
  DishArtwork,
  resolveFoodKind,
  FOOD_VISUAL_PALETTE,
  ArrowLeftIcon,
} from "@/components/ui/FoodVisuals";

const SectionContainer = styled.section`
  padding: 4rem 1.75rem;
  max-width: 1240px;
  margin: 0 auto;
  direction: rtl;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    padding: 2.5rem 1rem;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 1.75rem 0.9rem;
  }
`;

const SectionHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  gap: 1rem;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 1.15rem;
    gap: 0.65rem;
  }
`;

const HeaderTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const SectionEyebrow = styled.span`
  font-size: 0.78rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary[600]};
  letter-spacing: 0.02em;
`;

const SectionTitle = styled.h2`
  font-size: clamp(1.45rem, 2.5vw, 2rem);
  font-weight: 800;
  color: ${(props) => props.theme.colors.neutral[900]};
  margin: 0;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 1.28rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 0.95rem;
  color: ${(props) => props.theme.colors.neutral[600]};
  margin: 0;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 0.84rem;
  }
`;

const AllCategoriesLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.neutral[800]};
  background: #ffffff;
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  padding: 0.55rem 1rem;
  min-height: 38px;
  border-radius: ${(props) => props.theme.borderRadius.full};
  text-decoration: none;
  transition: transform 180ms var(--ease-out),
    border-color 180ms var(--ease-out),
    color 180ms var(--ease-out);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: ${(props) => props.theme.colors.primary[400]};
      color: ${(props) => props.theme.colors.primary[600]};
      transform: translateX(-3px);
    }
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 0.82rem;
    padding: 0.45rem 0.85rem;
  }
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.15rem;

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.7rem;
  }
`;

const CategoryCardMotion = styled.div`
  display: flex;
`;

const CategoryCard = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 1.4rem 1.1rem 1.2rem;
  border-radius: 1.35rem;
  background: #ffffff;
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  box-shadow: 0 4px 14px -4px rgba(22, 18, 15, 0.05);
  transition: transform 240ms var(--ease-out),
    box-shadow 240ms var(--ease-out),
    border-color 240ms var(--ease-out);
  text-decoration: none;
  overflow: hidden;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translateY(-6px);
      box-shadow: 0 22px 36px -12px rgba(22, 18, 15, 0.14);
      border-color: ${(props) => props.theme.colors.primary[300]};
    }
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 1rem 0.75rem 0.9rem;
    border-radius: 1.1rem;
  }
`;

const ArtworkStage = styled.div<{ $bgStart: string; $bgEnd: string }>`
  width: 92px;
  height: 92px;
  border-radius: 26px;
  background: linear-gradient(
    145deg,
    ${(props) => props.$bgStart} 0%,
    ${(props) => props.$bgEnd} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  box-shadow: 0 10px 20px -6px rgba(22, 18, 15, 0.22);
  transition: transform 280ms var(--ease-out),
    box-shadow 280ms var(--ease-out);

  @media (hover: hover) and (pointer: fine) {
    ${CategoryCard}:hover & {
      transform: scale(1.09) rotate(-4deg) translateY(-2px);
      box-shadow: 0 16px 26px -6px rgba(22, 18, 15, 0.28);
    }
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    width: 64px;
    height: 64px;
    border-radius: 18px;
    margin-bottom: 0.65rem;

    svg {
      width: 54px;
      height: 54px;
    }
  }
`;

const CulinaryTag = styled.span<{ $bg: string; $color: string }>`
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.18rem 0.55rem;
  border-radius: 999px;
  background: ${(props) => props.$bg};
  color: ${(props) => props.$color};
  margin-bottom: 0.45rem;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 0.65rem;
    margin-bottom: 0.3rem;
  }
`;

const CategoryName = styled.h3`
  font-size: 1.08rem;
  font-weight: 800;
  color: ${(props) => props.theme.colors.neutral[900]};
  margin: 0 0 0.3rem;
  text-align: center;
  transition: color 180ms var(--ease-out);

  @media (hover: hover) and (pointer: fine) {
    ${CategoryCard}:hover & {
      color: ${(props) => props.theme.colors.primary[600]};
    }
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 0.94rem;
    margin-bottom: 0.2rem;
  }
`;

const ItemCount = styled.span`
  font-size: 0.8rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.neutral[500]};
`;

export interface CategoryItem {
  id: string | number;
  name: string;
  icon: string;
  slug: string;
  count?: number | string;
}

const defaultCategories: CategoryItem[] = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    name: "پیتزا",
    icon: "pizza",
    count: 1,
    slug: "pizza",
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    name: "برگر",
    icon: "burger",
    count: 1,
    slug: "burger",
  },
  {
    id: "10000000-0000-4000-8000-000000000003",
    name: "غذای ایرانی",
    icon: "iranian",
    count: 1,
    slug: "iranian",
  },
  {
    id: "10000000-0000-4000-8000-000000000004",
    name: "سوشی",
    icon: "sushi",
    count: 1,
    slug: "sushi",
  },
  {
    id: "10000000-0000-4000-8000-000000000005",
    name: "غذای سالم",
    icon: "healthy",
    count: 1,
    slug: "healthy",
  },
];

const formatCount = (count?: number | string) => {
  if (count === undefined || count === null) return "مشاهده منو";
  if (typeof count === "number") {
    if (count === 0) return "به‌زودی";
    return `${count.toLocaleString("fa-IR")} رستوران فعال`;
  }
  return count;
};

interface PopularCategoriesProps {
  initialCategories?: CategoryItem[];
}

const PopularCategories = ({ initialCategories }: PopularCategoriesProps) => {
  const displayCategories =
    initialCategories && initialCategories.length > 0
      ? initialCategories
      : defaultCategories;

  return (
    <SectionContainer>
      <SectionHeaderRow>
        <HeaderTitleGroup>
          <SectionEyebrow>ذائقه و سبک پخت</SectionEyebrow>
          <SectionTitle>دسته‌بندی‌های محبوب</SectionTitle>
          <SectionSubtitle>
            انتخاب سریع بر اساس سبک آشپزی؛ از تنور ایتالیایی تا مطبخ اصیل ایرانی
          </SectionSubtitle>
        </HeaderTitleGroup>
        <AllCategoriesLink href="/categories">
          <span>همه دسته‌بندی‌ها</span>
          <ArrowLeftIcon size={15} />
        </AllCategoriesLink>
      </SectionHeaderRow>

      <CategoriesGrid>
        {displayCategories.map((category) => {
          const kind = resolveFoodKind(
            category.slug,
            category.name,
            category.icon
          );
          const palette = FOOD_VISUAL_PALETTE[kind];

          return (
            <CategoryCardMotion key={category.id}>
              <CategoryCard href={`/categories/${category.slug}`}>
                <ArtworkStage
                  $bgStart={palette.bgStart}
                  $bgEnd={palette.bgEnd}
                >
                  <DishArtwork kind={kind} size={76} variant="thumb" />
                </ArtworkStage>
                <CulinaryTag $bg={palette.tagBg} $color={palette.tagColor}>
                  {palette.label}
                </CulinaryTag>
                <CategoryName>{category.name}</CategoryName>
                <ItemCount>{formatCount(category.count)}</ItemCount>
              </CategoryCard>
            </CategoryCardMotion>
          );
        })}
      </CategoriesGrid>
    </SectionContainer>
  );
};

export default PopularCategories;
