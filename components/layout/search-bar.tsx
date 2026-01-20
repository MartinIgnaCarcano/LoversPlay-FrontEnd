"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useFiltersStore } from "@/lib/store"
import { fetchProductosBase } from "@/lib/services/api"
import Fuse from "fuse.js"
import Link from "next/link"

interface SearchBarProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [fuse, setFuse] = useState<Fuse<any> | null>(null)
  const [productos, setProductos] = useState<any[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const { setSearchQuery } = useFiltersStore()

  // Foco automático al abrir
  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus()
  }, [isOpen])

  // 🔄 Limpiar al cerrar
  useEffect(() => {
    if (!isOpen) {
      setQuery("")
      setResults([])
    }
  }, [isOpen])

  // Cargar productos una sola vez
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const prods = await fetchProductosBase()
        const productosLimpios = prods.filter((p: any) => p && p.nombre)
        setProductos(productosLimpios)

        const fuseInstance = new Fuse(productosLimpios, {
          keys: ["nombre"],
          threshold: 0.3,
        })
        setFuse(fuseInstance)
      } catch (err) {
        console.error("❌ Error cargando productos:", err)
      }
    }

    cargarProductos()
  }, [])

  // Búsqueda local con Fuse.js
  useEffect(() => {
    if (!fuse || query.trim().length < 2) {
      setResults([])
      return
    }

    const productosFiltrados = fuse.search(query).map((r) => r.item).slice(0, 8)
    setResults(productosFiltrados)
  }, [query, fuse])

  const handleSearch = (searchQuery: string) => {
    setSearchQuery(searchQuery)
    onClose()
    window.location.href = `/catalogo?q=${encodeURIComponent(searchQuery)}`
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) handleSearch(query)
    if (e.key === "Escape") onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 pt-20">
        <div className="max-w-2xl mx-auto">
          {/* Input de búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Buscar productos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-12 h-12 text-lg bg-card border-border"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery("")
                setResults([])
                onClose()
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Resultados */}
          {results.length > 0 && (
            <div className="mt-4 bg-card rounded-lg border border-border shadow-lg max-h-96 overflow-y-auto">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                  Productos
                </h3>
                <div className="space-y-2">
                  {results.map((p) => (
                    <Link
                      key={p.id}
                      href={`/producto?id=${p.id}`}
                      onClick={onClose}
                      className="flex items-center gap-3 p-2 rounded hover:bg-muted transition-colors"
                    >
                      <img
                        src={p.url_imagen_principal || "/placeholder.svg"}
                        alt={p.nombre}
                        className="w-10 h-10 rounded object-cover"
                        onError={(e) =>
                          ((e.target as HTMLImageElement).src = "/placeholder.svg")
                        }
                      />
                      <div className="flex-1">
                        <div className="font-medium text-card-foreground">
                          {p.nombre}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sin resultados */}
          {query.length > 2 && results.length === 0 && (
            <div className="mt-4 bg-card rounded-lg border border-border p-8 text-center">
              <p className="text-muted-foreground">
                No se encontraron resultados para "{query}"
              </p>
              <Button
                variant="outline"
                className="mt-4 bg-transparent"
                onClick={() => handleSearch(query)}
              >
                Buscar en todo el catálogo
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
