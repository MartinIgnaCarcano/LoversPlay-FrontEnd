"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"

// AJUSTÁ ESTE IMPORT SI TU CARD ESTÁ EN OTRA RUTA
import { ProductCard } from "@/components/product/product-card"

type Props = {
  products: Product[]
  className?: string
  step?: number // cuánto avanza por click (1 recomendado)
}

function useItemsPerView() {
  const [items, setItems] = useState(4)

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth
      if (w < 640) return 1      // <sm
      if (w < 768) return 2      // sm
      if (w < 1024) return 3     // md
      return 4                   // lg+
    }
    const onResize = () => setItems(calc())
    onResize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  return items
}

export function ProductCarousel({ products, className = "", step = 1 }: Props) {
  const itemsPerView = useItemsPerView()
  const total = products?.length ?? 0

  const maxIndex = useMemo(() => {
    return Math.max(0, total - itemsPerView)
  }, [total, itemsPerView])

  const [index, setIndex] = useState(0)

  // Si cambia el responsive y el index queda fuera de rango, lo ajustamos
  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex))
  }, [maxIndex])

  const canPrev = index > 0
  const canNext = index < maxIndex

  const prev = () => setIndex((i) => Math.max(0, i - step))
  const next = () => setIndex((i) => Math.min(maxIndex, i + step))

  // Cada item ocupa 100/itemsPerView %
  const itemBasis = `${100 / itemsPerView}%`
  // Movemos por items: index * (100/itemsPerView)
  const translate = `-${index * (100 / itemsPerView)}%`

  // Dots/paginación: cantidad de “páginas” (moviendo de a itemsPerView)
  const pages = useMemo(() => {
    if (total === 0) return 0
    return Math.ceil(total / itemsPerView)
  }, [total, itemsPerView])

  const currentPage = useMemo(() => {
    if (pages <= 1) return 0
    return Math.floor(index / itemsPerView)
  }, [index, itemsPerView, pages])

  const goToPage = (p: number) => {
    const target = Math.min(maxIndex, p * itemsPerView)
    setIndex(target)
  }

  if (!products || products.length === 0) return null

  return (
    <div className={className}>
      <div className="relative">
        {/* FLECHA IZQ - bien visible */}
        <Button
          type="button"
          onClick={prev}
          disabled={!canPrev}
          size="icon"
          variant="secondary"
          aria-label="Anterior"
          className="
            cursor-pointer
            absolute left-2 top-1/2 -translate-y-1/2 z-10
            h-12 w-12 rounded-full
            bg-background/95 backdrop-blur
            border border-border shadow-lg
            hover:bg-background
            disabled:opacity-40
          "
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        {/* FLECHA DER - bien visible */}
        <Button
          type="button"
          onClick={next}
          disabled={!canNext}
          size="icon"
          variant="secondary"
          aria-label="Siguiente"
          className="
            cursor-pointer
            absolute right-2 top-1/2 -translate-y-1/2 z-10
            h-12 w-12 rounded-full
            bg-background/95 backdrop-blur
            border border-border shadow-lg
            hover:bg-background
            disabled:opacity-40
          "
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* VIEWPORT */}
        <div className="overflow-hidden">
          {/* TRACK */}
          <div
            className="flex transition-transform duration-500 ease-out will-change-transform"
            style={{ transform: `translateX(${translate})` }}
          >
            {products.map((product, i) => (
              <div
                key={(product as any).id ?? i}
                className="shrink-0 px-2"
                style={{ flexBasis: itemBasis }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DOTS */}
      {pages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {Array.from({ length: pages }).map((_, p) => {
            const active = p === currentPage
            return (
              <button
                key={p}
                type="button"
                onClick={() => goToPage(p)}
                aria-label={`Ir a página ${p + 1}`}
                className={[
                  "h-2.5 rounded-full transition-all",
                  active ? "w-8 bg-foreground" : "w-2.5 bg-muted-foreground/40 hover:bg-muted-foreground/60",
                ].join(" ")}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
