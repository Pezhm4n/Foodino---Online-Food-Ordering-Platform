"use client";

import React, { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import FoodDetailModal, { type DishDetails } from "@/components/common/FoodDetailModal";

const FEATURED_ITEMS: readonly DishDetails[] = [
  {
    id: "30000000-0000-4000-8000-000000000001",
    name: "پیتزا مخصوص اسپشیال",
    description: "پیتزا مخصوص ایتالیایی با پنیر موزارلا مطهر، قارچ تازه، ژامبون گوشت، فلفل دلمه و سس مخصوص دست‌ساز",
    price: 145000,
    originalPrice: 170000,
    discountPercent: 15,
    image: "🍕",
    restaurantId: "20000000-0000-4000-8000-000000000001",
    restaurantName: "پیتزا برتر",
    category: "پیتزا",
    ingredients: ["پنیر موزارلا تازه", "قارچ اسلایس", "ژامبون گوشت ۹۰٪", "فلفل دلمه رنگی", "سس گوجه دست‌ساز"],
    nutrition: { calories: 720, protein: 34, fat: 28, carbs: 65 },
    isPopular: true,
  },
  {
    id: "30000000-0000-4000-8000-000000000004",
    name: "چلوکباب کوبیده زعفرانی",
    description: "دو سیخ کباب کوبیده گوشت گرم گوسفندی همراه با برنج صدری ایرانی، کره محلی و گوجه کبابی",
    price: 240000,
    originalPrice: 300000,
    discountPercent: 20,
    image: "🍚",
    restaurantId: "20000000-0000-4000-8000-000000000004",
    restaurantName: "رستوران ایرانی سنتی",
    category: "ایرانی",
    ingredients: ["گوشت راسته و قلوه‌گاه گوسفندی", "برنج هاشمی درجه یک", "زعفران قائنات", "کره محلی", "گوجه ارگانیک"],
    nutrition: { calories: 840, protein: 42, fat: 36, carbs: 78 },
    isPopular: true,
  },
  {
    id: "30000000-0000-4000-8000-000000000002",
    name: "برگر دست‌ساز کلاسیک دبل",
    description: "۱۸۰ گرم گوشت خالص گوساله تازه با پنیر چدار گودا، کاهو فرانسوی، خیارشور و سس باربیکیو دودی",
    price: 180000,
    originalPrice: 200000,
    discountPercent: 10,
    image: "🍔",
    restaurantId: "20000000-0000-4000-8000-000000000002",
    restaurantName: "برگرلند",
    category: "برگر",
    ingredients: ["گوشت تازه گوساله", "پنیر چدار طبیعی", "نان بریوش کنجدی", "کاهو فرانسوی", "سس دودی مخصوص"],
    nutrition: { calories: 650, protein: 38, fat: 32, carbs: 48 },
    isPopular: true,
  },
  {
    id: "30000000-0000-4000-8000-000000000003",
    name: "سوشی سالمون فیلادلفیا",
    description: "رول سالمون نروژی تازه همراه با پنیر فیلادلفیا، آووکادو، خیار و جلبک نوری با سس تریاکی",
    price: 290000,
    originalPrice: 330000,
    discountPercent: 12,
    image: "🍣",
    restaurantId: "20000000-0000-4000-8000-000000000003",
    restaurantName: "سوشی تاکو",
    category: "سوشی",
    ingredients: ["فیله سالمون نروژی", "برنج سوشی ژاپنی", "پنیر فیلادلفیا", "آووکادو تازه", "سس سویا و واسابی"],
    nutrition: { calories: 480, protein: 29, fat: 14, carbs: 52 },
    isPopular: true,
  },
];

const Section = styled.section`
  padding: 3.5rem 2rem;
  background-color: white;
  direction: rtl;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    padding: 2.25rem 1rem;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 1.75rem 0.85rem;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
  }
`;

const TitleBox = styled.div``;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.4rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    font-size: 1.4rem;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 1.25rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 0.85rem;
  }
`;

const ViewAllLink = styled(Link)`
  color: #ff5a00;
  font-weight: 700;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    color: #e04e00;
    transform: translateX(-4px);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const DishCard = styled.div`
  background: white;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
    border-color: #fdba74;
  }
`;

const CardBanner = styled.div`
  height: 140px;
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const CardEmoji = styled.div`
  font-size: 4.5rem;
  user-select: none;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s ease;

  ${DishCard}:hover & {
    transform: scale(1.08);
  }
`;

const DiscountBadge = styled.span`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: #ea580c;
  color: white;
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(234, 88, 12, 0.3);
`;

const CardBody = styled.div`
  padding: 1rem 1.15rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.5rem;
`;

const CardTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`;

const RestoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.825rem;
`;

const RestoName = styled.span`
  color: #ff5a00;
  font-weight: 600;
`;

const RatingPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  color: #d97706;
  font-weight: 700;
`;

const CardDesc = styled.p`
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardFooter = styled.div`
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PriceBox = styled.div`
  display: flex;
  flex-direction: column;

  .current {
    font-size: 1rem;
    font-weight: 800;
    color: #0f172a;
  }

  .original {
    font-size: 0.75rem;
    color: #94a3b8;
    text-decoration: line-through;
  }
`;

const QuickAddBtn = styled.button`
  background: #ff5a00;
  color: white;
  border: none;
  padding: 0.45rem 0.85rem;
  border-radius: 0.5rem;
  font-size: 0.825rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &:hover {
    background: #e04e00;
  }

  &:active {
    transform: scale(0.95);
  }
`;

export default function FeaturedDishes() {
  const [selectedDish, setSelectedDish] = useState<DishDetails | null>(null);
  const { addItem } = useCart();

  const formatPrice = (p: number) => p.toLocaleString("fa-IR") + " تومان";

  const handleQuickAdd = (e: React.MouseEvent, dish: DishDetails) => {
    e.stopPropagation();
    addItem({
      id: `${dish.id}:default`,
      productId: dish.id,
      restaurantId: dish.restaurantId,
      restaurantName: dish.restaurantName,
      name: dish.name,
      price: dish.price,
      quantity: 1,
      addonIds: [],
    });
  };

  return (
    <Section>
      <Container>
        <HeaderRow>
          <TitleBox>
            <SectionTitle>
              <span>🔥</span>
              <span>پیشنهادات ویژه و غذاهای پرطرفدار</span>
            </SectionTitle>
            <SectionSubtitle>محبوب‌ترین طعم‌های شهر با تخفیف ویژه و ارسال سریع در فودینو</SectionSubtitle>
          </TitleBox>
          <ViewAllLink href="/restaurants">
            <span>مشاهده همه رستوران‌ها</span>
            <span>←</span>
          </ViewAllLink>
        </HeaderRow>

        <Grid>
          {FEATURED_ITEMS.map((dish) => (
            <DishCard key={dish.id} onClick={() => setSelectedDish(dish)}>
              <CardBanner>
                <CardEmoji>{dish.image}</CardEmoji>
                {dish.discountPercent && (
                  <DiscountBadge>٪{dish.discountPercent} تخفیف</DiscountBadge>
                )}
              </CardBanner>

              <CardBody>
                <CardTitle>{dish.name}</CardTitle>
                <RestoRow>
                  <RestoName>{dish.restaurantName}</RestoName>
                  <RatingPill>
                    <span>★</span>
                    <span>۴.۸</span>
                  </RatingPill>
                </RestoRow>
                <CardDesc>{dish.description}</CardDesc>

                <CardFooter>
                  <PriceBox>
                    <span className="current">{formatPrice(dish.price)}</span>
                    {dish.originalPrice && (
                      <span className="original">{formatPrice(dish.originalPrice)}</span>
                    )}
                  </PriceBox>
                  <QuickAddBtn
                    type="button"
                    onClick={(e) => handleQuickAdd(e, dish)}
                    aria-label={`افزودن ${dish.name} به سبد خرید`}
                  >
                    <span>+</span>
                    <span>افزودن</span>
                  </QuickAddBtn>
                </CardFooter>
              </CardBody>
            </DishCard>
          ))}
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
