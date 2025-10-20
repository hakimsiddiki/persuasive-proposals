import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressTrackerProps {
  currentStep: number;
}

const steps = [
  { id: 1, name: "Project Details", emoji: "📋" },
  { id: 2, name: "Generate Proposal", emoji: "✨" },
  { id: 3, name: "Review & Export", emoji: "🎉" },
];

const ProgressTracker = ({ currentStep }: ProgressTrackerProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-smooth",
                  currentStep > step.id
                    ? "bg-success text-success-foreground shadow-soft"
                    : currentStep === step.id
                    ? "bg-primary text-primary-foreground shadow-glow scale-110"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {currentStep > step.id ? (
                  <Check className="h-6 w-6" />
                ) : (
                  <span>{step.emoji}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <div
                  className={cn(
                    "text-sm font-medium transition-smooth",
                    currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.name}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-4 rounded-full bg-muted relative overflow-hidden">
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-hero transition-smooth duration-500",
                    currentStep > step.id ? "w-full" : "w-0"
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;
