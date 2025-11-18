"use client"

import { Button } from "@/components/ui/button"
import { Step } from "./useCheckout"

interface NavigationButtonsProps {
    step: Step
    isProcessing: boolean
    canGoNext: boolean
    total: number
    onBack: () => void
    onNext: () => void
}

export function NavigationButtons({
    step,
    isProcessing,
    canGoNext,
    total,
    onBack,
    onNext,
}: NavigationButtonsProps) {
    const isLastStep = step === 5

    return (
        <div className="flex justify-between pt-2">
            <Button
                className="cursor-pointer"
                variant="outline"
                disabled={step === 1}
                onClick={onBack}
            >
                Anterior
            </Button>

            <Button
                className="bg-primary hover:bg-primary/80 cursor-pointer"
                onClick={onNext}
                disabled={isProcessing || !canGoNext}
            >
                {isLastStep
                    ? isProcessing
                        ? "Procesando..."
                        : `Confirmar y pagar $${total.toFixed(2)}`
                    : "Siguiente"}
            </Button>
        </div>
    )
}
