"use client";

import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useCart } from "@/contexts/CartContext";
import {
  DishArtwork,
  resolveFoodKind,
  FOOD_VISUAL_PALETTE,
  CloseIcon,
  FlameIcon,
  SparkleIcon,
} from "@/components/ui/FoodVisuals";

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

const Overlay = styled.div<{ $isOpen: boolean; $isClosing?: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(22, 18, 15, 0.65);
  backdrop-filter: blur(5px);
  z-index: 200;
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  padding: 1rem;
  direction: rtl;
  touch-action: none;
  overscroll-behavior: contain;
  animation: ${({ $isClosing }) =>
    $isClosing
      ? "modalBackdropFadeOut 190ms cubic-bezier(0.4, 0, 1, 1) forwards"
      : "modalBackdropFadeIn 220ms cubic-bezier(0, 0, 0.2, 1)"};

  @keyframes modalBackdropFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes modalBackdropFadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    align-items: flex-end;
    padding: 0;
  }
`;

const ModalCard = styled.div<{ $isClosing?: boolean }>`
  background: #ffffff;
  border-radius: 1.5rem;
  width: 100%;
  max-width: 540px;
  max-height: 90vh;
  overflow: hidden;
  touch-action: auto;
  overscroll-behavior: contain;
  box-shadow: 0 28px 60px rgba(22, 18, 15, 0.32);
  position: relative;
  display: flex;
  flex-direction: column;
  animation: ${({ $isClosing }) =>
    $isClosing
      ? "modalExitDesktop 190ms cubic-bezier(0.4, 0, 1, 1) forwards"
      : "modalEnterDesktop 220ms cubic-bezier(0.16, 1, 0.3, 1)"};

  @keyframes modalEnterDesktop {
    from {
      opacity: 0;
      transform: scale(0.97) translateY(6px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes modalExitDesktop {
    from {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    to {
      opacity: 0;
      transform: scale(0.97) translateY(8px);
    }
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    max-height: 88vh;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-top-left-radius: 1.5rem;
    border-top-right-radius: 1.5rem;
  }
`;

const DragHandle = styled.div`
  display: none;
  width: 44px;
  height: 5px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.35);
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 15;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    display: block;
  }
`;

const ModalHeader = styled.div<{ $bgStart: string; $bgEnd: string }>`
  position: relative;
  height: 192px;
  background: linear-gradient(
    145deg,
    ${({ $bgStart }) => $bgStart} 0%,
    ${({ $bgEnd }) => $bgEnd} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  overflow: hidden;
  flex-shrink: 0;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    height: 155px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(22, 18, 15, 0.65);
  backdrop-filter: blur(8px);
  color: #faf6f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 120ms ease, background-color 140ms ease;

  &:hover {
    background: rgba(22, 18, 15, 0.85);
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
  background: ${({ theme }) => theme.colors.primary[500]};
  color: #ffffff;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 800;
`;

const CategoryTag = styled.span`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  color: ${({ theme }) => theme.colors.neutral[900]};
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 700;
`;

const ModalBody = styled.div`
  padding: 1.35rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  flex: 1;
  overflow-y: auto;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const DishTitle = styled.h2`
  font-size: 1.35rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin: 0;
`;

const RestaurantMeta = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.primary[600]};
  font-weight: 700;
`;

const DishDescription = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.neutral[600]};
  line-height: 1.65;
  margin: 0;
`;

const SectionHeader = styled.h3`
  font-size: 0.92rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin: 0 0 0.55rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  svg {
    color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const NutritionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  background: ${({ theme }) => theme.colors.neutral[50]};
  padding: 0.8rem;
  border-radius: 0.9rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};

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
    font-size: 0.74rem;
    color: ${({ theme }) => theme.colors.neutral[500]};
  }

  .value {
    font-size: 0.9rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.neutral[900]};
    margin-top: 0.2rem;
  }
`;

const IngredientsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
`;

const IngredientChip = styled.span`
  background: ${({ theme }) => theme.colors.neutral[100]};
  color: ${({ theme }) => theme.colors.neutral[800]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  font-size: 0.8rem;
  padding: 0.28rem 0.65rem;
  border-radius: 0.55rem;
  font-weight: 600;
`;

const NoteInput = styled.textarea`
  width: 100%;
  padding: 0.65rem 0.85rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: 0.75rem;
  font-size: 0.86rem;
  font-family: inherit;
  resize: none;
  outline: none;
  background: ${({ theme }) => theme.colors.neutral[50]};

  &:focus {
    background: #ffffff;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  background: #ffffff;
  flex-shrink: 0;
  z-index: 10;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    flex-direction: column;
    gap: 0.85rem;
    padding: 0.85rem 1.15rem calc(1rem + env(safe-area-inset-bottom));
  }
`;

const MobileFooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  @media (min-width: 641px) {
    display: none;
  }
`;

const MobileOnlyBtnWrapper = styled.div`
  width: 100%;

  @media (min-width: 641px) {
    display: none;
  }
`;

const DesktopFooterControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 1rem;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    display: none;
  }
`;

const PriceColumn = styled.div`
  display: flex;
  flex-direction: column;

  .label {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.neutral[500]};
  }

  .current {
    font-size: 1.15rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.neutral[900]};
  }

  .original {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.neutral[400]};
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
  background: ${({ theme }) => theme.colors.neutral[100]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: 0.65rem;
  padding: 0.2rem;
`;

const QtyBtn = styled.button`
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: none;
  border-radius: 0.45rem;
  font-weight: 800;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.neutral[900]};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral[200]};
  }
`;

const QtyValue = styled.span`
  min-width: 34px;
  text-align: center;
  font-weight: 800;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.neutral[900]};
`;

const AddToCartBtn = styled.button`
  background: ${({ theme }) => theme.colors.primary[500]};
  color: #ffffff;
  border: none;
  padding: 0.78rem 1.45rem;
  border-radius: 0.8rem;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0 6px 16px -4px rgba(217, 56, 30, 0.35);
  transition: all 0.2s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    width: 100%;
    padding: 0.85rem 1rem;
    font-size: 1rem;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
    transform: translateY(-1px);
  }
`;

export default function FoodDetailModal({
  dish,
  isOpen,
  onClose,
}: FoodDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const { addItem } = useCart();

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setQuantity(1);
      setNotes("");
    }, 190);
  }, [isClosing, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClose]);

  if (!isOpen || !dish) return null;
  const activeDish = dish;
  const kind = resolveFoodKind(
    activeDish.category,
    activeDish.name,
    activeDish.image
  );
  const palette = FOOD_VISUAL_PALETTE[kind];

  const formatPrice = (p: number) => p.toLocaleString("fa-IR") + " تومان";
  const lineTotal = activeDish.price * quantity;

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
    <Overlay
      $isOpen={isOpen}
      $isClosing={isClosing}
      onClick={handleClose}
      role="presentation"
    >
      <ModalCard
        $isClosing={isClosing}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dish-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <DragHandle aria-hidden="true" />
        <ModalHeader $bgStart={palette.bgStart} $bgEnd={palette.bgEnd}>
          <DishArtwork kind={kind} size={146} variant="hero" />
          <CloseButton onClick={handleClose} aria-label="بستن جزئیات غذا">
            <CloseIcon size={16} />
          </CloseButton>
          <BadgeContainer>
            {activeDish.discountPercent && (
              <DiscountTag>
                ٪{activeDish.discountPercent.toLocaleString("fa-IR")} تخفیف
              </DiscountTag>
            )}
            {activeDish.category && (
              <CategoryTag>{activeDish.category}</CategoryTag>
            )}
          </BadgeContainer>
        </ModalHeader>

        <ModalBody>
          <TitleSection>
            <DishTitle id="dish-modal-title">{activeDish.name}</DishTitle>
            <RestaurantMeta>از {activeDish.restaurantName}</RestaurantMeta>
            <DishDescription>{activeDish.description}</DishDescription>
          </TitleSection>

          {activeDish.nutrition && (
            <div>
              <SectionHeader>
                <FlameIcon size={16} />
                <span>ارزش غذایی (در هر پرس)</span>
              </SectionHeader>
              <NutritionGrid>
                <NutritionItem>
                  <span className="label">کالری</span>
                  <span className="value">
                    {activeDish.nutrition.calories.toLocaleString("fa-IR")}{" "}
                    کالری
                  </span>
                </NutritionItem>
                <NutritionItem>
                  <span className="label">پروتئین</span>
                  <span className="value">
                    {activeDish.nutrition.protein.toLocaleString("fa-IR")} گرم
                  </span>
                </NutritionItem>
                <NutritionItem>
                  <span className="label">چربی</span>
                  <span className="value">
                    {activeDish.nutrition.fat.toLocaleString("fa-IR")} گرم
                  </span>
                </NutritionItem>
                <NutritionItem>
                  <span className="label">کربوهیدرات</span>
                  <span className="value">
                    {activeDish.nutrition.carbs.toLocaleString("fa-IR")} گرم
                  </span>
                </NutritionItem>
              </NutritionGrid>
            </div>
          )}

          {activeDish.ingredients && activeDish.ingredients.length > 0 && (
            <div>
              <SectionHeader>
                <SparkleIcon size={16} />
                <span>ترکیبات و مواد اولیه</span>
              </SectionHeader>
              <IngredientsList>
                {activeDish.ingredients.map((ing, i) => (
                  <IngredientChip key={i}>{ing}</IngredientChip>
                ))}
              </IngredientsList>
            </div>
          )}

          <div>
            <SectionHeader>
              <span>یادداشت اختصاصی برای سرآشپز (اختیاری)</span>
            </SectionHeader>
            <NoteInput
              rows={2}
              placeholder="مثلاً: بدون پیاز، سس کمتر، تند نباشد…"
              value={notes}
              spellCheck={false}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </ModalBody>

        <ModalFooter>
          <MobileFooterRow>
            <PriceColumn style={{ fontVariantNumeric: "tabular-nums" }}>
              <span className="label">مبلغ کل:</span>
              <span className="current">{formatPrice(lineTotal)}</span>
              {activeDish.originalPrice && (
                <span className="original">
                  {formatPrice(activeDish.originalPrice * quantity)}
                </span>
              )}
            </PriceColumn>

            <QuantityBox>
              <QtyBtn
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="کاهش تعداد"
              >
                -
              </QtyBtn>
              <QtyValue
                aria-live="polite"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {quantity.toLocaleString("fa-IR")}
              </QtyValue>
              <QtyBtn
                type="button"
                onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                aria-label="افزایش تعداد"
              >
                +
              </QtyBtn>
            </QuantityBox>
          </MobileFooterRow>

          <MobileOnlyBtnWrapper>
            <AddToCartBtn type="button" onClick={handleAddToCart}>
              <span>افزودن به سبد خرید</span>
              <span style={{ opacity: 0.85 }}>•</span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>
                {formatPrice(lineTotal)}
              </span>
            </AddToCartBtn>
          </MobileOnlyBtnWrapper>

          <DesktopFooterControls>
            <PriceColumn style={{ fontVariantNumeric: "tabular-nums" }}>
              <span className="label">مبلغ کل:</span>
              <span className="current">{formatPrice(lineTotal)}</span>
              {activeDish.originalPrice && (
                <span className="original">
                  {formatPrice(activeDish.originalPrice * quantity)}
                </span>
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
                <QtyValue
                  aria-live="polite"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {quantity.toLocaleString("fa-IR")}
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
          </DesktopFooterControls>
        </ModalFooter>
      </ModalCard>
    </Overlay>
  );
}
