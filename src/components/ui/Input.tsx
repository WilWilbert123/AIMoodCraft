import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-200">
          {label}
        </label>
      )}
      <input
        className={`px-4 py-2 rounded-lg border bg-white text-gray-900 placeholder-gray-400 ${error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 dark:placeholder-gray-500 ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};