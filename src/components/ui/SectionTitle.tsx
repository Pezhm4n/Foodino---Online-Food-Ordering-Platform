import React, { ReactNode } from 'react';

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
    <h2 className={`text-2xl font-bold text-gray-900 ${className}`}>
      {title || children}
    </h2>
  );
};

export default SectionTitle; 