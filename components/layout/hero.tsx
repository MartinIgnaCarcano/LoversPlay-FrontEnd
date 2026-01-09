"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type Slide = {
  title: string
  subtitle: string
  image: string
  href?: string
}

const clamp = (i: number, len: number) => (i + len) % len

export function Hero() {
  const slides: Slide[] = useMemo(
    () => [
      {
        title: "Bienestar íntimo, sin vueltas",
        subtitle: "Compra segura, estética cuidada y envíos discretos a todo el país.",
        image: "/hero1.png",
        href: "/catalogo",
      },
      {
        title: "Para vos o para compartir",
        subtitle: "Opciones para explorar, conectar y disfrutar con confianza.",
        image: "/hero2.png",
        href: "/catalogo",
      },
      {
        title: "Cuidado y accesorios",
        subtitle: "Lubricantes y complementos: simple, seguro y premium.",
        image: "/hero3.png",
        href: "/catalogo",
      },
    ],
    []
  )

  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const prev = () => setIndex((i) => clamp(i - 1, slides.length))
  const next = () => setIndex((i) => clamp(i + 1, slides.length))

  // Autoplay
  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setIndex((i) => clamp(i + 1, slides.length)), 6000)
    return () => clearInterval(id)
  }, [paused, slides.length])

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const active = slides[index]

  // ✅ Header height: h-16 = 64px
  const headerPx = 64

  return (
    <section
      aria-label="Hero"
      className="relative w-full overflow-hidden"
      style={{ minHeight: `calc(100svh - ${headerPx}px)` }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Imagen */}
      <div className="absolute inset-0">
        <img
          src={active.image}
          alt={active.title}
          className="h-full w-full object-cover"
          draggable={false}
        />
        {/* overlay */}
        <div className="absolute inset-0 bg-black/45" />
        {/* degradé suave */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/20 to-black/10" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 h-full w-full px-6 lg:px-16 flex items-center">
        <div className="max-w-2xl text-white">
          <div className="flex gap-2 mb-5 py-2">
            <span className="text-xs md:text-sm px-3 py-1 rounded-full bg-white/15 border border-white/20">
              LoversPlay
            </span>
            <span className="text-xs md:text-sm px-3 py-1 rounded-full bg-white/15 border border-white/20">
              Envíos discretos
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {active.title}
          </h1>

          <p className="mt-4 text-base md:text-lg text-white/85 leading-relaxed">
            {active.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
              <Link href={active.href ?? "/catalogo"}>Explorar catálogo</Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10"
            >
              <Link href="/faq">Cómo compramos</Link>
            </Button>
          </div>

          {/* Dots */}
          <div className="mt-8 flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={[
                  "h-2.5 rounded-full transition-all",
                  i === index ? "w-8 bg-white" : "w-2.5 bg-white/40 hover:bg-white/70",
                ].join(" ")}
                aria-label={`Ir a slide ${i + 1}`}
                aria-current={i === index}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Flechas */}
      <div className="absolute z-20 bottom-6 right-6 flex gap-3">
        <button
          onClick={prev}
          aria-label="Anterior"
          type="button"
          className="h-11 w-11 rounded-full bg-white/15 border border-white/20 text-white backdrop-blur hover:bg-white/25 transition cursor-pointer"
        >
          ←
        </button>
        <button
          onClick={next}
          aria-label="Siguiente"
          type="button"
          className="h-11 w-11 rounded-full bg-white/15 border border-white/20 text-white backdrop-blur hover:bg-white/25 transition cursor-pointer"
        >
          →
        </button>
      </div>
    </section>
  )
}
