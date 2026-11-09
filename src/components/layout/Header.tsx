"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import styled, { keyframes } from "styled-components";
import Link from "next/link";
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
} from "@/components/ui/FoodVisuals";

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

const TopPromoBarContainer = styled.div<{ $visible: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  background: linear-gradient(90deg, #16120f 0%, #261b15 50%, #16120f 100%);
  color: #faf6f0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: ${({ $visible }) => ($visible ? "0.5rem 2.5rem" : "0 2.5rem")};
  max-height: ${({ $visible }) => ($visible ? "54px" : "0px")};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  overflow: hidden;
  transition: max-height 260ms cubic-bezier(0.2, 0, 0, 1),
    opacity 200ms cubic-bezier(0.2, 0, 0, 1),
    padding 260ms cubic-bezier(0.2, 0, 0, 1);
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
  position: relative;
  z-index: 101;
  direction: rtl;
  text-align: center;
  font-size: 0.825rem;
  font-weight: 500;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 0.74rem;
    padding: ${({ $visible }) =>
      $visible ? "0.4rem 2.25rem 0.4rem 0.75rem" : "0 2.25rem 0 0.75rem"};
    gap: 0.35rem;
    max-height: ${({ $visible }) => ($visible ? "68px" : "0px")};
  }
`;

const PromoIndicator = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fbbf24;
  flex-shrink: 0;
`;

const PromoCodeButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(217, 56, 30, 0.22);
  color: #fde68a;
  padding: 0.16rem 0.6rem;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  border: 1px dashed rgba(251, 191, 36, 0.55);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  cursor: pointer;
  transition: background-color 150ms ease, transform 120ms ease, border-color 150ms ease;

  &:hover {
    background: rgba(217, 56, 30, 0.36);
    border-color: #fbbf24;
  }

  &:active {
    transform: scale(0.96);
  }
`;

const PromoCloseButton = styled.button`
  position: absolute;
  left: 0.85rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(250, 246, 240, 0.78);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  transition: background-color 140ms ease, color 140ms ease, transform 120ms ease;
  user-select: none;
  touch-action: manipulation;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.15);
  }

  &:active {
    transform: scale(0.9);
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
  padding: ${({ $isScrolled }) =>
    $isScrolled ? "0.65rem 1.75rem" : "0.95rem 1.75rem"};
  transition: padding 220ms ease;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    padding: ${({ $isScrolled }) =>
      $isScrolled ? "0.55rem 1rem" : "0.7rem 1rem"};
    gap: 0.65rem;
  }
`;

const LogoLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  flex-shrink: 0;
  transition: transform 160ms cubic-bezier(0.2, 0, 0, 1);

  &:hover {
    transform: translateY(-1px);
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
  max-width: 300px;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    display: none;
  }
`;

const SearchInputContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  border-radius: ${(props) => props.theme.borderRadius.full};
  padding: 0.48rem 0.95rem;
  transition: border-color 160ms ease, box-shadow 160ms ease;

  &:focus-within {
    border-color: ${(props) => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${(props) => props.theme.colors.primary[100]};
  }
`;

const SearchInput = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.85rem;
  color: ${(props) => props.theme.colors.neutral[900]};

  &::placeholder {
    color: ${(props) => props.theme.colors.neutral[400]};
  }
`;

const SearchIconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;
  color: ${(props) => props.theme.colors.neutral[400]};
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

  &:hover {
    border-color: ${(props) => props.theme.colors.neutral[400]};
    background: ${(props) => props.theme.colors.neutral[100]};
    transform: translateY(-1px);
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

  &:hover {
    background-color: ${(props) => props.theme.colors.primary[600]};
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(217, 56, 30, 0.32);
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

  &:hover {
    background-color: ${(props) => props.theme.colors.primary[50]};
    border-color: ${(props) => props.theme.colors.primary[200]};
    transform: translateY(-1px);
    color: ${(props) => props.theme.colors.primary[600]};
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
  transition: color 0.2s ease, transform 0.2s ease, border-color 0.2s ease;

  &:hover {
    color: ${(props) => props.theme.colors.primary[500]};
    border-color: ${(props) => props.theme.colors.primary[200]};
  }

  &:active {
    transform: scale(0.94);
  }

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
  }
`;

const MobileCartButton = styled(Link)`
  position: relative;
  text-decoration: none;
  display: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #ffffff;
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  transition: all 0.2s ease;
  color: ${(props) => props.theme.colors.neutral[800]};

  &:hover {
    background-color: ${(props) => props.theme.colors.primary[50]};
    color: ${(props) => props.theme.colors.primary[500]};
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
  right: 0;
  width: min(320px, 88vw);
  height: 100vh;
  height: 100dvh;
  background-color: #faf6f0;
  border-left: 1px solid ${(props) => props.theme.colors.neutral[200]};
  box-shadow: -12px 0 36px rgba(22, 18, 15, 0.18);
  padding: 1.25rem 1.15rem;
  padding-bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px));
  transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 200;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
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

const Header = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  const handleCopyPromo = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText("FOODINO");
        setCopiedPromo(true);
        setTimeout(() => setCopiedPromo(false), 2000);
      }
    } catch {
      // Ignore clipboard errors
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
      router.push(`/restaurants?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

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
      <TopPromoBarContainer $visible={isPromoVisible}>
        <PromoIndicator>
          <SparkleIcon size={14} />
        </PromoIndicator>
        <span>پیشنهاد ویژه اولین سفارش در فودینو با کد:</span>
        <PromoCodeButton
          type="button"
          onClick={handleCopyPromo}
          title="کپی کد تخفیف FOODINO"
        >
          {copiedPromo ? <CheckCircleIcon size={13} /> : <CopyIcon size={13} />}
          <span>FOODINO</span>
        </PromoCodeButton>
        <span>(۲۰٪ تخفیف تا سقف ۵۰ هزار تومان)</span>
        <PromoCloseButton onClick={handleDismissPromo} aria-label="بستن اعلان">
          <CloseIcon size={14} />
        </PromoCloseButton>
      </TopPromoBarContainer>

      <HeaderWrapper $isScrolled={isScrolled}>
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

          <SearchContainer>
            <form onSubmit={handleSearch}>
              <SearchInputContainer>
                <SearchIconWrap>
                  <SearchVectorIcon size={16} />
                </SearchIconWrap>
                <SearchInput
                  type="text"
                  placeholder={t("search")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label={t("search")}
                />
              </SearchInputContainer>
            </form>
          </SearchContainer>

          <ActionButtons>
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
          <SearchInputContainer>
            <SearchIconWrap>
              <SearchVectorIcon size={16} />
            </SearchIconWrap>
            <SearchInput
              type="text"
              placeholder={t("search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
