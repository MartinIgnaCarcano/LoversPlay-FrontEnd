"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { useCartStore } from "@/lib/store"
import { ProductGrid } from "@/components/product/product-grid"
import type { Product } from "@/lib/types"
import { fetchProductoPorId } from "@/lib/services/api"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"

export default function ProductPage() {
  const params = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCartStore()
  const [mounted, setMounted] = useState(false);

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
  })

  useEffect(() => {
    setMounted(true);
    if (!params?.id) return
    fetchProductoPorId(Number(params.id))
      .then((data) => {
        setProduct(data.producto)
        setRelated(data.sugeridos)
      })
      .catch((err) => console.error("❌ Error cargando producto:", err))
  }, [params?.id])

  if (!product) {
    return <p className="text-center py-20">Cargando producto...</p>
  }

  const breadcrumbItems = [
    { label: "Catálogo", href: "/catalogo" },
    { label: product.nombre },
  ]

  const handleAddToCart = () => {
    addItem({
      productId: String(product.id),
      name: product.nombre,
      price: product.precio,
      image: product.url_imagen_principal || "/placeholder.svg",
      quantity,
    })
  }
  const imagenesCarrusel = [
    product.url_imagen_principal,
    ...(product.imagenes ?? []),
  ].filter(Boolean) // saca null/undefined

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Carrusel con controles */}
          <div className="relative">
            <div
              ref={sliderRef}
              className="keen-slider rounded-xl overflow-hidden h-[500px]"
            >
              {imagenesCarrusel.map((img, index) => (
                <div key={index} className="keen-slider__slide flex items-center justify-center bg-black">
                  <img
                    src={img || "/placeholder.svg"}
                    alt={`${product.nombre} ${index + 1}`}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ))}
            </div>


            {/* Botones prev/next */}
            <button
              onClick={() => slider.current?.prev()}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => slider.current?.next()}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Info producto */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">{product.nombre}</h1>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-brand">${product.precio}</span>
            </div>

            {product.descripcion_corta && (
              <div
                className="prose prose-sm text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: product.descripcion_corta }}
              />
            )}

            {/* Cantidad y carrito */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="hover:cursor-pointer" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-4 py-2 font-medium">{quantity}</span>
              <Button
                variant="ghost"
                className="hover:cursor-pointer"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
                disabled={product.stock ? quantity >= product.stock : false}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button onClick={handleAddToCart} disabled={product.stock === 0} className="flex-1 bg-primary hover:bg-brand/90 cursor-pointer" size="lg">
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.stock === 0 ? "Agotado" : "Agregar al Carrito"}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs como en tu diseño */}
        <div className="border-t border-border pt-6 padding-x-4">
          <div className="flex gap-6 mb-4">
            <button className="px-4 py-2 font-semibold border-b-2 border-brand">Descripción</button>
          </div>

          <div className="prose prose-sm text-muted-foreground">
            {product.descripcion_larga ? (
              <div dangerouslySetInnerHTML={{ __html: product.descripcion_larga }} />
            ) : (
              <p>No hay descripción detallada disponible.</p>
            )}
          </div>
        </div>

        {/* Productos relacionados */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Productos Relacionados</h2>
            <ProductGrid products={related} />
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
