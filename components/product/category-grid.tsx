"use client"

import { useMemo, useState } from "react"
import { useFiltersStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import {
  ChevronDown,
  ChevronUp,
  Key,
  Plug,
  Vibrate,
  Waves,
  Shield,
  Target,
  Droplets,
  Shirt,
  CircleDot,
} from "lucide-react"

type Mode = "filter" | "navigate"

interface CategoryIconGridProps {
  className?: string
  onCategoriasChange?: (ids: number[]) => void
  mode?: Mode
}

type StaticCategory = {
  label: string
  icon: LucideIcon
  ids?: number[]
  children?: {
    label: string
    ids: number[]
  }[]
}

export function CategoryIconGrid({
  className = "",
  onCategoriasChange,
  mode = "filter",
}: CategoryIconGridProps) {
  const { filters, setFilters } = useFiltersStore()
  const router = useRouter()

  // solo un desplegable abierto a la vez
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // 11 categorías principales (estáticas)
  const CATEGORIES: StaticCategory[] = useMemo(
    () => [
      { label: "Accesorios", icon: Key, ids: [64] },
      { label: "Anales", icon: Plug, ids: [49] },
      {
        label: "Vibradores",
        icon: Vibrate,
        children: [
          { label: "Realísticos", ids: [56] },
          { label: "Comunes", ids: [672] },
        ],
      },
      {
        label: "Estimuladores",
        icon: Waves,
        children: [
          { label: "Vib. Importados", ids: [57] },
          { label: "Bolas Chinas", ids: [50] },
        ],
      },
      {
        label: "Fundas & Prótesis",
        icon: Shield,
        children: [
          { label: "Fundas/Ext.", ids: [61] },
          { label: "Prótesis", ids: [51] },
        ],
      },
      { label: "Succionadores", icon: Target, ids: [679] },
      {
        label: "Lubric. & Afro.",
        icon: Droplets,
        children: [
          { label: "Lubricantes", ids: [45] },
          { label: "Afrodisíacos", ids: [43] },
        ],
      },
      { label: "Lencería", icon: Shirt, ids: [38] },
      {
        label: "Masturbadores",
        icon: CircleDot,
        children: [
          { label: "Masculinos", ids: [59] },
          { label: "Anillos", ids: [47] },
        ],
      },
      { label: "SADO / BDSM", icon: CircleDot, ids: [65] },
      {
        label: "Dildos",
        icon: CircleDot,
        children: [
          { label: "Comunes", ids: [675] },
          { label: "Realísticos", ids: [53] },
          { label: "Gigantes", ids: [54] },
        ],
      },
    ],
    []
  )

  const selectedIds = useMemo(
    () => (filters.categories || []).map((x) => Number(x)).filter((n) => !Number.isNaN(n)),
    [filters.categories]
  )

  const applySelected = (next: number[]) => {
    const unique = Array.from(new Set(next)).filter((n) => !Number.isNaN(n))

    if (mode === "navigate") {
      router.push(`/catalogo?cats=${unique.join(",")}`)
      return
    }

    setFilters({ categories: unique.map(String) })
    onCategoriasChange?.(unique)
  }

  // ✅ toggle multi-select (agrega o quita IDs)
  const toggleIds = (ids: number[]) => {
    const anySelected = ids.some((id) => selectedIds.includes(id))
    const next = anySelected
      ? selectedIds.filter((x) => !ids.includes(x)) // si alguno estaba, los saca todos
      : [...selectedIds, ...ids] // si ninguno estaba, los agrega

    applySelected(next)
  }

  const handleMainClick = (cat: StaticCategory, index: number) => {
    if (cat.children?.length) {
      setOpenIndex((prev) => (prev === index ? null : index))
      return
    }

    const ids = cat.ids || []
    if (!ids.length) return

    // ✅ en modo filter: toggle multi
    if (mode === "filter") {
      toggleIds(ids)
      return
    }

    // navigate: ir a la lista con esos ids
    applySelected(ids)
  }

  // ✅ en subcategorías: también multi-select (toggle)
  const handleChildClick = (childIds: number[]) => {
    if (mode === "filter") {
      toggleIds(childIds)
      return
    }
    applySelected(childIds)
  }

  const isCatActive = (cat: StaticCategory) => {
    const ids = cat.ids || []
    const childIds = cat.children?.flatMap((c) => c.ids) || []
    const all = [...ids, ...childIds]
    return all.some((id) => selectedIds.includes(id))
  }

  return (
    <div className={`bg-background border-t border-border ${className}`}>
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* ✅ NO scroll: grid fija 11 columnas */}
        <div className="grid grid-cols-11 gap-3 items-start">
          {CATEGORIES.map((cat, index) => {
            const Icon = cat.icon
            const active = isCatActive(cat)
            const isOpen = openIndex === index

            return (
              <div key={cat.label} className="relative ">
                <button
                  type="button"
                  onClick={() => handleMainClick(cat, index)}
                  className="group flex flex-col items-center gap-2 w-full"
                >
                  <div
                    className={[
                      "h-12 cursor-pointer w-12 rounded-full border flex items-center justify-center transition",
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
                      "text-sm leading-tight text-center w-full line-clamp-2",
                      active && mode === "filter"
                        ? "text-foreground"
                        : "text-muted-foreground group-hover:text-foreground",
                    ].join(" ")}
                    title={cat.label}
                  >
                    {cat.label}
                  </span>

                  {cat.children?.length ? (
                    isOpen ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground cursor-pointer" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground cursor-pointer" />
                    )
                  ) : (
                    <span className="h-4 w-4" />
                  )}
                </button>

                {/* ✅ dropdown absoluto, subcategorías con toggle multi */}
                {cat.children?.length && isOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 z-50 w-44 rounded-xl border border-border bg-background shadow-lg p-2">
                    <div className="flex flex-col gap-1">
                      {cat.children.map((child) => {
                        const childActive = child.ids.some((id) => selectedIds.includes(id))
                        return (
                          <button
                            key={child.label}
                            type="button"
                            onClick={() => handleChildClick(child.ids)}
                            className={[
                              "text-m text-left px-2 py-1.5 rounded-md cursor-pointer transition",
                              childActive && mode === "filter"
                                ? "bg-primary/30 text-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                            ].join(" ")}
                            title={child.label}
                          >
                            {child.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* ✅ click afuera para cerrar desplegable */}
        {openIndex !== null && (
          <button
            aria-label="Cerrar desplegable"
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpenIndex(null)}
          />
        )}
      </div>
    </div>
  )
}
