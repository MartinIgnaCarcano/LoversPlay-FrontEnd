"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useFiltersStore } from "@/lib/store"
import { mockProducts, mockCategories } from "@/lib/services/mock-data"
import Link from "next/link"

interface SearchBarProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<{
    products: typeof mockProducts
    categories: typeof mockCategories
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
      const filteredProducts = mockProducts
        .filter(
          (product) =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.tags?.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase())),
        )
        .slice(0, 5)

      const filteredCategories = mockCategories
        .filter((category) => category.name.toLowerCase().includes(query.toLowerCase()))
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
              {/* Categories */}
              {results.categories.length > 0 && (
                <div className="p-4 border-b border-border">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">Categorías</h3>
                  <div className="space-y-2">
                    {results.categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/catalogo/${category.slug}`}
                        onClick={onClose}
                        className="block p-2 rounded hover:bg-muted transition-colors"
                      >
                        <div className="font-medium text-card-foreground">{category.name}</div>
                        <div className="text-sm text-muted-foreground">{category.count} productos</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Products */}
              {results.products.length > 0 && (
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">Productos</h3>
                  <div className="space-y-2">
                    {results.products.map((product) => (
                      <Link
                        key={product.id}
                        href={`/producto/${product.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 p-2 rounded hover:bg-muted transition-colors"
                      >
                        <img
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-card-foreground">{product.name}</div>
                          <div className="text-sm text-brand font-semibold">${product.salePrice || product.price}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
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
