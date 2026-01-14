"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, Heart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/lib/store"
import type { Product } from "@/lib/types"
import { agregarFavorito } from "@/lib/services/api"
import { Check } from "lucide-react"
import { useAddToCartFeedback } from "@/hooks/useAddToCartFeedBack"

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className = "" }: ProductCardProps) {
  const { addItem } = useCartStore()
  const { added, trigger } = useAddToCartFeedback(700)

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

  const imagenSecundaria =
    (product as any).url_imagen_secundaria ??
    (product as any).image2 ??
    product.imagenes?.[1] ??
    imagenPrincipal

  // 👇 Estado para cambiar imagen en hover
  const [imagenActual, setImagenActual] = useState(imagenPrincipal)

  const descripcionCorta: string | undefined =
    (product as any).descripcion_corta ?? (product as any).shortDesc


  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: (product as any).id,
      name: nombre || "Producto",
      price: precio || 0,
      image: imagenActual,
      quantity: 1,
      stock: Number(stock ?? 0),
    })
    trigger()
  }
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const response = agregarFavorito(product.id)
    console.log("agregar a favoritos")
  }

  return (
    <div
      className={`group relative bg-white rounded-xl border border-border
      shadow-md
      transition-all duration-300 ease-out
      hover:-translate-y-2
      hover:shadow-xl
      hover:shadow-black/10
      overflow-hidden
      active:translate-y-0
      active:scale-[0.98]
      ${className}`}
    >
      <Link href={`/producto/${(product as any).id}`}>
        {/* Imagen */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-xl flex items-center justify-center"
          onMouseEnter={() => setImagenActual(imagenSecundaria)}
          onMouseLeave={() => setImagenActual(imagenPrincipal)}
        >
          <img
            src={imagenActual}
            alt={nombre || "Producto"}
            className="object-contain max-h-full max-w-full drop-shadow-md group-hover:scale-105 transition-transform duration-300 rounded-lg"
          />
          {/* 🔥 Precarga invisible de la imagen secundaria */}
          {imagenSecundaria && (
            <img
              src={imagenSecundaria}
              alt=""
              style={{ display: "none" }}
              loading="eager"
            />
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-2">
            {typeof stock === "number" && stock <= 2 && stock > 0 && (
              <Badge variant="outline" className="bg-background/80 text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">
                Últimas {stock}
              </Badge>
            )}
          </div>

          {/* Acciones rápidas */}
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="sm"
              variant="ghost"
              className="bg-background/80 cursor-pointer hover:bg-background/90 h-6 w-6 sm:h-8 sm:w-8 p-0"
              onClick={handleLike}
            >
              <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="sr-only">Agregar a favoritos</span>
            </Button>
          </div>

          {/* Overlay agotado */}
          {stock === 0 && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Badge
                variant="secondary"
                className="text-xs sm:text-lg px-2 sm:px-4 py-1 sm:py-2"
              >
                Agotado
              </Badge>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-2 sm:p-4 flex flex-col justify-between min-h-[130px] sm:min-h-[170px]">
          <h3 className="font-semibold text-card-foreground mb-1 sm:mb-2 line-clamp-2 font-[family-name:var(--font-poppins)] text-xs sm:text-base">
            {nombre || "Producto sin nombre"}
          </h3>

          {descripcionCorta && (
            <p className="text-[10px] sm:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2 font-[family-name:var(--font-inter)]">
              {descripcionCorta.replace(/<[^>]+>/g, "")}
            </p>
          )}

          {/* Precio */}
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-sm sm:text-lg font-bold text-brand font-[family-name:var(--font-poppins)]">
                ${precio?.toLocaleString?.("es-AR") ?? precio}
              </span>
            </div>
          </div>

          {/* Botón agregar */}
          <Button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className={`w-full mt-auto bg-primary hover:bg-primary/60 cursor-pointer text-[10px] sm:text-sm h-8 sm:h-10 ${added ? "bg-green-600 hover:bg-green-600" : "bg-primary hover:bg-brand/90"
              }`}
            size="sm"
          >
            {added ? (
              <>
                <Check className="h-5 w-5 mr-2" /> Agregado
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.stock === 0 ? "Sin stock disponible" : "Agregar al Carrito"}
              </>
            )}
          </Button>
        </div>
      </Link>
    </div>

  )
}
