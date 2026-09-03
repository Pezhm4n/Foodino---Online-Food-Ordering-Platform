"use client";

import React from "react";
import styled from "styled-components";

export type RestaurantTabType = "menu" | "info" | "reviews";

interface RestaurantNavTabsProps {
  activeTab: RestaurantTabType;
  onChangeTab: (tab: RestaurantTabType) => void;
  menuItemCount: number;
}

const TabsBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
  margin-bottom: 1.5rem;
  direction: rtl;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabButton = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.25rem;
  border: none;
  background: transparent;
  font-size: 0.95rem;
  font-weight: ${({ $active }) => ($active ? 800 : 600)};
  color: ${({ $active }) => ($active ? "#ff5a00" : "#64748b")};
  position: relative;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ $active }) => ($active ? "#ff5a00" : "#0f172a")};
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 3px;
    background: #ff5a00;
    border-radius: 9999px;
    opacity: ${({ $active }) => ($active ? 1 : 0)};
    transform: scaleX(${({ $active }) => ($active ? 1 : 0.8)});
    transition: all 0.2s ease;
  }
`;

const CountBadge = styled.span<{ $active: boolean }>`
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  background: ${({ $active }) => ($active ? "#ffefe5" : "#f1f5f9")};
  color: ${({ $active }) => ($active ? "#ff5a00" : "#64748b")};
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
        <span>🍽️</span>
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
        <span>ℹ️</span>
        <span>اطلاعات و ساعت کاری</span>
      </TabButton>

      <TabButton
        role="tab"
        aria-selected={activeTab === "reviews"}
        $active={activeTab === "reviews"}
        onClick={() => onChangeTab("reviews")}
      >
        <span>⭐</span>
        <span>نظرات کاربران</span>
        <CountBadge $active={activeTab === "reviews"}>۲۴۵</CountBadge>
      </TabButton>
    </TabsBar>
  );
}
