import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding-right: 1rem;
  padding-left: 1rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding-right: 1.5rem;
    padding-left: 1.5rem;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding-right: 2rem;
    padding-left: 2rem;
  }
`;

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className = '' }) => {
  return (
    <StyledContainer className={className}>
      {children}
    </StyledContainer>
  );
};

export default Container; 
