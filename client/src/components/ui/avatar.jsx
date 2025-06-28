import React from "react";

export function Avatar({ children, className }) {
  return (
    <div className={`rounded-full bg-gray-200 w-10 h-10 flex items-center justify-center ${className}`}>
      {children}
    </div>
  );
}

export function AvatarFallback({ children }) {
  return <span className="text-sm font-medium text-gray-700">{children}</span>;
}
