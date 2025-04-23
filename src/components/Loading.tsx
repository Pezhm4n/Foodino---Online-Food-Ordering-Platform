import React from 'react';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'medium', 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };
  
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-solid border-gray-200 border-t-primary-500`} role="status">
        <span className="sr-only">بارگذاری...</span>
      </div>
    </div>
  );
};

export default Loading; 