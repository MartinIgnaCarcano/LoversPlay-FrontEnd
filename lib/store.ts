import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem, Usuario, FilterState, SortOption } from "./types"

interface CartStore {
  items: CartItem[]
  cartPulse: number
  pulseCart: () => void
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

interface AuthStore {
  user: Usuario | null
  isAuthenticated: boolean
  login: (user: Usuario) => void
  logout: () => void
}

interface FiltersStore {
  filters: FilterState
  sortBy: SortOption
  searchQuery: string
  setFilters: (filters: Partial<FilterState>) => void
  setSortBy: (sort: SortOption) => void
  setSearchQuery: (query: string) => void
  clearFilters: () => void
}

const toNumberOrNull = (v: unknown): number | null => {
  if (typeof v === "number" && Number.isFinite(v)) return v
  if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) return Number(v)
  return null
}

// 🔹 Filtros
export const useFiltersStore = create<FiltersStore>()((set) => ({
  filters: {
    categories: [],
    priceRange: [0, 100_000], // rango extendido
    rating: [],
    inStock: false,
    tags: [],
  },
  sortBy: "relevance",
  searchQuery: "",

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  setSortBy: (sort) => set({ sortBy: sort }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  clearFilters: () =>
    set({
      filters: {
        categories: [],
        priceRange: [0, 100_000],
        rating: [],
        inStock: false,
        tags: [],
      },
      searchQuery: "",
    }),
}))

// 🔹 Carrito
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      cartPulse: 0, // ✅ NUEVO
      pulseCart: () => set((s) => ({ cartPulse: s.cartPulse + 1 })), // ✅ NUEVO

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => String(i.productId) === String(item.productId))
          const currentQty = existingItem?.quantity ?? 0

          const knownStock =
            toNumberOrNull(item.stock) ??
            toNumberOrNull(existingItem?.stock) ??
            null

          if (knownStock === null) return state

          const desiredQty = currentQty + item.quantity
          const finalQty = Math.min(desiredQty, knownStock)

          // si no hay stock disponible, no hacemos nada
          if (finalQty <= 0 || finalQty === currentQty) {
            return state
          }

          setTimeout(() => get().pulseCart(), 0)

          if (existingItem) {
            return {
              items: state.items.map((i) =>
                String(i.productId) === String(item.productId)
                  ? { ...i, quantity: finalQty, stock: item.stock ?? i.stock }
                  : i,
              ),
            }
          }

          return {
            items: [...state.items, { ...item, quantity: finalQty }],
          }
        }),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          const item = state.items.find((i) => String(i.productId) === String(productId))
          if (!item) return state

          const currentQty = item.quantity

          const stockNum = toNumberOrNull(item.stock)

          if (stockNum === null) {
            if (quantity > currentQty) return state
            const q = quantity
            return {
              items:
                q <= 0
                  ? state.items.filter((i) => String(i.productId) !== String(productId))
                  : state.items.map((i) =>
                    String(i.productId) === String(productId) ? { ...i, quantity: q } : i
                  ),
            }
          }

          const clampedQty = Math.min(quantity, stockNum)

          // ✅ NUEVO: pulso solo si aumentó
          if (clampedQty > currentQty) {
            setTimeout(() => get().pulseCart(), 0)
          }

          return {
            items:
              clampedQty <= 0
                ? state.items.filter((i) => String(i.productId) !== String(productId))
                : state.items.map((i) =>
                  String(i.productId) === String(productId) ? { ...i, quantity: clampedQty } : i,
                ),
          }
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => String(i.productId) !== String(productId)),
        })),
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () =>
        get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: "cart-storage",
    },
  ),
)

// 🔹 Autenticación
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => {
        localStorage.removeItem("access_token");
        set({ user: null, isAuthenticated: false })
      }
    }),
    {
      name: "auth-storage",
    },
  ),
)


