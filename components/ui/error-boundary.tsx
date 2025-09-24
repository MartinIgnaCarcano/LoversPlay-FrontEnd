"use client"

import { Component, type ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Algo salió mal</h2>
              <p className="text-muted-foreground max-w-md">
                Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
              </p>
              <Button onClick={() => window.location.reload()} className="bg-brand hover:bg-brand/90">
                Recargar página
              </Button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
