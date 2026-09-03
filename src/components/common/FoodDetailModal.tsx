"use client";

import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useCart } from "@/contexts/CartContext";

export interface DishNutrition {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface DishDetails {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  image?: string;
  restaurantId: string;
  restaurantName: string;
  category?: string;
  ingredients?: string[];
  nutrition?: DishNutrition;
  isPopular?: boolean;
}

interface FoodDetailModalProps {
  dish: DishDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  padding: 1rem;
  direction: rtl;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalCard = styled.div`
  background: white;
  border-radius: 1.25rem;
  width: 100%;
  max-width: 540px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  position: relative;
  display: flex;
  flex-direction: column;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    max-height: 94vh;
    border-radius: 1rem;
  }
`;

const ModalHeader = styled.div`
  position: relative;
  height: 180px;
  background: linear-gradient(135deg, #ffefe6 0%, #ffe0d1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  overflow: hidden;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    height: 140px;
  }
`;

const DishEmoji = styled.div`
  font-size: 5.5rem;
  user-select: none;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.12));

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 4.2rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: white;
  color: #475569;
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
    color: #0f172a;
    transform: scale(1.05);
  }
`;

const BadgeContainer = styled.div`
  position: absolute;
  bottom: 0.85rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const DiscountTag = styled.span`
  background: #ea580c;
  color: white;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
`;

const CategoryTag = styled.span`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
  color: #0f172a;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const ModalBody = styled.div`
  padding: 1.25rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 1rem 1.15rem 1.25rem;
    gap: 1rem;
  }
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const DishTitle = styled.h2`
  font-size: 1.35rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 1.2rem;
  }
`;

const RestaurantMeta = styled.div`
  font-size: 0.85rem;
  color: #ff5a00;
  font-weight: 600;
`;

const DishDescription = styled.p`
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
`;

const SectionHeader = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const NutritionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  background: #f8fafc;
  padding: 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const NutritionItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0.25rem;

  .label {
    font-size: 0.75rem;
    color: #64748b;
  }

  .value {
    font-size: 0.9rem;
    font-weight: 700;
    color: #0f172a;
    margin-top: 0.2rem;
  }
`;

const IngredientsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const IngredientChip = styled.span`
  background: #f1f5f9;
  color: #334155;
  font-size: 0.8rem;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-weight: 500;
`;

const NoteInput = styled.textarea`
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-family: inherit;
  resize: none;
  outline: none;

  &:focus {
    border-color: #ff5a00;
    box-shadow: 0 0 0 2px rgba(255, 90, 0, 0.15);
  }
`;

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  margin-top: 0.5rem;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    gap: 0.75rem;
  }
`;

const PriceColumn = styled.div`
  display: flex;
  flex-direction: column;

  .label {
    font-size: 0.75rem;
    color: #64748b;
  }

  .current {
    font-size: 1.15rem;
    font-weight: 800;
    color: #0f172a;
  }

  .original {
    font-size: 0.8rem;
    color: #94a3b8;
    text-decoration: line-through;
  }
`;

const ControlsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const QuantityBox = styled.div`
  display: flex;
  align-items: center;
  background: #f1f5f9;
  border-radius: 0.5rem;
  padding: 0.2rem;
`;

const QtyBtn = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: none;
  border-radius: 0.35rem;
  font-weight: 700;
  font-size: 1rem;
  color: #0f172a;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: #e2e8f0;
  }
`;

const QtyValue = styled.span`
  min-width: 32px;
  text-align: center;
  font-weight: 700;
  font-size: 0.95rem;
  color: #0f172a;
`;

const AddToCartBtn = styled.button`
  background: #ea580c;
  color: white;
  border: none;
  padding: 0.65rem 1.25rem;
  border-radius: 0.6rem;
  font-weight: 700;
  font-size: 0.925rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(234, 88, 12, 0.25);
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: #c2410c;
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.97);
  }
`;

export default function FoodDetailModal({ dish, isOpen, onClose }: FoodDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const { addItem } = useCart();

  const handleClose = useCallback(() => {
    setQuantity(1);
    setNotes("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClose]);

  if (!isOpen || !dish) return null;

  const formatPrice = (p: number) => p.toLocaleString("fa-IR") + " تومان";
  const lineTotal = dish.price * quantity;

  const handleAddToCart = () => {
    addItem({
      id: `${dish.id}:item`,
      productId: dish.id,
      restaurantId: dish.restaurantId,
      restaurantName: dish.restaurantName,
      name: dish.name,
      price: dish.price,
      quantity,
      addonIds: [],
      notes: notes.trim() || undefined,
    });
    handleClose();
  };

  return (
    <Overlay $isOpen={isOpen} onClick={handleClose} role="presentation">
      <ModalCard
        role="dialog"
        aria-modal="true"
        aria-labelledby="dish-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader>
          <DishEmoji aria-hidden="true">{dish.image || "🍕"}</DishEmoji>
          <CloseButton onClick={handleClose} aria-label="بستن جزئیات غذا">✕</CloseButton>
          <BadgeContainer>
            {dish.discountPercent && <DiscountTag>٪{dish.discountPercent} تخفیف</DiscountTag>}
            {dish.category && <CategoryTag>{dish.category}</CategoryTag>}
          </BadgeContainer>
        </ModalHeader>

        <ModalBody>
          <TitleSection>
            <DishTitle id="dish-modal-title">{dish.name}</DishTitle>
            <RestaurantMeta>از {dish.restaurantName}</RestaurantMeta>
            <DishDescription>{dish.description}</DishDescription>
          </TitleSection>

          {dish.nutrition && (
            <div>
              <SectionHeader>📊 ارزش غذایی (در هر پرس)</SectionHeader>
              <NutritionGrid>
                <NutritionItem>
                  <span className="label">کالری</span>
                  <span className="value">{dish.nutrition.calories} kcal</span>
                </NutritionItem>
                <NutritionItem>
                  <span className="label">پروتئین</span>
                  <span className="value">{dish.nutrition.protein} گرم</span>
                </NutritionItem>
                <NutritionItem>
                  <span className="label">چربی</span>
                  <span className="value">{dish.nutrition.fat} گرم</span>
                </NutritionItem>
                <NutritionItem>
                  <span className="label">کربوهیدرات</span>
                  <span className="value">{dish.nutrition.carbs} گرم</span>
                </NutritionItem>
              </NutritionGrid>
            </div>
          )}

          {dish.ingredients && dish.ingredients.length > 0 && (
            <div>
              <SectionHeader>🌿 ترکیبات و مواد اولیه</SectionHeader>
              <IngredientsList>
                {dish.ingredients.map((ing, i) => (
                  <IngredientChip key={i}>{ing}</IngredientChip>
                ))}
              </IngredientsList>
            </div>
          )}

          <div>
            <SectionHeader>✍️ یادداشت اختصاصی برای سرآشپز (اختیاری)</SectionHeader>
            <NoteInput
              rows={2}
              placeholder="مثلاً: بدون پیاز، سس کمتر، تند نباشد…"
              value={notes}
              spellCheck={false}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <ModalFooter>
            <PriceColumn style={{ fontVariantNumeric: "tabular-nums" }}>
              <span className="label">مبلغ کل:</span>
              <span className="current">{formatPrice(lineTotal)}</span>
              {dish.originalPrice && (
                <span className="original">{formatPrice(dish.originalPrice * quantity)}</span>
              )}
            </PriceColumn>

            <ControlsGroup>
              <QuantityBox>
                <QtyBtn
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="کاهش تعداد"
                >
                  -
                </QtyBtn>
                <QtyValue aria-live="polite" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {quantity}
                </QtyValue>
                <QtyBtn
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                  aria-label="افزایش تعداد"
                >
                  +
                </QtyBtn>
              </QuantityBox>
              <AddToCartBtn type="button" onClick={handleAddToCart}>
                افزودن به سبد
              </AddToCartBtn>
            </ControlsGroup>
          </ModalFooter>
        </ModalBody>
      </ModalCard>
    </Overlay>
  );
}
