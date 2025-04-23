"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2.5rem;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
  direction: rtl;
  transition: box-shadow 0.3s ease, padding 0.3s ease;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    padding: 1rem 1.5rem;
  }
`;

const Logo = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  color: ${(props) => props.theme.colors.primary[500]};
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:after {
    content: "";
    position: absolute;
    bottom: -2px;
    right: 0;
    width: 0;
    height: 2px;
    background-color: ${(props) => props.theme.colors.primary[400]};
    transition: width 0.3s ease;
  }

  &:hover:after {
    width: 100%;
  }
`;

const LogoLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LogoEmoji = styled.span`
  font-size: 1.5rem;
`;

const Navigation = styled.nav`
  display: flex;
  gap: 2rem;
  margin: 0 2rem;

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${(props) => props.theme.colors.neutral[700]};
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.3s ease;

  &:hover {
    color: ${(props) => props.theme.colors.primary[500]};
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    right: 0;
    width: 0;
    height: 2px;
    background-color: ${(props) => props.theme.colors.primary[500]};
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }

  &.active {
    color: ${(props) => props.theme.colors.primary[500]};
    font-weight: 600;

    &::after {
      width: 100%;
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    gap: 0.5rem;
  }
`;

const LanguageToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.neutral[50]};
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  transition: all 0.3s ease;
  color: ${(props) => props.theme.colors.neutral[700]};
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;

  &:hover {
    background-color: ${(props) => props.theme.colors.neutral[100]};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    color: ${(props) => props.theme.colors.primary[500]};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin-left: 1rem;
  flex-grow: 1;
  max-width: 400px;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    display: none;
  }
`;

const SearchInputContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${(props) => props.theme.colors.neutral[50]};
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  border-radius: ${(props) => props.theme.borderRadius.full};
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: ${(props) => props.theme.colors.primary[300]};
    box-shadow: 0 0 0 3px ${(props) => props.theme.colors.primary[100]};
  }
`;

const SearchInput = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.neutral[900]};

  &::placeholder {
    color: ${(props) => props.theme.colors.neutral[400]};
  }
`;

const SearchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;
  color: ${(props) => props.theme.colors.neutral[500]};
`;

const LoginButton = styled(Link)`
  padding: 0.5rem 1.25rem;
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  background: transparent;
  border: 1px solid ${(props) => props.theme.colors.neutral[300]};
  color: ${(props) => props.theme.colors.neutral[700]};

  &:hover {
    border-color: ${(props) => props.theme.colors.primary[500]};
    color: ${(props) => props.theme.colors.primary[500]};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`;

const SignupButton = styled(Link)`
  padding: 0.5rem 1.25rem;
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  background-color: ${(props) => props.theme.colors.primary[500]};
  border: none;
  color: white;

  &:hover {
    background-color: ${(props) => props.theme.colors.primary[400]};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`;

const IconButton = styled(Link)`
  position: relative;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.neutral[50]};
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  transition: all 0.3s ease;
  color: ${(props) => props.theme.colors.neutral[700]};

  &:hover {
    background-color: ${(props) => props.theme.colors.neutral[100]};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    color: ${(props) => props.theme.colors.primary[500]};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: ${(props) => props.theme.colors.primary[500]};
  color: white;
  font-size: 0.75rem;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  font-weight: 600;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: ${(props) => props.theme.colors.neutral[700]};
  transition: color 0.3s ease;

  &:hover {
    color: ${(props) => props.theme.colors.primary[500]};
  }

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${(props) => props.theme.colors.neutral[50]};
    border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  }
`;

const MobileNavigation = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100vh;
  background-color: white;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  padding: 2rem 1.5rem;
  transition: transform 0.3s ease;
  z-index: 200;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);

  &[data-open="true"] {
    transform: translateX(0);
  }
`;

const MobileNavHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const MobileNavCloseButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.neutral[500]};
  font-size: 1.5rem;
  cursor: pointer;
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MobileNavLink = styled(Link)`
  color: ${(props) => props.theme.colors.neutral[800]};
  text-decoration: none;
  font-weight: 500;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${(props) => props.theme.colors.neutral[100]};
  transition: color 0.2s ease;

  &:hover {
    color: ${(props) => props.theme.colors.primary[500]};
  }
`;

const MobileNavActions = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 2rem;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 150;
  opacity: 0;
  visibility: hidden;

  &[data-visible="true"] {
    opacity: 1;
    visibility: visible;
  }
`;

const LogoutIconButton = styled.button`
  background: none;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: ${(props) => props.theme.colors.neutral[700]};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.neutral[100]};
    color: ${(props) => props.theme.colors.primary.main};
  }
`;

const MobileIconContainer = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 1rem 0;
  margin-bottom: 1rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.neutral[100]};
`;

const MobileIconButton = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: ${(props) => props.theme.colors.neutral[700]};
  gap: 0.5rem;

  &:hover {
    color: ${(props) => props.theme.colors.primary[500]};
  }
`;

const MobileIconLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
`;

const MobileCartButton = styled(Link)`
  position: relative;
  text-decoration: none;
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.neutral[50]};
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  transition: all 0.3s ease;
  color: ${(props) => props.theme.colors.neutral[700]};

  &:hover {
    background-color: ${(props) => props.theme.colors.neutral[100]};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    color: ${(props) => props.theme.colors.primary[500]};
  }

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    display: flex;
  }
`;

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { getTotalItems } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation("header");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    router.push("/");
  };

  return (
    <>
      <HeaderContainer
        style={{
          padding: isScrolled ? "0.75rem 2.5rem" : "1.25rem 2.5rem",
          boxShadow: isScrolled
            ? "0 4px 12px rgba(0, 0, 0, 0.1)"
            : "0 4px 12px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Logo>
          <LogoLink href="/">
            <LogoEmoji>🍔</LogoEmoji>
            <span>فودینو</span>
          </LogoLink>
        </Logo>

        <Navigation>
          <NavLink href="/">{t("home")}</NavLink>
          <NavLink href="/restaurants">{t("restaurants")}</NavLink>
          <NavLink href="/categories">{t("categories")}</NavLink>
          <NavLink href="/order-tracking">{t("orderTracking")}</NavLink>
          <NavLink href="/about">{t("about")}</NavLink>
          <NavLink href="/contact">{t("contact")}</NavLink>
        </Navigation>

        <SearchContainer>
          <form onSubmit={handleSearch}>
            <SearchInputContainer>
              <SearchIcon>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 21L16.65 16.65"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder={t("search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchInputContainer>
          </form>
        </SearchContainer>

        <ActionButtons>
          <LanguageToggle onClick={toggleLanguage} aria-label={language === "fa" ? t("changeToEnglish") : t("changeToPersian")}>
            {language === "fa" ? "EN" : "فا"}
          </LanguageToggle>

          <IconButton
            href="/favorite-restaurants"
            aria-label="علاقه‌مندی‌ها"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </IconButton>

          <IconButton href="/cart" aria-label="سبد خرید">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {getTotalItems() > 0 && <CartBadge>{getTotalItems()}</CartBadge>}
          </IconButton>

          {isAuthenticated ? (
            <>
              <IconButton
                href="/profile"
                onClick={closeMobileMenu}
                aria-label="حساب کاربری"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </IconButton>
              <LogoutIconButton onClick={handleLogout} aria-label="خروج">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 17L21 12L16 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 12H9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {getTotalItems() > 0 && <CartBadge>{getTotalItems()}</CartBadge>}
          </MobileCartButton>

          <MobileMenuButton onClick={toggleMobileMenu} aria-label="منوی موبایل">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 12H21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 6H21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 18H21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </MobileMenuButton>
        </ActionButtons>
      </HeaderContainer>

      <Overlay
        data-visible={isMobileMenuOpen ? "true" : "false"}
        onClick={closeMobileMenu}
      />

      <MobileNavigation data-open={isMobileMenuOpen ? "true" : "false"}>
        <MobileNavHeader>
          <Logo style={{ fontSize: "1.5rem" }}>
            <LogoLink href="/">
              <LogoEmoji>🍔</LogoEmoji>
              <span>فودینو</span>
            </LogoLink>
          </Logo>
          <MobileNavCloseButton onClick={closeMobileMenu} aria-label="بستن منو">
            &times;
          </MobileNavCloseButton>
        </MobileNavHeader>

        <form onSubmit={handleSearch} style={{ marginBottom: "1.5rem" }}>
          <SearchInputContainer>
            <SearchIcon>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 21L16.65 16.65"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </SearchIcon>
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
            onClick={closeMobileMenu}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <MobileIconLabel>{t("favorites")}</MobileIconLabel>
          </MobileIconButton>

          <MobileIconButton href="/cart" onClick={closeMobileMenu}>
            <div style={{ position: "relative" }}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {getTotalItems() > 0 && <CartBadge>{getTotalItems()}</CartBadge>}
            </div>
            <MobileIconLabel>{t("cart")}</MobileIconLabel>
          </MobileIconButton>

          {isAuthenticated ? (
            <MobileIconButton href="/profile" onClick={closeMobileMenu}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <MobileIconLabel>{t("profile")}</MobileIconLabel>
            </MobileIconButton>
          ) : (
            <MobileIconButton href="/auth" onClick={closeMobileMenu}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 17L15 12L10 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 12H3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <MobileIconLabel>{t("login")}/{t("signup")}</MobileIconLabel>
            </MobileIconButton>
          )}
        </MobileIconContainer>

        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <button 
            onClick={() => {
              toggleLanguage();
              setTimeout(closeMobileMenu, 500);
            }}
            aria-label={language === "fa" ? t("changeToEnglish") : t("changeToPersian")}
            style={{ 
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              transition: 'all 0.3s ease',
              color: '#374151',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 500
            }}
          >
            {language === "fa" ? "EN" : "فا"}
          </button>
          <div style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
            {language === "fa" ? t("changeToEnglish") : t("changeToPersian")}
          </div>
        </div>

        <MobileNavLinks>
          <MobileNavLink href="/" onClick={closeMobileMenu}>
            {t("home")}
          </MobileNavLink>
          <MobileNavLink href="/restaurants" onClick={closeMobileMenu}>
            {t("restaurants")}
          </MobileNavLink>
          <MobileNavLink href="/categories" onClick={closeMobileMenu}>
            {t("categories")}
          </MobileNavLink>
          <MobileNavLink href="/order-tracking" onClick={closeMobileMenu}>
            {t("orderTracking")}
          </MobileNavLink>
          <MobileNavLink href="/about" onClick={closeMobileMenu}>
            {t("about")}
          </MobileNavLink>
          <MobileNavLink href="/contact" onClick={closeMobileMenu}>
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
                  backgroundColor: "#EF4444",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              <MobileNavLink href="/auth" onClick={closeMobileMenu}>
                {t("login")}
              </MobileNavLink>
              <MobileNavLink href="/auth?tab=register" onClick={closeMobileMenu}>
                {t("signup")}
              </MobileNavLink>
            </>
          )}
        </MobileNavActions>
      </MobileNavigation>
    </>
  );
};

export default Header;
