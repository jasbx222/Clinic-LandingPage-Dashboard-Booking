import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";
import { cn } from "./utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "حدث خطأ ما",
  message = "عذراً، لم نتمكن من إتمام طلبك. يرجى المحاولة مرة أخرى.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50/50 p-8 text-center", className)}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h3 className="mb-2 text-lg font-bold text-gray-900">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-gray-600">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="border-red-200 text-red-600 hover:bg-red-50">
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
}
