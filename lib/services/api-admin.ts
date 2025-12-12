// lib/services/api-admin.ts
const API_URL = "http://localhost:5000/api";

// Utilidad: incluir token automáticamente
function authHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
  };
}

/* ============================
 *   PRODUCTOS — ADMIN CRUD
 * ============================ */

// GET paginado
export async function adminFetchProductos(page = 1, perPage = 10) {
  const res = await fetch(`${API_URL}/productos?page=${page}&per_page=${perPage}`);

  if (!res.ok) throw new Error("Error cargando productos");
  return await res.json(); // {page, per_page, productos[], total}
}

// GET por id
export async function adminFetchProducto(id: number) {
  const res = await fetch(`${API_URL}/productos/${id}`, {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Error cargando producto");
  return await res.json();
}

// CREATE — FormData
export async function adminCreateProducto(formData: FormData) {
  const res = await fetch(`${API_URL}/productos`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Error creando producto");

  return await res.json(); // {id, message}
}

// UPDATE — FormData o JSON según corresponda
export async function adminUpdateProducto(id: number, formData: FormData) {
  const res = await fetch(`${API_URL}/productos/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: formData,
  });

  if (!res.ok) throw new Error("Error actualizando producto");

  return await res.json(); // {message}
}

// DELETE
export async function adminDeleteProducto(id: number) {
  const res = await fetch(`${API_URL}/productos/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Error eliminando producto");
  return await res.json(); // {message}
}

export async function adminFiltrarProductos({
  filtro = "",
  categoria = "",
  page = 1,
  perPage = 20,
}: {
  filtro?: string;
  categoria?: string | number;
  page?: number;
  perPage?: number;
}) {
  const url = new URL(`${API_URL}/productos/filtro`);

  if (filtro) url.searchParams.set("filtro", filtro);
  if (categoria) url.searchParams.set("id", String(categoria));

  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(perPage));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Error filtrando productos");

  return await res.json(); // { page, per_page, total, productos }
}



// ===============================
//     CATEGORÍAS (ADMIN)
// ===============================

// Listar categorías
export async function adminFetchCategorias() {
  const res = await fetch(`${API_URL}/categorias`);
  if (!res.ok) throw new Error("Error cargando categorías");
  return await res.json();
}

// Traer una categoría por ID
export async function adminFetchCategoria(id: number) {
  const res = await fetch(`${API_URL}/categorias/${id}`);
  if (!res.ok) throw new Error("Error cargando categoría");
  return await res.json();
}

// Crear categoría
export async function adminCreateCategoria(formData: FormData) {
  const res = await fetch(`${API_URL}/categorias/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Error creando categoría");
  return await res.json();
}

// Editar categoría
export async function adminUpdateCategoria(id: number, formData: FormData) {
  const res = await fetch(`${API_URL}/categorias/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Error actualizando categoría");
  return await res.json();
}

// Eliminar categoría
export async function adminDeleteCategoria(id: number) {
  const res = await fetch(`${API_URL}/categorias/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });

  if (!res.ok) throw new Error("Error eliminando categoría");
  return true;
}

// =====================================
//             ENVIOS (ADMIN)
// =====================================

export async function adminFetchEnvios() {
  const res = await fetch(`${API_URL}/envios`);
  if (!res.ok) throw new Error("Error cargando envíos");
  return await res.json();
}

export async function adminFetchEnvio(id: number) {
  const res = await fetch(`${API_URL}/envios/${id}`);
  if (!res.ok) throw new Error("Error cargando envío");
  return await res.json();
}

export async function adminCreateEnvio(payload: {
  nombre: string;
  cp_inicio: number;
  cp_fin: number;
  tipo_envio: string;
  precio: number;
}) {
  const res = await fetch(`${API_URL}/envios/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Error creando envío");
  return await res.json();
}

export async function adminUpdateEnvio(id: number, payload: any) {
  const res = await fetch(`${API_URL}/envios/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Error actualizando envío");
  return await res.json();
}

export async function adminDeleteEnvio(id: number) {
  const res = await fetch(`${API_URL}/envios/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });

  if (!res.ok) throw new Error("Error eliminando envío");
  return true;
}


// ===========================
//      USUARIOS ADMIN
// ===========================

export async function adminFetchUsuarios(page = 1, perPage = 20) {
  const url = new URL(`${API_URL}/auth/listar`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(perPage));

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`
    }
  });

  if (!res.ok) throw new Error("Error cargando usuarios");
  return await res.json();
}

export async function adminFetchUsuario(id: number) {
  const res = await fetch(`${API_URL}/auth/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });

  if (!res.ok) throw new Error("Error cargando usuario");
  return await res.json();
}

export async function adminUpdateUsuario(id: number, payload: any) {
  const res = await fetch(`${API_URL}/auth/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Error actualizando usuario");
  return await res.json();
}

export async function adminDeleteUsuario(id: number) {
  const res = await fetch(`${API_URL}/auth/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });

  if (!res.ok) throw new Error("Error desactivando usuario");
  return true;
}


// ===========================
//      PEDIDOS ADMIN
// ===========================
export async function adminFetchPedidos(page = 1, perPage = 10) {
  const url = `${API_URL}/pedidos/listar?page=${page}&per_page=${perPage}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  })
  if (!res.ok) throw new Error("Error cargando pedidos");

  return await res.json();
}

export async function adminFetchPedido(id: number) {
  const url = `${API_URL}/pedidos/unico/${id}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  })
  if (!res.ok) throw new Error("Error cargando pedidos");

  return await res.json();
}

export async function adminUpdatePedidoEstado(id: number, nuevoEstado: string) {
  const res = await fetch(`${API_URL}/pedidos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ estado: nuevoEstado }),
  });

  if (!res.ok) throw new Error("Error actualizando estado del pedido");
  return await res.json();
}

export async function adminDeletePedido(id: number) {
  const res = await fetch(`${API_URL}/pedidos/${id}`, {
    method: "DELETE",
    credentials: "include"
  });

  if (!res.ok) throw new Error("Error eliminando pedido");
  return await res.json();
}