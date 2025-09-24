import { ProductCard } from "./product-card"
import type { Product } from "@/lib/types"

interface ProductGridProps {
  products?: any[]
  className?: string
}

export function ProductGrid({ products, className = "" }: ProductGridProps) {
  if (!Array.isArray(products)) {
    console.error("❌ ProductGrid recibió algo que no es un array:", products)
    return null
  }

  if (products.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-foreground mb-2 font-[family-name:var(--font-poppins)]">
          No se encontraron productos
        </h3>
        <p className="text-muted-foreground font-[family-name:var(--font-inter)]">
          Intenta ajustar los filtros o buscar algo diferente
        </p>
      </div>
    )
  }


  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>

  )
}
