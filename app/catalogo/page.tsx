// FILE: app/catalogo/page.tsx
"use client"

import { useCallback, useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { CategorySidebar } from "@/components/product/category-sidebar"
import { ProductGrid } from "@/components/product/product-grid"
import { SortSelect } from "@/components/product/sort-select"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { useFiltersStore } from "@/lib/store"
import { fetchProductos } from "@/lib/services/api"
import { Pagination } from "@/components/ui/pagination"
import { CategoryIconGrid } from "@/components/product/category-grid"
import { useIsMobile } from "@/hooks/use-mobile"
import { useSearchParams } from "next/navigation"

export default function CatalogPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const isMobile = useIsMobile()
  const searchParams = useSearchParams()

  const { filters, sortBy } = useFiltersStore()
  const { setFilters } = useFiltersStore()

  const [totalGlobal, setTotalGlobal] = useState(0)
  const [productos, setProductos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<number[]>([])

  // ✅ mapping UI -> API sort (no invento más)
  const mapSortToApi = (ui: string) => {
    switch (ui) {
      case "price-asc":
        return "price_asc"
      case "price-desc":
        return "price_desc"
      case "popularity":
        return "most_viewed"
      // si algún día agregás opción “más vendidos” en el select:
      case "best-selling":
        return "best_selling"
      default:
        return "relevance"
    }
  }

  const PER_PAGE = 12

  // ✅ Carga: ahora TODO se lo delegás al back
  const loadProductos = useCallback(
    async (pageNumber: number, ids: number[], inStock: boolean, sortUi: string) => {
      setLoading(true)
      try {
        const data = await fetchProductos({
          page: pageNumber,
          per_page: PER_PAGE,
          categoria_ids: ids,
          in_stock: inStock,
          sort: mapSortToApi(sortUi),
        })

        setProductos(data.productos)
        setTotalGlobal(data.total)
        setPage(pageNumber)
        setTotalPages(Math.ceil(data.total / data.per_page))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // ✅ leer cats desde URL (solo para entrar con /catalogo?cats=1,2)
  useEffect(() => {
    const cats = searchParams.get("cats")
    const ids = cats ? cats.split(",").map(Number).filter((n) => !Number.isNaN(n)) : []
    setCategoriasSeleccionadas(ids)
    setFilters({ categories: ids.map(String) })
    setPage(1)
  }, [searchParams, setFilters])

  // ✅ cada cambio relevante dispara request (SIN ordenar en front)
  useEffect(() => {
    loadProductos(page, categoriasSeleccionadas, !!filters.inStock, sortBy)
  }, [page, categoriasSeleccionadas, filters.inStock, sortBy, loadProductos])

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
        {isMobile ? null : (
          <div className="mb-6">
            <CategoryIconGrid
              onCategoriasChange={(ids) => {
                setCategoriasSeleccionadas(ids)
                setPage(1) // ✅ reset page
              }}
            />
          </div>
        )}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <CategorySidebar
              onCategoriasChange={(ids) => {
                setCategoriasSeleccionadas(ids)
                setPage(1) // ✅ reset page
              }}
            />
          </aside>

          {/* Main */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>

                <span className="text-sm text-muted-foreground font-[family-name:var(--font-inter)]">
                  {loading ? "Cargando..." : `${totalGlobal} productos encontrados`}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <SortSelect />
              </div>
            </div>



            {/* ✅ NO hay filteredAndSortedProducts */}
            <ProductGrid products={productos} />

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)} // ✅ cambia page, el effect pide al back
              maxVisible={5}
            />
          </div>
        </div>
      </main>

      <Footer />

      {/* Mobile sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
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
                  setIsSidebarOpen(false)
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
