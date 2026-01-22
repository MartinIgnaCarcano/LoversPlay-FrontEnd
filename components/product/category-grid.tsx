"use client"

import { useEffect, useMemo, useState } from "react"
import { useFiltersStore } from "@/lib/store"
import { fetchCategorias } from "@/lib/services/api"
import type { LucideIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  CircleDot,
  Droplets,
  Shirt,
  Hand,
  Waves,
  Vibrate,
  Plug,
  Sparkles,
  Pill,
  Shapes,
  Circle,
  Feather,
  Globe,
  Package,
  Radio,
  Zap,
} from "lucide-react"

type ApiCategoria = {
  id: number
  nombre: string
  icon_key?: string | null
  url_imagen?: string | null
  cantidad_productos?: number
}

const iconMap: Record<string, LucideIcon> = {
  CircleDot,
  Droplets,
  Shirt,
  Hand,
  Waves,
  Vibrate,
  Plug,
  Sparkles,
  Pill,
}

type Mode = "filter" | "navigate"

interface CategoryIconGridProps {
  className?: string
  onCategoriasChange?: (ids: number[]) => void
  mode?: Mode
}

export function CategoryIconGrid({
  className = "",
  onCategoriasChange,
  mode = "filter",
}: CategoryIconGridProps) {
  const { filters, setFilters } = useFiltersStore()
  const [categorias, setCategorias] = useState<ApiCategoria[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // ✅ seleccionadas (mismo criterio que CategorySidebar)
  const selectedIds = useMemo(
    () => (filters.categories || []).map((x) => Number(x)).filter((n) => !Number.isNaN(n)),
    [filters.categories]
  )

  const toggleCategoria = (id: number) => {
    const exists = selectedIds.includes(id)
    const next = exists ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]

    setFilters({ categories: next.map(String) })
    onCategoriasChange?.(next)
  }

  const handleClick = (id: number) => {
    if (mode === "navigate") {
      router.push(`/catalogo?cats=${id}`)
      return
    }
    toggleCategoria(id)
  }

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCategorias()
        setCategorias(data)
      } catch (e) {
        console.error("Error cargando categorías", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className={`bg-background border-t border-border ${className}`}>
        <div className="mx-auto max-w-6xl px-6 py-6">
          <p className="text-sm text-muted-foreground">Cargando categorías...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-background border-t border-border ${className}`}>
      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap justify-start lg:justify-center py-1">
          {categorias.map((c) => {
            const Icon = c.icon_key && iconMap[c.icon_key] ? iconMap[c.icon_key] : Shapes
            const active = selectedIds.includes(c.id)

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleClick(c.id)}
                className="group flex flex-col items-center gap-2 shrink-0 w-20 cursor-pointer"
              >
                <div
                  className={[
                    "h-12 w-12 rounded-full border flex items-center justify-center transition",
                    "group-hover:scale-105",
                    active && mode === "filter"
                      ? "border-foreground bg-primary/70"
                      : "border-border bg-background",
                  ].join(" ")}
                >
                  <Icon
                    className={[
                      "h-7 w-7 transition",
                      active && mode === "filter" ? "text-foreground" : "text-brand",
                    ].join(" ")}
                  />
                </div>

                <span
                  className={[
                    "text-xs text-center truncate whitespace-nowrap overflow-hidden w-full",
                    active && mode === "filter"
                      ? "text-foreground"
                      : "text-muted-foreground group-hover:text-foreground",
                  ].join(" ")}
                  title={c.nombre}
                >
                  {c.nombre}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
