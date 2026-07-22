import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500 dark:bg-primary-600 dark:hover:bg-primary-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-500',
    success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500 dark:bg-green-600 dark:hover:bg-green-500',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-400 dark:text-gray-200 dark:hover:bg-gray-800'
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin" size={size === 'sm' ? 16 : 20} />}
      {children}
    </button>
  );
};