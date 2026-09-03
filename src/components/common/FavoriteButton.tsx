'use client';

import React, { useState, useTransition } from 'react';
import styled, { css } from 'styled-components';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { toggleFavoriteAction } from '@/app/profile/actions';

export interface FavoriteButtonProps {
  restaurantId: string;
  restaurantName: string;
  initialIsFavorite?: boolean;
  variant?: 'icon' | 'button' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const popAnimation = css`
  @keyframes heartPop {
    0% { transform: scale(0.94); }
    40% { transform: scale(1.14); }
    100% { transform: scale(1); }
  }
`;

const IconButton = styled.button<{ $isFavorite: boolean; $size: 'sm' | 'md' | 'lg' }>`
  ${popAnimation}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  outline: none;
  transition: transform 120ms cubic-bezier(0.2, 0, 0, 1),
    background-color 160ms cubic-bezier(0.2, 0, 0, 1),
    border-color 160ms cubic-bezier(0.2, 0, 0, 1),
    color 160ms cubic-bezier(0.2, 0, 0, 1),
    box-shadow 160ms cubic-bezier(0.2, 0, 0, 1);
  flex-shrink: 0;
  user-select: none;
  touch-action: manipulation;

  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return css`
          width: 32px;
          height: 32px;
          font-size: 0.95rem;
        `;
      case 'lg':
        return css`
          width: 44px;
          height: 44px;
          font-size: 1.25rem;
        `;
      default:
        return css`
          width: 38px;
          height: 38px;
          font-size: 1.1rem;
        `;
    }
  }}

  ${({ $isFavorite }) =>
    $isFavorite
      ? css`
          background-color: #fff1f2;
          border: 1.5px solid #fecdd3;
          color: #e11d48;
          box-shadow: 0 2px 8px rgba(225, 29, 72, 0.18);
          animation: heartPop 0.22s cubic-bezier(0.16, 1, 0.3, 1);

          &:hover {
            background-color: #ffe4e6;
            border-color: #fda4af;
            transform: scale(1.06);
          }
        `
      : css`
          background-color: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(4px);
          border: 1.5px solid rgba(226, 232, 240, 0.9);
          color: #64748b;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);

          &:hover {
            background-color: white;
            border-color: #cbd5e1;
            color: #e11d48;
            transform: scale(1.06);
          }
        `}

  &:active {
    transform: scale(0.92);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
  }
`;

const FullButton = styled.button<{ $isFavorite: boolean; $size: 'sm' | 'md' | 'lg' }>`
  ${popAnimation}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-family: var(--font-vazirmatn);
  font-weight: 700;
  cursor: pointer;
  outline: none;
  transition: transform 120ms cubic-bezier(0.2, 0, 0, 1),
    background-color 160ms cubic-bezier(0.2, 0, 0, 1),
    border-color 160ms cubic-bezier(0.2, 0, 0, 1),
    color 160ms cubic-bezier(0.2, 0, 0, 1),
    box-shadow 160ms cubic-bezier(0.2, 0, 0, 1);
  min-height: 44px;
  user-select: none;
  touch-action: manipulation;

  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return css`
          padding: 0.45rem 0.9rem;
          font-size: 0.85rem;
        `;
      case 'lg':
        return css`
          padding: 0.75rem 1.6rem;
          font-size: 1rem;
        `;
      default:
        return css`
          padding: 0.6rem 1.25rem;
          font-size: 0.9rem;
        `;
    }
  }}

  ${({ $isFavorite }) =>
    $isFavorite
      ? css`
          background-color: #fff1f2;
          border: 1.5px solid #fecdd3;
          color: #e11d48;
          box-shadow: 0 2px 8px rgba(225, 29, 72, 0.15);
          animation: heartPop 0.22s cubic-bezier(0.16, 1, 0.3, 1);

          &:hover {
            background-color: #ffe4e6;
            border-color: #fda4af;
          }
        `
      : css`
          background-color: white;
          border: 1.5px solid #e2e8f0;
          color: #334155;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);

          &:hover {
            background-color: #f8fafc;
            border-color: #cbd5e1;
            color: #0f172a;
          }
        `}

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

export default function FavoriteButton({
  restaurantId,
  restaurantName,
  initialIsFavorite = false,
  variant = 'icon',
  size = 'md',
  className,
}: Readonly<FavoriteButtonProps>) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const previousState = isFavorite;
    const nextState = !previousState;
    setIsFavorite(nextState);

    startTransition(async () => {
      try {
        const result = await toggleFavoriteAction(restaurantId);
        setIsFavorite(result.isFavorite);
        if (result.isFavorite) {
          toast.success(`«${restaurantName}» به علاقه‌مندی‌ها افزوده شد.`, { icon: '❤️' });
        } else {
          toast.success(`«${restaurantName}» از علاقه‌مندی‌ها حذف شد.`, { icon: '🗑️' });
        }
      } catch (error) {
        setIsFavorite(previousState);
        const errMsg = error instanceof Error ? error.message : '';
        if (errMsg.includes('AUTHENTICATION_REQUIRED')) {
          toast.error('برای نشان کردن رستوران لطفاً ابتدا وارد حساب کاربری خود شوید.', { icon: '🔒' });
          if (typeof window !== 'undefined') {
            router.push(`/auth?next=${encodeURIComponent(window.location.pathname)}`);
          }
        } else {
          toast.error('خطا در ثبت علاقه‌مندی، لطفاً دوباره تلاش کنید.');
        }
      }
    });
  };

  const HeartSvg = (
    <svg
      width={size === 'sm' ? '15' : size === 'lg' ? '20' : '17'}
      height={size === 'sm' ? '15' : size === 'lg' ? '20' : '17'}
      viewBox="0 0 24 24"
      fill={isFavorite ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );

  if (variant === 'button') {
    return (
      <FullButton
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        $isFavorite={isFavorite}
        $size={size}
        className={className}
        aria-label={isFavorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
        aria-pressed={isFavorite}
      >
        {HeartSvg}
        <span>{isFavorite ? 'نشان‌شده در علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}</span>
      </FullButton>
    );
  }

  return (
    <IconButton
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      $isFavorite={isFavorite}
      $size={size}
      className={className}
      aria-label={isFavorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
      aria-pressed={isFavorite}
      title={isFavorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
    >
      {HeartSvg}
    </IconButton>
  );
}
