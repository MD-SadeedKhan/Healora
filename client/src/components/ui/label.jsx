import React from 'react';

const Label = ({ className = '', children, ...props }) => {
  return (
    <label className={`block text-sm font-medium ${className}`} {...props}>
      {children}
    </label>
  );
};

export { Label };