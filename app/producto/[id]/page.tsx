"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Minus, Plus, ChevronLeft, ChevronRight, Heart } from "lucide-react"
import { useCartStore } from "@/lib/store"
import { ProductGrid } from "@/components/product/product-grid"
import type { Product } from "@/lib/types"
import { fetchProductoPorId } from "@/lib/services/api"
import { useKeenSlider } from "keen-slider/react"
import { Package } from "lucide-react"
import "keen-slider/keen-slider.min.css"

export default function ProductPage() {
  const params = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [quantity, setQuantity] = useState(1)
  const { addItem, items } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  // --- Sliders ---
  const [sliderRefSmall, sliderSmall] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slideChanged(s) {
      setActiveSlide(s.track.details.rel)
    },
  })

  const [sliderRefFull, sliderFull] = useKeenSlider<HTMLDivElement>({
    loop: true,
  })

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (!sliderSmall.current) return;

    sliderSmall.current.on("slideChanged", (s) => {
      setActiveSlide(s.track.details.rel);
    });
  }, [sliderSmall]);

  useEffect(() => {
    if (!mounted || !product) return
    const inCart = items.find((i) => String(i.productId) === String(product.id))?.quantity ?? 0
    const available = Math.max(1, (product.stock ?? 1) - inCart)
    setQuantity((q) => Math.min(q, available))
  }, [product?.id, product?.stock, items, mounted])

  useEffect(() => {
    setMounted(true)
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

  const currentInCart =
    items.find((i) => String(i.productId) === String(product.id))?.quantity ?? 0

  const availableToAdd = Math.max(0, (product.stock ?? 0) - currentInCart)

  const breadcrumbItems = [
    { label: "Catálogo", href: "/catalogo" },
    { label: product.nombre },
  ]

  const handleAddToCart = () => {
    const currentInCart =
      items.find((i) => String(i.productId) === String(product.id))?.quantity ?? 0

    const desiredTotal = currentInCart + quantity
    const stock = product.stock ?? 0

    if (stock > 0 && desiredTotal > stock) {
      // Acá podés mostrar toast/alert en vez de console
      alert(`Stock insuficiente. Ya tenés ${currentInCart} en el carrito y solo hay ${stock} disponibles.`)
      return
    }

    addItem({
      productId: String(product.id),
      name: product.nombre,
      price: product.precio,
      image: product.url_imagen_principal || "/placeholder.svg",
      quantity,
      stock: product.stock ?? 0,
    })
  }

  const imagenes = [
    product.url_imagen_principal,
    ...(product.imagenes ?? []),
  ].filter(Boolean)

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

          {/* ------------------ GALERÍA COMPLETA ------------------ */}
          <div className="flex gap-6">

            {/* Miniaturas verticales */}
            <div className="flex flex-col gap-2">
              {imagenes.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => sliderSmall.current?.moveToIdx(idx)}
                  className={`w-14 h-14 cursor-pointer rounded-lg overflow-hidden border-2 transition
                            ${activeSlide === idx ? "border-black" : "border-gray-300"}`}
                >
                  <img
                    src={img || "/placeholder.svg"}
                    className="w-full h-full object-cover"
                    alt={"thumb " + idx}
                  />
                </button>
              ))}
            </div>

            {/* Carrusel principal con ancho controlado */}
            <div className="relative w-full max-w-[450px]">
              <div
                ref={sliderRefSmall}
                className="keen-slider rounded-xl overflow-hidden cursor-zoom-in h-[420px] bg-background"
                onClick={() => setIsGalleryOpen(true)}
              >
                {imagenes.map((img, index) => (
                  <div
                    key={index}
                    className="keen-slider__slide flex items-center justify-center"
                  >
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`${product.nombre} ${index + 1}`}
                      className="object-contain max-h-[420px] w-full"
                    />
                  </div>
                ))}
              </div>

              {/* Botones prev/next */}
              <button
                onClick={() => sliderSmall.current?.prev()}
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                onClick={() => sliderSmall.current?.next()}
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>



          {/* ------------------ FULLSCREEN GALLERY (NO TOCAR) ------------------ */}
          {isGalleryOpen && (
            <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center">
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="absolute top-6 right-6 text-white hover:text-brand text-3xl font-bold cursor-pointer"
              >
                ✕
              </button>

              <div
                ref={sliderRefFull}
                className="keen-slider w-full max-w-5xl h-[80vh] rounded-xl overflow-hidden"
              >
                {imagenes.map((img, index) => (
                  <div
                    key={index}
                    className="keen-slider__slide flex items-center justify-center"
                  >
                    <img
                      src={img || "/placeholder.svg"}
                      className="object-contain max-h-full max-w-full"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => sliderFull.current?.prev()}
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-3 cursor-pointer"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={() => sliderFull.current?.next()}
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-3 cursor-pointer"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          )}

          {/* Info producto */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">{product.nombre}</h1>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-brand">${product.precio}</span>
            </div>
            {product.descripcion_corta && (
              <div className="prose prose-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: product.descripcion_corta }} />)}

            <div className="space-y-1">
              <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 px-3 py-1 text-sm font-medium">
                {product.stock} disponibles
              </span>
            </div>



            {/* Cantidad y carrito */}
            <div className="flex items-center gap-4"> <Button variant="ghost" className="hover:cursor-pointer" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
              <Minus className="h-4 w-4" />
            </Button>
              <span className="px-4 py-2 font-medium">{quantity}
              </span>
              <Button
                variant="ghost"
                className="hover:cursor-pointer"
                size="sm"
                onClick={() => setQuantity((q) => q + 1)}
                disabled={product.stock ? quantity >= availableToAdd : false}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || availableToAdd === 0}
                className="flex-1 bg-primary hover:bg-brand/90 cursor-pointer"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.stock === 0 ? "Agotado" : availableToAdd === 0 ? "Sin stock disponible" : "Agregar al Carrito"}
              </Button>
            </div>
          </div>
        </div>
        {/* Tabs como en tu diseño */}
        <div className="border-t border-border pt-6 padding-x-4">
          <div className="flex gap-6 mb-4">
            <button className="px-4 py-2 font-semibold border-b-2 border-brand">
              Descripción
            </button>
          </div>
          <div className="prose prose-sm text-muted-foreground">
            {product.descripcion_larga ? (
              <div dangerouslySetInnerHTML={{ __html: product.descripcion_larga }} />) : (
              <p>
                No hay descripción detallada disponible.
              </p>
            )}
          </div>
        </div>
        {/* Productos relacionados */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Productos Relacionados
            </h2>
            <ProductGrid products={related} />
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}