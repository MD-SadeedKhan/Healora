import React from 'react';

export const Badge = ({ children, className, variant = 'default' }) => {
  const baseStyles = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium';
  const variants = {
    default: 'bg-gray-200 text-gray-800',
    outline: 'border border-gray-300 text-gray-700 bg-white',
  };

  return (
    <span className={`${baseStyles} ${variants[variant] || ''} ${className || ''}`}>
      {children}
    </span>
  );
};
