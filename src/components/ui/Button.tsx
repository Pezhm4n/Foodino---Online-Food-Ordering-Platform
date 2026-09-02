"use client";

import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';
import Link from 'next/link';

// تعریف تایپ‌های دکمه
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

// تعریف پراپ‌های کامپوننت دکمه
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  href?: string;
  children: ReactNode;
  isLoading?: boolean;
}

// استایل‌های مشترک برای همه انواع دکمه‌ها
const baseButtonStyles = css<{ $size: ButtonSize; $fullWidth: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${props => props.theme.typography.fontFamily};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.2s ease;
  cursor: pointer;
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  
  /* اندازه‌ها */
  ${props => {
    switch (props.$size) {
      case 'xs':
        return css`
          padding: 0.25rem 0.5rem;
          font-size: ${props.theme.typography.fontSizes.xs};
          min-height: 28px;
        `;
      case 'sm':
        return css`
          padding: 0.45rem 0.85rem;
          font-size: ${props.theme.typography.fontSizes.sm};
          min-height: 36px;
        `;
      case 'lg':
        return css`
          padding: 0.75rem 1.75rem;
          font-size: ${props.theme.typography.fontSizes.lg};
          min-height: 48px;

          @media (max-width: ${props.theme.breakpoints.sm}) {
            padding: 0.65rem 1.25rem;
            font-size: 1rem;
            min-height: 44px;
          }
        `;
      case 'md':
      default:
        return css`
          padding: 0.65rem 1.35rem;
          font-size: ${props.theme.typography.fontSizes.md};
          min-height: 42px;

          @media (max-width: ${props.theme.breakpoints.sm}) {
            padding: 0.55rem 1.1rem;
            font-size: 0.875rem;
            min-height: 38px;
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// استایل‌های خاص برای هر نوع دکمه
const variantStyles = {
  primary: css`
    background-color: ${props => props.theme.colors.primary[500]};
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      background-color: ${props => props.theme.colors.primary[400]};
    }
    
    &:active:not(:disabled) {
      transform: translateY(1px);
    }
  `,
  
  secondary: css`
    background-color: ${props => props.theme.colors.secondary[500]};
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      background-color: ${props => props.theme.colors.secondary[400]};
    }
    
    &:active:not(:disabled) {
      transform: translateY(1px);
    }
  `,
  
  outline: css`
    background-color: transparent;
    color: ${props => props.theme.colors.primary[500]};
    border: 1px solid ${props => props.theme.colors.primary[500]};
    
    &:hover:not(:disabled) {
      background-color: rgba(255, 90, 0, 0.05);
    }
    
    &:active:not(:disabled) {
      transform: translateY(1px);
    }
  `,
  
  ghost: css`
    background-color: transparent;
    color: ${props => props.theme.colors.neutral[700]};
    border: none;
    
    &:hover:not(:disabled) {
      background-color: ${props => props.theme.colors.neutral[100]};
    }
    
    &:active:not(:disabled) {
      transform: translateY(1px);
    }
  `,
  
  danger: css`
    background-color: ${props => props.theme.colors.error[500]};
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      background-color: ${props => props.theme.colors.error[400]};
    }
    
    &:active:not(:disabled) {
      transform: translateY(1px);
    }
  `,
};

// کامپوننت‌های استایل شده
const StyledButton = styled.button<{ $variant: ButtonVariant; $size: ButtonSize; $fullWidth: boolean }>`
  ${baseButtonStyles}
  ${props => variantStyles[props.$variant]}
  
  ${props => props.disabled && css`
    opacity: 0.6;
    cursor: not-allowed;
  `}
`;

const StyledLinkButton = styled(Link)<{ $variant: ButtonVariant; $size: ButtonSize; $fullWidth: boolean }>`
  ${baseButtonStyles}
  ${props => variantStyles[props.$variant]}
  text-decoration: none;
`;

const LoadingGlyph = styled.span`
  margin-left: 0.5rem;
`;

// کامپوننت اصلی Button
export const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  href,
  children,
  isLoading = false,
  ...props
}: ButtonProps) => {
  // افزودن نشانگر loading
  const content = isLoading ? (
    <>
      <LoadingGlyph aria-hidden="true">⟳</LoadingGlyph>
      {children}
    </>
  ) : children;
  
  // اگر href وجود داشته باشد، از Link استفاده می‌کنیم
  if (href) {
    return (
      <StyledLinkButton
        href={href}
        $variant={variant}
        $size={size}
        $fullWidth={fullWidth}
      >
        {content}
      </StyledLinkButton>
    );
  }
  
  // در غیر این صورت، از button استفاده می‌کنیم
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {content}
    </StyledButton>
  );
}; 
