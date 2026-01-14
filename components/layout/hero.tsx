"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  CircleDot,
  Droplets,
  Shirt,
  Hand,
  Waves,
  Vibrate,
  Plug,
  Sparkles,
  Pill,
} from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

type Slide = {
  title: string
  subtitle: string
  video: string
  href?: string
}

const clamp = (i: number, len: number) => (i + len) % len

export function Hero() {
  const slides: Slide[] = useMemo(
    () => [
      {
        title: "Bienestar íntimo, sin vueltas",
        subtitle: "Compra segura, estética cuidada y envíos discretos a todo el país.",
        video: "/Consolador-Blanco.mp4",
        href: "/catalogo",
      },
      {
        title: "Para vos o para compartir",
        subtitle: "Opciones para explorar, conectar y disfrutar con confianza.",
        video: "/Consolador-Celeste.mp4",
        href: "/catalogo",
      },
      {
        title: "Cuidado y accesorios",
        subtitle: "Lubricantes y complementos: simple, seguro y premium.",
        video: "/Consolador-Rosado.mp4",
        href: "/catalogo",
      },
    ],
    []
  )
  const isMobile = useIsMobile()
  const categorias = useMemo(
    () => [
      { label: "Anillos", href: "/catalogo?cat=anillos", Icon: CircleDot },
      { label: "Lamido", href: "/catalogo?cat=lamido", Icon: Droplets },
      { label: "Lencería", href: "/catalogo?cat=lenceria", Icon: Shirt },
      { label: "Masturbadores", href: "/catalogo?cat=masturbadores", Icon: Hand },
      { label: "Succionadores", href: "/catalogo?cat=succionadores", Icon: Waves },
      { label: "Vibradores", href: "/catalogo?cat=vibradores", Icon: Vibrate },
      { label: "Anal", href: "/catalogo?cat=anal", Icon: Plug },
      { label: "Cosmética Erótica", href: "/catalogo?cat=cosmetica", Icon: Sparkles },
      { label: "Suplementos", href: "/catalogo?cat=suplementos", Icon: Pill },
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
    const id = setInterval(() => setIndex((i) => clamp(i + 1, slides.length)), 12000)
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
    <>
      <section
        aria-label="Hero"
        className="relative w-full overflow-hidden"
        style={{ minHeight: `calc(100svh - ${headerPx}px)` }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Video */}
        <div className="absolute inset-0">
          <video
            key={active.video} // 🔥 fuerza reset al cambiar slide
            src={active.video}
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          />
          {/* overlay */}
          <div className="absolute inset-0 bg-black/45" />
          {/* degradé suave */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/20 to-black/10" />
        </div>

        {/* Contenido */}
        <div className="relative z-10 h-full w-full px-6 lg:px-16 flex items-center pt-24 md:pt-32">
          <div className="max-w-2xl text-white">




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

      {/* Categorías (como tu ejemplo) */}
      <div className="bg-background border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex flex-wrap items-center justify-center gap-6">
            {categorias.map(({ label, href, Icon }) => (
              <Link key={label} href={href} className="group flex flex-col items-center gap-2">
                <div className="h-16 w-16 rounded-full border border-border bg-background flex items-center justify-center group-hover:scale-105 transition">
                  <Icon className="h-7 w-7 text-brand" />
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition text-center">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
