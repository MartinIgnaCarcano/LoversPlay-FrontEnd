"use client"

import type React from "react"
import Link from "next/link"
import { ShoppingCart, Heart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/lib/store"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className = "" }: ProductCardProps) {
  const { addItem } = useCartStore()

  // 🔧 Compat: soporta ambas formas (API cruda y normalizada)
  const nombre: string =
    (product as any).nombre ?? (product as any).name ?? ""
  const precio: number =
    (product as any).precio ?? (product as any).price ?? 0
  const stock: number | undefined = (product as any).stock

  const imagenPrincipal: string =
    (product as any).url_imagen_principal ??
    (product as any).image ??
    (product as any).imagenes?.[0] ??
    (product as any).images?.[0] ??
    "/placeholder.svg"

  const descripcionCorta: string | undefined =
    (product as any).descripcion_corta ?? (product as any).shortDesc

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: (product as any).id,
      name: nombre || "Producto",
      price: precio || 0,
      image: imagenPrincipal,
      quantity: 1,
    })
  }

  return (
    <div
      className={`group relative bg-card rounded-xl border border-border shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden ${className}`}
    >
      <Link href={`/producto/${(product as any).id}`}>
        {/* Imagen */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-xl flex items-center justify-center">
          <img
            src={imagenPrincipal}
            alt={nombre || "Producto"}
            className="object-contain max-h-full max-w-full drop-shadow-md group-hover:scale-105 transition-transform duration-300 rounded-lg"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {typeof stock === "number" && stock <= 2 && stock > 0 && (
              <Badge variant="outline" className="bg-background/80">
                Últimas {stock}
              </Badge>
            )}
          </div>

          {/* Acciones rápidas */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button size="sm" variant="ghost" className="bg-background/80 hover:bg-background/90 h-8 w-8 p-0">
              <Heart className="h-4 w-4" />
              <span className="sr-only">Agregar a favoritos</span>
            </Button>
            <Button size="sm" variant="ghost" className="bg-background/80 hover:bg-background/90 h-8 w-8 p-0">
              <Eye className="h-4 w-4" />
              <span className="sr-only">Vista rápida</span>
            </Button>
          </div>

          {/* Overlay agotado */}
          {stock === 0 && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Agotado
              </Badge>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-4">
          <h3 className="font-semibold text-card-foreground mb-2 line-clamp-2 font-[family-name:var(--font-poppins)]">
            {nombre || "Producto sin nombre"}
          </h3>

          {descripcionCorta && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2 font-[family-name:var(--font-inter)]">
              {/* viene con HTML a veces, pero en cards mostramos texto plano */}
              {descripcionCorta.replace(/<[^>]+>/g, "")}
            </p>
          )}

          {/* Precio */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-brand font-[family-name:var(--font-poppins)]">
                ${precio?.toLocaleString?.("es-AR") ?? precio}
              </span>
            </div>
          </div>

          {/* Botón agregar */}
          <Button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className="w-full bg-brand hover:bg-brand/90"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {stock === 0 ? "Agotado" : "Agregar al Carrito"}
          </Button>
        </div>
      </Link>
    </div>
  )
}
