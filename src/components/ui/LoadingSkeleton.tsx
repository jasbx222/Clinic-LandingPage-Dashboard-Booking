import React from 'react';
import { cn } from './utils';

export function LoadingSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("animate-pulse rounded-2xl bg-muted/20", className)} {...props} />
  );
}