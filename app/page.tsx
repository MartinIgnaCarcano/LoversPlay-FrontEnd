"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Hero } from "@/components/layout/hero"
import { ShippingMethods } from "@/components/shipping/shipping-methods"
import { ProductCarousel } from "@/components/product/product-carousel"
import { Button } from "@/components/ui/button"
import { CategoryIconGrid } from "@/components/product/category-grid"

import { fetchProductos } from "@/lib/services/api"
import type { Product } from "@/lib/types"

import "@/styles/globals.css"
import { useIsMobile } from "@/hooks/use-mobile"

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [popularProducts, setPopularProducts] = useState<Product[]>([])
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<number[]>([])
  const isMobile = useIsMobile()
  useEffect(() => {
    fetchProductos(1, 8)
      .then((data) => setFeaturedProducts(data.productos))
      .catch((err) => console.error("Error cargando destacados:", err))

    fetchProductos(2, 8)
      .then((data) => setPopularProducts(data.productos))
      .catch((err) => console.error("Error cargando populares:", err))
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <Hero />

        {isMobile ? (
          <>
          </>
        ) : (
          <>
            {/* Categorías */}
            <div className="mb-6">
              <CategoryIconGrid mode="navigate"/>
            </div>
          </>
        )}
        {/* Featured products */}
        <section className="bg-white pb-4">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4 font-[family-name:var(--font-poppins)]">
                Productos Destacados
              </h2>
              <p className="text-muted-foreground font-[family-name:var(--font-inter)]">
                Nuestra selección de productos más populares
              </p>
            </div>

            <ProductCarousel products={featuredProducts} className="mb-8" />

            <div className="text-center">
              <Button size="lg" variant="outline" asChild>
                <Link href="/catalogo">Ver Todos los Productos</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Why choose us section */}
        <section className="relative py-16 overflow-hidden">
          <Image
            src="/hero1.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
          />

          <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px]" />

          <div className="relative container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8 font-[family-name:var(--font-poppins)]">
              ¿Por qué elegirnos?
            </h2>

            <p className="max-w-3xl mx-auto mb-12 text-lg text-muted-foreground leading-relaxed">
              Somos una tienda de bienestar íntimo con más de <strong>25 años de experiencia en Mendoza</strong>,
              acompañando a personas y parejas a descubrir su sexualidad de forma
              <strong> segura, confiable y discreta</strong>. En Lovers Play combinamos{" "}
              <strong>atención personalizada</strong>, un <strong>catálogo variado</strong> y{" "}
              <strong>precios competitivos</strong>, para que cada compra sea una experiencia cómoda,
              respetuosa y sin prejuicios.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2 font-[family-name:var(--font-poppins)]">
                  Envío Discreto
                </h3>
                <p className="text-muted-foreground font-[family-name:var(--font-inter)]">
                  Todos nuestros productos se envían en empaques completamente discretos
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2 font-[family-name:var(--font-poppins)]">
                  Calidad Premium
                </h3>
                <p className="text-muted-foreground font-[family-name:var(--font-inter)]">
                  Productos de las mejores marcas con materiales seguros y certificados
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2 font-[family-name:var(--font-poppins)]">
                  Asesoría Experta
                </h3>
                <p className="text-muted-foreground font-[family-name:var(--font-inter)]">
                  Nuestro equipo te ayuda a encontrar el producto perfecto para ti
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular products */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4 font-[family-name:var(--font-poppins)]">
                Más Vistos
              </h2>
              <p className="text-muted-foreground font-[family-name:var(--font-inter)]">
                Los productos que más interesan a nuestros clientes
              </p>
            </div>

            <ProductCarousel products={popularProducts} />
          </div>
        </section>

        {/* Shipping methods */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <ShippingMethods />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}



