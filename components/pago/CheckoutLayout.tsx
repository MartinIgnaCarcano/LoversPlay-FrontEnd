"use client"

import { ReactNode } from "react"

interface CheckoutLayoutProps {
  stepContent: ReactNode
  summary: ReactNode | null
}

export function CheckoutLayout({ stepContent, summary }: CheckoutLayoutProps) {
  // Solo Step 5 tiene summary, entonces armamos layout doble.
  if (summary) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        {/* Step */}
        <div className="space-y-4">
          {stepContent}
        </div>

        {/* Summary */}
        <div>
          {/* Desktop */}
          <div className="hidden lg:block">
            {summary}
          </div>

          {/* Mobile */}
          <div className="block lg:hidden">
            <details className="border rounded-lg">
              <summary className="px-4 py-2 text-sm font-medium cursor-pointer">
                Ver resumen del pedido
              </summary>
              <div className="p-4">{summary}</div>
            </details>
          </div>
        </div>
      </div>
    )
  }

  // Steps 1–4 → solo contenido centrado
  return (
    <div className="flex flex-col items-center w-full mt-4">
      <div className="w-full max-w-lg">
        {stepContent}
      </div>
    </div>
  )
}