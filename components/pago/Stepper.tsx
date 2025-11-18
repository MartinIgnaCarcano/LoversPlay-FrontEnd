"use client"

import { Step } from "./useCheckout"

interface StepperProps {
  currentStep: Step
  labels: readonly string[]
}

export function Stepper({ currentStep, labels }: StepperProps) {
  return (
    <div className="flex items-center justify-between mb-6 text-xs sm:text-sm">
      {labels.map((label, idx) => {
        const num = (idx + 1) as Step
        const active = currentStep === num
        const completed = currentStep > num
        return (
          <div key={label} className="flex-1 flex items-center">
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full border text-xs mr-2
                ${active
                  ? "bg-primary text-white border-primary"
                  : completed
                    ? "bg-primary/10 text-primary border-primary/50"
                    : "border-border text-muted-foreground"
                }`}
            >
              {num}
            </div>
            {/* Mobile: solo número importa; texto igual va pero chico */}
            <span className={active ? "font-medium" : "text-muted-foreground hidden sm:inline"}>
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
