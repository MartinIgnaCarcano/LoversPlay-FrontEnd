"use client"

import Link from "next/link"
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

// Recorta y agrega "…"
function truncateText(text: string, maxLength: number): string {
  if (!text) return ""
  if (text.length <= maxLength) return text

  const truncated = text.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(" ")
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated).trimEnd() + "…"
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, getTotalItems, getTotalPrice } = useCartStore()

  const subtotal = getTotalPrice()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-card border-l border-border shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-card-foreground font-[family-name:var(--font-poppins)]">
              Carrito ({getTotalItems()})
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-card-foreground mb-2 font-[family-name:var(--font-poppins)]">
                Tu carrito está vacío
              </h3>
              <p className="text-muted-foreground mb-6 font-[family-name:var(--font-inter)]">
                Agrega algunos productos para comenzar
              </p>
              <Button onClick={onClose} asChild>
                <Link href="/catalogo">Explorar Productos</Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {items.map((item: any) => {
                  const name = String(item.name ?? "Producto")
                  const image = String(item.image ?? "/placeholder.svg")
                  const price = Number(item.price ?? 0)
                  const quantity = Number(item.quantity ?? 1)
                  const totalPrice = price * quantity

                  return (
                    <div
                      key={String(item.productId)}
                      className="relative rounded-2xl border border-border bg-muted/20 p-3"
                    >
                      {/* 🗑️ Basurín DENTRO del recuadro (no rompe layout) */}
                      <button
                        type="button"
                        onClick={() => removeItem(String(item.productId))}
                        aria-label="Eliminar producto"
                        className="absolute right-2 top-2 z-10 rounded-full p-2 hover:bg-black/5 active:scale-95"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>

                      <div className="flex gap-3">
                        {/* Imagen */}
                        <img
                          src={image}
                          alt={name}
                          className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-white"
                        />

                        {/* Texto + controles */}
                        {/* pr-10 = deja lugar al basurín para que no se encime */}
                        <div className="flex-1 min-w-0 pr-10">
                          {/* ✅ Mobile: truncado + … */}
                          <h3 className="font-medium text-card-foreground font-[family-name:var(--font-poppins)] text-sm sm:text-base">
                            <span className="block w-full truncate sm:hidden">
                              {truncateText(name, 10)}
                            </span>
                            <span className="hidden sm:block">{name}</span>
                          </h3>

                          {/* ✅ Mobile: columna para que no se desborde */}
                          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            {/* Cantidad */}
                            <div className="flex items-center border border-border rounded-xl bg-background/60 w-fit">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(String(item.productId), quantity - 1)}
                                disabled={quantity <= 1}
                                className="h-9 w-9 p-0"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>

                              <span className="px-3 text-sm font-medium">{quantity}</span>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(String(item.productId), quantity + 1)}
                                className="h-9 w-9 p-0"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Precio */}
                            <div className="text-left sm:text-right">
                              <div className="font-semibold text-card-foreground font-[family-name:var(--font-poppins)] text-lg sm:text-base">
                                ${totalPrice.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Footer */}
              <div className="border-t border-border p-4 space-y-4">
                <div className="flex justify-between text-lg font-bold text-card-foreground">
                  <span className="font-[family-name:var(--font-poppins)]">Subtotal</span>
                  <span className="font-[family-name:var(--font-poppins)]">${subtotal.toFixed(2)}</span>
                </div>

                <div className="space-y-2">
                  <Button className="w-full bg-brand hover:bg-brand/90" onClick={onClose} asChild>
                    <Link href="/carrito">
                      Ver Carrito
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>

                  <Button variant="outline" className="w-full bg-transparent" onClick={onClose} asChild>
                    <Link href="/catalogo">Continuar Comprando</Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}




