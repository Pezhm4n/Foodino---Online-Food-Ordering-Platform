"use client";

import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import FoodDetailModal, {
  type DishDetails,
} from "@/components/common/FoodDetailModal";
import {
  DishArtwork,
  resolveFoodKind,
  FOOD_VISUAL_PALETTE,
  StarIcon,
  FlameIcon,
  PlusIcon,
  ArrowLeftIcon,
  StoreIcon,
  CheckCircleIcon,
} from "@/components/ui/FoodVisuals";

export interface FeaturedDish extends DishDetails {
  slug: string;
  restaurantRating: number;
  deliveryMinutes: { min: number; max: number };
}

const FEATURED_ITEMS: readonly DishDetails[] = [
  {
    id: "30000000-0000-4000-8000-000000000001",
    name: "پیتزا مخصوص اسپشیال",
    description:
      "پیتزا مخصوص ایتالیایی با پنیر موزارلا تازه، قارچ اسلایس، ژامبون گوشت، فلفل دلمه و سس دست‌ساز",
    price: 145000,
    originalPrice: 170000,
    discountPercent: 15,
    image: "pizza",
    restaurantId: "20000000-0000-4000-8000-000000000001",
    restaurantName: "پیتزا برتر",
    category: "پیتزا",
    ingredients: [
      "پنیر موزارلا تازه",
      "قارچ اسلایس",
      "ژامبون گوشت ۹۰٪",
      "فلفل دلمه رنگی",
      "سس گوجه دست‌ساز",
    ],
    nutrition: { calories: 720, protein: 34, fat: 28, carbs: 65 },
    isPopular: true,
  },
  {
    id: "30000000-0000-4000-8000-000000000004",
    name: "چلوکباب کوبیده زعفرانی",
    description:
      "دو سیخ کباب کوبیده گوشت گرم گوسفندی همراه با برنج صدری ایرانی، کره محلی و گوجه کبابی",
    price: 240000,
    originalPrice: 300000,
    discountPercent: 20,
    image: "iranian",
    restaurantId: "20000000-0000-4000-8000-000000000004",
    restaurantName: "رستوران ایرانی سنتی",
    category: "ایرانی",
    ingredients: [
      "گوشت راسته و قلوه‌گاه گوسفندی",
      "برنج هاشمی درجه یک",
      "زعفران قائنات",
      "کره محلی",
      "گوجه ارگانیک",
    ],
    nutrition: { calories: 840, protein: 42, fat: 36, carbs: 78 },
    isPopular: true,
  },
  {
    id: "30000000-0000-4000-8000-000000000002",
    name: "برگر دست‌ساز کلاسیک دبل",
    description:
      "۱۸۰ گرم گوشت خالص گوساله تازه با پنیر چدار گودا، کاهو فرانسوی، خیارشور و سس باربیکیو دودی",
    price: 180000,
    originalPrice: 200000,
    discountPercent: 10,
    image: "burger",
    restaurantId: "20000000-0000-4000-8000-000000000002",
    restaurantName: "برگرلند",
    category: "برگر",
    ingredients: [
      "گوشت تازه گوساله",
      "پنیر چدار طبیعی",
      "نان بریوش کنجدی",
      "کاهو فرانسوی",
      "سس دودی مخصوص",
    ],
    nutrition: { calories: 650, protein: 38, fat: 32, carbs: 48 },
    isPopular: true,
  },
  {
    id: "30000000-0000-4000-8000-000000000003",
    name: "سوشی سالمون فیلادلفیا",
    description:
      "رول سالمون نروژی تازه همراه با پنیر فیلادلفیا، آووکادو، خیار و جلبک نوری با سس تریاکی",
    price: 290000,
    originalPrice: 330000,
    discountPercent: 12,
    image: "sushi",
    restaurantId: "20000000-0000-4000-8000-000000000003",
    restaurantName: "سوشی تاکو",
    category: "سوشی",
    ingredients: [
      "فیله سالمون نروژی",
      "برنج سوشی ژاپنی",
      "پنیر فیلادلفیا",
      "آووکادو تازه",
      "سس سویا و واسابی",
    ],
    nutrition: { calories: 480, protein: 29, fat: 14, carbs: 52 },
    isPopular: true,
  },
];

const Section = styled.section`
  padding: 4rem 1.75rem;
  background-color: ${(props) => props.theme.colors.neutral[100]};
  border-top: 1px solid ${(props) => props.theme.colors.neutral[200]};
  border-bottom: 1px solid ${(props) => props.theme.colors.neutral[200]};
  direction: rtl;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    padding: 2.5rem 1rem;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 1.85rem 0.9rem;
  }
`;

const Container = styled.div`
  max-width: 1240px;
  margin: 0 auto;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2.25rem;
  gap: 1rem;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 1.15rem;
    gap: 0.65rem;
  }
`;

const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary[600]};
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

const ViewAllLink = styled(Link)`
  color: ${(props) => props.theme.colors.neutral[800]};
  background: #ffffff;
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  padding: 0.55rem 1rem;
  min-height: 38px;
  border-radius: ${(props) => props.theme.borderRadius.full};
  font-weight: 700;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.35rem;

  @media (max-width: 1080px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: 0.9rem;
  }
`;

const DishCard = styled.article.attrs<{ 'data-landing-card'?: string }>({ "data-landing-card": "" })`
  display: flex;
  min-width: 0;
  cursor: pointer;
`;

const DishSurface = styled.div`
  background: #ffffff;
  border-radius: 1.35rem;
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  overflow: hidden;
  box-shadow: 0 6px 18px -6px rgba(22, 18, 15, 0.06);
  transition: transform 300ms var(--ease-out),
    box-shadow 240ms var(--ease-out),
    border-color 240ms var(--ease-out);
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1;
  min-width: 0;

  @media (hover: hover) and (pointer: fine) {
    ${DishCard}:hover & {
      transform: translateY(-9px);
      box-shadow: 0 24px 40px -12px rgba(22, 18, 15, 0.16);
      border-color: ${(props) => props.theme.colors.primary[300]};
    }
  }

  ${DishCard}:active & {
    transform: scale(0.98);
    border-color: ${({ theme }) => theme.colors.primary[400]};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: box-shadow 180ms ease-out, border-color 180ms ease-out;
    ${DishCard}:hover &, ${DishCard}:active & { transform: none; }
  }
`;

const CardBanner = styled.div<{ $bgStart: string; $bgEnd: string }>`
  height: 162px;
  background: linear-gradient(
    145deg,
    ${(props) => props.$bgStart} 0%,
    ${(props) => props.$bgEnd} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
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

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    height: 132px;
  }
`;

const ArtworkMotionWrap = styled.div`
  position: relative;
  z-index: 2;
  transition: transform 340ms var(--ease-out);

  @media (hover: hover) and (pointer: fine) {
    ${DishCard}:hover & {
      transform: translateY(-6px) rotate(-5deg) scale(1.15);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    ${DishCard}:hover & { transform: none; }
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    svg {
      width: 96px;
      height: 96px;
    }
  }
`;

const DiscountBadge = styled.span`
  position: absolute;
  top: 0.85rem;
  right: 0.85rem;
  z-index: 3;
  background: ${(props) => props.theme.colors.primary[500]};
  color: #ffffff;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 800;
  box-shadow: 0 4px 10px rgba(217, 56, 30, 0.35);
`;

const CaloriePill = styled.span`
  position: absolute;
  bottom: 0.75rem;
  left: 0.75rem;
  z-index: 3;
  background: rgba(22, 18, 15, 0.68);
  backdrop-filter: blur(6px);
  color: #faf6f0;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.14);
`;

const CardBody = styled.div`
  padding: 1.15rem 1.2rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.55rem;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 0.95rem 1rem;
    gap: 0.45rem;
  }
`;

const RestoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.78rem;
`;

const RestoName = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  color: ${(props) => props.theme.colors.primary[600]};
  font-weight: 700;
`;

const RatingPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.22rem;
  color: ${(props) => props.theme.colors.warning[700]};
  background: ${(props) => props.theme.colors.warning[50]};
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-weight: 800;
`;

const CardTitle = styled.h3`
  font-size: 1.06rem;
  font-weight: 800;
  color: ${(props) => props.theme.colors.neutral[900]};
  margin: 0;
  transition: color 180ms var(--ease-out);

  button {
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: inherit;
    cursor: pointer;
  }

  @media (hover: hover) and (pointer: fine) {
    ${DishCard}:hover & {
      color: ${(props) => props.theme.colors.primary[600]};
    }
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 0.98rem;
  }
`;

const CardDesc = styled.p`
  font-size: 0.82rem;
  color: ${(props) => props.theme.colors.neutral[600]};
  margin: 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardFooter = styled.div`
  margin-top: auto;
  padding-top: 0.85rem;
  border-top: 1px solid ${(props) => props.theme.colors.neutral[100]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

const PriceBox = styled.div`
  display: flex;
  flex-direction: column;

  .current {
    font-size: 1.02rem;
    font-weight: 800;
    color: ${(props) => props.theme.colors.neutral[900]};
  }

  .original {
    font-size: 0.74rem;
    color: ${(props) => props.theme.colors.neutral[400]};
    text-decoration: line-through;
  }
`;

const QuickAddBtn = styled.button<{ $justAdded?: boolean }>`
  background: ${({ $justAdded, theme }) =>
    $justAdded ? theme.colors.success[600] : theme.colors.primary[500]};
  color: #ffffff;
  border: none;
  padding: 0.55rem 0.95rem;
  min-height: 40px;
  border-radius: 0.75rem;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 140ms var(--ease-out),
    background-color 180ms var(--ease-out),
    box-shadow 180ms var(--ease-out);
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  user-select: none;
  touch-action: manipulation;
  transform: ${({ $justAdded }) => ($justAdded ? "scale(1.04)" : "scale(1)")};

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: ${({ $justAdded, theme }) =>
        $justAdded ? theme.colors.success[600] : theme.colors.primary[600]};
      box-shadow: 0 8px 16px -4px rgba(217, 56, 30, 0.38);
      transform: translateY(-1px);
    }
  }

  &:active {
    transform: scale(0.95);
  }
`;

export default function FeaturedDishes({ dishes, demo = false }: { dishes: readonly FeaturedDish[]; demo?: boolean }) {
  const items = dishes.map((dish) => {
    const visual = FEATURED_ITEMS.find((item) => resolveFoodKind(item.image) === resolveFoodKind(dish.slug, dish.name));
    return { ...(demo ? visual : {}), ...dish, image: visual?.image, category: visual?.category };
  });
  const [selectedDish, setSelectedDish] = useState<DishDetails | null>(null);
  const [addedDishId, setAddedDishId] = useState<string | null>(null);
  const addTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (addTimer.current) clearTimeout(addTimer.current); }, []);
  const { addItem } = useCart();

  const formatPrice = (p: number) => p.toLocaleString("fa-IR") + " تومان";

  const handleQuickAdd = (e: React.MouseEvent, dish: DishDetails) => {
    e.stopPropagation();
    const accepted = addItem({
      id: `${dish.id}:default`,
      productId: dish.id,
      restaurantId: dish.restaurantId,
      restaurantName: dish.restaurantName,
      name: dish.name,
      price: dish.price,
      quantity: 1,
      addonIds: [],
    });
    if (!accepted) return;
    setAddedDishId(dish.id);
    if (addTimer.current) clearTimeout(addTimer.current);
    addTimer.current = setTimeout(() => {
      setAddedDishId((prev) => (prev === dish.id ? null : prev));
    }, 900);
  };

  return (
    <Section aria-label="پیشنهادات ویژه روز">
      <Container>
        <HeaderRow>
          <TitleBox>
            <Eyebrow>
              <FlameIcon size={15} />
              <span>منتخب سرآشپز و پرطرفدارترین‌ها</span>
            </Eyebrow>
            <SectionTitle>پیشنهادات ویژه روز</SectionTitle>
            <SectionSubtitle>
              محبوب‌ترین بشقاب‌های فودینو با مواد اولیه تازه و تخفیف اختصاصی؛
              برای مشاهده ارزش غذایی روی هر کارت کلیک کنید
              {demo && " (تخفیف و اطلاعات تغذیه نمایشی)"}
            </SectionSubtitle>
          </TitleBox>
          <ViewAllLink href="/restaurants">
            <span>مشاهده همه رستوران‌ها</span>
            <ArrowLeftIcon size={15} />
          </ViewAllLink>
        </HeaderRow>

        <Grid>
          {items.map((dish) => {
            const kind = resolveFoodKind(dish.category, dish.name, dish.image);
            const palette = FOOD_VISUAL_PALETTE[kind];
            const isJustAdded = addedDishId === dish.id;

            return (
              <DishCard
                key={dish.id}
                onClick={() => setSelectedDish(dish)}
              >
                <DishSurface>
                  <CardBanner
                    $bgStart={palette.bgStart}
                    $bgEnd={palette.bgEnd}
                  >
                    <ArtworkMotionWrap>
                      <DishArtwork kind={kind} size={126} variant="card" />
                    </ArtworkMotionWrap>
                    {dish.discountPercent && (
                      <DiscountBadge>
                        ٪{dish.discountPercent.toLocaleString("fa-IR")} تخفیف
                      </DiscountBadge>
                    )}
                    {dish.nutrition && (
                      <CaloriePill>
                        {dish.nutrition.calories.toLocaleString("fa-IR")} کالری
                      </CaloriePill>
                    )}
                  </CardBanner>

                  <CardBody>
                    <RestoRow>
                      <RestoName>
                        <StoreIcon size={13} />
                        <span>{dish.restaurantName}</span>
                      </RestoName>
                      <RatingPill>
                        <StarIcon size={12} />
                        <span>{dish.restaurantRating.toLocaleString("fa-IR")}</span>
                      </RatingPill>
                    </RestoRow>
                    <CardTitle>
                      <button type="button" aria-label={`جزئیات ${dish.name}`} onClick={() => setSelectedDish(dish)}>{dish.name}</button>
                    </CardTitle>
                    <CardDesc>{dish.description}</CardDesc>

                    <CardFooter>
                      <PriceBox>
                        <span className="current">{formatPrice(dish.price)}</span>
                        {dish.originalPrice && (
                          <span className="original">
                            {formatPrice(dish.originalPrice)}
                          </span>
                        )}
                      </PriceBox>
                      <QuickAddBtn
                        type="button"
                        $justAdded={isJustAdded}
                        onClick={(e) => handleQuickAdd(e, dish)}
                        aria-label={`افزودن ${dish.name} به سبد خرید`}
                      >
                        {isJustAdded ? (
                          <>
                            <CheckCircleIcon size={14} />
                            <span>افزوده شد</span>
                          </>
                        ) : (
                          <>
                            <PlusIcon size={14} />
                            <span>افزودن</span>
                          </>
                        )}
                      </QuickAddBtn>
                    </CardFooter>
                  </CardBody>
                </DishSurface>
              </DishCard>
            );
          })}
        </Grid>
      </Container>

      <FoodDetailModal
        dish={selectedDish}
        isOpen={!!selectedDish}
        onClose={() => setSelectedDish(null)}
      />
    </Section>
  );
}
