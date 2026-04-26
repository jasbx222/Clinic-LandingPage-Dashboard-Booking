import type { ReactNode } from "react";
import { cn } from "./utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center", className)}>
      <div>
        <h1 className="text-2xl font-bold text-text">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}
