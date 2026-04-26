const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, 'src', 'components', 'ui');
fs.mkdirSync(uiDir, { recursive: true });

const files = {
  'utils.ts': `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`,

  'Button.tsx': `import React from 'react';
import { cn } from './utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-3xl font-medium transition-all focus:outline-none active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
      primary: "bg-primary text-white hover:bg-primary-dark shadow-soft hover:shadow-md",
      secondary: "bg-lavender text-primary-dark hover:bg-lavender/80",
      outline: "border-2 border-primary text-primary hover:bg-primary/10",
      ghost: "hover:bg-primary/10 text-primary-dark",
      danger: "bg-red-500 text-white hover:bg-red-600 shadow-soft",
    };
    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-6 text-base",
      lg: "h-14 px-8 text-lg",
    };
    return (
      <button ref={ref} className={cn(baseStyles, variants[variant], sizes[size], className)} disabled={isLoading || props.disabled} {...props}>
        {isLoading && <span className="mr-2 inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';`,

  'Card.tsx': `import React from 'react';
import { cn } from './utils';

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("bg-card rounded-3xl shadow-soft border border-border/50 overflow-hidden", className)} {...props} />
));
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-xl font-bold leading-none tracking-tight text-text", className)} {...props} />
));
CardTitle.displayName = "CardTitle";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";`,

  'Input.tsx': `import React from 'react';
import { cn } from './utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && <label className="text-sm font-medium text-text">{label}</label>}
        <input
          className={cn(
            "flex h-12 w-full rounded-2xl border border-border bg-white px-4 py-2 text-sm ring-offset-bg file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm hover:border-primary/50",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';`,

  'Select.tsx': `import React from 'react';
import { cn } from './utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, label, options, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && <label className="text-sm font-medium text-text">{label}</label>}
        <select
          className={cn(
            "flex h-12 w-full rounded-2xl border border-border bg-white px-4 py-2 text-sm ring-offset-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm hover:border-primary/50 appearance-none",
            error && "border-red-500 focus-visible:ring-red-500",
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
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';`,

  'Textarea.tsx': `import React from 'react';
import { cn } from './utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && <label className="text-sm font-medium text-text">{label}</label>}
        <textarea
          className={cn(
            "flex min-h-[100px] w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm ring-offset-bg placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm hover:border-primary/50 resize-y",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';`,

  'Badge.tsx': `import React from 'react';
import { cn } from './utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: "bg-lavender text-primary-dark",
    success: "bg-mint text-emerald-800",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-red-100 text-red-800",
    outline: "text-text border border-border",
  };
  return (
    <div className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors", variants[variant], className)} {...props} />
  );
}`,

  'LoadingSkeleton.tsx': `import React from 'react';
import { cn } from './utils';

export function LoadingSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("animate-pulse rounded-2xl bg-muted/20", className)} {...props} />
  );
}`,

  'EmptyState.tsx': `import React from 'react';
import { cn } from './utils';
import { Inbox } from 'lucide-react';

export function EmptyState({ title, description, icon, action, className }: { title: string; description?: string; icon?: React.ReactNode; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center bg-white/50 rounded-3xl border border-dashed border-border", className)}>
      <div className="mb-4 text-primary bg-lavender p-4 rounded-full">
        {icon || <Inbox size={32} />}
      </div>
      <h3 className="text-xl font-semibold text-text mb-2">{title}</h3>
      {description && <p className="text-muted max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  );
}`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(uiDir, filename), content);
}
console.log('UI components created successfully!');
