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
        <div className="mt-4 flex justify-between">
            <Button
                variant="outline"
                disabled={step === 1 || isProcessing}
                onClick={onBack}
                className="min-w-[96px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Anterior
            </Button>

            <Button
                className="min-w-[150px] cursor-pointer bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
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
