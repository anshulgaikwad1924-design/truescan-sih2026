import React from 'react';
import { clsx, type ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ts-peach disabled:opacity-50 disabled:pointer-events-none active:scale-95';
    
    const variants = {
      primary: 'bg-ts-peach text-ts-text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_4px_var(--color-ts-shadow)] hover:brightness-105',
      secondary: 'bg-ts-mint text-ts-text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_4px_var(--color-ts-shadow)] hover:brightness-105',
      outline: 'border-2 border-ts-border bg-ts-ivory text-ts-text-primary hover:bg-ts-sage hover:border-ts-sage shadow-[0_1px_2px_var(--color-ts-shadow)]',
      ghost: 'bg-transparent text-ts-text-primary hover:bg-ts-sage/50',
    };
    
    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 py-2 text-sm',
      lg: 'h-12 px-8 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
