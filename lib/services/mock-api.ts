import { mockProductos, mockCategorias, mockUsuarios, mockPedidos } from "./mock-data"
import type { Product, Usuario, Pedido } from "@/lib/types"

// 🔹 Productos
export async function fetchProductosMock(
  page: number = 1,
  perPage: number = 15
): Promise<{ page: number; per_page: number; productos: Product[]; total: number }> {
  const start = (page - 1) * perPage
  const end = start + perPage
  const productos = mockProductos.slice(start, end)
  return {
    page,
    per_page: perPage,
    productos,
    total: mockProductos.length,
  }
}

export async function fetchProductoPorIdMock(id: number): Promise<{ producto: Product; sugeridos: Product[] }> {
  const producto = mockProductos.find((p) => p.id === id)
  if (!producto) throw new Error("Producto no encontrado")
  // Para sugeridos tomamos 3 random del mismo array
  const sugeridos = mockProductos.filter((p) => p.id !== id).slice(0, 3)
  return { producto, sugeridos }
}

// 🔹 Categorías
export async function fetchCategoriasMock() {
  return mockCategorias
}

// 🔹 Usuarios
export async function loginMock(email: string, password: string): Promise<{ login: boolean; usuario?: Usuario }> {
  const usuario = mockUsuarios.find((u) => u.email === email)
  if (usuario) {
    return { login: true, usuario }
  }
  return { login: false }
}

export async function fetchUsuarioMock(id: string): Promise<Usuario> {
  const usuario = mockUsuarios.find((u) => u.id === id)
  if (!usuario) throw new Error("Usuario no encontrado")
  return usuario
}

// 🔹 Pedidos
export async function fetchPedidosPorUsuarioMock(userId: string): Promise<Pedido[]> {
  // Para simplificar, devolvemos todos los pedidos (puedes filtrar por usuario si quieres)
  return mockPedidos
}

export async function crearPedidoMock(detalles: { producto_id: number; cantidad: number }[]): Promise<Pedido> {
  const nuevo: Pedido = {
    id: String(mockPedidos.length + 1),
    fecha: new Date().toISOString(),
    total: detalles.reduce((acc, d) => {
      const p = mockProductos.find((p) => p.id === d.producto_id)
      return acc + (p ? p.precio * d.cantidad : 0)
    }, 0),
    estado: "PENDIENTE",
    items: detalles.map((d) => {
      const p = mockProductos.find((p) => p.id === d.producto_id)
      return {
        producto: p ? p.nombre : "Desconocido",
        cantidad: d.cantidad,
        subtotal: p ? p.precio * d.cantidad : 0,
      }
    }),
  }
  mockPedidos.push(nuevo)
  return nuevo
}