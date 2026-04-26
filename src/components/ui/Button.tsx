import React from 'react';
import { cn } from './utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-bold transition-all duration-300 focus:outline-none active:scale-95 disabled:opacity-50 disabled:pointer-events-none tracking-tight";
    
    const variants = {
      primary: "bg-primary text-white hover:bg-primary-dark shadow-soft hover:shadow-hover",
      secondary: "bg-secondary-light text-secondary hover:bg-secondary-light/80 shadow-sm",
      outline: "border-2 border-border text-text-primary hover:border-primary hover:text-primary bg-white",
      ghost: "hover:bg-primary-light/30 text-primary hover:text-primary-dark",
      danger: "bg-red-500 text-white hover:bg-red-600 shadow-soft",
      gradient: "gradient-pink-blue text-white shadow-soft hover:shadow-hover hover:scale-[1.02]",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs",
      md: "h-12 px-6 text-sm",
      lg: "h-14 px-8 text-base",
    };

    return (
      <button 
        ref={ref} 
        className={cn(baseStyles, variants[variant === 'primary' ? 'gradient' : variant], sizes[size], className)} 
        disabled={isLoading || props.disabled} 
        {...props}
      >
        {isLoading && <span className="ml-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';