"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type Slide = {
  title: string
  subtitle: string
  image: string
  tag?: string
  href?: string
}

const clampIndex = (i: number, len: number) => (i + len) % len

export function Hero() {
  const slides: Slide[] = useMemo(
    () => [
      {
        title: "Colección Bienestar Íntimo",
        subtitle: "Juguetes y productos íntimos curados con estética, privacidad y confianza.",
        image: "/elegant-pink-luxury-vibrator.jpg",
        tag: "Destacado",
        href: "/catalogo",
      },
      {
        title: "Para Parejas",
        subtitle: "Opciones para conexión, juego y experiencias compartidas.",
        image: "/couples-vibrating-ring-elegant.jpg",
        tag: "Parejas",
        href: "/catalogo?cat=parejas",
      },
      {
        title: "Cuidado & Accesorios",
        subtitle: "Lubricantes, limpieza y complementos: simple, seguro y premium.",
        image: "/premium-natural-lubricant-bottle-elegant.jpg",
        tag: "Cuidado",
        href: "/catalogo?cat=cuidado",
      },
    ],
    []
  )

  const [index, setIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const prev = () => setIndex((i) => clampIndex(i - 1, slides.length))
  const next = () => setIndex((i) => clampIndex(i + 1, slides.length))

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 120)
    return () => clearTimeout(t)
  }, [])

  // Autoplay (opcional)
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => clampIndex(i + 1, slides.length)), 6500)
    return () => clearInterval(id)
  }, [slides.length])

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
  const left = slides[clampIndex(index - 1, slides.length)]
  const right = slides[clampIndex(index + 1, slides.length)]

  return (
    <section
      className="bg-background flex items-center"
      style={{ minHeight: "calc(100dvh - var(--nav-h, 80px))" }}
      aria-label="Hero carousel"
    >
      <div className="w-full px-6 lg:px-10">
        <div className="mx-auto max-w-[1700px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* LEFT (solo texto, SIN controles) */}
            <div
              className={[
                "rounded-[2.5rem] bg-primary text-primary-foreground",
                "p-10 lg:p-14",
                "min-h-[520px] lg:min-h-[620px]",
                "flex flex-col justify-between",
                "transition-all duration-1000",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
              ].join(" ")}
            >
              <div className="space-y-8">
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex h-9 items-center rounded-full px-4 text-sm bg-primary-foreground/10 border border-primary-foreground/15">
                    LoversPlay
                  </span>
                  <span className="inline-flex h-9 items-center rounded-full px-4 text-sm bg-primary-foreground/10 border border-primary-foreground/15">
                    Envíos discretos
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight font-[family-name:var(--font-work-sans)]">
                  {active.title}
                </h1>

                <p className="max-w-md text-base md:text-lg leading-relaxed text-primary-foreground/80 font-[family-name:var(--font-open-sans)]">
                  {active.subtitle}
                </p>
              </div>

              {/* CTA: misma forma */}
              <div className="pt-10">
                <Button
                  size="lg"
                  className="bg-background hover:bg-background/90 cursor-pointer text-foreground text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-[family-name:var(--font-work-sans)] font-semibold"
                  asChild
                >
                  <Link href={active.href ?? "/catalogo"}>Explorar Catálogo</Link>
                </Button>

                <p className="mt-4 text-sm text-primary-foreground/75">
                  Curado premium · Compra segura · Atención discreta
                </p>
              </div>
            </div>

            {/* RIGHT (imagen + CONTROLES) */}
            <div
              className={[
                "relative min-h-[520px] lg:min-h-[620px]",
                "transition-all duration-1200 delay-150",
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4",
              ].join(" ")}
            >
              {/* Back stacked cards */}
              <StackCard slide={left} pos="left" />
              <StackCard slide={right} pos="right" />

              {/* Main card */}
              <div className="relative z-20 mx-auto w-[92%] lg:w-[90%]">
                <div className="rounded-[2.2rem] bg-card border border-border p-6 lg:p-7 shadow-xl">
                  <div className="relative rounded-[1.8rem] bg-secondary border border-border overflow-hidden">
                    <img
                      src={active.image}
                      alt={active.title}
                      className="w-full h-[420px] lg:h-[520px] object-cover"
                      draggable={false}
                    />

                    {/* Tag */}
                    <div className="absolute top-5 left-5 rounded-full bg-background/90 backdrop-blur border border-border px-4 py-2 text-sm text-foreground">
                      {active.tag ?? "Nuevo"}
                    </div>

                    {/* Mini info bottom */}
                    <div className="absolute bottom-5 left-5 rounded-2xl bg-background/90 backdrop-blur border border-border shadow-lg p-4 w-[270px]">
                      <p className="text-xs text-muted-foreground">Producto destacado</p>
                      <p className="text-base font-semibold text-foreground mt-1">Diseño premium</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">$ 29.900</span>
                        <span className="text-xs px-3 py-1 rounded-full bg-accent text-accent-foreground border border-border">
                          Nuevo
                        </span>
                      </div>
                    </div>

                    {/* CONTROLES: abajo derecha sobre la imagen */}
                    <div className="absolute bottom-5 right-5 z-30 flex items-center gap-3">
                      <button
                        onClick={prev}
                        aria-label="Imagen anterior"
                        className="h-11 w-11 rounded-full bg-background/90 backdrop-blur border border-border shadow hover:bg-background transition"
                        type="button"
                      >
                        ←
                      </button>

                      <button
                        onClick={next}
                        aria-label="Imagen siguiente"
                        className="h-11 w-11 rounded-full bg-background/90 backdrop-blur border border-border shadow hover:bg-background transition"
                        type="button"
                      >
                        →
                      </button>
                    </div>
                  </div>

                  {/* Bottom cards */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-border bg-secondary p-5">
                      <p className="text-sm font-semibold text-foreground">Atención</p>
                      <p className="text-sm text-muted-foreground">rápida y humana</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-secondary p-5">
                      <p className="text-sm font-semibold text-foreground">Selección</p>
                      <p className="text-sm text-muted-foreground">curada & segura</p>
                    </div>
                  </div>

                  {/* DOTS: debajo de la imagen (opcional pero queda bien) */}
                  <div className="mt-6 flex justify-center gap-2" aria-label="Puntos del carrusel">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setIndex(i)}
                        className={[
                          "h-2.5 rounded-full transition-all",
                          i === index ? "w-8 bg-foreground" : "w-2.5 bg-muted-foreground/40 hover:bg-muted-foreground/70",
                        ].join(" ")}
                        aria-label={`Ir a imagen ${i + 1}`}
                        aria-current={i === index}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* end right */}
          </div>
        </div>
      </div>
    </section>
  )
}

function StackCard({ slide, pos }: { slide: Slide; pos: "left" | "right" }) {
  const base = "absolute top-1/2 -translate-y-1/2 z-10 w-[82%] lg:w-[78%] opacity-90 pointer-events-none"
  const side =
    pos === "left"
      ? "left-0 -translate-x-6 lg:-translate-x-10 rotate-[-4deg]"
      : "right-0 translate-x-6 lg:translate-x-10 rotate-[4deg]"

  return (
    <div className={[base, side].join(" ")}>
      <div className="rounded-[2.2rem] bg-card border border-border p-5 shadow-lg">
        <div className="relative rounded-[1.6rem] bg-secondary border border-border overflow-hidden">
          <img src={slide.image} alt="" className="w-full h-[320px] lg:h-[380px] object-cover" draggable={false} />
        </div>
      </div>
    </div>
  )
}






