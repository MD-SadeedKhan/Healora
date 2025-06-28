// src/components/ui/dialog.jsx
import * as DialogPrimitive from "@radix-ui/react-dialog";
import React from "react";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;

export const DialogOverlay = ({ className = "", ...props }) => (
  <DialogPrimitive.Overlay
    className={`fixed inset-0 bg-black/50 backdrop-blur-sm ${className}`}
    {...props}
  />
);

export const DialogContent = ({ className = "", children, ...props }) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      className={`fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg ${className}`}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
);

export const DialogHeader = ({ children }) => (
  <div className="mb-4">{children}</div>
);

export const DialogTitle = ({ className = "", children }) => (
  <DialogPrimitive.Title className={`text-lg font-semibold ${className}`}>
    {children}
  </DialogPrimitive.Title>
);
