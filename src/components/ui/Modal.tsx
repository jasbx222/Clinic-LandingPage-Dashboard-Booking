import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "./utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />
      <div 
        className={cn(
          "relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl transition-all",
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
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
