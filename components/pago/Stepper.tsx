"use client"

import { Step } from "./useCheckout"

interface StepperProps {
  currentStep: Step
  labels: readonly string[]
}

export function Stepper({ currentStep, labels }: StepperProps) {
  const totalSteps = labels.length
  const progress =
    totalSteps > 1 ? ((currentStep - 1) / (totalSteps - 1)) * 100 : 0

  return (
    <div className="mb-6">
      {/* Línea de fondo */}
      <div className="relative flex items-center">
        <div className="absolute left-0 right-0 h-[3px] bg-border top-1/2 -translate-y-1/2" />
        <div
          className="absolute left-0 h-[3px] bg-primary top-1/2 -translate-y-1/2 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />

        <div className="flex justify-between w-full">
          {labels.map((label, idx) => {
            const num = (idx + 1) as Step
            const active = currentStep === num
            const completed = currentStep > num

            return (
              <div
                key={label}
                className="flex flex-col items-center flex-1"
              >
                <div
                  className={[
                    "flex items-center justify-center w-9 h-9 rounded-full border-2 text-xs sm:text-sm font-semibold z-[1] transition-colors duration-200",
                    active
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : completed
                        ? "bg-primary/10 text-primary border-primary/60"
                        : "bg-background text-muted-foreground border-border",
                  ].join(" ")}
                >
                  {num}
                </div>
                <span
                  className={[
                    "mt-2 text-[11px] sm:text-xs text-center",
                    active ? "font-semibold text-foreground" : "text-muted-foreground",
                    "hidden xs:block",
                  ].join(" ")}
                >
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
