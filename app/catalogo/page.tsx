"use client"

import { useState, useEffect, useMemo } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { CategorySidebar } from "@/components/product/category-sidebar"
import { ProductGrid } from "@/components/product/product-grid"
import { SortSelect } from "@/components/product/sort-select"
import { Button } from "@/components/ui/button"
import { Filter, Grid, List } from "lucide-react"
import { useFiltersStore } from "@/lib/store"
import { fetchProductos, fetchProductosPorCategorias } from "@/lib/services/api"

export default function CatalogPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const { filters, sortBy, searchQuery } = useFiltersStore()

  const [productos, setProductos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<number[]>([])

  // Normalizador para que coincidan con tus componentes
  const normalizeProductos = (apiProductos: any[]) =>
    apiProductos.map((p) => ({
      id: p.id,
      name: p.nombre,
      price: p.precio,
      stock: p.stock,
      image: p.url_imagen_principal, // 👈 para el catálogo
      rating: p.valoracion_promedio,
      views: p.vistas,
    }))

  // Función de carga
  const loadProductos = async (reset = false) => {
    setLoading(true)
    try {
      let data
      const nextPage = reset ? 1 : page

      if (categoriasSeleccionadas.length > 0) {
        data = await fetchProductosPorCategorias(categoriasSeleccionadas, nextPage)
      } else {
        data = await fetchProductos(nextPage)
      }

      const nuevos = data.productos

      if (reset) {
        setProductos(nuevos)
        setPage(1)                // página actual es 1
      } else {
        setProductos((prev) => [...prev, ...nuevos])
        setPage(nextPage)         // mantener sincronizado el page usado
      }
      setHasMore(data.page * data.per_page < data.total)
    } catch (err) {
      console.error("Error cargando productos:", err)
    } finally {
      setLoading(false)
    }
  }



  // Primera carga y cuando cambian categorías
  useEffect(() => {
    loadProductos(true)
  }, [categoriasSeleccionadas])

  // Cuando cambia la página (para "cargar más")
  useEffect(() => {
    if (page > 1) {
      loadProductos(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const loadMore = () => setPage((prev) => prev + 1)

  // Filtros y orden
  const filteredAndSortedProducts = useMemo(() => {
    if (!Array.isArray(productos)) return []

    const filtered = productos.filter((product) => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (!product.name.toLowerCase().includes(query)) return false
      }

      // Price filter
      const price = product.price
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false
      }

      // Stock filter
      if (filters.inStock && (!product.stock || product.stock <= 0)) {
        return false
      }

      return true
    })

    // Sort
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case "popularity":
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0))
        break
      case "newest":
        filtered.sort((a, b) => Number(b.id) - Number(a.id))
        break
    }

    return filtered
  }, [productos, filters, sortBy, searchQuery])

  const breadcrumbItems = [{ label: "Catálogo" }]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 font-[family-name:var(--font-poppins)]">
            Catálogo de Productos
          </h1>
          <p className="text-muted-foreground font-[family-name:var(--font-inter)]">
            Descubre nuestra colección completa de productos de bienestar íntimo
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <CategorySidebar
              onCategoriasChange={(ids) => {
                setCategoriasSeleccionadas(ids)
                setPage(1)
              }}
            />
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => setIsSidebarOpen(true)} className="lg:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>

                <span className="text-sm text-muted-foreground font-[family-name:var(--font-inter)]">
                  {loading ? "Cargando..." : `${filteredAndSortedProducts.length} productos encontrados`}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <SortSelect />
              </div>
            </div>

            {/* Products grid */}
            <ProductGrid products={filteredAndSortedProducts} />
            {hasMore && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="flex items-center gap-2 text-primary hover:underline disabled:opacity-50"
                >
                  <span>Cargar más</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Mobile sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-80 bg-background border-r border-border overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold font-[family-name:var(--font-poppins)]">Filtros</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(false)}>
                  ✕
                </Button>
              </div>
              <CategorySidebar
                onCategoriasChange={(ids) => {
                  setCategoriasSeleccionadas(ids)
                  setPage(1)
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
