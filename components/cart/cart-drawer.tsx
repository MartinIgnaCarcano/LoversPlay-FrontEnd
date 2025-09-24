"use client"
import Link from "next/link"
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store"
import { mockProducts } from "@/lib/services/mock-data"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, getTotalItems, getTotalPrice } = useCartStore()

  const cartItems = items
    .map((item) => {
      const product = mockProducts.find((p) => p.id === item.productId)
      return {
        ...item,
        product,
      }
    })
    .filter((item) => item.product)

  const subtotal = cartItems.reduce((total, item) => {
    const price = item.product!.salePrice || item.product!.price
    return total + price * item.quantity
  }, 0)

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
          {cartItems.length === 0 ? (
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
                {cartItems.map((item) => (
                  <div key={`${item.productId}-${item.selectedVariant || "default"}`} className="flex gap-3">
                    <img
                      src={item.product!.images[0] || "/placeholder.svg"}
                      alt={item.product!.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-card-foreground line-clamp-2 font-[family-name:var(--font-poppins)]">
                        {item.product!.name}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-border rounded">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-2 text-sm font-medium">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-card-foreground font-[family-name:var(--font-poppins)]">
                            ${((item.product!.salePrice || item.product!.price) * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
