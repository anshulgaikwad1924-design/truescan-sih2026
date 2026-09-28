import React from 'react';
import { clsx, type ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-ts-sage text-ts-text-primary border-ts-border',
    success: 'bg-ts-mint text-[#204a35] border-[#9fbcae]',
    warning: 'bg-[#fcf3d9] text-[#7a641c] border-[#e8dcb8]',
    danger: 'bg-[#fcdede] text-[#8a2b2b] border-[#e8c3c3]',
    info: 'bg-[#e2f1f8] text-[#2a5b75] border-[#c0dce8]',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ts-mint focus:ring-offset-2',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
