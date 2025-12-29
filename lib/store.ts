import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem, Usuario, FilterState, SortOption } from "./types"

interface CartStore {
  items: CartItem[]
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
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => String(i.productId) === String(item.productId))
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                String(i.productId) === String(item.productId)
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              ),
            }
          }
          return { items: [...state.items, item] }
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => String(item.productId) !== String(productId))
              : state.items.map((item) =>
                String(item.productId) === String(productId) ? { ...item, quantity } : item,
              ),
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


