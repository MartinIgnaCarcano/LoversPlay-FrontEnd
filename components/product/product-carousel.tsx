"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product/product-card"

type Props = {
  products: Product[]
  className?: string
  swipe?: boolean
  marquee?: boolean
  marqueeSpeedPxPerSec?: number
  showArrows?: boolean
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

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const calc = () => window.innerWidth >= 1024
    const onResize = () => setIsDesktop(calc())
    onResize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  return isDesktop
}

export function ProductCarousel({
  products,
  className = "",
  swipe = true,
  marquee = true,
  marqueeSpeedPxPerSec = 45,
  showArrows = true,
}: Props) {
  const itemsPerView = useItemsPerView()
  const isDesktop = useIsDesktop()

  const viewportRef = useRef<HTMLDivElement | null>(null)

  const [paused, setPaused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffsetPx, setDragOffsetPx] = useState(0)

  const offsetRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const lastTsRef = useRef<number | null>(null)
  const [renderOffset, setRenderOffset] = useState(0)

  const total = products?.length ?? 0
  const itemBasis = `${100 / itemsPerView}%`

  const duplicated = useMemo(() => {
    if (!products || products.length === 0) return []
    const times = products.length <= itemsPerView ? 3 : 2
    return Array.from({ length: times }).flatMap(() => products)
  }, [products, itemsPerView])

  const getOriginalWidthPx = useCallback(() => {
    const vp = viewportRef.current
    if (!vp) return 0
    const itemW = vp.clientWidth / itemsPerView
    return itemW * total
  }, [itemsPerView, total])

  useEffect(() => {
    const activeMarquee = marquee && isDesktop && total > 0
    if (!activeMarquee) return

    const tick = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts
      const dt = (ts - lastTsRef.current) / 1000
      lastTsRef.current = ts

      const originalW = getOriginalWidthPx()
      if (originalW <= 0) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      if (!paused && !isDragging) {
        offsetRef.current += marqueeSpeedPxPerSec * dt
        if (offsetRef.current >= originalW) offsetRef.current -= originalW
        setRenderOffset(offsetRef.current)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      lastTsRef.current = null
    }
  }, [marquee, isDesktop, paused, isDragging, marqueeSpeedPxPerSec, total, getOriginalWidthPx])

  const pointer = useRef({
    active: false,
    dragging: false,
    startX: 0,
    lastX: 0,
    pointerId: -1,
  })

  const DRAG_THRESHOLD_PX = 6

  const isInteractiveTarget = (target: EventTarget | null) => {
    const el = target as HTMLElement | null
    if (!el) return false
    return !!el.closest(
      'button, a, input, textarea, select, option, [role="button"], [data-no-swipe="true"]'
    )
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (!swipe) return
    const vp = viewportRef.current
    if (!vp) return
    if (e.pointerType === "mouse" && e.button !== 0) return

    // 🔥 Si el user tocó un botón/link, NO activar swipe
    if (isInteractiveTarget(e.target)) return

    pointer.current.active = true
    pointer.current.dragging = false
    pointer.current.startX = e.clientX
    pointer.current.lastX = e.clientX
    pointer.current.pointerId = e.pointerId

    setPaused(true)
    setDragOffsetPx(0)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!swipe) return
    if (!pointer.current.active) return

    const vp = viewportRef.current
    if (!vp) return

    const dx = e.clientX - pointer.current.startX
    pointer.current.lastX = e.clientX

    if (!pointer.current.dragging) {
      if (Math.abs(dx) < DRAG_THRESHOLD_PX) return

      pointer.current.dragging = true
      setIsDragging(true)

      // ✅ capturar puntero SOLO cuando ya estás arrastrando
      vp.setPointerCapture(pointer.current.pointerId)
    }

    // cuando ya estás draggeando
    e.preventDefault()
    setDragOffsetPx(dx)
  }

  const finishDrag = (endX?: number) => {
    if (!pointer.current.active) return
    const wasDragging = pointer.current.dragging

    pointer.current.active = false
    pointer.current.dragging = false

    const vp = viewportRef.current
    if (!vp) return

    // ✅ si NO hubo drag real, no hagas snap ni toques offset (deja que el click funcione)
    if (!wasDragging) {
      setPaused(false)
      setIsDragging(false)
      setDragOffsetPx(0)
      return
    }

    const x = typeof endX === "number" ? endX : pointer.current.lastX
    const dx = x - pointer.current.startX

    const itemW = vp.clientWidth / itemsPerView
    let nextOffset = offsetRef.current - dx

    const snappedIndex = Math.round(nextOffset / itemW)
    nextOffset = snappedIndex * itemW

    const originalW = getOriginalWidthPx()
    if (originalW > 0) nextOffset = ((nextOffset % originalW) + originalW) % originalW

    offsetRef.current = nextOffset
    setRenderOffset(nextOffset)

    setIsDragging(false)
    setDragOffsetPx(0)
    setPaused(false)
  }

  const onPointerUp = (e: React.PointerEvent) => finishDrag(e.clientX)
  const onPointerCancel = () => finishDrag()

  const shiftByOneItem = (dir: -1 | 1) => {
    const vp = viewportRef.current
    if (!vp) return
    const itemW = vp.clientWidth / itemsPerView

    let nextOffset = offsetRef.current + dir * itemW
    const originalW = getOriginalWidthPx()
    if (originalW > 0) nextOffset = ((nextOffset % originalW) + originalW) % originalW

    offsetRef.current = nextOffset
    setRenderOffset(nextOffset)
  }

  if (!products || products.length === 0) return null

  return (
    <div className={className}>
      <div
        className="relative overflow-visible"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {showArrows && (
          <>
            <Button
              type="button"
              onClick={() => shiftByOneItem(-1)}
              size="icon"
              variant="secondary"
              aria-label="Anterior"
              className="
                absolute top-1/2 -translate-y-1/2 z-20
                -left-6 md:-left-8
                h-12 w-12 rounded-full
                bg-background/95 backdrop-blur
                shadow-xl
                border border-foreground/10
                hover:bg-background
                cursor-pointer
              "
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              type="button"
              onClick={() => shiftByOneItem(1)}
              size="icon"
              variant="secondary"
              aria-label="Siguiente"
              className="
                absolute top-1/2 -translate-y-1/2 z-20
                -right-6 md:-right-8
                h-12 w-12 rounded-full
                bg-background/95 backdrop-blur
                shadow-xl
                border border-foreground/10
                hover:bg-background
                cursor-pointer
              "
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        <div
          ref={viewportRef}
          className={["overflow-hidden", swipe ? "touch-pan-y select-none" : ""].join(" ")}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
        >
          <div
            className={[
              "flex will-change-transform",
              isDragging ? "transition-none" : "transition-transform duration-300 ease-out",
            ].join(" ")}
            style={{
              transform: `translateX(calc(-${renderOffset}px + ${dragOffsetPx}px))`,
            }}
          >
            {duplicated.map((product, i) => (
              <div
                key={`${(product as any).id ?? "p"}-${i}`}
                className="shrink-0 px-2"
                style={{ flexBasis: itemBasis }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


