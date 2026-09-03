"use client";

import React, { useState, useMemo } from "react";
import styled from "styled-components";
import type { ProductMenuItem } from "@/application/ports/catalog-repository";
import { useCart } from "@/contexts/CartContext";
import { irrToToman } from "@/domain/money/money";
import { toast } from "react-hot-toast";
import FoodDetailModal, { type DishDetails } from "@/components/common/FoodDetailModal";

function getDishEmoji(name: string): string {
  if (name.includes("پیتزا")) return "🍕";
  if (name.includes("برگر") || name.includes("ساندویچ")) return "🍔";
  if (name.includes("سوشی")) return "🍣";
  if (name.includes("کباب") || name.includes("جوجه") || name.includes("چلو")) return "🍚";
  if (name.includes("سالاد")) return "🥗";
  if (name.includes("پاستا") || name.includes("اسپاگتی")) return "🍝";
  if (name.includes("سوپ")) return "🍲";
  if (name.includes("نوشابه") || name.includes("دوغ") || name.includes("آب")) return "🥤";
  if (name.includes("دسر") || name.includes("کیک")) return "🍰";
  return "🍽️";
}

function getDishCategory(name: string): string {
  if (name.includes("پیتزا")) return "پیتزا";
  if (name.includes("برگر") || name.includes("ساندویچ")) return "برگر و ساندویچ";
  if (name.includes("سوشی")) return "سوشی و غذاهای آسیایی";
  if (name.includes("کباب") || name.includes("جوجه") || name.includes("چلو") || name.includes("خورشت")) return "غذای اصلی";
  if (name.includes("سالاد") || name.includes("سوپ") || name.includes("سیب‌زمینی")) return "پیش‌غذا و سالاد";
  if (name.includes("نوشابه") || name.includes("دوغ") || name.includes("آب") || name.includes("موهیتو")) return "نوشیدنی";
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
  if (description && (description.includes("با") || description.includes("و"))) {
    const parts = description.split(/[،,و]|با|همراه/);
    const cleaned = parts
      .map((p) => p.trim())
      .filter((p) => p.length > 2 && p.length < 30 && !p.includes("پیتزا") && !p.includes("مخصوص"));
    if (cleaned.length > 0) return cleaned;
  }
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
  gap: 1rem;
  background: white;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.75rem;
    gap: 0.75rem;
  }
`;

const SearchBox = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.65rem 2.5rem 0.65rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-family: inherit;
  outline: none;
  background: #f8fafc;
  transition: all 0.2s;

  &:focus {
    background: white;
    border-color: #ff5a00;
    box-shadow: 0 0 0 3px rgba(255, 90, 0, 0.1);
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  right: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
  font-size: 0.95rem;
`;

const ClearSearchBtn = styled.button`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.2rem;
  font-size: 0.85rem;

  &:hover {
    color: #0f172a;
  }
`;

const TabsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const CategoryTab = styled.button<{ $active: boolean }>`
  background: ${({ $active }) => ($active ? "#ff5a00" : "#f1f5f9")};
  color: ${({ $active }) => ($active ? "white" : "#475569")};
  border: none;
  padding: 0.45rem 1rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.35rem;

  &:hover {
    background: ${({ $active }) => ($active ? "#e04e00" : "#e2e8f0")};
  }

  span.count {
    background: ${({ $active }) => ($active ? "rgba(255, 255, 255, 0.25)" : "#cbd5e1")};
    color: ${({ $active }) => ($active ? "white" : "#334155")};
    padding: 0.1rem 0.4rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 700;
  }
`;

const List = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
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
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.15rem;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  background: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: #ff5a00;
    box-shadow: 0 6px 18px rgba(255, 90, 0, 0.08);
    transform: translateY(-2px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.85rem;
    gap: 0.75rem;
    border-radius: 0.85rem;
  }
`;

const DishIconBox = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.85rem;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 44px;
    height: 44px;
    font-size: 1.5rem;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
  min-width: 0;

  strong {
    display: block;
    font-size: 1rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.neutral[900]};
    margin-bottom: 0.25rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      font-size: 0.925rem;
      margin-bottom: 0.2rem;
    }
  }

  p {
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.neutral[600]};
    margin: 0 0 0.4rem;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      font-size: 0.78rem;
      margin-bottom: 0.35rem;
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
    font-size: 0.95rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary[600]};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      font-size: 0.85rem;
    }
  }

  span.details-hint {
    font-size: 0.75rem;
    color: #94a3b8;
  }
`;

const ActionBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
`;

const AddButton = styled.button`
  padding: 0.55rem 1rem;
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  min-height: 40px;
  min-width: 72px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(255, 90, 0, 0.2);

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
  }

  &:active {
    transform: scale(0.96);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.45rem 0.85rem;
    font-size: 0.825rem;
    min-height: 36px;
    min-width: 64px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  background: white;
  border-radius: 1rem;
  border: 1px dashed #cbd5e1;
  color: #64748b;

  .emoji {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  h4 {
    margin: 0 0 0.35rem;
    color: #0f172a;
    font-size: 1.1rem;
  }

  p {
    margin: 0;
    font-size: 0.875rem;
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

  const categories = useMemo(() => Object.keys(categoriesWithCounts), [categoriesWithCounts]);

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
      image: getDishEmoji(product.name),
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

  return (
    <Container>
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
          <SearchIconWrapper aria-hidden="true">🔍</SearchIconWrapper>
          {searchQuery && (
            <ClearSearchBtn
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="پاک کردن متن جستجو"
            >
              ✕
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
              <span className="count">{categoriesWithCounts[cat]}</span>
            </CategoryTab>
          ))}
        </TabsWrapper>
      </ControlsBar>

      {filteredProducts.length === 0 ? (
        <EmptyState>
          <div className="emoji" aria-hidden="true">🍽️</div>
          <h4>غذایی یافت نشد</h4>
          <p>موردی با مشخصات جستجوی شما در منوی این رستوران پیدا نشد.</p>
        </EmptyState>
      ) : (
        <List>
          {filteredProducts.map((product) => {
            const priceToman = irrToToman(product.price);
            const emoji = getDishEmoji(product.name);
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
                <DishIconBox aria-hidden="true">{emoji}</DishIconBox>
                <ItemDetails>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem", flexWrap: "wrap" }}>
                    <strong style={{ margin: 0, textWrap: "balance" }}>{product.name}</strong>
                    {inCart && (
                      <span
                        style={{
                          fontSize: "0.725rem",
                          fontWeight: 700,
                          color: "#ea580c",
                          background: "#ffedd5",
                          padding: "0.15rem 0.5rem",
                          borderRadius: "9999px",
                          border: "1px solid #fed7aa",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        ✓ {inCart.quantity} در سبد
                      </span>
                    )}
                  </div>
                  <p>{product.description}</p>
                  <div className="meta-row">
                    <span className="price" style={{ fontVariantNumeric: "tabular-nums" }}>
                      {new Intl.NumberFormat("fa-IR").format(priceToman)} تومان
                    </span>
                    <span className="details-hint">💡 ارزش غذایی و ترکیبات</span>
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
