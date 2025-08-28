'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
}

const LoadingSpinner = ({ 
  size = 'md', 
  className = '', 
  color = 'primary',
  text 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    primary: 'border-gray-300 dark:border-gray-600 border-t-blue-600',
    secondary: 'border-gray-300 dark:border-gray-600 border-t-gray-600',
    white: 'border-gray-400 border-t-white'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <div 
        className={`animate-spin rounded-full border-2 ${colorClasses[color]} ${sizeClasses[size]}`}
        role="status"
        aria-label={text || 'Loading'}
      >
        <span className="sr-only">{text || 'Loading...'}</span>
      </div>
      {text && (
        <p className={`text-gray-600 dark:text-gray-400 font-medium ${textSizeClasses[size]} animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
