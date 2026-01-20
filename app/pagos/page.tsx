"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import { useAuthStore, useCartStore } from "@/lib/store"
import { useEffect, useMemo } from "react"

export default function PaymentStatusPage() {
  const searchParams = useSearchParams()
  const status = (searchParams.get("status") || "pending").toLowerCase()
  const pedidoId = searchParams.get("pedido_id")

  const { clearCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    clearCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ui = useMemo(() => {
    let title = "Estado del pago"
    let description = "Revisa el resultado de tu transacción."
    let icon = <Clock className="h-24 w-24 mx-auto mb-6 text-yellow-500" />
    let buttonLabel = "Volver al carrito"
    let buttonHref = "/carrito"

    if (status === "success") {
      title = "¡Pago Exitoso!"
      description = "Tu pedido ha sido procesado correctamente. Gracias por tu compra ❤️"
      icon = <CheckCircle className="h-24 w-24 mx-auto mb-6 text-green-500" />
      if (isAuthenticated) {
        buttonLabel = "Ver pedidos"
        buttonHref = "/perfil"
      } else {
        buttonLabel = "Ir al inicio"
        buttonHref = "/"
      }
    } else if (status === "failure") {
      title = "Pago fallido"
      description = "Ocurrió un problema al procesar tu pago. Intenta nuevamente."
      icon = <XCircle className="h-24 w-24 mx-auto mb-6 text-red-500" />
    } else if (status === "pending") {
      title = "Pago pendiente"
      description = pedidoId
        ? "Recibimos tu pedido. El pago está pendiente de confirmación."
        : "Tu pago está en proceso."
      icon = <Clock className="h-24 w-24 mx-auto mb-6 text-yellow-500" />
    }

    return { title, description, icon, buttonLabel, buttonHref }
  }, [status, pedidoId, isAuthenticated])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center py-16">
          {ui.icon}
          <h1 className="text-3xl font-bold text-foreground mb-4">{ui.title}</h1>
          <p className="text-muted-foreground mb-8">{ui.description}</p>

          {pedidoId && (
            <p className="text-xl text-muted-foreground mb-6">
              Número de pedido:{" "}
              <span className="font-semibold text-foreground">#{pedidoId}</span>
            </p>
          )}

          <Button size="lg" className="bg-primary hover:bg-primary/70" asChild>
            <Link href={ui.buttonHref}>{ui.buttonLabel}</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}

