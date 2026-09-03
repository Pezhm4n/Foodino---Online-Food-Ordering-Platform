"use client";

import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

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
  background: #0f172a;
  color: white;
  border-radius: 9999px;
  padding: 0.5rem 0.65rem 0.5rem 1.15rem;
  box-shadow: 0 12px 32px -4px rgba(15, 23, 42, 0.45), 0 2px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.4rem 0.5rem 0.4rem 0.85rem;
    gap: 0.5rem;
  }
`;

const InfoSide = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0;

  .icon-bubble {
    @keyframes gentleBounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.08) rotate(-3deg); }
    }

    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: #ff5a00;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    box-shadow: 0 2px 6px rgba(255, 90, 0, 0.4);
    flex-shrink: 0;
    animation: gentleBounce 3s infinite ease-in-out;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      width: 28px;
      height: 28px;
      font-size: 0.85rem;
    }
  }

  .text-box {
    display: flex;
    flex-direction: column;
    min-width: 0;

    .count {
      font-size: 0.725rem;
      color: #94a3b8;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        font-size: 0.675rem;
      }
    }

    .amount {
      font-size: 0.9rem;
      font-weight: 800;
      color: #ffffff;
      white-space: nowrap;

      @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        font-size: 0.825rem;
      }
    }
  }
`;

const CheckoutButton = styled(Link)`
  background: linear-gradient(135deg, #ff5a00 0%, #ea580c 100%);
  color: white;
  border-radius: 9999px;
  padding: 0.45rem 1rem;
  font-size: 0.825rem;
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  white-space: nowrap;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(255, 90, 0, 0.35);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-1px) scale(1.02);
    box-shadow: 0 6px 16px rgba(255, 90, 0, 0.5);
  }

  &:active {
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.4rem 0.75rem;
    font-size: 0.78rem;
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
          <div className="icon-bubble" aria-hidden="true">🛍️</div>
          <div className="text-box">
            <span className="count" style={{ fontVariantNumeric: "tabular-nums" }}>
              سبد خرید ({numberFormatter.format(totalItems)} قلم)
            </span>
            <span className="amount" style={{ fontVariantNumeric: "tabular-nums" }}>
              {numberFormatter.format(totalPrice)} تومان
            </span>
          </div>
        </InfoSide>

        <CheckoutButton href="/cart" aria-label="مشاهده سبد و تکمیل نهایی خرید">
          <span>تکمیل خرید</span>
          <span aria-hidden="true">←</span>
        </CheckoutButton>
      </Capsule>
    </FloatingWrapper>
  );
}
