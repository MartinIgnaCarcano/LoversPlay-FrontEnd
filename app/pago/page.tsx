"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Smartphone, ArrowLeft, CheckCircle, MapPin, Store, MessageCircle } from "lucide-react"
import { useCartStore } from "@/lib/store"
import Link from "next/link"
import { useRouter } from "next/navigation"
import withAuth from "@/lib/withAuth"
// import { fetchCostoEnvio } from "@/app/api/costo-envio/route" // 👈 función que vas a definir

function PaymentPage() {
  const router = useRouter()
  const { items, clearCart } = useCartStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  const [shippingMethod, setShippingMethod] = useState("delivery")
  const [shippingCost, setShippingCost] = useState<number>(0)


  // Form states
  const [billingData, setBillingData] = useState({
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  })

  // ✅ Ahora usamos los items del carrito directamente
  const cartItems = items

  const subtotal = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)

  const shipping = shippingMethod === "pickup" || shippingMethod === "arrange" ? 0 : shippingCost
  const total = subtotal + shipping

  const breadcrumbItems = [{ label: "Carrito", href: "/carrito" }, { label: "Pago" }]

  // ✅ Calcular costo de envío desde la API
  const calculateShipping = async () => {
    if (!billingData.postalCode) {
      alert("Por favor ingresa un código postal válido")
      return
    }

    try {
      const postalCode = billingData.postalCode
      const res = await fetch("/api/costo-envio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postalCode }),
      })
      const data = await res.json()

      // Si eligió envío a domicilio usamos el costo de "home"
      if (shippingMethod === "delivery" && data.home) {
        setShippingCost(data.home)
      }

    } catch (error) {
      console.error("❌ Error calculando el envío:", error)
      alert("Hubo un problema calculando el costo de envío")
    }
  }

  const handleProcessPayment = async () => {
  setIsProcessing(true);

  try {
    // Adaptar items al formato que espera tu API
    const detalles = cartItems.map((item) => ({
      producto_id: item.productId, // 👈 asegurate que `item.productId` exista en tu store
      cantidad: item.quantity,
    }));
    const token = localStorage.getItem("access_token")
    const res = await fetch("/api/pagos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ detalles, token }),
    });

    if (!res.ok) {
      throw new Error("Error creando pedido");
    }

    const data = await res.json();
    console.log("✅ Pedido creado:", data);

    clearCart(); // limpiar carrito
    setOrderComplete(true);

    // Redirigir después de unos segundos
    setTimeout(() => router.push("/"), 3000);

  } catch (error) {
    console.error("❌ Error en el pago:", error);
    alert("Hubo un error procesando el pago");
  } finally {
    setIsProcessing(false);
  }
};



  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center py-16">
            <CheckCircle className="h-24 w-24 mx-auto mb-6 text-green-500" />
            <h1 className="text-3xl font-bold text-foreground mb-4">¡Pago Exitoso!</h1>
            <p className="text-muted-foreground mb-8">
              Tu pedido ha sido procesado correctamente. Recibirás un email de confirmación en breve.
            </p>
            <p className="text-sm text-muted-foreground">Redirigiendo al inicio.....</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center py-16">
            <h1 className="text-3xl font-bold text-foreground mb-4">No hay productos en el carrito</h1>
            <Button asChild>
              <Link href="/catalogo">Ir al Catálogo</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/carrito">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al carrito
                </Link>
              </Button>
            </div>

            {/* Datos de contacto */}
            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={billingData.email}
                      onChange={(e) => setBillingData({ ...billingData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={billingData.phone}
                      onChange={(e) => setBillingData({ ...billingData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Método de entrega */}
            <Card>
              <CardHeader>
                <CardTitle>Método de Entrega</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-4">
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery" className="flex items-center gap-2 cursor-pointer">
                      <MapPin className="h-5 w-5" />
                      Envío a domicilio
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="flex items-center gap-2 cursor-pointer">
                      <Store className="h-5 w-5" />
                      Retiro en local
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="arrange" id="arrange" />
                    <Label htmlFor="arrange" className="flex items-center gap-2 cursor-pointer">
                      <MessageCircle className="h-5 w-5" />
                      Arreglar con el vendedor
                    </Label>
                  </div>
                </RadioGroup>

                {shippingMethod === "delivery" && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <Label htmlFor="postalCode">Código Postal *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="postalCode"
                          value={billingData.postalCode}
                          onChange={(e) => setBillingData({ ...billingData, postalCode: e.target.value })}
                          placeholder="Ej: 5500"
                          required
                        />
                        <Button variant="outline" onClick={calculateShipping}>
                          Calcular envío
                        </Button>
                      </div>
                    </div>
                    {shippingCost > 0 && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium">Costo de envío: ${shippingCost.toFixed(2)}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Productos */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Cantidad: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totales */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Envío</span>
                    <span>
                      {shipping === 0
                        ? "-"
                        : `$${(shipping ?? 0).toFixed(2)}`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-brand hover:bg-brand/90"
                  size="lg"
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Procesando..." : `Pagar con Mercado Pago $${total.toFixed(2)}`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
export default withAuth(PaymentPage);