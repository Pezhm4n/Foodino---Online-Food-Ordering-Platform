"use client";

import React, { useState, useEffect, useRef, useSyncExternalStore } from "react";
import styled, { keyframes } from "styled-components";
import Link from "next/link";
import toast from "react-hot-toast";
import { MAX_CATALOG_QUERY_LENGTH } from "@/lib/validation/search";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { logoutAction } from "@/app/auth/actions";
import {
  FoodinoEmblem,
  SearchIcon as SearchVectorIcon,
  HeartIcon,
  BagIcon,
  UserIcon,
  MenuIcon,
  CloseIcon,
  SparkleIcon,
  CopyIcon,
  CheckCircleIcon,
  DishArtwork,
  resolveFoodKind,
  StarIcon,
  ArrowLeftIcon,
  FlameIcon,
} from "@/components/ui/FoodVisuals";


type Suggestions = {
  restaurants: { id: string; slug: string; name: string; description: string; rating: number }[];
  products: { id: string; slug: string; name: string; description: string; priceIrr: number; restaurantName: string }[];
};

const headerCopy = {
  home: "خانه",
  restaurants: "رستوران‌ها",
  categories: "دسته‌بندی‌ها",
  orderTracking: "پیگیری سفارش",
  about: "درباره ما",
  contact: "تماس با ما",
  profile: "پروفایل کاربری",
  login: "ورود",
  signup: "ثبت‌نام",
  logout: "خروج از حساب کاربری",
  search: "جستجوی رستوران، پیتزا، کباب...",
  favorites: "علاقه‌مندی‌ها",
  cart: "سبد خرید",
} as const;

const t = (key: keyof typeof headerCopy) => headerCopy[key];

const TopPromoBarContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(0.25rem, 1.5vw, 0.75rem);
  min-height: 44px;
  padding-inline: 0.5rem;
  background: linear-gradient(110deg, #18120f, #211610 55%, #18120f);
  color: ${({ theme }) => theme.colors.neutral[50]};
  font-size: 0.8rem;
  white-space: nowrap;

  .conditions { color: ${({ theme }) => theme.colors.secondary[200]}; }
  .promo-leading { display: inline-flex; align-items: center; gap: 0.4rem; font-weight: 700; }
  .promo-leading svg { color: ${({ theme }) => theme.colors.warning[400]}; }
  details { display: none; }

  @media (max-width: 640px) {
    .conditions { display: none; }
    details { display: block; }
    summary {
      display: grid;
      place-items: center;
      min-width: 44px;
      min-height: 44px;
      cursor: pointer;
      text-decoration: underline;
      text-underline-offset: 0.2em;
    }
    summary::-webkit-details-marker { display: none; }
    details p {
      position: absolute;
      z-index: 101;
      inset-block-start: 100%;
      inset-inline: 0;
      width: min(calc(100% - 2rem), 21rem);
      margin: 0.25rem auto 0;
      padding: 0.75rem 1rem;
      border-radius: 0.6rem;
      background: ${({ theme }) => theme.colors.secondary[900]};
      box-shadow: ${({ theme }) => theme.shadows.md};
      white-space: normal;
    }
  }
`;

const PromoCodeButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 44px;
  padding: 0 0.45rem;
  border: 1px dashed rgba(251, 191, 36, 0.48);
  border-radius: 0.5rem;
  background: rgba(184, 43, 20, 0.24);
  color: ${({ theme }) => theme.colors.warning[200]};
  font: inherit;
  font-weight: 800;
  cursor: pointer;

  @media (min-width: 641px) {
    min-height: 34px;
    padding-inline: 0.65rem;
  }

  @media (max-width: 640px) {
    border-block: 0;
  }
`;

const PromoCloseButton = styled.button`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;

  @media (min-width: 641px) {
    position: absolute;
    inset-inline-end: 0.65rem;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.05);
  }
`;
const HeaderWrapper = styled.header<{ $isScrolled: boolean }>`
  position: sticky;
  top: 0;
  z-index: 100;
  direction: rtl;
  background-color: ${({ $isScrolled }) =>
    $isScrolled ? "rgba(250, 246, 240, 0.92)" : "rgba(250, 246, 240, 0.98)"};
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid
    ${({ $isScrolled, theme }) =>
      $isScrolled ? theme.colors.neutral[200] : "rgba(230, 221, 208, 0.7)"};
  box-shadow: ${({ $isScrolled }) =>
    $isScrolled ? "0 10px 30px -10px rgba(22, 18, 15, 0.08)" : "none"};
  transition: background-color 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
`;

const HeaderInner = styled.div<{ $isScrolled: boolean }>`
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.25rem;
  padding: 0.75rem 1.75rem;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    padding: 0.55rem 0.9rem;
    gap: 0.5rem;
  }
`;

const LogoLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  flex-shrink: 0;
  transition: transform 160ms cubic-bezier(0.2, 0, 0, 1);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translateY(-1px);
    }
  }

  &:active {
    transform: scale(0.97);
  }
`;

const BrandTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.1;
`;

const BrandTitle = styled.span`
  font-size: 1.45rem;
  font-weight: 800;
  color: ${(props) => props.theme.colors.neutral[900]};
  letter-spacing: -0.03em;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    font-size: 1.22rem;
  }
`;

const BrandTagline = styled.span`
  font-size: 0.68rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary[600]};
  margin-top: 0.12rem;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    display: none;
  }
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(243, 236, 226, 0.75);
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  padding: 0.3rem;
  border-radius: ${(props) => props.theme.borderRadius.full};

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  color: ${({ $active, theme }) =>
    $active ? theme.colors.neutral[900] : theme.colors.neutral[600]};
  background-color: ${({ $active }) => ($active ? "#FFFFFF" : "transparent")};
  box-shadow: ${({ $active }) =>
    $active ? "0 2px 8px rgba(22, 18, 15, 0.07)" : "none"};
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  padding: 0.45rem 0.95rem;
  border-radius: ${(props) => props.theme.borderRadius.full};
  transition: color 160ms ease, background-color 160ms ease, box-shadow 160ms ease;
  white-space: nowrap;

  &:hover {
    color: ${(props) => props.theme.colors.neutral[900]};
    background-color: ${({ $active }) =>
      $active ? "#FFFFFF" : "rgba(255, 255, 255, 0.55)"};
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex-grow: 1;
  max-width: 310px;
  min-width: 200px;
  transition: max-width 240ms cubic-bezier(0.16, 1, 0.3, 1);

  &:focus-within {
    max-width: 380px;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    max-width: 240px;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    display: none;
  }
`;

const SearchInputContainer = styled.div<{ $isOpen?: boolean }>`
  display: flex;
  align-items: center;
  background-color: ${({ $isOpen }) => ($isOpen ? '#ffffff' : 'rgba(243, 236, 226, 0.65)')};
  border: 1.5px solid ${({ $isOpen, theme }) =>
    $isOpen ? theme.colors.primary[500] : theme.colors.neutral[200]};
  border-radius: ${(props) => props.theme.borderRadius.full};
  padding: 0.25rem 0.85rem;
  min-height: 40px;
  box-shadow: ${({ $isOpen }) =>
    $isOpen ? '0 10px 24px -6px rgba(217, 56, 30, 0.12)' : 'none'};
  transition: background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease;

  &:hover {
    border-color: ${(props) => props.theme.colors.neutral[400]};
    background-color: #ffffff;
  }
`;

const SearchIconWrap = styled.span<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-inline-end: 0.5rem;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary[500] : theme.colors.neutral[500]};
  transition: color 150ms ease;
  flex-shrink: 0;
`;

const SearchInput = styled.input`
  width: 100%;
  min-height: 34px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.86rem;
  font-family: inherit;
  color: ${(props) => props.theme.colors.neutral[900]};

  &::placeholder {
    color: ${(props) => props.theme.colors.neutral[400]};
    font-size: 0.82rem;
  }
`;

const SearchClearBtn = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.neutral[400]};
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  margin-inline-start: 0.35rem;
  transition: background-color 140ms ease, color 140ms ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.neutral[200]};
    color: ${(props) => props.theme.colors.neutral[800]};
  }
`;

const KbdShortcut = styled.kbd`
  font-size: 0.68rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.neutral[400]};
  background: ${(props) => props.theme.colors.neutral[100]};
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  border-radius: 6px;
  padding: 0.12rem 0.38rem;
  font-family: inherit;
  margin-inline-start: 0.35rem;
  pointer-events: none;
  user-select: none;

  @media (max-width: 1100px) {
    display: none;
  }
`;

const SearchDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: max(100%, 390px);
  background: #ffffff;
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  border-radius: 1.25rem;
  box-shadow: 0 20px 48px -12px rgba(22, 18, 15, 0.18),
              0 0 0 1px rgba(22, 18, 15, 0.04);
  padding: 1rem;
  z-index: 300;
  direction: rtl;
  max-height: 480px;
  overflow-y: auto;
`;

const DropdownSectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.76rem;
  font-weight: 800;
  color: ${(props) => props.theme.colors.neutral[500]};
  margin-bottom: 0.65rem;
`;

const TrendingTagsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  flex-wrap: wrap;
  margin-bottom: 1.15rem;
`;

const TrendingTagPill = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: ${(props) => props.theme.colors.neutral[50]};
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  color: ${(props) => props.theme.colors.neutral[700]};
  padding: 0.32rem 0.7rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 140ms ease, color 140ms ease, border-color 140ms ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.primary[50]};
    color: ${(props) => props.theme.colors.primary[600]};
    border-color: ${(props) => props.theme.colors.primary[200]};
  }
`;

const QuickCategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.45rem;
`;

const QuickCategoryCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 0.6rem 0.3rem;
  background: ${(props) => props.theme.colors.neutral[50]};
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  border-radius: 0.85rem;
  text-decoration: none;
  color: ${(props) => props.theme.colors.neutral[800]};
  font-size: 0.74rem;
  font-weight: 700;
  text-align: center;
  transition: transform 140ms ease, border-color 140ms ease, background-color 140ms ease;

  &:hover {
    background-color: #ffffff;
    border-color: ${(props) => props.theme.colors.primary[300]};
    transform: translateY(-2px);
  }
`;

const SearchResultsGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 0.85rem;
`;

const ResultItemLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.55rem 0.65rem;
  border-radius: 0.85rem;
  text-decoration: none;
  color: inherit;
  transition: background-color 140ms ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.neutral[50]};
  }
`;

const ResultThumbWrap = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${(props) => props.theme.colors.neutral[100]};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
`;

const ResultInfo = styled.div`
  flex: 1;
  min-width: 0;

  h4 {
    font-size: 0.86rem;
    font-weight: 800;
    color: ${(props) => props.theme.colors.neutral[900]};
    margin: 0 0 0.15rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    font-size: 0.74rem;
    color: ${(props) => props.theme.colors.neutral[500]};
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const ResultPriceOrRating = styled.div`
  font-size: 0.78rem;
  font-weight: 800;
  color: ${(props) => props.theme.colors.primary[600]};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ViewAllResultsBtn = styled.button`
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.65rem;
  background: ${(props) => props.theme.colors.neutral[50]};
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  border-radius: 0.85rem;
  font-size: 0.82rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary[600]};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  transition: background-color 140ms ease, border-color 140ms ease;

  &:hover {
    background: ${(props) => props.theme.colors.primary[50]};
    border-color: ${(props) => props.theme.colors.primary[300]};
  }
`;

const MobileSearchBtn = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ffffff;
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  color: ${(props) => props.theme.colors.neutral[800]};
  cursor: pointer;
  transition: background-color 150ms ease, color 150ms ease;

  &:active {
    transform: scale(0.94);
  }

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    display: flex;
  }
`;

const MobileSearchDrawer = styled.div`
  display: none;
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    display: block;
    padding: 0.65rem 1rem 0.95rem;
    background: #ffffff;
    border-bottom: 1px solid ${(props) => props.theme.colors.neutral[200]};
    box-shadow: 0 10px 24px rgba(22, 18, 15, 0.08);
    direction: rtl;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.6rem;
  align-items: center;
  flex-shrink: 0;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    gap: 0.45rem;
  }
`;

const LoginButton = styled(Link)`
  padding: 0.55rem 1.05rem;
  border-radius: ${(props) => props.theme.borderRadius.full};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 120ms cubic-bezier(0.2, 0, 0, 1),
    border-color 140ms ease,
    background-color 140ms ease,
    color 140ms ease;
  text-decoration: none;
  background: #ffffff;
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  color: ${(props) => props.theme.colors.neutral[800]};
  user-select: none;
  touch-action: manipulation;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: ${(props) => props.theme.colors.neutral[400]};
      background: ${(props) => props.theme.colors.neutral[100]};
      transform: translateY(-1px);
    }
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    display: none;
  }
`;

const SignupButton = styled(Link)`
  padding: 0.55rem 1.15rem;
  border-radius: ${(props) => props.theme.borderRadius.full};
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 120ms cubic-bezier(0.2, 0, 0, 1),
    background-color 140ms ease,
    box-shadow 140ms ease;
  text-decoration: none;
  background-color: ${(props) => props.theme.colors.primary[500]};
  border: 1px solid transparent;
  color: #ffffff;
  user-select: none;
  touch-action: manipulation;
  box-shadow: 0 4px 12px rgba(217, 56, 30, 0.24);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${(props) => props.theme.colors.primary[600]};
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(217, 56, 30, 0.32);
    }
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    display: none;
  }
`;

const IconButton = styled(Link)`
  position: relative;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #ffffff;
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  transition: transform 120ms cubic-bezier(0.2, 0, 0, 1),
    background-color 140ms ease,
    border-color 140ms ease,
    color 140ms ease,
    box-shadow 140ms ease;
  color: ${(props) => props.theme.colors.neutral[800]};
  user-select: none;
  touch-action: manipulation;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${(props) => props.theme.colors.primary[50]};
      border-color: ${(props) => props.theme.colors.primary[200]};
      transform: translateY(-1px);
      color: ${(props) => props.theme.colors.primary[600]};
    }
  }

  &:active {
    transform: scale(0.94);
  }

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    display: none;
  }
`;

const badgePopKeyframe = keyframes`
  0% { transform: scale(0.85); }
  50% { transform: scale(1.22); }
  100% { transform: scale(1); }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: ${(props) => props.theme.colors.primary[500]};
  color: #ffffff;
  font-size: 0.72rem;
  min-width: 20px;
  height: 20px;
  padding: 0 4px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #faf6f0;
  font-weight: 700;
  animation: ${badgePopKeyframe} 200ms cubic-bezier(0.16, 1, 0.3, 1);
`;

const MobileMenuButton = styled.button`
  display: none;
  background: #ffffff;
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  cursor: pointer;
  color: ${(props) => props.theme.colors.neutral[800]};
  transition: color 150ms ease, transform 120ms ease, border-color 150ms ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: ${(props) => props.theme.colors.primary[500]};
      border-color: ${(props) => props.theme.colors.primary[200]};
    }
  }

  &:active {
    transform: scale(0.94);
  }

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
`;

const MobileCartButton = styled(Link)`
  position: relative;
  text-decoration: none;
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ffffff;
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  transition: background-color 150ms ease, color 150ms ease, border-color 150ms ease, transform 120ms ease;
  color: ${(props) => props.theme.colors.neutral[800]};

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${(props) => props.theme.colors.primary[50]};
      color: ${(props) => props.theme.colors.primary[500]};
    }
  }

  &:active {
    transform: scale(0.94);
  }

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    display: flex;
  }
`;

const MobileNavigation = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: auto;
  width: min(320px, 88vw);
  height: 100vh;
  height: 100dvh;
  background-color: #faf6f0;
  border-right: 1px solid ${(props) => props.theme.colors.neutral[200]};
  box-shadow: 12px 0 36px rgba(22, 18, 15, 0.18);
  padding: 1.25rem 1.15rem;
  padding-bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px));
  transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 200;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  transform: translateX(-100%);
  visibility: hidden;
  pointer-events: none;
  direction: rtl;

  &[data-open="true"] {
    transform: translateX(0);
    visibility: visible;
    pointer-events: auto;
  }
`;

const MobileNavHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.1rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.neutral[200]};
`;

const MobileNavCloseButton = styled.button`
  background: #ffffff;
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  color: ${(props) => props.theme.colors.neutral[700]};
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: transform 120ms ease, background-color 140ms ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.neutral[100]};
    color: ${(props) => props.theme.colors.neutral[900]};
  }

  &:active {
    transform: scale(0.92);
  }
`;

const MobileIconContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 1rem;
  background: #ffffff;
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  border-radius: ${(props) => props.theme.borderRadius.xl};
`;

const MobileIconButton = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: ${(props) => props.theme.colors.neutral[800]};
  gap: 0.4rem;
  padding: 0.45rem 0.25rem;
  border-radius: ${(props) => props.theme.borderRadius.lg};
  transition: background-color 150ms ease, color 150ms ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.primary[50]};
    color: ${(props) => props.theme.colors.primary[600]};
  }
`;

const MobileIconLabel = styled.span`
  font-size: 0.74rem;
  font-weight: 600;
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const MobileNavLink = styled(Link)<{ $active?: boolean }>`
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary[600] : theme.colors.neutral[800]};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary[50] : "transparent"};
  text-decoration: none;
  font-weight: ${({ $active }) => ($active ? 700 : 600)};
  padding: 0.75rem 0.85rem;
  border-radius: ${(props) => props.theme.borderRadius.lg};
  transition: background-color 150ms ease, color 150ms ease;

  &:hover {
    background: ${(props) => props.theme.colors.neutral[100]};
    color: ${(props) => props.theme.colors.primary[600]};
  }
`;

const MobileNavActions = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding-top: 1.5rem;
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(22, 18, 15, 0.52);
  backdrop-filter: blur(2px);
  transition: opacity 0.25s ease, visibility 0.25s ease;
  z-index: 150;
  opacity: 0;
  visibility: hidden;

  &[data-visible="true"] {
    opacity: 1;
    visibility: visible;
  }
`;

const LogoutIconButton = styled.button`
  background: #ffffff;
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  width: 44px;
  height: 44px;
  border-radius: 50%;
  color: ${(props) => props.theme.colors.neutral[700]};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 120ms ease, background-color 140ms ease, color 140ms ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.error[50]};
    border-color: ${(props) => props.theme.colors.error[200]};
    color: ${(props) => props.theme.colors.error[600]};
  }

  &:active {
    transform: scale(0.92);
  }

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    display: none;
  }
`;

const subscribeToStorage = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

const getPromoSnapshot = () => {
  try {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("foodino:hide_promo") !== "true";
    }
    return true;
  } catch {
    return true;
  }
};

const getPromoServerSnapshot = () => true;

const TRENDING_SEARCHES = [
  "پیتزا پپرونی",
  "برگر دست‌ساز",
  "کباب کوبیده",
  "سوشی سالمون",
  "سالاد سزار",
];

const POPULAR_CATEGORIES = [
  { slug: "pizza", name: "پیتزا", kind: "pizza" as const },
  { slug: "burger", name: "برگر", kind: "burger" as const },
  { slug: "iranian", name: "ایرانی", kind: "iranian" as const },
  { slug: "sushi", name: "سوشی", kind: "sushi" as const },
  { slug: "healthy", name: "غذای سالم", kind: "salad" as const },
];

const Header = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [copiedPromo, setCopiedPromo] = useState(false);
  const isStoredPromoVisible = useSyncExternalStore(
    subscribeToStorage,
    getPromoSnapshot,
    getPromoServerSnapshot
  );
  const isPromoVisible = isStoredPromoVisible && !isDismissed;
  const router = useRouter();
  const pathname = usePathname();
  const { getTotalItems } = useCart();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const input = searchInputRef.current;
      if (
        (e.key === "/" || (e.key === "k" && (e.metaKey || e.ctrlKey))) &&
        !e.defaultPrevented && !e.isComposing &&
        !(e.target instanceof Element && e.target.closest("input, textarea, select, [contenteditable]")) &&
        input?.getClientRects().length
      ) {
        e.preventDefault();
        input.focus();
        setIsSearchFocused(true);
      }
      if (e.key === "Escape") {
        setIsSearchFocused(false);
        setIsMobileSearchOpen(false);
        searchInputRef.current?.blur();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDismissPromo = () => {
    setIsDismissed(true);
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("foodino:hide_promo", "true");
      }
    } catch {
      // Ignore sessionStorage access errors
    }
  };

  useEffect(() => {
    if (!copiedPromo) return;
    const timer = setTimeout(() => setCopiedPromo(false), 2000);
    return () => clearTimeout(timer);
  }, [copiedPromo]);

  const handleCopyPromo = async () => {
    try {
      await navigator.clipboard.writeText("FOODINO");
      setCopiedPromo(true);
      toast.success("کد تخفیف کپی شد");
    } catch {
      toast.error("کد را دستی وارد کنید: FOODINO");
    }
  };
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 36);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      closeMobileMenu();
      setIsSearchFocused(false);
      setIsMobileSearchOpen(false);
      router.push(`/restaurants?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSelectSearch = (query: string) => {
    setSearchTerm(query);
    closeMobileMenu();
    setIsSearchFocused(false);
    setIsMobileSearchOpen(false);
    router.push(`/restaurants?q=${encodeURIComponent(query)}`);
  };

  const normalizedQuery = searchTerm.trim().toLowerCase();

  const [suggestions, setSuggestions] = useState<{ query: string; results: Suggestions | null }>();
  const currentResults = suggestions?.query === normalizedQuery ? suggestions.results : undefined;
  const matchingRestaurants = currentResults?.restaurants ?? [];
  const matchingProducts = currentResults?.products ?? [];

  useEffect(() => {
    if (!isSearchFocused || normalizedQuery.length < 2) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch('/api/catalog/suggestions?q=' + encodeURIComponent(normalizedQuery), {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Suggestions unavailable');
        const results = await response.json() as Suggestions;
        if (!controller.signal.aborted) setSuggestions({ query: normalizedQuery, results });
      } catch {
        if (!controller.signal.aborted) setSuggestions({ query: normalizedQuery, results: null });
      }
    }, 280);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [isSearchFocused, normalizedQuery]);
  const formatPrice = (irr: number) =>
    (irr / 10).toLocaleString("fa-IR") + " تومان";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    closeMobileMenu();
    void logoutAction();
  };

  const totalItems = getTotalItems();

  return (
    <>
      {isPromoVisible && (
        <TopPromoBarContainer>
          <span className="promo-leading"><SparkleIcon size={14} />۲۰٪ تخفیف</span>
          <PromoCodeButton
            type="button"
            onClick={handleCopyPromo}
            aria-label="کپی کد تخفیف FOODINO"
            aria-description="تا ۵۰ هزار تومان برای خرید از ۱۰۰ هزار تومان"
            title="تا ۵۰ هزار تومان برای خرید از ۱۰۰ هزار تومان"
          >
            {copiedPromo ? <CheckCircleIcon size={13} /> : <CopyIcon size={13} />}
            <span>FOODINO</span>
          </PromoCodeButton>
          <span className="conditions">تا ۵۰ هزار تومان برای خرید از ۱۰۰ هزار تومان</span>
          <details>
            <summary>شرایط</summary>
            <p>۲۰٪ تخفیف تا ۵۰ هزار تومان برای خرید از ۱۰۰ هزار تومان.</p>
          </details>
          <PromoCloseButton type="button" onClick={handleDismissPromo} aria-label="بستن اعلان">
            <CloseIcon size={14} />
          </PromoCloseButton>
        </TopPromoBarContainer>
      )}

      <HeaderWrapper $isScrolled={isScrolled} data-toast-anchor>
        <HeaderInner $isScrolled={isScrolled}>
          <LogoLink href="/">
            <FoodinoEmblem size={40} />
            <BrandTextGroup>
              <BrandTitle>فودینو</BrandTitle>
              <BrandTagline>سفارش آنلاین غذا</BrandTagline>
            </BrandTextGroup>
          </LogoLink>

          <Navigation aria-label="ناوبری اصلی">
            <NavLink href="/" prefetch={true} $active={pathname === "/"}>
              {t("home")}
            </NavLink>
            <NavLink
              href="/restaurants"
              prefetch={true}
              $active={pathname?.startsWith("/restaurants")}
            >
              {t("restaurants")}
            </NavLink>
            <NavLink
              href="/categories"
              prefetch={true}
              $active={pathname?.startsWith("/categories")}
            >
              {t("categories")}
            </NavLink>
            <NavLink
              href="/order-tracking"
              prefetch={true}
              $active={
                pathname?.startsWith("/order-tracking") ||
                pathname?.startsWith("/track")
              }
            >
              {t("orderTracking")}
            </NavLink>
            <NavLink
              href="/about"
              prefetch={true}
              $active={pathname === "/about"}
            >
              {t("about")}
            </NavLink>
            <NavLink
              href="/contact"
              prefetch={true}
              $active={pathname === "/contact"}
            >
              {t("contact")}
            </NavLink>
          </Navigation>

          <SearchContainer ref={searchContainerRef}>
            <form onSubmit={handleSearch}>
              <SearchInputContainer $isOpen={isSearchFocused}>
                <SearchIconWrap $active={isSearchFocused}>
                  <SearchVectorIcon size={16} />
                </SearchIconWrap>
                <SearchInput
                  maxLength={MAX_CATALOG_QUERY_LENGTH}
                  ref={searchInputRef}
                  type="text"
                  placeholder={t("search")}
                  value={searchTerm}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (!isSearchFocused) setIsSearchFocused(true);
                  }}
                  aria-label={t("search")}
                />
                {searchTerm ? (
                  <SearchClearBtn
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      searchInputRef.current?.focus();
                    }}
                    aria-label="پاک کردن متن جستجو"
                  >
                    <CloseIcon size={12} />
                  </SearchClearBtn>
                ) : (
                  <KbdShortcut>⌘K</KbdShortcut>
                )}
              </SearchInputContainer>
            </form>

            {isSearchFocused && (
              <SearchDropdown>
                {!normalizedQuery ? (
                  <>
                    <DropdownSectionTitle>
                      <FlameIcon size={14} style={{ color: "#D9381E" }} />
                      <span>پیشنهادهای جست‌وجو</span>
                    </DropdownSectionTitle>
                    <TrendingTagsRow>
                      {TRENDING_SEARCHES.map((tag) => (
                        <TrendingTagPill
                          key={tag}
                          type="button"
                          onClick={() => handleSelectSearch(tag)}
                        >
                          <span>{tag}</span>
                        </TrendingTagPill>
                      ))}
                    </TrendingTagsRow>

                    <DropdownSectionTitle>
                      <SparkleIcon size={13} style={{ color: "#E59A11" }} />
                      <span>دسته‌بندی‌های سریع</span>
                    </DropdownSectionTitle>
                    <QuickCategoriesGrid>
                      {POPULAR_CATEGORIES.map((cat) => (
                        <QuickCategoryCard
                          key={cat.slug}
                          href={`/categories/${cat.slug}`}
                          onClick={() => setIsSearchFocused(false)}
                        >
                          <DishArtwork kind={cat.kind} size={28} variant="thumb" />
                          <span>{cat.name}</span>
                        </QuickCategoryCard>
                      ))}
                    </QuickCategoriesGrid>
                  </>
                ) : (
                  <>
                    {matchingRestaurants.length > 0 && (
                      <SearchResultsGroup>
                        <DropdownSectionTitle>
                          <span>رستوران‌های مرتبط</span>
                        </DropdownSectionTitle>
                        {matchingRestaurants.map((res) => {
                          const kind = resolveFoodKind(res.name, res.description);
                          return (
                            <ResultItemLink
                              key={res.id}
                              href={`/restaurants/${res.slug}`}
                              onClick={() => {
                                setIsSearchFocused(false);
                                setSearchTerm("");
                              }}
                            >
                              <ResultThumbWrap>
                                <DishArtwork kind={kind} size={30} variant="thumb" />
                              </ResultThumbWrap>
                              <ResultInfo>
                                <h4>{res.name}</h4>
                                <p>{res.description}</p>
                              </ResultInfo>
                              <ResultPriceOrRating>
                                <StarIcon size={12} style={{ color: "#E59A11" }} />
                                <span>{res.rating.toLocaleString("fa-IR", { minimumFractionDigits: 1 })}</span>
                              </ResultPriceOrRating>
                            </ResultItemLink>
                          );
                        })}
                      </SearchResultsGroup>
                    )}

                    {matchingProducts.length > 0 && (
                      <SearchResultsGroup>
                        <DropdownSectionTitle>
                          <span>غذاها</span>
                        </DropdownSectionTitle>
                        {matchingProducts.map((p) => {
                          const kind = resolveFoodKind(p.name, p.description);

                          return (
                            <ResultItemLink
                              key={p.id}
                              href={`/products/${p.slug}`}
                              onClick={() => {
                                setIsSearchFocused(false);
                                setSearchTerm("");
                              }}
                            >
                              <ResultThumbWrap>
                                <DishArtwork kind={kind} size={30} variant="thumb" />
                              </ResultThumbWrap>
                              <ResultInfo>
                                <h4>{p.name}</h4>
                                <p>{p.restaurantName}</p>
                              </ResultInfo>
                              <ResultPriceOrRating>
                                <span>{formatPrice(p.priceIrr)}</span>
                              </ResultPriceOrRating>
                            </ResultItemLink>
                          );
                        })}
                      </SearchResultsGroup>
                    )}

                    {currentResults && matchingRestaurants.length === 0 && matchingProducts.length === 0 && (
                      <div style={{ textAlign: "center", padding: "1.25rem 0.5rem", color: "#6E6055" }}>
                        <p style={{ fontSize: "0.88rem", fontWeight: 700, margin: "0 0 0.35rem" }}>
                          موردی با عنوان «{searchTerm}» یافت نشد
                        </p>
                        <span style={{ fontSize: "0.78rem", color: "#9E8E80" }}>
                          عبارت جستجو را کوتاه کنید یا دسته‌بندی‌ها را بررسی نمایید.
                        </span>
                      </div>
                    )}

                    <ViewAllResultsBtn
                      type="button"
                      onClick={() => handleSelectSearch(searchTerm)}
                    >
                      <span>مشاهده همه نتایج برای «{searchTerm}»</span>
                      <ArrowLeftIcon size={14} />
                    </ViewAllResultsBtn>
                  </>
                )}
              </SearchDropdown>
            )}
          </SearchContainer>

          <ActionButtons>
            <MobileSearchBtn
              type="button"
              onClick={() => setIsMobileSearchOpen((prev) => !prev)}
              aria-label="جستجو"
              title="جستجو در فودینو"
            >
              <SearchVectorIcon size={18} />
            </MobileSearchBtn>
            <IconButton
              href="/favorite-restaurants"
              prefetch={true}
              aria-label="علاقه‌مندی‌ها"
              title="رستوران‌های محبوب من"
            >
              <HeartIcon size={18} />
            </IconButton>

            <IconButton href="/cart" aria-label="سبد خرید" title="سبد خرید">
              <BagIcon size={18} />
              {totalItems > 0 && (
                <CartBadge key={totalItems}>
                  {totalItems.toLocaleString("fa-IR")}
                </CartBadge>
              )}
            </IconButton>

            {isAuthenticated ? (
              <>
                <IconButton
                  href="/profile"
                  onClick={closeMobileMenu}
                  aria-label="حساب کاربری"
                  title="پروفایل کاربری"
                >
                  <UserIcon size={18} />
                </IconButton>
                <LogoutIconButton onClick={handleLogout} aria-label="خروج" title="خروج از حساب">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </LogoutIconButton>
              </>
            ) : (
              <>
                <LoginButton href="/auth" onClick={closeMobileMenu}>
                  {t("login")}
                </LoginButton>
                <SignupButton
                  href="/auth?tab=register"
                  onClick={closeMobileMenu}
                >
                  {t("signup")}
                </SignupButton>
              </>
            )}

            <MobileCartButton href="/cart" aria-label="سبد خرید">
              <BagIcon size={18} />
              {totalItems > 0 && (
                <CartBadge key={totalItems}>
                  {totalItems.toLocaleString("fa-IR")}
                </CartBadge>
              )}
            </MobileCartButton>

            <MobileMenuButton
              onClick={toggleMobileMenu}
              aria-label="منوی موبایل"
            >
              <MenuIcon size={20} />
            </MobileMenuButton>
          </ActionButtons>
        </HeaderInner>

        {isMobileSearchOpen && (
          <MobileSearchDrawer>
            <form onSubmit={handleSearch}>
              <SearchInputContainer $isOpen={true}>
                <SearchIconWrap $active={true}>
                  <SearchVectorIcon size={16} />
                </SearchIconWrap>
                <SearchInput
                  maxLength={MAX_CATALOG_QUERY_LENGTH}
                  ref={mobileSearchInputRef}
                  type="text"
                  placeholder="جستجوی رستوران یا غذا..."
                  value={searchTerm}
                  autoFocus
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="جستجوی رستوران یا غذا"
                />
                {searchTerm && (
                  <SearchClearBtn
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      mobileSearchInputRef.current?.focus();
                    }}
                    aria-label="پاک کردن متن جستجو"
                  >
                    <CloseIcon size={12} />
                  </SearchClearBtn>
                )}
              </SearchInputContainer>
            </form>

            <div style={{ marginTop: "0.65rem" }}>
              <DropdownSectionTitle>
                <FlameIcon size={13} style={{ color: "#D9381E" }} />
                <span>پیشنهادهای جست‌وجو</span>
              </DropdownSectionTitle>
              <TrendingTagsRow style={{ marginBottom: "0.35rem" }}>
                {TRENDING_SEARCHES.map((tag) => (
                  <TrendingTagPill
                    key={tag}
                    type="button"
                    onClick={() => handleSelectSearch(tag)}
                  >
                    <span>{tag}</span>
                  </TrendingTagPill>
                ))}
              </TrendingTagsRow>
            </div>
          </MobileSearchDrawer>
        )}
      </HeaderWrapper>

      <Overlay
        data-visible={isMobileMenuOpen ? "true" : "false"}
        onClick={closeMobileMenu}
      />

      <MobileNavigation data-open={isMobileMenuOpen ? "true" : "false"}>
        <MobileNavHeader>
          <LogoLink href="/" onClick={closeMobileMenu}>
            <FoodinoEmblem size={34} />
            <BrandTitle style={{ fontSize: "1.2rem" }}>فودینو</BrandTitle>
          </LogoLink>
          <MobileNavCloseButton onClick={closeMobileMenu} aria-label="بستن منو">
            <CloseIcon size={18} />
          </MobileNavCloseButton>
        </MobileNavHeader>

        <form onSubmit={handleSearch} style={{ marginBottom: "1rem" }}>
          <SearchInputContainer $isOpen={false}>
            <SearchIconWrap>
              <SearchVectorIcon size={16} />
            </SearchIconWrap>
            <SearchInput
              maxLength={MAX_CATALOG_QUERY_LENGTH}
              type="text"
              placeholder="جستجوی رستوران یا غذا..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="جستجو در منو"
            />
            {searchTerm && (
              <SearchClearBtn
                type="button"
                onClick={() => setSearchTerm("")}
                aria-label="پاک کردن متن"
              >
                <CloseIcon size={12} />
              </SearchClearBtn>
            )}
          </SearchInputContainer>
        </form>

        <MobileIconContainer>
          <MobileIconButton
            href="/favorite-restaurants"
            prefetch={true}
            onClick={closeMobileMenu}
          >
            <HeartIcon size={18} />
            <MobileIconLabel>{t("favorites")}</MobileIconLabel>
          </MobileIconButton>

          <MobileIconButton href="/cart" onClick={closeMobileMenu}>
            <div style={{ position: "relative", display: "inline-flex" }}>
              <BagIcon size={18} />
              {totalItems > 0 && (
                <CartBadge key={totalItems}>
                  {totalItems.toLocaleString("fa-IR")}
                </CartBadge>
              )}
            </div>
            <MobileIconLabel>{t("cart")}</MobileIconLabel>
          </MobileIconButton>

          {isAuthenticated ? (
            <MobileIconButton href="/profile" onClick={closeMobileMenu}>
              <UserIcon size={18} />
              <MobileIconLabel>{t("profile")}</MobileIconLabel>
            </MobileIconButton>
          ) : (
            <MobileIconButton href="/auth" onClick={closeMobileMenu}>
              <UserIcon size={18} />
              <MobileIconLabel>
                {t("login")} / {t("signup")}
              </MobileIconLabel>
            </MobileIconButton>
          )}
        </MobileIconContainer>

        <MobileNavLinks>
          <MobileNavLink
            href="/"
            prefetch={true}
            $active={pathname === "/"}
            onClick={closeMobileMenu}
          >
            {t("home")}
          </MobileNavLink>
          <MobileNavLink
            href="/restaurants"
            prefetch={true}
            $active={pathname?.startsWith("/restaurants")}
            onClick={closeMobileMenu}
          >
            {t("restaurants")}
          </MobileNavLink>
          <MobileNavLink
            href="/categories"
            prefetch={true}
            $active={pathname?.startsWith("/categories")}
            onClick={closeMobileMenu}
          >
            {t("categories")}
          </MobileNavLink>
          <MobileNavLink
            href="/order-tracking"
            prefetch={true}
            $active={pathname?.startsWith("/order-tracking")}
            onClick={closeMobileMenu}
          >
            {t("orderTracking")}
          </MobileNavLink>
          <MobileNavLink
            href="/about"
            prefetch={true}
            $active={pathname === "/about"}
            onClick={closeMobileMenu}
          >
            {t("about")}
          </MobileNavLink>
          <MobileNavLink
            href="/contact"
            prefetch={true}
            $active={pathname === "/contact"}
            onClick={closeMobileMenu}
          >
            {t("contact")}
          </MobileNavLink>
        </MobileNavLinks>

        <MobileNavActions>
          {isAuthenticated ? (
            <>
              <MobileNavLink href="/profile" onClick={closeMobileMenu}>
                {t("profile")}
              </MobileNavLink>
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  backgroundColor: "#DC2626",
                  color: "white",
                  border: "none",
                  borderRadius: "0.75rem",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                {t("logout")}
              </button>
            </>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              <MobileNavLink
                href="/auth"
                onClick={closeMobileMenu}
                style={{
                  textAlign: "center",
                  background: "#ffffff",
                  border: "1px solid #E6DDD0",
                }}
              >
                {t("login")}
              </MobileNavLink>
              <MobileNavLink
                href="/auth?tab=register"
                onClick={closeMobileMenu}
                style={{
                  textAlign: "center",
                  background: "#D9381E",
                  color: "#ffffff",
                }}
              >
                {t("signup")}
              </MobileNavLink>
            </div>
          )}
        </MobileNavActions>
      </MobileNavigation>
    </>
  );
};

export default Header;
