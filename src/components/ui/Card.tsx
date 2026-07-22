import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md'
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 transition-colors duration-300 dark:bg-gray-900 dark:border-gray-800 ${paddingStyles[padding]} ${hover ? 'card-hover' : ''} ${className}`}>
      {children}
    </div>
  );
};