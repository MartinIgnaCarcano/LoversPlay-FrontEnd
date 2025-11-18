import type { Pedido, Product, Usuario } from "@/lib/types"

const API_URL = "http://192.168.100.219:5000/api"



// 🔹 Cargar productos (paginado)
export async function fetchProductos(
  page: number = 1,
  perPage: number = 16
): Promise<{ page: number; per_page: number; productos: any[]; total: number }> {
  const res = await fetch(`${API_URL}/productos?page=${page}&per_page=${perPage}`)
  if (!res.ok) throw new Error("Error cargando productos")
  const data = await res.json()
  console.log("productos")
  console.log(data)

  return {
    ...data,
    productos: data.productos.map((p: any) => ({
      id: p.id,
      name: p.nombre,
      price: p.precio,
      stock: p.stock,
      image: p.url_imagen_principal,
      image2: p.url_imagen_secundaria,
      rating: p.valoracion_promedio,
      views: p.vistas,
    })),
  }
}

// 🔹 Cargar productos por categorías
export async function fetchProductosPorCategorias(
  ids: number[],
  page: number = 1,
  perPage: number = 16
): Promise<{ page: number; per_page: number; productos: Product[]; total: number }> {
  const res = await fetch(
    `${API_URL}/productos/por_categoria?ids=${ids.join(",")}&page=${page}&per_page=${perPage}`
  )
  if (!res.ok) throw new Error("Error cargando productos por categorías")

  const data = await res.json()
  console.log("productos por categoría")
  console.log(data)
  return {
    ...data,
    productos: data.productos.map((p: any) => ({
      id: p.id,
      name: p.nombre,
      price: p.precio,
      stock: p.stock,
      image: p.url_imagen_principal,
      image2: p.url_imagen_secundaria,
      rating: p.valoracion_promedio,
      views: p.vistas,
    })),
  }
}

// 🔹 Cargar categorías
export async function fetchCategorias(): Promise<{ id: number; nombre: string; url_imagen: string | null }[]> {
  const res = await fetch(`${API_URL}/categorias`)
  if (!res.ok) throw new Error("Error cargando categorías")
  const data = await res.json()
  return data // 👈 es un array directo
}

// 🔹 Producto por ID
export async function fetchProductoPorId(id: number): Promise<{ producto: Product; sugeridos: Product[] }> {
  const res = await fetch(`${API_URL}/productos/${id}`)
  if (!res.ok) throw new Error("Error cargando producto")
  const p = await res.json()

  const producto: Product = {
    id: p.id,
    nombre: p.nombre,
    precio: p.precio,
    stock: p.stock,
    descripcion_corta: p.descripcion_corta,
    descripcion_larga: p.descripcion_larga,
    url_imagen_principal: p.url_imagen_principal ?? p.imagenes?.[0],
    imagenes: p.imagenes?.length ? p.imagenes : (p.url_imagen_principal ? [p.url_imagen_principal] : []),
    categoria_id: p.categoria_id,
    vistas: p.vistas ?? 0,
    slug: p.slug,
  }

  const sugeridos: Product[] = (p.sugeridos || []).map((s: any) => ({
    id: s.id,
    nombre: s.nombre,
    precio: s.precio,
    url_imagen_principal: s.url_imagen_principal,
    url_imagen_secundaria: s.url_imagen_secundaria
  }))

  return { producto, sugeridos }
}

export async function fetchProductosBase() {
  const res = await fetch(`${API_URL}/productos/nombres`)
  if (!res.ok) throw new Error("Error al cargar productos")
  const data = await res.json()
  return data.map((p: any) => ({
    id: p.id,
    nombre: p.nombre,
    categoria_id: p.categoria_id,
    url_imagen_principal: p.url_imagen_principal
  }))
}


export { fetchProductoPorId as fetchProducto }

// 🔹 Login
export async function login(email: string, password: string): Promise<{ login: boolean }> {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "email": email,
        "password": password
      }),
    })

    if (!res.ok) throw new Error("Error al iniciar sesión")

    const data = await res.json()
    console.log("Respuesta del login:", data);
    if (data.access_token) {
      localStorage.setItem("access_token", data.access_token);
      return { login: true }
    }

    return { login: false }
  } catch (error) {
    console.error("Error en login:", error);
    throw error;
  }
}

// 🔹 Registro
export async function register(nombre: string, email: string, password: string, telefono: string): Promise<{ register: boolean }> {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "nombre": nombre,
        "email": email,
        "password": password,
        "telefono": telefono
      }),
    })

    if (!res.ok) throw new Error("Error al registrar usuario")
    const data = await res.json()

    if (data.id) {
      return { register: true }
    }

    return { register: false }
  } catch (error) {
    console.error("Error en registro:", error);
    throw error;
  }
}

// 🔹 Obtener detalles del usuario
export async function fetchUsuario(): Promise<Usuario> {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    }
  })

  if (!response.ok) throw new Error("Error cargando usuario")

  const data = await response.json()

  return {
    id: String(data.id),
    nombre: data.nombre,
    email: data.email,
    telefono: data.telefono,
    rol: data.rol || "cliente",
    direcciones: data.direcciones || [],
  }
}

export async function fetchPedidosPorUsuario(): Promise<Pedido[]> {
  const token = localStorage.getItem("access_token");
  console.log("🔑 Token usado:", token);

  const url = `${API_URL}/pedidos`; // 👈 sin barra al final
  console.log("🌐 Llamando a:", url);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("❌ Error HTTP:", response.status, text);
    throw new Error(`Error cargando pedidos: ${response.status}`);
  }

  const data = await response.json();
  console.log("📦 Datos de pedidos recibidos:", data);

  return data.map((pedido: any) => ({
    id: String(pedido.id),
    fecha: pedido.fecha,
    total: pedido.total,
    estado: pedido.estado,
    items: pedido.detalles.map((det: any) => ({
      producto: det.producto,
      cantidad: det.cantidad,
      subtotal: det.subtotal,
    })),
  }));
}

export async function actualizarUsuario(nombre: string, email: string, telefono: string, direccion: string): Promise<{ update: boolean }> {
  try {
    const res = await fetch(`${API_URL}/auth/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`
      },
      body: JSON.stringify({
        nombre,
        email,
        telefono,
        direccion
      })
    })

    if (!res.ok) throw new Error("Error al actualizar usuario")

    const data = await res.json()
    console.log("Respuesta de actualización de usuario:", data)

    return { update: true }
  } catch (error) {
    console.error("Error en actualización de usuario:", error)
    return { update: false }
  }
}

export async function fetchWishlist() {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    }
  })
  if (!response.ok) throw new Error("Error cargando fav")

  const data = await response.json()
  // Validamos que el backend devuelva un array en "favoritos"
  const favoritos = Array.isArray(data?.favoritos) ? data.favoritos : [];
  console.log("Favoritos: "+favoritos)
  return favoritos.map((p: any) => ({
    id: p.id,
    nombre: p.nombre,
    precio: p.precio,
    url_imagen_principal: p.url_imagen_principal
  }))
}