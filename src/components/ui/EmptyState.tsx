import React from 'react';
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
}