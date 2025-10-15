"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Hero } from "@/components/layout/hero"
import { ShippingMethods } from "@/components/shipping/shipping-methods"
import { ProductGrid } from "@/components/product/product-grid"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { fetchProductos } from "@/lib/services/api"
import type { Product } from "@/lib/types"
import { mockBlogPosts } from "@/lib/services/mock-data"
import "@/styles/globals.css"

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [popularProducts, setPopularProducts] = useState<Product[]>([])

  useEffect(() => {
  // 🔹 Cargar productos destacados (los primeros 8, por ejemplo)
  fetchProductos(1, 4)
    .then((data) => setFeaturedProducts(data.productos))
    .catch((err) => console.error("Error cargando destacados:", err))

  // 🔹 Cargar productos más vistos (página 2, otros 8 productos)
  fetchProductos(2, 4)
    .then((data) => setPopularProducts(data.productos))
    .catch((err) => console.error("Error cargando populares:", err))
}, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <Hero />

        {/* Why choose us section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8 font-[family-name:var(--font-poppins)]">
              ¿Por qué elegirnos?
            </h2>
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

        {/* Featured products */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4 font-[family-name:var(--font-poppins)]">
                Productos Destacados
              </h2>
              <p className="text-muted-foreground font-[family-name:var(--font-inter)]">
                Nuestra selección de productos más populares
              </p>
            </div>
            <ProductGrid products={featuredProducts} className="mb-8" />
            <div className="text-center">
              <Link href="/catalogo">
                <Button size="lg" variant="outline" asChild>
                  Ver Todos los Productos
                </Button>
              </Link>
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
            <ProductGrid products={popularProducts} />
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

