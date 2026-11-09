"use client";

import React from "react";
import styled from "styled-components";
import { UtensilsIcon, InfoIcon, StarIcon } from "@/components/ui/FoodVisuals";

export type RestaurantTabType = "menu" | "info" | "reviews";

interface RestaurantNavTabsProps {
  activeTab: RestaurantTabType;
  onChangeTab: (tab: RestaurantTabType) => void;
  menuItemCount: number;
}

const TabsBar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.45rem;
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  padding: 0.4rem;
  border-radius: 1rem;
  margin-bottom: 1.5rem;
  direction: rtl;
  overflow-x: visible;
  box-shadow: 0 2px 8px rgba(22, 18, 15, 0.03);

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: 0.3rem;
    padding: 0.3rem;
    margin-bottom: 1.15rem;
  }
`;

const TabButton = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 36px;
  padding: 0.65rem 1.15rem;
  border: none;
  border-radius: 0.75rem;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.neutral[900] : "transparent"};
  font-size: 0.9rem;
  font-weight: ${({ $active }) => ($active ? 800 : 600)};
  color: ${({ $active, theme }) =>
    $active ? "#FAF6F0" : theme.colors.neutral[600]};
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 160ms ease, color 160ms ease, transform 120ms ease;

  &:hover {
    color: ${({ $active, theme }) =>
      $active ? "#FAF6F0" : theme.colors.neutral[900]};
    background: ${({ $active, theme }) =>
      $active ? theme.colors.neutral[900] : theme.colors.neutral[100]};
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex: 1 1 auto;
    padding: 0.48rem 0.4rem;
    font-size: 0.73rem;
    gap: 0.25rem;

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const CountBadge = styled.span<{ $active: boolean }>`
  font-size: 0.74rem;
  font-weight: 700;
  padding: 0.12rem 0.5rem;
  border-radius: 9999px;
  background: ${({ $active, theme }) =>
    $active ? "rgba(255, 255, 255, 0.18)" : theme.colors.neutral[100]};
  color: ${({ $active, theme }) =>
    $active ? "#FAF6F0" : theme.colors.neutral[700]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.66rem;
    padding: 0.08rem 0.35rem;
  }
`;

export default function RestaurantNavTabs({
  activeTab,
  onChangeTab,
  menuItemCount,
}: Readonly<RestaurantNavTabsProps>) {
  const numberFormatter = new Intl.NumberFormat("fa-IR");

  return (
    <TabsBar role="tablist">
      <TabButton
        role="tab"
        aria-selected={activeTab === "menu"}
        $active={activeTab === "menu"}
        onClick={() => onChangeTab("menu")}
      >
        <UtensilsIcon size={16} />
        <span>منوی غذا</span>
        <CountBadge $active={activeTab === "menu"}>
          {numberFormatter.format(menuItemCount)}
        </CountBadge>
      </TabButton>

      <TabButton
        role="tab"
        aria-selected={activeTab === "info"}
        $active={activeTab === "info"}
        onClick={() => onChangeTab("info")}
      >
        <InfoIcon size={16} />
        <span>اطلاعات و ساعت کاری</span>
      </TabButton>

      <TabButton
        role="tab"
        aria-selected={activeTab === "reviews"}
        $active={activeTab === "reviews"}
        onClick={() => onChangeTab("reviews")}
      >
        <StarIcon size={16} />
        <span>نظرات کاربران</span>
        <CountBadge $active={activeTab === "reviews"}>۲۴۵</CountBadge>
      </TabButton>
    </TabsBar>
  );
}
