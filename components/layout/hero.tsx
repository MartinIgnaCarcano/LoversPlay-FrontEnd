"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-gradient-to-br from-primary via-secondary/20 to-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(5,150,105,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.08),transparent_50%)]"></div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[65vh]">
          <div
            className={`space-y-8 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="space-y-6">
              <div
                className={`inline-flex items-center px-4 py-2 bg-primary/10 rounded-full transition-all duration-800 delay-200 ${
                  isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
              >
                <span className="text-primary-foreground bg-primary px-3 py-1 rounded-full font-medium text-sm font-[family-name:var(--font-open-sans)] tracking-wide">
                  ✨ Bienestar Premium
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground font-[family-name:var(--font-work-sans)] text-balance leading-tight">
                Descubre tu
                <span className="text-primary block mt-2">Estilo</span>
              </h1>
            </div>

            <p className="text-xl text-muted-foreground max-w-lg font-[family-name:var(--font-open-sans)] text-pretty leading-relaxed">
              Explora una experiencia de compra única con productos cuidadosamente seleccionados que elevan tu bienestar
              personal y relaciones íntimas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-[family-name:var(--font-work-sans)] font-semibold"
                asChild
              >
                <Link href="/catalogo">Explorar Catálogo</Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-6 rounded-xl transition-all duration-300 font-[family-name:var(--font-work-sans)] font-medium bg-transparent"
                asChild
              >
                <Link href="/blog">Guías & Consejos</Link>
              </Button>
            </div>
          </div>

          <div
            className={`relative transition-all duration-1200 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <div className="relative">
              {/* Main lifestyle image */}
              <div
                className={`relative z-10 transition-all duration-800 delay-500 ${
                  isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
              >
                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                  <img
                    src="/elegant-pink-luxury-vibrator.jpg"
                    alt="Productos de bienestar íntimo premium en ambiente natural"
                    className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent"></div>
                </div>
              </div>

              {/* Floating product cards */}
              <div
                className={`absolute -top-8 -right-8 z-20 transition-all duration-800 delay-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                }`}
              >
                <div className="bg-background/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-primary/20">
                  <img
                    src="/couples-vibrating-ring-elegant.jpg"
                    alt="Productos para parejas"
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                  <p className="text-sm font-medium text-foreground mt-2 font-[family-name:var(--font-work-sans)]">
                    Para Parejas
                  </p>
                </div>
              </div>

              <div
                className={`absolute -bottom-8 -left-8 z-20 transition-all duration-800 delay-900 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <div className="bg-background/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-secondary/20">
                  <img
                    src="/premium-natural-lubricant-bottle-elegant.jpg"
                    alt="Cuidado íntimo natural"
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                  <p className="text-sm font-medium text-foreground mt-2 font-[family-name:var(--font-work-sans)]">
                    Cuidado Natural
                  </p>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-1/4 -left-4 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute bottom-1/4 -right-4 w-16 h-16 bg-secondary/20 rounded-full blur-lg animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-20 right-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-secondary/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
    </section>
  )
}
