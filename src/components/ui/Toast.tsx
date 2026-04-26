import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "./utils";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const icons = {
  success: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
};

const bgColors = {
  success: "bg-green-50 border-green-200",
  error: "bg-red-50 border-red-200",
  warning: "bg-yellow-50 border-yellow-200",
  info: "bg-blue-50 border-blue-200",
};

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full max-w-md rounded-xl border p-4 shadow-lg transition-all",
        bgColors[type]
      )}
    >
      <div className="flex w-full items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          {message && <p className="mt-1 text-sm text-gray-600">{message}</p>}
        </div>
        <button
          onClick={() => onClose(id)}
          className="flex-shrink-0 rounded-md p-1 text-gray-400 hover:bg-black/5 hover:text-gray-900 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
