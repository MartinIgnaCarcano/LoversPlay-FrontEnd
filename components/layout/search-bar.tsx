"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useFiltersStore } from "@/lib/store"
import { mockProductos, mockCategorias } from "@/lib/services/mock-data"
import Link from "next/link"

interface SearchBarProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<{
    products: typeof mockProductos
    categories: typeof mockCategorias
  }>({ products: [], categories: [] })
  const inputRef = useRef<HTMLInputElement>(null)
  const { setSearchQuery } = useFiltersStore()

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (query.length > 2) {
      // 🔍 Filtrar productos
      const filteredProducts = mockProductos
        .filter(
          (product) =>
            product.nombre.toLowerCase().includes(query.toLowerCase()) ||
            product.descripcion_corta?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)

      // 🔍 Filtrar categorías
      const filteredCategories = mockCategorias
        .filter((category) => category.nombre.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 3)


      setResults({ products: filteredProducts, categories: filteredCategories })
    } else {
      setResults({ products: [], categories: [] })
    }
  }, [query])

  const handleSearch = (searchQuery: string) => {
    setSearchQuery(searchQuery)
    onClose()
    // Navigate to catalog with search
    window.location.href = `/catalogo?q=${encodeURIComponent(searchQuery)}`
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      handleSearch(query)
    }
    if (e.key === "Escape") {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 pt-20">
        <div className="max-w-2xl mx-auto">
          {/* Search input */}
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Buscar productos, categorías..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10 pr-12 h-12 text-lg bg-card border-border"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Search results */}
          {(results.products.length > 0 || results.categories.length > 0) && (
            <div className="mt-4 bg-card rounded-lg border border-border shadow-lg max-h-96 overflow-y-auto">
              {/* Categorías */}
              {results.categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/catalogo/${category.id}`}
                  onClick={onClose}
                  className="block p-2 rounded hover:bg-muted transition-colors"
                >
                  <div className="font-medium text-card-foreground">{category.nombre}</div>
                  {/* Si no tenés count en tu mock, podés quitar esta línea */}
                  {/* <div className="text-sm text-muted-foreground">{category.count} productos</div> */}
                </Link>
              ))}

              {/* Productos */}
              {results.products.map((product) => (
                <Link
                  key={product.id}
                  href={`/producto/${product.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-2 rounded hover:bg-muted transition-colors"
                >
                  <img
                    src={product.url_imagen_principal || "/placeholder.svg"}
                    alt={product.nombre}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-card-foreground">{product.nombre}</div>
                    <div className="text-sm text-brand font-semibold">${product.precio}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* No results */}
          {query.length > 2 && results.products.length === 0 && results.categories.length === 0 && (
            <div className="mt-4 bg-card rounded-lg border border-border p-8 text-center">
              <p className="text-muted-foreground">No se encontraron resultados para "{query}"</p>
              <Button variant="outline" className="mt-4 bg-transparent" onClick={() => handleSearch(query)}>
                Buscar en todo el catálogo
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
