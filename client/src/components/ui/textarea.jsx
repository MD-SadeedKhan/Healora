// src/components/ui/textarea.jsx
import React from "react";
export const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-healora-primary ${className}`}
    {...props}
  />
);
