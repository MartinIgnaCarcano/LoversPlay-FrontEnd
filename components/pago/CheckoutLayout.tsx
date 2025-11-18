"use client"

import { ReactNode } from "react"

interface CheckoutLayoutProps {
  stepContent: ReactNode
  summary: ReactNode | null
}

export function CheckoutLayout({ stepContent, summary }: CheckoutLayoutProps) {
  // Step 5 (summary presente) → layout doble tipo MercadoLibre
  if (summary) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-8 mt-4">
        {/* Paso */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-lg">
            {stepContent}
          </div>
        </div>

        {/* Resumen */}
        <div>
          {/* Desktop */}
          <div className="hidden lg:block">
            {summary}
          </div>

          {/* Mobile */}
          <div className="block lg:hidden mt-4">
            <details className="border rounded-lg bg-card/40">
              <summary className="px-4 py-2 text-sm font-medium cursor-pointer">
                Ver resumen del pedido
              </summary>
              <div className="p-4">
                {summary}
              </div>
            </details>
          </div>
        </div>
      </div>
    )
  }

  // Steps 1–4 → formulario centrado, sin forzar altura
  return (
    <div className="flex flex-col items-center w-full mt-2">
      <div className="w-full max-w-lg">
        {stepContent}
      </div>
    </div>
  )
}