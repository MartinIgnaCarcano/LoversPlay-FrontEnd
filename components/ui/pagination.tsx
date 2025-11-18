"use client"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  maxVisible?: number // default = 5
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 5,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const createPageArray = () => {
    const pages: (number | string)[] = []

    const half = Math.floor(maxVisible / 2)

    let start = Math.max(1, currentPage - half)
    let end = Math.min(totalPages, currentPage + half)

    // Ajustar cuando estamos al principio
    if (currentPage <= half) {
      start = 1
      end = Math.min(totalPages, maxVisible)
    }

    // Ajustar cuando estamos al final
    if (currentPage > totalPages - half) {
      start = Math.max(1, totalPages - maxVisible + 1)
      end = totalPages
    }

    // Punto suspensivo inicial
    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push("…")
    }

    // Rango central
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Punto suspensivo final
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("…")
      pages.push(totalPages)
    }

    return pages
  }

  const pageList = createPageArray()

  return (
    <div className="flex items-center justify-center gap-2 py-10">

      {/* Flecha izquierda */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-2 py-1 text-sm text-muted-foreground disabled:opacity-40 cursor-pointer
             sm:px-2 sm:py-1
             hidden sm:block"
      >
        ◄ Anterior
      </button>

      {/* Flecha izquierda solo ícono */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-2 py-1 text-sm text-muted-foreground disabled:opacity-40
             sm:hidden"
      >
        ◄
      </button>

      {/* Números */}
      <div className="flex items-center gap-2">
        {pageList.map((item, idx) =>
          typeof item === "string" ? (
            <span key={idx} className="px-2 text-muted-foreground">
              …
            </span>
          ) : (
            <button
              key={idx}
              onClick={() => onPageChange(item)}
              className={`px-3 py-1 text-sm rounded border hover: cursor-pointer ${currentPage === item
                ? "bg-primary text-white border-primary"
                : "bg-card text-foreground border-border hover:bg-accent"
                }`}
            >
              {item}
            </button>
          )
        )}
      </div>

      {/* Flecha derecha */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-2 py-1 text-sm text-muted-foreground disabled:opacity-40 cursor-pointer
             hidden sm:block"
      >
        Siguiente ►
      </button>

      {/* Flecha derecha solo ícono */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-2 py-1 text-sm text-muted-foreground disabled:opacity-40
             sm:hidden"
      >
        ►
      </button>

    </div>
  )
}
