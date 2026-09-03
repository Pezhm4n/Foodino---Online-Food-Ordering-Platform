"use client";

import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

const FloatingWrapper = styled.div<{ $visible: boolean }>`
  position: fixed;
  bottom: 1.75rem;
  left: 50%;
  transform: translateX(-50%) translateY(${({ $visible }) => ($visible ? "0" : "120px")});
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 99;
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
  max-width: 90vw;
  width: 520px;
  direction: rtl;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    bottom: 1rem;
    width: calc(100vw - 2rem);
  }
`;

const Capsule = styled.div`
  background: #0f172a;
  color: white;
  border-radius: 9999px;
  padding: 0.65rem 0.75rem 0.65rem 1.25rem;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.35), 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.5rem 0.65rem 0.5rem 1rem;
    gap: 0.5rem;
  }
`;

const InfoSide = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .icon-bubble {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: #ff5a00;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.15rem;
    box-shadow: 0 2px 8px rgba(255, 90, 0, 0.4);
    flex-shrink: 0;
  }

  .text-box {
    display: flex;
    flex-direction: column;

    .count {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .amount {
      font-size: 0.95rem;
      font-weight: 800;
      color: #ffffff;
    }
  }
`;

const CheckoutButton = styled(Link)`
  background: linear-gradient(135deg, #ff5a00 0%, #ea580c 100%);
  color: white;
  border-radius: 9999px;
  padding: 0.55rem 1.15rem;
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(255, 90, 0, 0.3);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 16px rgba(255, 90, 0, 0.45);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.45rem 0.85rem;
    font-size: 0.8rem;
  }
`;

export default function FloatingCartPill() {
  const { getTotalItems, calculateSubtotal } = useCart();
  const totalItems = getTotalItems();
  const totalPrice = calculateSubtotal();
  const numberFormatter = new Intl.NumberFormat("fa-IR");

  const isVisible = totalItems > 0;

  return (
    <FloatingWrapper $visible={isVisible} aria-hidden={!isVisible}>
      <Capsule>
        <InfoSide>
          <div className="icon-bubble">🛍️</div>
          <div className="text-box">
            <span className="count">
              سبد خرید شما ({numberFormatter.format(totalItems)} قلم غذا)
            </span>
            <span className="amount">
              {numberFormatter.format(totalPrice)} تومان
            </span>
          </div>
        </InfoSide>

        <CheckoutButton href="/cart">
          <span>مشاهده و تکمیل خرید</span>
          <span>←</span>
        </CheckoutButton>
      </Capsule>
    </FloatingWrapper>
  );
}
