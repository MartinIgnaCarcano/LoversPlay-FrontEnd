import type { Pedido, Product, Usuario } from "@/lib/types"
export { fetchProductoPorId as fetchProducto }

const API_URL = "https://mckenzie-burthensome-denita.ngrok-free.dev/api"

function handleUnauthorized(res: Response) {
  if (res.status === 401 || res.status === 403) {
    // Token inválido o expirado
    localStorage.removeItem("access_token");

    try {
      // Si usas Zustand para autenticación:
      const { logout } = require("@/lib/store").useAuthStore.getState();
      logout();
    } catch { }

    // Redirigir al login
    window.location.href = "/login";
  }
}


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

// 🔹 Login
export async function login(email: string, password: string): Promise<{
  login: boolean;
  id?: number;
  nombre?: string;
}> {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password
      }),
    });

    if (!res.ok) throw new Error("Error al iniciar sesión");

    const data = await res.json();
    console.log("Respuesta del login:", data);

    if (data.access_token) {
      localStorage.setItem("access_token", data.access_token);

      return {
        login: true,
        id: data.id,
        nombre: data.nombre
      };
    }

    return { login: false };
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
export async function fetchUsuario() {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })

    if (response.status === 401 || response.status === 403) {
      handleUnauthorized(response);
      return null;
    }

    if (!response.ok) {
      throw new Error("Error cargando usuario");
    }

    const data = await response.json()

    return {
      id: String(data.id),
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono,
      rol: data.rol || "cliente",
      direccion: data.direccion || {},
    }
  } catch (err) {
    console.error("❌ Error fetchUsuario:", err);
    return null;
  }
}

export async function fetchPedidosPorUsuario(): Promise<Pedido[] | null> {
  const token = localStorage.getItem("access_token");

  const url = `${API_URL}/pedidos`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // 🔥 manejar token vencido
  if (response.status === 401 || response.status === 403) {
    handleUnauthorized(response);
    return null;
  }

  if (!response.ok) {
    const text = await response.text();
    console.error("❌ Error HTTP:", response.status, text);
    return null; // 👈 detener ejecución limpia
  }

  const data = await response.json();

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


export async function actualizarUsuario(data: {
  nombre: string
  email: string
  telefono: string
  direccion: {
    calle: string
    departamento: string
    provincia: string
    codigo_postal: string
    extra: string
  }
}): Promise<{ update: boolean }> {

  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`
      },
      body: JSON.stringify(data)
    })

    if (!res.ok) throw new Error("Error al actualizar usuario")

    const json = await res.json()
    console.log("Respuesta actualización usuario:", json)

    return { update: true }

  } catch (error) {
    console.error("Error en actualización de usuario:", error)
    return { update: false }
  }
}


export async function fetchFavorites() {
  try {
    const res = await fetch(`${API_URL}/auth/mis-productos`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`
      }
    });

    if (res.status === 401 || res.status === 403) {
      handleUnauthorized(res);
      return null; // 👈 importante
    }

    if (!res.ok) throw new Error("Error obteniendo favoritos");

    return await res.json();
  } catch (error) {
    console.error("❌ Error al obtener favoritos:", error);
    return null; // 👈 importante: NO devolver [], así no rompe tu UI
  }
}


// Agregar favorito
export async function agregarFavorito(productoId: number) {
  const res = await fetch(`${API_URL}/auth/fav/${productoId}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("access_token")}`
    }
  });

  if (!res.ok) throw new Error("Error agregando favorito");
  return await res.json();
}

// Eliminar favorito
export async function eliminarFavorito(fav_id: number) {
  const res = await fetch(`${API_URL}/auth/deletefav/${fav_id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("access_token")}`
    }
  });

  if (!res.ok) throw new Error("Error eliminando favorito");
  return await res.json();
}

export async function calcularEnvio(cp: number, tipo_envio: string) {
  try {
    console.log("cp:" + cp)
    console.log("tipo_envio: " + tipo_envio)
    const res = await fetch(`${API_URL}/envios/calcular`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cp, tipo_envio }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Error al calcular envío:", text);
      return null;
    }

    const data = await res.json();
    return data; // { precio: number }
  } catch (error) {
    console.error("❌ Error en calcularEnvio:", error);
    return null;
  }
}
