"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { useFiltersStore } from "@/lib/store"
import { fetchCategorias } from "@/lib/services/api"
import { useIsMobile } from "@/hooks/use-mobile"

interface CategorySidebarProps {
  className?: string
  onCategoriasChange?: (ids: number[]) => void
}

export function CategorySidebar({ className = "", onCategoriasChange }: CategorySidebarProps) {
  const { filters, setFilters, clearFilters } = useFiltersStore()
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [categorias, setCategorias] = useState<{ id: number; nombre: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const isMobile = useIsMobile()

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, categoryId]
      : filters.categories.filter((id) => id !== categoryId)

    setFilters({ categories: newCategories })

    // Avisar al padre
    if (onCategoriasChange) {
      onCategoriasChange(newCategories.map((id) => Number(id)))
    }
  }

  const handlePriceChange = (value: number[]) => {
    setFilters({ priceRange: [value[0], value[1]] as [number, number] })
  }

  const handleStockChange = (checked: boolean) => {
    setFilters({ inStock: checked })
  }

  const handleClearButton = () => {
    // Valores iniciales por defecto
    const defaultFilters = {
      categories: [],
      priceRange: [0, 99998] as [number, number],
      inStock: false,
    }

    setFilters(defaultFilters)

    // Avisar al componente padre (si lo hay)
    if (onCategoriasChange) {
      onCategoriasChange([])
    }

    // Colapsar categorías (opcional)
    setExpandedCategories([])
  }


  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const data = await fetchCategorias()
        setCategorias(data)
      } catch (error) {
        console.error("Error cargando categorías", error)
      } finally {
        setLoading(false)
      }
    }
    loadCategorias()
  }, [])


  return (
    <div className={`bg-card rounded-xl border border-border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-card-foreground font-[family-name:var(--font-poppins)]">Filtros</h2>
        <Button className="cursor-pointer text-base" variant="ghost" size="sm" onClick={handleClearButton}>
          Limpiar
        </Button>
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <h3 className="font-medium text-card-foreground mb-3 font-[family-name:var(--font-poppins)]">
            Rango de Precio
          </h3>
          <div className="space-y-4">
            <Slider
              value={filters.priceRange}
              onValueChange={handlePriceChange}
              max={99999}
              min={0}
              step={500}
              className="w-full"
            />
            <div className="flex items-center justify-between text-base text-muted-foreground">
              <span>${filters.priceRange[0]?.toLocaleString?.("es-AR")}</span>
              <span>${filters.priceRange[1]?.toLocaleString?.("es-AR")}</span>
            </div>
          </div>
        </div>
        {/* Stock */}
        <div>
          <h3 className="font-medium text-card-foreground mb-3 font-[family-name:var(--font-poppins)]">
            Disponibilidad
          </h3>
          <div className="flex items-center space-x-2">
            <Checkbox id="in-stock" checked={filters.inStock} onCheckedChange={handleStockChange} />
            <label
              htmlFor="in-stock"
              className="text-base text-card-foreground cursor-pointer font-[family-name:var(--font-inter)]"
            >
              Solo productos en stock
            </label>
          </div>
        </div>
        {/* Categories */}
        {isMobile ? (
          <>
            <div>
              <h3 className="font-medium text-card-foreground mb-3 font-[family-name:var(--font-poppins)]">Categorías</h3>
              <div className="relative">
                <div className={`space-y-2 ${!showAll ? "max-h-48 overflow-hidden" : ""}`}>
                  {loading ? (
                    <p className="text-sm text-muted-foreground">Cargando categorías...</p>
                  ) : categorias && categorias.length > 0 ? (
                    (showAll ? categorias : categorias.slice(0, 5)).map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={filters.categories.includes(String(category.id))}
                          onCheckedChange={(checked) =>
                            handleCategoryChange(String(category.id), checked as boolean)
                          }
                        />
                        <label
                          htmlFor={`category-${category.id}`}
                          className="text-sm text-card-foreground cursor-pointer flex-1 font-[family-name:var(--font-inter)]"
                        >
                          {category.nombre}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No hay categorías disponibles</p>
                  )}
                </div>

                {/* Degradado solo cuando no se muestran todas */}
                {!showAll && categorias.length > 5 && (
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card to-transparent pointer-events-none"></div>
                )}
              </div>

              {/* Botón para expandir/colapsar */}
              {categorias.length > 5 && (
                <div className="mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAll((prev) => !prev)}
                    className="w-full"
                  >
                    {showAll ? "Ver menos" : "Ver más"}
                    {showAll ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 15l-7-7-7 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
          </>
        )}



      </div>
    </div>
  )
}
