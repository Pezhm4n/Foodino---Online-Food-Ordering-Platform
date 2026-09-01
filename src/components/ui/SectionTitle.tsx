import React, { ReactNode } from 'react';
import styled from 'styled-components';

const Heading = styled.h2`
  color: ${({ theme }) => theme.colors.neutral[900]};
  font-size: 1.5rem;
  font-weight: 700;
`;

interface SectionTitleProps {
  title?: string;
  children?: ReactNode;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ 
  title, 
  children, 
  className = '' 
}) => {
  return (
    <Heading className={className}>
      {title || children}
    </Heading>
  );
};

export default SectionTitle; 
