"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import { useCartStore } from "@/lib/store"
import { useEffect } from "react"

export default function PaymentStatusPage() {
  const { status } = useParams<{ status: string }>()
  const { clearCart } = useCartStore()

  useEffect(()=>{
    clearCart()
  },[])

  let title = "Estado del pago"
  let description = "Revisa el resultado de tu transacción."
  let icon = <Clock className="h-24 w-24 mx-auto mb-6 text-yellow-500" />
  let buttonLabel = "Volver al carrito"
  let buttonHref = "/carrito"

  if (status === "success") {
    title = "¡Pago Exitoso!"
    description = "Tu pedido ha sido procesado correctamente. Gracias por tu compra ❤️"
    icon = <CheckCircle className="h-24 w-24 mx-auto mb-6 text-green-500" />
    buttonLabel = "Ver pedidos"
    buttonHref = "/pedidos"
  } else if (status === "failure") {
    title = "Pago fallido"
    description = "Ocurrió un problema al procesar tu pago. Intenta nuevamente."
    icon = <XCircle className="h-24 w-24 mx-auto mb-6 text-red-500" />
  } else if (status === "pending") {
    title = "Pago pendiente"
    description = "Tu pago está en proceso. Te notificaremos cuando se confirme."
    icon = <Clock className="h-24 w-24 mx-auto mb-6 text-yellow-500" />
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center py-16">
          {icon}
          <h1 className="text-3xl font-bold text-foreground mb-4">{title}</h1>
          <p className="text-muted-foreground mb-8">{description}</p>
          <Button size="lg" className="bg-brand hover:bg-brand/90" asChild>
            <Link href={buttonHref}>{buttonLabel}</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
