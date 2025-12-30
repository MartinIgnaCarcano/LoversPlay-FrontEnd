/*

*/
"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"

type Slide = { src: string; alt: string }

export function Hero() {
  const slides: Slide[] = useMemo(
    () => [
      { src: "https://i0.wp.com/loversplaysexshop.com/wp-content/uploads/2021/12/slider-m.1.jpg?fit=750%2C500&ssl=1", alt: "Bienestar íntimo premium" },
      { src: "https://i0.wp.com/loversplaysexshop.com/wp-content/uploads/2021/12/slider.4.jpg?fit=1440%2C610&ssl=1", alt: "Selección cuidada y discreta" },
      { src: "https://i0.wp.com/loversplaysexshop.com/wp-content/uploads/2021/12/slider.14.jpg?fit=1440%2C610&ssl=1", alt: "Productos elegantes" },
    ],
    []
  )

  const [active, setActive] = useState(0)

  // Autoplay (sin controles)
  useEffect(() => {
    if (slides.length <= 1) return
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length)
    }, 6000) // cambia cada 6s (ajustable)

    return () => window.clearInterval(id)
  }, [slides.length])

  return (
    <section className="relative min-h-[85vh] overflow-hidden">
      {/* Fondo carrusel */}
      <div className="absolute inset-0">
        {slides.map((s, i) => (
          <img
            key={s.src}
            src={s.src}
            alt={s.alt}
            className={[
              "absolute inset-0 h-full w-full object-cover",
              "transition-opacity duration-1000 ease-out",
              i === active ? "opacity-100" : "opacity-0",
            ].join(" ")}
            draggable={false}
          />
        ))}

        {/* Overlays: menos opacos para que se vea la foto */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/25 via-background/35 to-background/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(236,72,153,0.14),transparent_55%)]" />
      </div>

      {/* Contenido */}
      <div className="relative container mx-auto px-4 py-20 min-h-[85vh] flex items-center">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-sm uppercase tracking-widest text-foreground/80">
            Bienestar íntimo • Selección premium
          </p>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-balance text-foreground">
            Descubrí productos que elevan tu{" "}
            <span className="text-primary">bienestar</span>
          </h1>

          <p className="text-lg md:text-xl text-foreground/80 leading-relaxed text-pretty">
            Estética, calidad y discreción. Comprá con confianza y encontrá tu estilo.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button asChild size="lg" className="rounded-xl px-8 py-6 text-lg shadow-lg">
              <Link href="/catalogo">Explorar catálogo</Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-xl px-8 py-6 text-lg bg-background/45 backdrop-blur border-white/30 hover:bg-background/60"
            >
              <Link href="/contacto">Consultar</Link>
            </Button>
          </div>

          {/* “Otra vuelta de tuerca”: microcopy elegante en vez de chips */}
          <p className="pt-4 text-sm text-foreground/70">
            Envío discreto · Atención personalizada · Pagos seguros
          </p>
        </div>
      </div>
    </section>
  )
}
