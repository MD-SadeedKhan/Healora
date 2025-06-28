import React from 'react';

export const Card = ({ children, className }) => (
  <div className={`rounded-2xl border border-gray-200 bg-white p-4 shadow-md ${className || ''}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className }) => (
  <div className={`mb-2 border-b pb-2 ${className || ''}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className }) => (
  <h3 className={`text-lg font-semibold text-gray-800 ${className || ''}`}>
    {children}
  </h3>
);

export const CardContent = ({ children, className }) => (
  <div className={className || ''}>
    {children}
  </div>
);
