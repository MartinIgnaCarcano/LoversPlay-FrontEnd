"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react"
import { useCartStore, useAuthStore } from "@/lib/store"
import Link from "next/link"

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotalItems, getTotalPrice } = useCartStore()
  const { user } = useAuthStore()
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)

  const subtotal = getTotalPrice()
  const shipping = subtotal >= 50 ? 0 : 8.99
  const discount = appliedPromo === "WELCOME10" ? subtotal * 0.1 : 0
  const total = subtotal + shipping - discount

  const handleApplyPromo = () => {
    if (promoCode === "WELCOME10") {
      setAppliedPromo(promoCode)
    } else {
      alert("Código promocional inválido")
    }
  }

  const breadcrumbItems = [{ label: "Carrito de Compras" }]

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Breadcrumbs items={breadcrumbItems} className="mb-6" />
          <div className="max-w-2xl mx-auto text-center py-16">
            <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-3xl font-bold text-foreground mb-4 font-[family-name:var(--font-poppins)]">
              Tu carrito está vacío
            </h1>
            <p className="text-muted-foreground mb-8 font-[family-name:var(--font-inter)]">
              Parece que aún no has agregado ningún producto a tu carrito
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/60" asChild>
              <Link href="/catalogo">Explorar Productos</Link>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-poppins)]">
                Carrito de Compras
              </h1>
              <Button variant="outline" size="sm" onClick={clearCart} className="hover:cursor-pointer" >
                <Trash2 className="h-4 w-4 mr-2" />
                Vaciar carrito
              </Button>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="bg-card rounded-xl border border-border p-6">
                  <div className="flex gap-4">
                    {/* Product image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    </div>

                    {/* Product details */}
                    <div className="flex-1">
                      {/* Nombre + tacho */}
                      <div className="flex justify-between items-center mb-3 sm:mb-2">
                        <h3 className="font-semibold text-card-foreground font-[family-name:var(--font-poppins)] truncate">
                          {item.name}
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.productId)}
                          className="text-muted-foreground cursor-pointer hover:text-destructive transition-colors"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Sumador + precio */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        {/* Quantity controls */}
                        <div className="flex items-center justify-center sm:justify-start border border-border rounded-lg px-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(String(item.productId), item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="hover:cursor-pointer"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-4 py-2 font-medium">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(String(item.productId), item.quantity + 1)}
                            className="hover:cursor-pointer"
                            disabled={typeof item.stock !== "number" || item.quantity >= item.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Price */}
                        <div className="text-center sm:text-right">
                          <div className="font-bold text-lg text-card-foreground font-[family-name:var(--font-poppins)]">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-card-foreground mb-6 font-[family-name:var(--font-poppins)]">
                Resumen del Pedido
              </h2>

              {/* Promo code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Código promocional"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" onClick={handleApplyPromo}>
                    Aplicar
                  </Button>
                </div>
                {appliedPromo && (
                  <p className="text-sm text-green-600 mt-2">Código "{appliedPromo}" aplicado correctamente</p>
                )}
              </div>

              {/* Price breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-card-foreground">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-card-foreground">
                  <span>Envío</span>
                  <span>{shipping === 0 ? "-" : `$${shipping.toFixed(2)}`}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-bold text-card-foreground">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout button */}
              <Button className="w-full bg-primary hover:bg-primary/60 mb-4" size="lg" asChild>
                <Link href="/pago">
                  Proceder al pago
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>

              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/catalogo">Continuar Comprando</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
