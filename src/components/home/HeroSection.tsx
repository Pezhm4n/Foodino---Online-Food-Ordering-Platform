"use client";

import React, { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const heroContentFade = keyframes`
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const heroVisualFade = keyframes`
  from {
    opacity: 0;
    transform: scale(0.96) translateY(12px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const HeroContainer = styled.section`
  background: linear-gradient(135deg, ${props => props.theme.colors.neutral[100]} 0%, white 100%);
  padding: 4.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  max-width: 1300px;
  margin: 0 auto;
  gap: 3rem;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    flex-direction: column;
    padding: 2.5rem 1.25rem;
    gap: 2rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 1.25rem 0.875rem 1.5rem;
    gap: 1.25rem;
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  max-width: 620px;
  animation: ${heroContentFade} 500ms cubic-bezier(0.16, 1, 0.3, 1) both;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 100%;
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.theme.colors.primary[50]};
  color: ${props => props.theme.colors.primary[600]};
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.35rem 0.9rem;
  border-radius: 9999px;
  border: 1px solid ${props => props.theme.colors.primary[200]};
  margin-bottom: 1rem;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 0.75rem;
    padding: 0.25rem 0.7rem;
    margin-bottom: 0.65rem;
  }
`;

const Title = styled.h1`
  font-size: 2.75rem;
  font-weight: 800;
  color: ${props => props.theme.colors.neutral[900]};
  margin-bottom: 1.25rem;
  line-height: 1.35;
  
  span {
    color: ${props => props.theme.colors.primary[500]};
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1.85rem;
    margin-bottom: 0.75rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 1.45rem;
    line-height: 1.35;
    margin-bottom: 0.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.neutral[600]};
  margin-bottom: 2rem;
  line-height: 1.8;
  max-width: 540px;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 0.95rem;
    margin-bottom: 1.25rem;
    line-height: 1.6;
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 0.85rem;
    line-height: 1.55;
    margin-bottom: 1rem;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  max-width: 520px;
  width: 100%;
  position: relative;
  flex-direction: column;
`;

const SearchInputContainer = styled.div`
  display: flex;
  position: relative;
  box-shadow: 0 4px 16px -2px rgba(0, 0, 0, 0.07);
  border-radius: ${props => props.theme.borderRadius.xl};
  background: white;
  border: 1.5px solid ${props => props.theme.colors.neutral[200]};
  transition: all 0.2s;

  &:focus-within {
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px rgba(255, 90, 0, 0.15);
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 3rem 1rem 1.25rem;
  border: none;
  background: transparent;
  font-size: 1rem;
  outline: none;
  font-family: inherit;
  direction: rtl;
  text-align: right;
  min-width: 0;

  &::placeholder {
    color: ${props => props.theme.colors.neutral[400]};
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 0.85rem;
    padding: 0.75rem 2.25rem 0.75rem 0.5rem;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 1.1rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.neutral[400]};
  font-size: 1.25rem;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    right: 0.65rem;
    font-size: 1rem;
  }
`;

const SearchButton = styled.button`
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  font-weight: 600;
  border: none;
  padding: 0.85rem 1.75rem;
  min-height: 44px;
  border-radius: ${props => props.theme.borderRadius.lg};
  margin: 0.35rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  font-size: 0.95rem;
  flex-shrink: 0;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[600]};
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 0.55rem 0.95rem;
    font-size: 0.85rem;
    min-height: 38px;
    margin: 0.25rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  width: 100%;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    margin-top: 0.85rem;
    gap: 0.5rem;
  }
`;

const PrimaryButton = styled(Link)`
  padding: 0.85rem 1.75rem;
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  font-weight: 600;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.borderRadius.lg};
  text-decoration: none;
  text-align: center;
  box-shadow: 0 4px 12px rgba(255, 90, 0, 0.22);
  transition: all 0.2s;
  font-size: 0.95rem;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[600]};
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex: 1;
    padding: 0.65rem 0.5rem;
    font-size: 0.85rem;
    min-height: 40px;
  }
`;

const SecondaryButton = styled(Link)`
  padding: 0.85rem 1.75rem;
  background-color: white;
  color: ${props => props.theme.colors.neutral[700]};
  font-weight: 600;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1.5px solid ${props => props.theme.colors.neutral[200]};
  text-decoration: none;
  text-align: center;
  transition: all 0.2s;
  font-size: 0.95rem;
  
  &:hover {
    border-color: ${props => props.theme.colors.neutral[300]};
    background-color: ${props => props.theme.colors.neutral[50]};
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex: 1;
    padding: 0.65rem 0.5rem;
    font-size: 0.85rem;
    min-height: 40px;
  }
`;

const SHOWCASE_DISHES = [
  {
    id: 'burger',
    emoji: '🍔',
    label: 'برگر',
    title: 'برگر دوبل ذغالی با پنیر گودا',
    desc: 'گوشت خالص ۱۰۰٪ با سس مخصوص و قارچ',
    rating: '۴.۹',
    reviewsCount: '۵۲۰+ نظر',
    deliveryTag: 'تحویل رایگان',
    price: '۲۴۵,۰۰۰ تومان',
    restaurant: 'برگرلند',
    circleGradient: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
    accentColor: '#ea580c',
    glowColor: 'rgba(234, 88, 12, 0.28)',
    badge1Icon: '⚡',
    badge1Title: 'تحویل اکسپرس',
    badge1Sub: 'زیر ۳۰ دقیقه',
    badge2Icon: '🍕',
    badge2Title: 'تنوع بی‌نظیر',
    badge2Sub: 'بیش از ۱۰۰ رستوران',
    link: '/restaurants/burger-land',
  },
  {
    id: 'pizza',
    emoji: '🍕',
    label: 'پیتزا',
    title: 'پیتزا ناپولی دبل چیز اسپشیال',
    desc: 'خمیر دست‌ساز ناپلی با پنیر موزارلا و پپرونی تند',
    rating: '۴.۸',
    reviewsCount: '۴۸۰+ نظر',
    deliveryTag: 'ارسال داغ',
    price: '۲۸۰,۰۰۰ تومان',
    restaurant: 'پیتزا برتر',
    circleGradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    accentColor: '#d97706',
    glowColor: 'rgba(217, 119, 6, 0.28)',
    badge1Icon: '🔥',
    badge1Title: 'داغ از تنور',
    badge1Sub: 'پخت هیزمی سنتی',
    badge2Icon: '🧀',
    badge2Title: 'پنیر ۱۰۰٪ طبیعی',
    badge2Sub: 'کِش‌دار و خوش‌طعم',
    link: '/restaurants/pizza-bartar',
  },
  {
    id: 'sushi',
    emoji: '🍣',
    label: 'سوشی',
    title: 'سوشی سالمون نروژی فیلادلفیا',
    desc: 'فیله سالمون تازه با آووکادو، پنیر و سس تریاکی',
    rating: '۵.۰',
    reviewsCount: '۳۴۰+ نظر',
    deliveryTag: 'بسته‌بندی ویژه',
    price: '۳۲۰,۰۰۰ تومان',
    restaurant: 'سوشی تاکو',
    circleGradient: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
    accentColor: '#059669',
    glowColor: 'rgba(5, 150, 105, 0.26)',
    badge1Icon: '🥢',
    badge1Title: 'صید روز نروژ',
    badge1Sub: 'آماده‌سازی لایو',
    badge2Icon: '✨',
    badge2Title: 'سرآشپز بین‌المللی',
    badge2Sub: 'کیفیت ممتاز A+',
    link: '/restaurants/sushi-taco',
  },
] as const;

// بخش ویژوال دسکتاپ با پرسپکتیو و افکت‌های سه‌بعدی
const VisualShowcase = styled.div`
  position: relative;
  width: 480px;
  height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1200px;
  animation: ${heroVisualFade} 560ms cubic-bezier(0.16, 1, 0.3, 1) 120ms both;
  user-select: none;

  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    width: 100%;
    max-width: 440px;
    height: 450px;
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`;

const MainCard = styled.div<{ $rx: number; $ry: number; $isInteractive: boolean }>`
  width: 375px;
  max-width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 2rem;
  padding: 1.65rem 1.65rem 1.35rem;
  box-shadow: 0 25px 50px -12px rgba(234, 88, 12, 0.16),
    0 10px 25px -5px rgba(0, 0, 0, 0.05),
    0 0 0 1px rgba(255, 255, 255, 0.9) inset;
  border: 1px solid rgba(226, 232, 240, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 2;
  transform-style: preserve-3d;
  transform: perspective(1000px) rotateX(${props => props.$rx}deg) rotateY(${props => props.$ry}deg);
  transition: ${props => (props.$isInteractive ? 'transform 100ms ease-out, box-shadow 200ms ease' : 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease')};
  cursor: pointer;

  &:hover {
    box-shadow: 0 32px 64px -14px rgba(234, 88, 12, 0.22),
      0 12px 28px -6px rgba(0, 0, 0, 0.08),
      0 0 0 1px rgba(255, 255, 255, 0.95) inset;
  }
`;

const CardGlareOverlay = styled.div<{ $x: number; $y: number; $opacity: number }>`
  position: absolute;
  inset: 0;
  border-radius: 2rem;
  pointer-events: none;
  background: radial-gradient(
    circle at ${props => props.$x}% ${props => props.$y}%,
    rgba(255, 255, 255, 0.7) 0%,
    rgba(255, 255, 255, 0) 65%
  );
  opacity: ${props => props.$opacity};
  transition: opacity 250ms ease;
  z-index: 5;
`;

const FoodCircleWrapper = styled.div`
  position: relative;
  transform: translateZ(36px);
  transform-style: preserve-3d;
  margin-bottom: 1.1rem;
`;

const FoodIconCircle = styled.div<{ $bg: string; $glow: string; $isPopping: boolean }>`
  width: 135px;
  height: 135px;
  background: ${props => props.$bg};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4.8rem;
  box-shadow: 0 14px 28px -6px ${props => props.$glow},
    0 0 0 6px rgba(255, 255, 255, 0.95);
  transition: background 300ms ease, box-shadow 300ms ease;
  animation: ${props => (props.$isPopping ? 'popSpring 320ms cubic-bezier(0.16, 1, 0.3, 1)' : 'foodFloat 4.2s ease-in-out infinite')};

  @keyframes popSpring {
    0% { transform: scale(0.85); }
    50% { transform: scale(1.16); }
    100% { transform: scale(1); }
  }

  @keyframes foodFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-7px); }
  }
`;

const SparkleBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.9);
  animation: pulseGlow 2.5s ease-in-out infinite;

  @keyframes pulseGlow {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.12); }
  }
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  color: ${props => props.theme.colors.neutral[900]};
  margin: 0 0 0.35rem;
  transform: translateZ(26px);
  letter-spacing: -0.2px;
  transition: color 200ms ease;
`;

const CardDesc = styled.p`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.neutral[500]};
  margin: 0 0 0.95rem;
  transform: translateZ(20px);
  line-height: 1.5;
  max-width: 310px;
`;

const DishSelectorBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.95rem;
  transform: translateZ(28px);
  background: #f8fafc;
  padding: 0.3rem 0.45rem;
  border-radius: 9999px;
  border: 1px solid #e2e8f0;
`;

const DishSelectorChip = styled.button<{ $active: boolean; $accent: string }>`
  background: ${props => (props.$active ? 'white' : 'transparent')};
  color: ${props => (props.$active ? props.$accent : '#64748b')};
  border: ${props => (props.$active ? `1px solid ${props.$accent}35` : '1px solid transparent')};
  box-shadow: ${props => (props.$active ? '0 2px 8px rgba(0,0,0,0.06)' : 'none')};
  border-radius: 9999px;
  padding: 0.28rem 0.7rem;
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
  transition: all 160ms cubic-bezier(0.2, 0, 0, 1);
  user-select: none;
  touch-action: manipulation;

  &:hover {
    color: ${props => props.$accent};
    background: white;
  }

  &:active {
    transform: scale(0.94);
  }
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-top: 0.85rem;
  border-top: 1px solid #f1f5f9;
  transform: translateZ(24px);
`;

const RatingTag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: #b45309;
  font-weight: 700;
  background: #fef3c7;
  padding: 0.25rem 0.6rem;
  border-radius: 0.55rem;
`;

const DeliveryTag = styled.div`
  font-size: 0.85rem;
  color: #15803d;
  font-weight: 700;
  background: #dcfce7;
  padding: 0.25rem 0.6rem;
  border-radius: 0.55rem;
`;

const OrderQuickLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  width: 100%;
  margin-top: 0.9rem;
  padding: 0.55rem 1rem;
  background: linear-gradient(135deg, #ff5a00 0%, #ea580c 100%);
  color: white;
  border-radius: 0.85rem;
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(234, 88, 12, 0.25);
  transform: translateZ(28px);
  transition: transform 140ms ease, box-shadow 140ms ease, filter 140ms ease;

  &:hover {
    filter: brightness(1.05);
    box-shadow: 0 6px 18px rgba(234, 88, 12, 0.35);
    transform: translateZ(32px) translateY(-1px);
  }

  &:active {
    transform: translateZ(28px) scale(0.98);
  }
`;

const FloatingBadge1 = styled.div`
  position: absolute;
  top: 1.25rem;
  right: -1.25rem;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(12px);
  padding: 0.75rem 1.15rem;
  border-radius: 1.15rem;
  box-shadow: 0 16px 32px -4px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.9) inset;
  border: 1px solid rgba(226, 232, 240, 0.85);
  display: flex;
  align-items: center;
  gap: 0.7rem;
  z-index: 4;
  font-size: 0.875rem;
  font-weight: 700;
  color: #1e293b;
  transform: translateZ(48px);
  animation: floatAmbient1 4.5s ease-in-out infinite;
  cursor: pointer;
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
  user-select: none;
  touch-action: manipulation;

  &:hover {
    transform: translateZ(58px) scale(1.06);
    box-shadow: 0 20px 36px -4px rgba(234, 88, 12, 0.2);
    border-color: rgba(234, 88, 12, 0.4);
  }

  &:active {
    transform: translateZ(48px) scale(0.96);
  }

  @keyframes floatAmbient1 {
    0%, 100% { transform: translateZ(48px) translateY(0); }
    50% { transform: translateZ(48px) translateY(-8px); }
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    right: 0.25rem;
  }
`;

const FloatingBadge2 = styled.div`
  position: absolute;
  bottom: 1.75rem;
  left: -1.25rem;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(12px);
  padding: 0.75rem 1.15rem;
  border-radius: 1.15rem;
  box-shadow: 0 16px 32px -4px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.9) inset;
  border: 1px solid rgba(226, 232, 240, 0.85);
  display: flex;
  align-items: center;
  gap: 0.7rem;
  z-index: 4;
  font-size: 0.875rem;
  font-weight: 700;
  color: #1e293b;
  transform: translateZ(44px);
  animation: floatAmbient2 5.2s ease-in-out infinite alternate;
  cursor: pointer;
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
  user-select: none;
  touch-action: manipulation;

  &:hover {
    transform: translateZ(54px) scale(1.06);
    box-shadow: 0 20px 36px -4px rgba(234, 88, 12, 0.2);
    border-color: rgba(234, 88, 12, 0.4);
  }

  &:active {
    transform: translateZ(44px) scale(0.96);
  }

  @keyframes floatAmbient2 {
    0% { transform: translateZ(44px) translateY(0); }
    100% { transform: translateZ(44px) translateY(-9px); }
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    left: 0.25rem;
  }
`;

const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDishIndex, setSelectedDishIndex] = useState(0);
  const [isPopping, setIsPopping] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isInteractive, setIsInteractive] = useState(false);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const activeDish = SHOWCASE_DISHES[selectedDishIndex];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!showcaseRef.current) return;
    const rect = showcaseRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setIsInteractive(true);
    setRotate({ x: Number(rotateX.toFixed(2)), y: Number(rotateY.toFixed(2)) });
    setGlare({ x: Number(glareX.toFixed(1)), y: Number(glareY.toFixed(1)), opacity: 0.2 });
  };

  const handleMouseLeave = () => {
    setIsInteractive(false);
    setRotate({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  const switchDish = (index: number) => {
    if (index === selectedDishIndex) return;
    setSelectedDishIndex(index);
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 320);
  };

  const cycleNextDish = () => {
    setSelectedDishIndex((prev) => (prev + 1) % SHOWCASE_DISHES.length);
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 320);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/restaurants');
    }
  };

  return (
    <HeroContainer>
      <ContentContainer>
        <Badge>
          <span>🔥</span> سریع‌ترین پلتفرم سفارش آنلاین غذا
        </Badge>
        
        <Title>
          سفارش آنلاین غذا از <span>بهترین رستوران‌ها</span>
        </Title>
        
        <Subtitle>
          غذای دلخواهت رو از برترین رستوران‌ها، فست‌فودها و کافه‌های شهر انتخاب کن و در کمترین زمان داغ و تازه تحویل بگیر!
        </Subtitle>
        
        <SearchContainer>
          <form onSubmit={handleSearch}>
            <SearchInputContainer>
              <SearchIcon>🔍</SearchIcon>
              <SearchInput
                type="text"
                placeholder="جستجوی نام رستوران، پیتزا، برگر..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchButton type="submit">جستجو</SearchButton>
            </SearchInputContainer>
          </form>
        </SearchContainer>
        
        <ActionButtons>
          <PrimaryButton href="/restaurants">مشاهده رستوران‌ها</PrimaryButton>
          <SecondaryButton href="/categories">دسته‌بندی‌های غذا</SecondaryButton>
        </ActionButtons>
      </ContentContainer>
      
      <VisualShowcase
        ref={showcaseRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <FloatingBadge1 onClick={cycleNextDish} title="کلیک برای غذای بعدی">
          <span style={{ fontSize: '1.25rem' }}>{activeDish.badge1Icon}</span>
          <div>
            <div>{activeDish.badge1Title}</div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a' }}>{activeDish.badge1Sub}</div>
          </div>
        </FloatingBadge1>

        <MainCard
          $rx={rotate.x}
          $ry={rotate.y}
          $isInteractive={isInteractive}
          onClick={cycleNextDish}
          title="کلیک برای تغییر غذا"
        >
          <CardGlareOverlay $x={glare.x} $y={glare.y} $opacity={glare.opacity} />

          <FoodCircleWrapper>
            <FoodIconCircle
              $bg={activeDish.circleGradient}
              $glow={activeDish.glowColor}
              $isPopping={isPopping}
            >
              {activeDish.emoji}
            </FoodIconCircle>
            <SparkleBadge aria-hidden="true">✨</SparkleBadge>
          </FoodCircleWrapper>

          <CardTitle>{activeDish.title}</CardTitle>
          <CardDesc>{activeDish.desc}</CardDesc>

          <DishSelectorBar onClick={(e) => e.stopPropagation()}>
            {SHOWCASE_DISHES.map((dish, index) => (
              <DishSelectorChip
                key={dish.id}
                type="button"
                $active={index === selectedDishIndex}
                $accent={dish.accentColor}
                onClick={() => switchDish(index)}
              >
                <span>{dish.emoji}</span>
                <span>{dish.label}</span>
              </DishSelectorChip>
            ))}
          </DishSelectorBar>

          <PriceRow>
            <RatingTag>
              <span>⭐</span>
              <span>{activeDish.rating}</span>
              <span style={{ opacity: 0.75, fontSize: '0.75rem', fontWeight: 500 }}>({activeDish.reviewsCount})</span>
            </RatingTag>
            <DeliveryTag>{activeDish.deliveryTag}</DeliveryTag>
          </PriceRow>

          <OrderQuickLink
            href={activeDish.link}
            onClick={(e) => e.stopPropagation()}
          >
            <span>سفارش از {activeDish.restaurant}</span>
            <span>←</span>
          </OrderQuickLink>
        </MainCard>

        <FloatingBadge2 onClick={cycleNextDish} title="کلیک برای غذای بعدی">
          <span style={{ fontSize: '1.25rem' }}>{activeDish.badge2Icon}</span>
          <div>
            <div>{activeDish.badge2Title}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{activeDish.badge2Sub}</div>
          </div>
        </FloatingBadge2>
      </VisualShowcase>
    </HeroContainer>
  );
};

export default HeroSection;
