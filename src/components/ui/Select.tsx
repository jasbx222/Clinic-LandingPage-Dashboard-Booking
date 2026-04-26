import React from 'react';
import { cn } from './utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  icon?: React.ReactNode;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, label, icon, options, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-2">
        {label && <label className="text-xs font-black text-text-muted uppercase tracking-widest px-2">{label}</label>}
        <div className="relative group">
          {icon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors pointer-events-none">
              {icon}
            </div>
          )}
          <select
            className={cn(
              "flex h-14 w-full rounded-[1.25rem] border border-border/60 bg-white py-2 text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 shadow-soft hover:border-primary/40 appearance-none",
              icon ? "pr-12 pl-10" : "pr-6 pl-10",
              error && "border-red-500 focus-visible:ring-red-100",
              className
            )}
            ref={ref}
            {...props}
          >
            <option value="" disabled>اختر...</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
        {error && <p className="text-[11px] text-red-500 mt-0.5 font-black uppercase tracking-wider">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';