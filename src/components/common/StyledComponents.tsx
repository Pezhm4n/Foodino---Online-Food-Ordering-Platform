import styled, { css } from 'styled-components';
import Link from 'next/link';

// کامپوننت‌های دکمه رادیویی
export const RadioOption = styled.div`
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
`;

export const RadioInput = styled.input`
  position: absolute;
  opacity: 0;
  
  &:checked + label::before {
    background-color: ${props => props.theme.colors.primary[500]};
    border-color: ${props => props.theme.colors.primary[500]};
  }
  
  &:checked + label::after {
    transform: scale(1);
  }
`;

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSizes.md};
  position: relative;
  padding-right: 2rem;
  
  &::before {
    content: '';
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid ${props => props.theme.colors.gray[300]};
    border-radius: 50%;
    margin-left: 0.75rem;
    transition: all 0.2s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    right: 0.5rem;
    width: 0.75rem;
    height: 0.75rem;
    background: white;
    border-radius: 50%;
    transform: scale(0);
    transition: transform 0.2s ease;
  }
`;

// کامپوننت‌های مراحل
export const StepperContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 2rem 0;
`;

export const StepContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 1rem;
`;

export const StepItem = styled.div<{ $active?: boolean; $completed?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
  
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    width: calc(100% - 3rem);
    height: 2px;
    top: 1.5rem;
    right: calc(50% + 1.5rem);
    background-color: ${props => 
      props.$completed 
        ? props.theme.colors.primary[500] 
        : props.theme.colors.gray[300]
    };
    transition: background-color 0.3s ease;
  }
`;

export const StepNumber = styled.div<{ $active?: boolean; $completed?: boolean }>`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.typography.fontSizes.lg};
  margin-bottom: 0.5rem;
  z-index: 1;
  transition: all 0.3s ease;
  
  background-color: ${props => {
    if (props.$completed) return props.theme.colors.primary[500];
    if (props.$active) return props.theme.colors.primary[100];
    return props.theme.colors.gray[100];
  }};
  
  color: ${props => {
    if (props.$completed) return '#fff';
    if (props.$active) return props.theme.colors.primary[700];
    return props.theme.colors.gray[700];
  }};
  
  border: 2px solid ${props => {
    if (props.$completed) return props.theme.colors.primary[500];
    if (props.$active) return props.theme.colors.primary[500];
    return props.theme.colors.gray[300];
  }};
`;

export const StepLabel = styled.div<{ $active?: boolean; $completed?: boolean }>`
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-weight: ${props => props.$active || props.$completed ? 600 : 400};
  color: ${props => {
    if (props.$active || props.$completed) return props.theme.colors.primary[700];
    return props.theme.colors.gray[600];
  }};
  text-align: center;
`;

export const StepContent = styled.div`
  width: 100%;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-top: 1rem;
`;

// کامپوننت‌های فرم
export const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.md};
  transition: border-color 0.3s, box-shadow 0.3s;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary[100]};
  }
`;

export const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.md};
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.3s, box-shadow 0.3s;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary[100]};
  }
`;

// کامپوننت‌های دکمه
type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger';

const buttonStyles = css<{ $variant?: ButtonVariant; $fullWidth?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 500;
  font-size: ${props => props.theme.typography.fontSizes.md};
  cursor: pointer;
  transition: all 0.2s ease;
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  
  ${props => {
    switch (props.$variant) {
      case 'secondary':
        return css`
          background-color: transparent;
          color: ${props.theme.colors.primary[700]};
          border: 1px solid ${props.theme.colors.primary[500]};
          
          &:hover {
            background-color: ${props.theme.colors.primary[50]};
          }
          
          &:active {
            background-color: ${props.theme.colors.primary[100]};
          }
        `;
      case 'success':
        return css`
          background-color: ${props.theme.colors.success[500]};
          color: white;
          border: none;
          
          &:hover {
            background-color: ${props.theme.colors.success[600]};
          }
          
          &:active {
            background-color: ${props.theme.colors.success[700]};
          }
        `;
      case 'danger':
        return css`
          background-color: ${props.theme.colors.error[500]};
          color: white;
          border: none;
          
          &:hover {
            background-color: ${props.theme.colors.error[600]};
          }
          
          &:active {
            background-color: ${props.theme.colors.error[700]};
          }
        `;
      case 'primary':
      default:
        return css`
          background-color: ${props.theme.colors.primary[500]};
          color: white;
          border: none;
          
          &:hover {
            background-color: ${props.theme.colors.primary[600]};
          }
          
          &:active {
            background-color: ${props.theme.colors.primary[700]};
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

export const Button = styled.button<{ $variant?: ButtonVariant; $fullWidth?: boolean }>`
  ${buttonStyles}
`;

export const LinkButton = styled(Link)<{ $variant?: ButtonVariant; $fullWidth?: boolean }>`
  ${buttonStyles}
  text-decoration: none;
`;

// کامپوننت‌های عمومی
export const Card = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.boxShadow.md};
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

export default {
  RadioOption,
  RadioInput,
  RadioLabel,
  StepperContainer,
  StepContainer,
  StepItem,
  StepNumber,
  StepLabel,
  StepContent,
  FormInput,
  FormTextarea,
  Button,
  LinkButton,
  Card
}; 