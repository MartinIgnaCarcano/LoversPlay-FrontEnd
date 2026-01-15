"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product/product-card"

type Props = {
  products: Product[]
  className?: string
  step?: number
}

function useItemsPerView() {
  const [items, setItems] = useState(4)

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth
      if (w < 640) return 1
      if (w < 768) return 2
      if (w < 1024) return 3
      return 4
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

  const maxIndex = useMemo(() => Math.max(0, total - itemsPerView), [total, itemsPerView])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex))
  }, [maxIndex])

  const canPrev = index > 0
  const canNext = index < maxIndex

  const prev = () => setIndex((i) => Math.max(0, i - step))
  const next = () => setIndex((i) => Math.min(maxIndex, i + step))

  const itemBasis = `${100 / itemsPerView}%`
  const translate = `-${index * (100 / itemsPerView)}%`

  const pages = useMemo(() => {
    if (total === 0) return 0
    return Math.ceil(total / itemsPerView)
  }, [total, itemsPerView])

  const currentPage = useMemo(() => {
    if (pages <= 1) return 0
    return Math.floor(index / itemsPerView)
  }, [index, itemsPerView, pages])

  const goToPage = (p: number) => setIndex(Math.min(maxIndex, p * itemsPerView))

  if (!products || products.length === 0) return null

  return (
    <div className={className}>
      {/* relative + overflow-visible para que las flechas "salgan" */}
      <div className="relative overflow-visible">
        {/* FLECHA IZQ: afuera, sin borde */}
        <Button
          type="button"
          onClick={prev}
          disabled={!canPrev}
          size="icon"
          variant="secondary"
          aria-label="Anterior"
          className="
            cursor-pointer
            absolute top-1/2 -translate-y-1/2 z-20
            -left-6 md:-left-8
            h-12 w-12 rounded-full
            bg-background/95 backdrop-blur
            shadow-xl
            border-2 border-primary shadow-lg
            hover:bg-background
            disabled:opacity-40
          "
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        {/* FLECHA DER: afuera, sin borde */}
        <Button
          type="button"
          onClick={next}
          disabled={!canNext}
          size="icon"
          variant="secondary"
          aria-label="Siguiente"
          className="
            cursor-pointer
            absolute top-1/2 -translate-y-1/2 z-20
            -right-6 md:-right-8
            h-12 w-12 rounded-full
            bg-background/95 backdrop-blur
            shadow-xl
            border-2 border-primary shadow-lg
            hover:bg-background
            disabled:opacity-40
          "
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* VIEWPORT: acá sí overflow-hidden */}
        <div className="overflow-hidden">
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
