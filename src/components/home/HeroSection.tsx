"use client";

import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  DishArtwork,
  type FoodVisualKind,
  SearchIcon as SearchVectorIcon,
  StarIcon,
  ClockIcon,
  FlameIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  SparkleIcon,
} from "@/components/ui/FoodVisuals";

const eyebrowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(217, 56, 30, 0.45);
  }
  70% {
    box-shadow: 0 0 0 7px rgba(217, 56, 30, 0);
  }
`;

const ambientOrbDrift = keyframes`
  0%, 100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(-18px, 12px, 0) scale(1.06);
  }
`;

const HeroSectionOuter = styled.section`
  position: relative;
  overflow: hidden;
  padding: 3.25rem 1.75rem 4rem;
  background: radial-gradient(
      circle at 18% 22%,
      rgba(217, 56, 30, 0.09) 0%,
      rgba(217, 56, 30, 0) 48%
    ),
    radial-gradient(
      circle at 85% 80%,
      rgba(229, 154, 17, 0.1) 0%,
      rgba(229, 154, 17, 0) 50%
    ),
    linear-gradient(180deg, #faf6f0 0%, #f3ece2 100%);
  border-bottom: 1px solid ${(props) => props.theme.colors.neutral[200]};
  direction: rtl;

  &::before {
    content: "";
    position: absolute;
    top: -120px;
    left: -80px;
    width: 380px;
    height: 380px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(217, 56, 30, 0.08) 0%,
      rgba(217, 56, 30, 0) 70%
    );
    pointer-events: none;
    animation: ${ambientOrbDrift} 9s ease-in-out infinite;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  }

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    padding: 2rem 1rem 2.5rem;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 1.35rem 0.9rem 1.85rem;
  }
`;

const HeroGrid = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.12fr 0.88fr;
  gap: 3rem;
  align-items: center;
  position: relative;
  z-index: 1;

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    gap: 1.45rem;
  }
`;

const ContentColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    align-items: center;
    text-align: center;
  }
`;

const EditorialEyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  background: #ffffff;
  color: ${(props) => props.theme.colors.neutral[800]};
  font-size: 0.82rem;
  font-weight: 700;
  padding: 0.4rem 0.9rem;
  border-radius: ${(props) => props.theme.borderRadius.full};
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  box-shadow: 0 2px 8px rgba(22, 18, 15, 0.04);
  margin-bottom: 1.25rem;

  span.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${(props) => props.theme.colors.primary[500]};
    animation: ${eyebrowPulse} 2.2s infinite;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 0.72rem;
    padding: 0.3rem 0.7rem;
    margin-bottom: 0.85rem;
  }
`;

const HeroHeadline = styled.h1`
  font-size: clamp(2.1rem, 4.2vw, 3.45rem);
  font-weight: 900;
  color: ${(props) => props.theme.colors.neutral[900]};
  line-height: 1.22;
  letter-spacing: -0.03em;
  margin: 0 0 1.15rem;

  span.highlight {
    color: ${(props) => props.theme.colors.primary[500]};
    position: relative;
    display: inline-block;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 1.58rem;
    line-height: 1.32;
    margin-bottom: 0.75rem;
  }
`;

const HeroLead = styled.p`
  font-size: 1.08rem;
  color: ${(props) => props.theme.colors.neutral[600]};
  line-height: 1.85;
  margin: 0 0 1.85rem;
  max-width: 56ch;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 0.86rem;
    line-height: 1.7;
    margin-bottom: 1.15rem;
  }
`;

const SearchBoxWrapper = styled.div`
  width: 100%;
  max-width: 580px;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

const SearchFormCard = styled.form`
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1.5px solid ${(props) => props.theme.colors.neutral[200]};
  border-radius: ${(props) => props.theme.borderRadius["2xl"]};
  padding: 0.4rem;
  box-shadow: 0 16px 36px -12px rgba(22, 18, 15, 0.1);
  transition: border-color 200ms var(--ease-out),
    box-shadow 200ms var(--ease-out),
    transform 200ms var(--ease-out);

  &:focus-within {
    border-color: ${(props) => props.theme.colors.primary[500]};
    box-shadow: 0 18px 38px -10px rgba(217, 56, 30, 0.2),
      0 0 0 4px ${(props) => props.theme.colors.primary[100]};
    transform: translateY(-1px);
  }
`;

const SearchIconSlot = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.85rem 0 0.4rem;
  color: ${(props) => props.theme.colors.neutral[400]};
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  padding: 0.75rem 0.25rem;
  font-size: 0.96rem;
  color: ${(props) => props.theme.colors.neutral[900]};
  outline: none;

  &::placeholder {
    color: ${(props) => props.theme.colors.neutral[400]};
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 0.88rem;
  }
`;

const SearchSubmitButton = styled.button`
  background: ${(props) => props.theme.colors.primary[500]};
  color: #ffffff;
  font-weight: 700;
  font-size: 0.92rem;
  border: none;
  padding: 0.8rem 1.5rem;
  min-height: 46px;
  border-radius: ${(props) => props.theme.borderRadius.xl};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  flex-shrink: 0;
  transition: background-color 160ms var(--ease-out),
    transform 160ms var(--ease-out),
    box-shadow 160ms var(--ease-out);
  box-shadow: 0 6px 16px -4px rgba(217, 56, 30, 0.35);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: ${(props) => props.theme.colors.primary[600]};
      transform: translateY(-2px);
      box-shadow: 0 10px 22px -4px rgba(217, 56, 30, 0.45);
    }
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 0.65rem 1rem;
    min-height: 42px;
    font-size: 0.82rem;
  }
`;

const CravingPillsRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.45rem;

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    justify-content: center;
  }
`;

const CravingLabel = styled.span`
  font-size: 0.78rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.neutral[500]};
  margin-left: 0.2rem;
`;

const CravingPill = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  font-size: 0.78rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.neutral[700]};
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  padding: 0.3rem 0.78rem;
  border-radius: ${(props) => props.theme.borderRadius.full};
  text-decoration: none;
  transition: transform 180ms var(--ease-out),
    background-color 180ms var(--ease-out),
    border-color 180ms var(--ease-out),
    color 180ms var(--ease-out),
    box-shadow 180ms var(--ease-out);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: #ffffff;
      border-color: ${(props) => props.theme.colors.primary[400]};
      color: ${(props) => props.theme.colors.primary[600]};
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(217, 56, 30, 0.1);
    }
  }

  &:active {
    transform: scale(0.96);
  }
`;

const HeroActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    justify-content: center;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    width: 100%;
    margin-top: 1.15rem;
    gap: 0.6rem;
  }
`;

const PrimaryCTA = styled(Link)`
  padding: 0.85rem 1.65rem;
  min-height: 48px;
  background: ${(props) => props.theme.colors.neutral[900]};
  color: #faf6f0;
  font-weight: 700;
  font-size: 0.94rem;
  border-radius: ${(props) => props.theme.borderRadius.xl};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-decoration: none;
  transition: transform 180ms var(--ease-out),
    background-color 180ms var(--ease-out),
    box-shadow 180ms var(--ease-out);
  box-shadow: 0 10px 24px -6px rgba(22, 18, 15, 0.25);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: ${(props) => props.theme.colors.neutral[800]};
      transform: translateY(-2px);
      box-shadow: 0 14px 28px -6px rgba(22, 18, 15, 0.32);
    }
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    flex: 1;
    min-height: 44px;
    padding: 0.68rem 0.9rem;
    font-size: 0.82rem;
  }
`;

const SecondaryCTA = styled(Link)`
  padding: 0.85rem 1.5rem;
  min-height: 48px;
  background: #ffffff;
  color: ${(props) => props.theme.colors.neutral[800]};
  border: 1.5px solid ${(props) => props.theme.colors.neutral[200]};
  font-weight: 700;
  font-size: 0.94rem;
  border-radius: ${(props) => props.theme.borderRadius.xl};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  text-decoration: none;
  transition: transform 180ms var(--ease-out),
    border-color 180ms var(--ease-out),
    background-color 180ms var(--ease-out);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: ${(props) => props.theme.colors.neutral[400]};
      background: ${(props) => props.theme.colors.neutral[50]};
      transform: translateY(-2px);
    }
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    flex: 1;
    min-height: 44px;
    padding: 0.68rem 0.9rem;
    font-size: 0.82rem;
  }
`;

const MetricsStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 2rem;
  margin-top: 2.25rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${(props) => props.theme.colors.neutral[200]};

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    gap: 0.9rem;
    margin-top: 1.35rem;
    padding-top: 1.1rem;
    width: 100%;
    justify-content: space-around;
  }
`;

const MetricItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;

  strong {
    font-size: 1.35rem;
    font-weight: 800;
    color: ${(props) => props.theme.colors.neutral[900]};
    letter-spacing: -0.02em;

    @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
      font-size: 1.05rem;
    }
  }

  span {
    font-size: 0.78rem;
    color: ${(props) => props.theme.colors.neutral[500]};
    font-weight: 500;

    @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
      font-size: 0.7rem;
    }
  }
`;

/* ============================================================================
 * ویترین تعاملی غذاها (Interactive Bento Culinary Stage)
 * ========================================================================== */

interface ShowcaseDish {
  id: FoodVisualKind;
  label: string;
  title: string;
  subtitle: string;
  rating: string;
  reviewsCount: string;
  prepTime: string;
  price: string;
  restaurant: string;
  calories: string;
  tempTag: string;
  stageBg: string;
  accentColor: string;
  link: string;
}

const SHOWCASE_DISHES: readonly ShowcaseDish[] = [
  {
    id: "burger",
    label: "برگر ذغالی",
    title: "دبل چیزبرگر دودی دست‌ساز",
    subtitle:
      "دو لایه گوشت تازه گوساله، پنیر چدار ذوب‌شده و سس باربیکیو خانگی در نان بریوش",
    rating: "۴.۸",
    reviewsCount: "۲۴۵ نظر ثبت‌شده",
    prepTime: "۲۵ تا ۳۵ دقیقه",
    price: "۲۵۰,۰۰۰ تومان",
    restaurant: "برگرلند",
    calories: "۶۸۰ کیلوکالری",
    tempTag: "سرو داغ ۶۸ درجه",
    stageBg: "linear-gradient(145deg, #281710 0%, #522514 100%)",
    accentColor: "#D9381E",
    link: "/restaurants/burger-land",
  },
  {
    id: "pizza",
    label: "پیتزا ناپولیتن",
    title: "پیتزا مخصوص تنوری ایتالیایی",
    subtitle:
      "خمیر دست‌ساز ۴۸ ساعته، سس گوجه سان مارزانو، موزارلای تازه و ریحان ارگانیک",
    rating: "۴.۹",
    reviewsCount: "۳۱۰ نظر ثبت‌شده",
    prepTime: "۳۰ تا ۴۰ دقیقه",
    price: "۱۴۵,۰۰۰ تومان",
    restaurant: "پیتزا برتر",
    calories: "۷۲۰ کیلوکالری",
    tempTag: "تنور سنگی ۳۸۰ درجه",
    stageBg: "linear-gradient(145deg, #2D120C 0%, #6E2011 100%)",
    accentColor: "#E59A11",
    link: "/restaurants/best-pizza",
  },
  {
    id: "iranian",
    label: "کباب زعفرانی",
    title: "چلوکباب کوبیده و جوجه زعفرانی",
    subtitle:
      "گوشت گرم گوسفندی همراه با برنج صدری هاشمی، زعفران قائنات و گوجه کبابی",
    rating: "۴.۹",
    reviewsCount: "۴۱۰ نظر ثبت‌شده",
    prepTime: "۳۵ تا ۴۵ دقیقه",
    price: "۲۴۰,۰۰۰ تومان",
    restaurant: "رستوران ایرانی سنتی",
    calories: "۸۴۰ کیلوکالری",
    tempTag: "کره محلی و زعفران",
    stageBg: "linear-gradient(145deg, #28190B 0%, #633B12 100%)",
    accentColor: "#D97706",
    link: "/restaurants/traditional-iranian",
  },
  {
    id: "sushi",
    label: "سوشی سالمون",
    title: "سوشی سالمون نروژی فیلادلفیا",
    subtitle:
      "رول سالمون تازه، آووکادو، پنیر کرمی و برنج ژاپنی با سس سویا و واسابی",
    rating: "۴.۹",
    reviewsCount: "۱۹۰ نظر ثبت‌شده",
    prepTime: "۳۰ تا ۴۵ دقیقه",
    price: "۲۹۰,۰۰۰ تومان",
    restaurant: "سوشی تاکو",
    calories: "۴۸۰ کیلوکالری",
    tempTag: "بسته‌بندی ایزوله سرد",
    stageBg: "linear-gradient(145deg, #131F2B 0%, #243E54 100%)",
    accentColor: "#15803D",
    link: "/restaurants/sushi-tako",
  },
];

const VisualStageColumn = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1200px;
`;

const StageBentoCard = styled.div<{
  $rx: number;
  $ry: number;
  $isInteractive: boolean;
}>`
  width: 100%;
  max-width: 470px;
  background: #ffffff;
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  border-radius: 1.75rem;
  padding: 1.25rem;
  box-shadow: 0 28px 60px -15px rgba(22, 18, 15, 0.16),
    0 6px 16px -4px rgba(22, 18, 15, 0.06);
  transform-style: preserve-3d;
  transform: perspective(1000px) rotateX(${(props) => props.$rx}deg)
    rotateY(${(props) => props.$ry}deg);
  transition: ${(props) =>
    props.$isInteractive
      ? "transform 90ms ease-out"
      : "transform 480ms var(--ease-out)"};
  position: relative;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 0.9rem;
    border-radius: 1.35rem;
  }
`;

const StageArtworkBox = styled.div<{ $bg: string }>`
  background: ${(props) => props.$bg};
  border-radius: 1.35rem;
  padding: 1.4rem 1.25rem 1.2rem;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #faf6f0;
  transition: background 420ms var(--ease-out);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
      rgba(255, 255, 255, 0.12) 1px,
      transparent 1px
    );
    background-size: 18px 18px;
    opacity: 0.35;
    pointer-events: none;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    border-radius: 1.1rem;
    padding: 0.95rem 0.85rem 0.85rem;
  }
`;

const StageTopBadges = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 2;
  margin-bottom: 0.25rem;
`;

const TelemetryPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #fffdf9;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 0.68rem;
    padding: 0.24rem 0.55rem;
  }
`;

const ArtworkPlateTrigger = styled(motion.button)`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  z-index: 2;
  min-height: 178px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    min-height: 132px;

    svg {
      width: 128px;
      height: 128px;
    }
  }
`;

const StageBottomMeta = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 2;
  margin-top: 0.35rem;
  font-size: 0.76rem;
  color: rgba(250, 246, 240, 0.88);
`;

const SwitcherTabs = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.35rem;
  background: ${(props) => props.theme.colors.neutral[100]};
  padding: 0.3rem;
  border-radius: 0.95rem;
  margin: 1rem 0;
  position: relative;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    margin: 0.75rem 0;
  }
`;

const SwitcherTab = styled.button<{ $active: boolean }>`
  position: relative;
  background: transparent;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.neutral[900] : theme.colors.neutral[600]};
  border: none;
  border-radius: 0.7rem;
  min-height: 34px;
  padding: 0.42rem 0.2rem;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
  transition: color 180ms var(--ease-out);
  white-space: nowrap;
  z-index: 1;

  &:hover {
    color: ${(props) => props.theme.colors.neutral[900]};
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 0.7rem;
  }
`;

const ActiveTabPill = styled(motion.span)`
  position: absolute;
  inset: 0;
  background: #ffffff;
  border: 1px solid ${(props) => props.theme.colors.neutral[200]};
  box-shadow: 0 2px 8px rgba(22, 18, 15, 0.08);
  border-radius: 0.7rem;
  z-index: -1;
`;

const DishInfoArea = styled(motion.div)`
  padding: 0.25rem 0.25rem 0;
`;

const DishTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.4rem;
`;

const DishTitle = styled.h2`
  font-size: 1.18rem;
  font-weight: 800;
  color: ${(props) => props.theme.colors.neutral[900]};
  margin: 0;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 1.02rem;
  }
`;

const RatingBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: ${(props) => props.theme.colors.warning[100]};
  color: ${(props) => props.theme.colors.warning[800]};
  font-size: 0.8rem;
  font-weight: 800;
  padding: 0.22rem 0.55rem;
  border-radius: 0.55rem;
  flex-shrink: 0;
`;

const DishDescription = styled.p`
  font-size: 0.84rem;
  color: ${(props) => props.theme.colors.neutral[600]};
  margin: 0 0 1rem;
  line-height: 1.65;
  min-height: 2.75rem;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 0.78rem;
    margin-bottom: 0.75rem;
  }
`;

const DishFooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.9rem;
  border-top: 1px solid ${(props) => props.theme.colors.neutral[200]};
  gap: 0.75rem;
`;

const PriceBlock = styled.div`
  display: flex;
  flex-direction: column;

  span.label {
    font-size: 0.72rem;
    color: ${(props) => props.theme.colors.neutral[500]};
  }

  strong.value {
    font-size: 1.08rem;
    font-weight: 800;
    color: ${(props) => props.theme.colors.neutral[900]};

    @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
      font-size: 0.96rem;
    }
  }
`;

const OrderRestaurantLink = styled(Link)`
  background: ${(props) => props.theme.colors.primary[500]};
  color: #ffffff;
  text-decoration: none;
  font-size: 0.86rem;
  font-weight: 700;
  padding: 0.68rem 1.15rem;
  border-radius: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  transition: background-color 160ms var(--ease-out),
    transform 160ms var(--ease-out),
    box-shadow 160ms var(--ease-out);
  box-shadow: 0 6px 16px -4px rgba(217, 56, 30, 0.35);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: ${(props) => props.theme.colors.primary[600]};
      transform: translateY(-2px);
      box-shadow: 0 10px 22px -4px rgba(217, 56, 30, 0.45);
    }
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 0.78rem;
    padding: 0.55rem 0.9rem;
  }
`;

const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDishIndex, setSelectedDishIndex] = useState(0);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isInteractive, setIsInteractive] = useState(false);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const activeDish = SHOWCASE_DISHES[selectedDishIndex];

  useEffect(() => {
    if (isInteractive) return;
    const timer = setInterval(() => {
      setSelectedDishIndex((prev) => (prev + 1) % SHOWCASE_DISHES.length);
    }, 5200);
    return () => clearInterval(timer);
  }, [isInteractive]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!showcaseRef.current) return;
    const rect = showcaseRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5.5;
    const rotateY = ((x - centerX) / centerX) * 5.5;

    setIsInteractive(true);
    setRotate({
      x: Number(rotateX.toFixed(2)),
      y: Number(rotateY.toFixed(2)),
    });
  };

  const handleMouseLeave = () => {
    setIsInteractive(false);
    setRotate({ x: 0, y: 0 });
  };

  const switchDish = (index: number) => {
    if (index === selectedDishIndex) return;
    setSelectedDishIndex(index);
  };

  const cycleNextDish = () => {
    setSelectedDishIndex((prev) => (prev + 1) % SHOWCASE_DISHES.length);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/restaurants?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/restaurants");
    }
  };

  return (
    <HeroSectionOuter>
      <HeroGrid>
        <ContentColumn>
          <EditorialEyebrow>
            <span className="dot" />
            <span>آشپزخانه‌های منتخب شهر • ارسال گرم زیر ۳۵ دقیقه</span>
          </EditorialEyebrow>

          <HeroHeadline>
            طعمِ داغِ تنور و گریل، مستقیماً از{" "}
            <span className="highlight">بهترین رستوران‌ها</span> تا میز شما
          </HeroHeadline>

          <HeroLead>
            در فودینو، منوی زنده‌ی برترین رستوران‌ها و آشپزخانه‌های تخصصی شهر را
            مرور کنید، جزئیات و ترکیبات هر غذا را ببینید و سفارشتان را داغ و
            تازه تحویل بگیرید.
          </HeroLead>

          <SearchBoxWrapper>
            <SearchFormCard onSubmit={handleSearch} role="search">
              <SearchIconSlot>
                <SearchVectorIcon size={20} />
              </SearchIconSlot>
              <SearchInput
                type="text"
                placeholder="جستجوی نام رستوران، پیتزا ناپولیتن، کباب، سوشی..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="جستجوی نام رستوران یا غذا"
              />
              <SearchSubmitButton type="submit">
                <span>جستجو</span>
                <ArrowLeftIcon size={16} />
              </SearchSubmitButton>
            </SearchFormCard>

            <CravingPillsRow>
              <CravingLabel>پیشنهاد سریع:</CravingLabel>
              <CravingPill href="/categories/pizza">پیتزا تنوری</CravingPill>
              <CravingPill href="/categories/burger">برگر ذغالی</CravingPill>
              <CravingPill href="/categories/iranian">کباب زعفرانی</CravingPill>
              <CravingPill href="/categories/sushi">سوشی تازه</CravingPill>
              <CravingPill href="/categories/healthy">سالاد و رژیمی</CravingPill>
            </CravingPillsRow>
          </SearchBoxWrapper>

          <HeroActionsRow>
            <PrimaryCTA href="/restaurants">
              <span>مشاهده همه رستوران‌ها</span>
              <ArrowLeftIcon size={17} />
            </PrimaryCTA>
            <SecondaryCTA href="/categories">
              <span>مرور دسته‌بندی‌های غذا</span>
            </SecondaryCTA>
          </HeroActionsRow>

          <MetricsStrip>
            <MetricItem>
              <strong>+۱۲۰</strong>
              <span>رستوران و آشپزخانه منتخب</span>
            </MetricItem>
            <MetricItem>
              <strong>۳۲ دقیقه</strong>
              <span>میانگین زمان تحویل گرم</span>
            </MetricItem>
            <MetricItem>
              <strong>۴.۸ از ۵</strong>
              <span>رضایت مشتریان تأییدشده</span>
            </MetricItem>
          </MetricsStrip>
        </ContentColumn>

        <VisualStageColumn
          ref={showcaseRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <StageBentoCard
            $rx={rotate.x}
            $ry={rotate.y}
            $isInteractive={isInteractive}
          >
            <StageArtworkBox $bg={activeDish.stageBg}>
              <StageTopBadges>
                <TelemetryPill>
                  <FlameIcon size={14} style={{ color: "#FBBF24" }} />
                  <span>{activeDish.tempTag}</span>
                </TelemetryPill>
                <TelemetryPill>
                  <ClockIcon size={14} />
                  <span>{activeDish.prepTime}</span>
                </TelemetryPill>
              </StageTopBadges>

              <AnimatePresence mode="wait">
                <ArtworkPlateTrigger
                  key={activeDish.id}
                  type="button"
                  onClick={cycleNextDish}
                  aria-label="نمایش غذای بعدی در ویترین"
                  title="کلیک برای مشاهده غذای بعدی"
                  initial={{ opacity: 0, scale: 0.88, rotate: -7, y: 12 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, rotate: 6, y: -10 }}
                  transition={{
                    type: "spring",
                    duration: 0.46,
                    bounce: 0.22,
                  }}
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <DishArtwork
                    kind={activeDish.id}
                    size={172}
                    variant="hero"
                  />
                </ArtworkPlateTrigger>
              </AnimatePresence>

              <StageBottomMeta>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <SparkleIcon size={13} style={{ color: "#FCD34D" }} />
                  <span>{activeDish.restaurant}</span>
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <ShieldCheckIcon size={14} style={{ color: "#4ADE80" }} />
                  <span>{activeDish.calories}</span>
                </span>
              </StageBottomMeta>
            </StageArtworkBox>

            <SwitcherTabs role="tablist" aria-label="انتخاب غذای نمونه">
              {SHOWCASE_DISHES.map((dish, index) => {
                const isActive = index === selectedDishIndex;
                return (
                  <SwitcherTab
                    key={dish.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    $active={isActive}
                    onClick={() => switchDish(index)}
                  >
                    {isActive && (
                      <ActiveTabPill
                        layoutId="heroShowcaseActiveTab"
                        transition={{
                          type: "spring",
                          duration: 0.38,
                          bounce: 0.16,
                        }}
                      />
                    )}
                    <span>{dish.label}</span>
                  </SwitcherTab>
                );
              })}
            </SwitcherTabs>

            <AnimatePresence mode="wait">
              <DishInfoArea
                key={activeDish.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
              >
                <DishTitleRow>
                  <DishTitle>{activeDish.title}</DishTitle>
                  <RatingBadge>
                    <StarIcon size={13} style={{ color: "#D97706" }} />
                    <span>{activeDish.rating}</span>
                  </RatingBadge>
                </DishTitleRow>
                <DishDescription>{activeDish.subtitle}</DishDescription>

                <DishFooterRow>
                  <PriceBlock>
                    <span className="label">
                      قیمت در منوی {activeDish.restaurant}
                    </span>
                    <strong className="value">{activeDish.price}</strong>
                  </PriceBlock>
                  <OrderRestaurantLink href={activeDish.link}>
                    <span>مشاهده منو و سفارش</span>
                    <ArrowLeftIcon size={15} />
                  </OrderRestaurantLink>
                </DishFooterRow>
              </DishInfoArea>
            </AnimatePresence>
          </StageBentoCard>
        </VisualStageColumn>
      </HeroGrid>
    </HeroSectionOuter>
  );
};

export default HeroSection;
