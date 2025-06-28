// src/components/ui/alert.jsx
import React from "react";

export const Alert = ({ className = "", children }) => (
  <div className={`p-4 border rounded-lg ${className}`}>
    {children}
  </div>
);

export const AlertDescription = ({ className = "", children }) => (
  <p className={`text-sm ${className}`}>{children}</p>
);
