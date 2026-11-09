"use client";

import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { BagIcon, ArrowLeftIcon } from "@/components/ui/FoodVisuals";

const FloatingWrapper = styled.div`
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99;
  max-width: 92vw;
  width: 500px;
  direction: rtl;
  animation: pillSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;

  @keyframes pillSlideUp {
    from {
      transform: translateX(-50%) translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    bottom: max(1rem, env(safe-area-inset-bottom, 1rem));
    width: calc(100vw - 1.5rem);
    max-width: none;
  }
`;

const Capsule = styled.div`
  background: #16120f;
  color: #faf6f0;
  border-radius: 9999px;
  padding: 0.5rem 0.65rem 0.5rem 1.15rem;
  box-shadow: 0 20px 38px -8px rgba(22, 18, 15, 0.48);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
`;

const InfoSide = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-width: 0;

  .icon-bubble {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary[500]};
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(217, 56, 30, 0.4);
    flex-shrink: 0;
  }

  .text-box {
    display: flex;
    flex-direction: column;
    min-width: 0;

    .count {
      font-size: 0.74rem;
      color: rgba(250, 246, 240, 0.7);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .amount {
      font-size: 0.92rem;
      font-weight: 800;
      color: #ffffff;
      white-space: nowrap;
    }
  }
`;

const CheckoutButton = styled(Link)`
  background: ${({ theme }) => theme.colors.primary[500]};
  color: #ffffff;
  border-radius: 9999px;
  padding: 0.5rem 1.05rem;
  font-size: 0.84rem;
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  white-space: nowrap;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(217, 56, 30, 0.35);
  transition: transform 120ms ease, background-color 140ms ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.96);
  }
`;

const emptySubscribe = () => () => {};

export default function FloatingCartPill() {
  const isClient = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const { getTotalItems, calculateSubtotal } = useCart();

  const totalItems = getTotalItems();
  const totalPrice = calculateSubtotal();
  const numberFormatter = new Intl.NumberFormat("fa-IR");

  if (!isClient || totalItems === 0) {
    return null;
  }

  return (
    <FloatingWrapper>
      <Capsule>
        <InfoSide>
          <div className="icon-bubble" aria-hidden="true">
            <BagIcon size={17} />
          </div>
          <div className="text-box">
            <span
              className="count"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              سبد خرید ({numberFormatter.format(totalItems)} قلم)
            </span>
            <span
              className="amount"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {numberFormatter.format(totalPrice)} تومان
            </span>
          </div>
        </InfoSide>

        <CheckoutButton
          href="/cart"
          aria-label="مشاهده سبد و تکمیل نهایی خرید"
        >
          <span>تکمیل خرید</span>
          <ArrowLeftIcon size={15} />
        </CheckoutButton>
      </Capsule>
    </FloatingWrapper>
  );
}
