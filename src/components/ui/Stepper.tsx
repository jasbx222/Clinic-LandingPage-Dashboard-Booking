import { cn } from "./utils";
import { Check } from "lucide-react";

interface Step {
  id: number;
  title: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="relative flex flex-col items-center flex-1">
              <div
                className={cn(
                  "z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white transition-colors duration-300",
                  isCompleted
                    ? "border-primary bg-primary text-white"
                    : isCurrent
                    ? "border-primary text-primary"
                    : "border-border text-muted"
                )}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : <span>{step.id}</span>}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs md:text-sm font-medium text-center",
                  isCurrent || isCompleted ? "text-text" : "text-muted"
                )}
              >
                {step.title}
              </span>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-5 left-1/2 w-full h-[2px] -translate-y-1/2 rtl:translate-x-1/2 rtl:left-auto rtl:right-1/2",
                    isCompleted ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
