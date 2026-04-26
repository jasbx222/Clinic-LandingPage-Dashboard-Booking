import type { ReactNode } from "react";
import { cn } from "./utils";
import { Card } from "./Card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("flex flex-col p-6", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted">{title}</h3>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      <div className="mt-4 flex items-baseline gap-4">
        <span className="text-3xl font-bold text-text">{value}</span>
        {trend && (
          <span
            className={cn(
              "text-sm font-medium",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}
          >
            {trend.isPositive ? "+" : ""}
            {trend.value}%
          </span>
        )}
      </div>
    </Card>
  );
}
