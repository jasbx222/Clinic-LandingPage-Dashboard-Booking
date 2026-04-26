import React from 'react';
import { cn } from './utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline' | 'secondary' | 'accent';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: "bg-primary-light/30 text-primary-dark",
    secondary: "bg-secondary-light/50 text-secondary",
    accent: "bg-accent-light/50 text-accent",
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-amber-50 text-amber-600",
    danger: "bg-red-50 text-red-500",
    outline: "text-text-primary border border-border bg-white shadow-sm",
  };

  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-lg px-3 py-1 text-[11px] font-black uppercase tracking-wider transition-all duration-300", 
        variants[variant], 
        className
      )} 
      {...props} 
    />
  );
}