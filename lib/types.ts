// 📂 Categorías del catálogo
export type Category = {
  id: string
  name: string
  slug: string
  count?: number
  parentId?: string | null
}

// 🛍️ Producto principal que se muestra en catálogo/front
export type Product = {
  id: number
  nombre: string
  slug?: string
  precio: number
  stock?: number
  categoria_id?: number
  descripcion_corta?: string
  descripcion_larga?: string
  peso?: number
  vistas?: number
  // 👉 En el catálogo puede venir solo la principal, en detalle viene array
  imagenes?: string[]
  url_imagen_principal?: string
  // 👉 Cuando es detalle, vienen sugeridos. Cuando no, simplemente undefined
  sugeridos?: {
    id: number
    nombre: string
    precio: number
    url_imagen_principal: string
  }[]
}

// 🚚 Métodos de envío
export type ShippingMethod = {
  id: string
  name: string
  eta: string
  regions: string[]
  priceRules: string
  icon?: string
}

// 🛒 Item dentro del carrito
export interface CartItem {
  productId: string
  name: string
  price: number
  salePrice?: number
  image: string
  quantity: number
}

// 👤 Usuario autenticado
export type Usuario = {
  id: string
  email: string
  nombre: string
  telefono: string
  rol: "cliente" | "admin"
  direcciones: string[]
}

// pedido
export type Pedido = {
  id: string
  fecha: string
  total: number
  estado: string
  items: {
    producto: string
    cantidad: number
    subtotal: number
  }[]
}

// 🔎 Estado de filtros para catálogo
export type FilterState = {
  categories: string[]
  priceRange: [number, number]
  rating: number[]
  inStock: boolean
  tags: string[]
}

// 📦 Producto proveniente del backend (mapeo API → front)
export type BackendProduct = {
  id: number
  nombre: string
  precio: number
  stock: number
  url_imagen_principal: string
  valoracion_promedio?: number
  vistas?: number
  descripcion?: string
}

// 🔽 Opciones de ordenamiento
export type SortOption =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "popularity"
  | "newest"
  | "rating"

