import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "./utils";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  side?: "left" | "right";
  className?: string;
}

export function Drawer({ isOpen, onClose, title, children, side = "right", className }: DrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex bg-black/40 backdrop-blur-sm">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />
      <div 
        className={cn(
          "relative z-10 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform",
          side === "left" ? "mr-auto" : "ml-auto",
          className
        )}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          {title && <h2 className="text-lg font-bold text-text">{title}</h2>}
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted hover:bg-bg hover:text-text transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}
