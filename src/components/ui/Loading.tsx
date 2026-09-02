import React from 'react';
import styled, { keyframes } from 'styled-components';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const spin = keyframes`to { transform: rotate(360deg); }`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
`;

const Spinner = styled.div<{ $size: LoadingProps['size'] }>`
  width: ${({ $size }) => $size === 'small' ? '1rem' : $size === 'large' ? '3rem' : '2rem'};
  height: ${({ $size }) => $size === 'small' ? '1rem' : $size === 'large' ? '3rem' : '2rem'};
  border: 4px solid ${({ theme }) => theme.colors.neutral[200]};
  border-top-color: ${({ theme }) => theme.colors.primary[500]};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const ScreenReaderText = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const Loading: React.FC<LoadingProps> = ({ size = 'medium', className }) => {
  return (
    <LoadingContainer className={className} role="status">
      <Spinner $size={size} />
      <ScreenReaderText>بارگذاری...</ScreenReaderText>
    </LoadingContainer>
  );
};

export default Loading; 
