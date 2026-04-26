import React from 'react';
import { cn } from './utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, icon, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-2">
        {label && <label className="text-xs font-black text-text-muted uppercase tracking-widest px-2">{label}</label>}
        <div className="relative group">
          {icon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
              {icon}
            </div>
          )}
          <input
            className={cn(
              "flex h-14 w-full rounded-[1.25rem] border border-border/60 bg-white py-2 text-sm transition-all duration-300 placeholder:text-text-muted/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 shadow-soft hover:border-primary/40",
              icon ? "pr-12 pl-6" : "px-6",
              error && "border-red-500 focus-visible:ring-red-100 focus-visible:border-red-500",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && <p className="text-[11px] text-red-500 mt-0.5 font-black uppercase tracking-wider">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';