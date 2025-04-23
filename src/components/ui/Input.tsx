"use client";

import React, { InputHTMLAttributes, forwardRef } from 'react';
import styled, { css } from 'styled-components';

// تعریف تایپ‌ها
type InputVariant = 'default' | 'outlined' | 'filled';
type InputSize = 'sm' | 'md' | 'lg';

// تعریف پراپ‌های کامپوننت با حذف تداخل size
type InputPropsWithoutSize = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>;

interface InputProps extends InputPropsWithoutSize {
  variant?: InputVariant;
  inputSize?: InputSize; // تغییر نام به inputSize برای جلوگیری از تداخل
  fullWidth?: boolean;
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

// استایل‌های پایه
const baseInputStyles = css<{
  $variant: InputVariant;
  $size: InputSize;
  $fullWidth: boolean;
  $hasIcon: boolean;
  $iconPosition: 'left' | 'right';
  $hasError: boolean;
}>`
  font-family: ${props => props.theme.typography.fontFamily};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.2s ease;
  outline: none;
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  padding-${props => props.$iconPosition}: ${props => props.$hasIcon ? '2.5rem' : '1rem'};
  padding-${props => props.$iconPosition === 'left' ? 'right' : 'left'}: 1rem;
  
  ${props => {
    switch (props.$size) {
      case 'sm':
        return css`
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          font-size: ${props.theme.typography.fontSizes.sm};
        `;
      case 'lg':
        return css`
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;
          font-size: ${props.theme.typography.fontSizes.lg};
        `;
      case 'md':
      default:
        return css`
          padding-top: 0.625rem;
          padding-bottom: 0.625rem;
          font-size: ${props.theme.typography.fontSizes.md};
        `;
    }
  }}
  
  ${props => {
    switch (props.$variant) {
      case 'outlined':
        return css`
          border: 1px solid ${props.$hasError
            ? props.theme.colors.error[500]
            : props.theme.colors.neutral[300]};
          background-color: transparent;
          
          &:focus {
            border-color: ${props.$hasError
              ? props.theme.colors.error[500]
              : props.theme.colors.primary[500]};
            box-shadow: 0 0 0 3px ${props.$hasError
              ? 'rgba(244, 67, 54, 0.1)'
              : 'rgba(255, 90, 0, 0.1)'};
          }
        `;
      case 'filled':
        return css`
          border: 1px solid transparent;
          background-color: ${props.$hasError
            ? props.theme.colors.error[100]
            : props.theme.colors.neutral[100]};
          
          &:focus {
            background-color: ${props.$hasError
              ? props.theme.colors.error[50]
              : 'white'};
            border-color: ${props.$hasError
              ? props.theme.colors.error[500]
              : props.theme.colors.primary[500]};
            box-shadow: 0 0 0 3px ${props.$hasError
              ? 'rgba(244, 67, 54, 0.1)'
              : 'rgba(255, 90, 0, 0.1)'};
          }
        `;
      case 'default':
      default:
        return css`
          border: 1px solid ${props.$hasError
            ? props.theme.colors.error[500]
            : props.theme.colors.neutral[300]};
          background-color: white;
          
          &:focus {
            border-color: ${props.$hasError
              ? props.theme.colors.error[500]
              : props.theme.colors.primary[500]};
            box-shadow: 0 0 0 3px ${props.$hasError
              ? 'rgba(244, 67, 54, 0.1)'
              : 'rgba(255, 90, 0, 0.1)'};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: ${props => props.theme.colors.neutral[200]};
  }
`;

// کامپوننت‌های استایل شده
const InputContainer = styled.div<{ $fullWidth: boolean }>`
  position: relative;
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  margin-bottom: ${props => props.theme.spacing[4]};
`;

const StyledInput = styled.input<{
  $variant: InputVariant;
  $size: InputSize;
  $fullWidth: boolean;
  $hasIcon: boolean;
  $iconPosition: 'left' | 'right';
  $hasError: boolean;
}>`
  ${baseInputStyles}
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.neutral[700]};
  font-size: ${props => props.theme.typography.fontSizes.sm};
`;

const ErrorMessage = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  color: ${props => props.theme.colors.error[500]};
  margin-top: 0.25rem;
`;

const IconWrapper = styled.span<{ $position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${props => props.$position === 'right' ? 'right: 0.75rem;' : 'left: 0.75rem;'}
  transform: translateY(-50%);
  color: ${props => props.theme.colors.neutral[500]};
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${props => props.$position === 'right' && `
    top: calc(50% - 0.25rem); // Adjusting for label height
  `}
`;

// کامپوننت Input با استفاده از forwardRef برای دسترسی به ref
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      inputSize = 'md',
      fullWidth = false,
      label,
      error,
      icon,
      iconPosition = 'right',
      className,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    const hasIcon = !!icon;

    return (
      <InputContainer $fullWidth={fullWidth} className={className}>
        {label && <Label htmlFor={props.id}>{label}</Label>}
        
        <div style={{ position: 'relative' }}>
          <StyledInput
            $variant={variant}
            $size={inputSize}
            $fullWidth={fullWidth}
            $hasIcon={hasIcon}
            $iconPosition={iconPosition}
            $hasError={hasError}
            ref={ref}
            {...props}
          />
          
          {hasIcon && (
            <IconWrapper $position={iconPosition}>
              {icon}
            </IconWrapper>
          )}
        </div>
        
        {hasError && <ErrorMessage>{error}</ErrorMessage>}
      </InputContainer>
    );
  }
);

// اضافه کردن displayName
Input.displayName = 'Input'; 