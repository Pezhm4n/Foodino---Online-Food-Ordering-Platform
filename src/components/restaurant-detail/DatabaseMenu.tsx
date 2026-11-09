"use client";

import React, { useState, useMemo } from "react";
import styled from "styled-components";
import type { ProductMenuItem } from "@/application/ports/catalog-repository";
import { useCart } from "@/contexts/CartContext";
import { irrToToman } from "@/domain/money/money";
import { toast } from "react-hot-toast";
import FoodDetailModal, {
  type DishDetails,
} from "@/components/common/FoodDetailModal";
import {
  DishArtwork,
  resolveFoodKind,
  FOOD_VISUAL_PALETTE,
  SearchIcon,
  CloseIcon,
  InfoIcon,
  CheckCircleIcon,
} from "@/components/ui/FoodVisuals";

function getDishCategory(name: string): string {
  if (name.includes("پیتزا")) return "پیتزا";
  if (name.includes("برگر") || name.includes("ساندویچ")) return "برگر و ساندویچ";
  if (name.includes("سوشی")) return "سوشی و غذاهای آسیایی";
  if (
    name.includes("کباب") ||
    name.includes("جوجه") ||
    name.includes("چلو") ||
    name.includes("خورشت")
  )
    return "غذای اصلی";
  if (
    name.includes("سالاد") ||
    name.includes("سوپ") ||
    name.includes("سیب‌زمینی") ||
    name.includes("پیاز") ||
    name.includes("نان سیر")
  )
    return "پیش‌غذا و سالاد";
  if (
    name.includes("نوشابه") ||
    name.includes("دوغ") ||
    name.includes("آب") ||
    name.includes("موهیتو")
  )
    return "نوشیدنی";
  return "منوی اصلی";
}

function getDishNutrition(category: string) {
  switch (category) {
    case "پیتزا":
      return { calories: 750, protein: 34, fat: 28, carbs: 68 };
    case "برگر و ساندویچ":
      return { calories: 680, protein: 36, fat: 30, carbs: 52 };
    case "سوشی و غذاهای آسیایی":
      return { calories: 460, protein: 28, fat: 12, carbs: 55 };
    case "پیش‌غذا و سالاد":
      return { calories: 340, protein: 18, fat: 14, carbs: 24 };
    case "نوشیدنی":
      return { calories: 120, protein: 0, fat: 0, carbs: 30 };
    default:
      return { calories: 820, protein: 40, fat: 34, carbs: 75 };
  }
}

function getDishIngredients(description: string): string[] {
  if (!description) {
    return ["مواد اولیه تازه روز", "ادویه مخصوص سرآشپز", "روغن درجه یک"];
  }
  const parts = description.split(
    /[،,؛;\n\+]|\s+و\s+|\s+همراه\s+با\s+|\s+به\s+همراه\s+|\s+همراه\s+|\s+با\s+/
  );
  const cleaned = parts
    .map((p) => p.trim())
    .filter(
      (p) =>
        p.length >= 2 &&
        p.length <= 40 &&
        !p.includes("پیتزا") &&
        !p.includes("مخصوص")
    );
  if (cleaned.length > 0) return cleaned;
  return ["مواد اولیه تازه روز", "ادویه مخصوص سرآشپز", "روغن درجه یک"];
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const ControlsBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  background: #ffffff;
  padding: 1.1rem;
  border-radius: 1.15rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  box-shadow: 0 4px 14px -4px rgba(22, 18, 15, 0.04);
`;

const SearchBox = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  min-height: 40px;
  padding: 0.7rem 2.65rem 0.7rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: 0.8rem;
  font-size: 0.9rem;
  font-family: inherit;
  outline: none;
  background: ${({ theme }) => theme.colors.neutral[50]};
  color: ${({ theme }) => theme.colors.neutral[900]};
  transition: border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease;

  &:focus {
    background: #ffffff;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  right: 0.9rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.neutral[400]};
  pointer-events: none;
  display: inline-flex;
`;

const ClearSearchBtn = styled.button`
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.neutral[400]};
  cursor: pointer;
  min-width: 34px;
  min-height: 34px;
  padding: 0.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${({ theme }) => theme.colors.neutral[900]};
  }
`;

const TabsWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  overflow-x: visible;
  padding-bottom: 0.1rem;
`;

const CategoryTab = styled.button<{ $active: boolean }>`
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary[500] : theme.colors.neutral[100]};
  color: ${({ $active, theme }) =>
    $active ? "#ffffff" : theme.colors.neutral[700]};
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.primary[500] : theme.colors.neutral[200]};
  min-height: 34px;
  padding: 0.4rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 180ms ease, color 180ms ease, border-color 180ms ease, transform 120ms ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primary[600] : theme.colors.neutral[200]};
  }

  &:active {
    transform: scale(0.96);
  }

  span.count {
    background: ${({ $active }) =>
      $active ? "rgba(255, 255, 255, 0.22)" : "#ffffff"};
    color: ${({ $active, theme }) =>
      $active ? "#ffffff" : theme.colors.neutral[700]};
    padding: 0.08rem 0.45rem;
    border-radius: 9999px;
    font-size: 0.74rem;
    font-weight: 800;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.76rem;
    padding: 0.35rem 0.75rem;
  }
`;

const List = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.15rem;
  padding: 0;
  list-style: none;
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 0.85rem;
  }
`;

const Item = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.15rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: 1.25rem;
  background: #ffffff;
  box-shadow: 0 4px 14px -4px rgba(22, 18, 15, 0.05);
  transition: transform 240ms var(--ease-out),
    box-shadow 240ms var(--ease-out),
    border-color 240ms var(--ease-out);
  cursor: pointer;
  position: relative;
  animation: foodinoFadeUp 420ms var(--ease-out) both;

  &:nth-child(1) { animation-delay: 20ms; }
  &:nth-child(2) { animation-delay: 65ms; }
  &:nth-child(3) { animation-delay: 110ms; }
  &:nth-child(4) { animation-delay: 155ms; }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: ${({ theme }) => theme.colors.primary[300]};
      box-shadow: 0 16px 32px -8px rgba(22, 18, 15, 0.12);
      transform: translateY(-4px);
    }
  }

  &:active {
    transform: scale(0.985);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-wrap: wrap;
    align-items: flex-start;
    padding: 0.9rem;
    gap: 0.7rem;
  }
`;

const DishIconBox = styled.div<{ $bgStart: string; $bgEnd: string }>`
  width: 78px;
  height: 78px;
  border-radius: 1rem;
  background: linear-gradient(
    145deg,
    ${({ $bgStart }) => $bgStart} 0%,
    ${({ $bgEnd }) => $bgEnd} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 6px 14px -4px rgba(22, 18, 15, 0.18);
  transition: transform 260ms var(--ease-out);

  @media (hover: hover) and (pointer: fine) {
    ${Item}:hover & {
      transform: scale(1.08) rotate(-3deg);
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 64px;
    height: 64px;

    svg {
      width: 52px;
      height: 52px;
    }
  }
`;

const ItemDetails = styled.div`
  flex: 1;
  min-width: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex: 1 1 calc(100% - 78px);
  }

  strong {
    display: block;
    font-size: 1.04rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.neutral[900]};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      font-size: 0.96rem;
    }
  }

  p {
    font-size: 0.84rem;
    color: ${({ theme }) => theme.colors.neutral[600]};
    margin: 0.25rem 0 0.6rem;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      font-size: 0.8rem;
      margin: 0.2rem 0 0.45rem;
    }
  }

  .meta-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  span.price {
    display: inline-block;
    font-size: 0.98rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.primary[600]};
  }

  span.details-hint {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.74rem;
    color: ${({ theme }) => theme.colors.neutral[500]};
    font-weight: 500;
  }
`;

const InCartBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.success[700]};
  background: ${({ theme }) => theme.colors.success[50]};
  padding: 0.14rem 0.5rem;
  border-radius: 9999px;
  border: 1px solid ${({ theme }) => theme.colors.success[200]};
`;

const ActionBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
    justify-content: flex-end;
    padding-top: 0.45rem;
    border-top: 1px dashed ${({ theme }) => theme.colors.neutral[100]};
  }
`;

const AddButton = styled.button`
  padding: 0.6rem 1.05rem;
  border: 0;
  border-radius: 0.8rem;
  background: ${({ theme }) => theme.colors.primary[500]};
  color: #ffffff;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.85rem;
  min-height: 40px;
  min-width: 78px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 180ms ease, transform 140ms ease, box-shadow 180ms ease;
  box-shadow: 0 6px 14px -4px rgba(217, 56, 30, 0.35);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: ${({ theme }) => theme.colors.primary[600]};
      transform: translateY(-1px);
    }
  }

  &:active {
    transform: scale(0.96);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px dashed ${({ theme }) => theme.colors.neutral[300]};
  color: ${({ theme }) => theme.colors.neutral[600]};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  h4 {
    margin: 0.25rem 0 0;
    color: ${({ theme }) => theme.colors.neutral[900]};
    font-size: 1.1rem;
    font-weight: 800;
  }

  p {
    margin: 0;
    font-size: 0.88rem;
  }
`;

export default function DatabaseMenu({
  restaurant,
  products,
}: Readonly<{
  restaurant: { id: string; name: string };
  products: readonly ProductMenuItem[];
}>) {
  const { addItem, cartItems } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("همه");
  const [selectedDish, setSelectedDish] = useState<DishDetails | null>(null);

  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = { همه: products.length };
    products.forEach((p) => {
      const cat = getDishCategory(p.name);
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [products]);

  const categories = useMemo(
    () => Object.keys(categoriesWithCounts),
    [categoriesWithCounts]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const cat = getDishCategory(p.name);
      const matchesCat = activeCategory === "همه" || cat === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  const handleProductClick = (product: ProductMenuItem) => {
    const priceToman = irrToToman(product.price);
    const category = getDishCategory(product.name);
    setSelectedDish({
      id: product.id,
      name: product.name,
      description: product.description,
      price: priceToman,
      image: resolveFoodKind(product.name, product.description),
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      category,
      ingredients: getDishIngredients(product.description),
      nutrition: getDishNutrition(category),
      isPopular: true,
    });
  };

  const handleQuickAdd = (e: React.MouseEvent, product: ProductMenuItem) => {
    e.stopPropagation();
    try {
      const priceToman = irrToToman(product.price);
      addItem({
        id: product.id,
        productId: product.id,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        name: product.name,
        price: priceToman,
        quantity: 1,
        addonIds: [],
      });
    } catch {
      toast.error("سبد خرید فقط می‌تواند شامل محصولات یک رستوران باشد.");
    }
  };

  const numberFormatter = new Intl.NumberFormat("fa-IR");

  return (
    <Container>
      {products.length > 1 && (
        <ControlsBar>
          <SearchBox>
            <SearchInput
              type="search"
              placeholder="جستجو در منوی این رستوران…"
              value={searchQuery}
              autoComplete="off"
              spellCheck={false}
              aria-label="جستجو در منوی غذاها"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchIconWrapper aria-hidden="true">
              <SearchIcon size={17} />
            </SearchIconWrapper>
            {searchQuery && (
              <ClearSearchBtn
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="پاک کردن متن جستجو"
              >
                <CloseIcon size={15} />
              </ClearSearchBtn>
            )}
          </SearchBox>

          <TabsWrapper role="tablist" aria-label="دسته‌بندی‌های غذا">
            {categories.map((cat) => (
              <CategoryTab
                key={cat}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat}
                $active={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
              >
                <span>{cat}</span>
                <span className="count">
                  {numberFormatter.format(categoriesWithCounts[cat])}
                </span>
              </CategoryTab>
            ))}
          </TabsWrapper>
        </ControlsBar>
      )}

      {filteredProducts.length === 0 ? (
        <EmptyState>
          <DishArtwork kind="chef" size={76} variant="thumb" />
          <h4>غذایی یافت نشد</h4>
          <p>موردی با مشخصات جستجوی شما در منوی این رستوران پیدا نشد.</p>
          <AddButton
            type="button"
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("همه");
            }}
            style={{ marginTop: "0.4rem" }}
          >
            نمایش همه غذاهای منو
          </AddButton>
        </EmptyState>
      ) : (
        <List>
          {filteredProducts.map((product) => {
            const priceToman = irrToToman(product.price);
            const kind = resolveFoodKind(product.name, product.description);
            const palette = FOOD_VISUAL_PALETTE[kind];
            const inCart = cartItems.find((it) => it.id === product.id);

            return (
              <Item
                key={product.id}
                role="button"
                tabIndex={0}
                onClick={() => handleProductClick(product)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleProductClick(product);
                  }
                }}
              >
                <DishIconBox
                  $bgStart={palette.bgStart}
                  $bgEnd={palette.bgEnd}
                  aria-hidden="true"
                >
                  <DishArtwork kind={kind} size={62} variant="thumb" />
                </DishIconBox>

                <ItemDetails>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <strong>{product.name}</strong>
                    {inCart && (
                      <InCartBadge>
                        <CheckCircleIcon size={12} />
                        <span>
                          {numberFormatter.format(inCart.quantity)} در سبد
                        </span>
                      </InCartBadge>
                    )}
                  </div>
                  <p>{product.description}</p>
                  <div className="meta-row">
                    <span
                      className="price"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {numberFormatter.format(priceToman)} تومان
                    </span>
                    <span className="details-hint">
                      <InfoIcon size={13} />
                      <span>ارزش غذایی و ترکیبات</span>
                    </span>
                  </div>
                </ItemDetails>

                <ActionBox>
                  <AddButton
                    type="button"
                    onClick={(e) => handleQuickAdd(e, product)}
                    aria-label={`افزودن ${product.name} به سبد خرید`}
                  >
                    + افزودن
                  </AddButton>
                </ActionBox>
              </Item>
            );
          })}
        </List>
      )}

      <FoodDetailModal
        dish={selectedDish}
        isOpen={!!selectedDish}
        onClose={() => setSelectedDish(null)}
      />
    </Container>
  );
}
