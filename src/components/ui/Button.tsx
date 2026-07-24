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
  const baseStyles = 'inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  const variantStyles = {
    primary: 'border border-black/10 bg-white text-neutral-950 shadow-[0_14px_30px_-14px_rgba(0,0,0,0.22)] hover:bg-neutral-100 focus:ring-black dark:border-white/10 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-800 dark:focus:ring-white',
    secondary: 'bg-slate-900/90 text-white hover:bg-slate-800 focus:ring-slate-400 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-500',
    success: 'bg-emerald-500 hover:bg-emerald-600 text-white focus:ring-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-500 dark:bg-amber-600 dark:hover:bg-amber-500',
    ghost: 'bg-white/70 text-slate-700 hover:bg-white/90 focus:ring-slate-400 dark:bg-slate-900/50 dark:text-slate-200 dark:hover:bg-slate-800/70'
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
