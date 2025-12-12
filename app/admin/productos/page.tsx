"use client";

import { useEffect, useState } from "react";
import {
  adminFetchProductos,
  adminDeleteProducto,
  adminFetchCategorias,
  adminFiltrarProductos,
} from "@/lib/services/api-admin";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash, Pencil, Plus } from "lucide-react";

export default function AdminProductosPage() {
  const [productos, setProductos] = useState<any[]>([]);
  const [productosBase, setProductosBase] = useState<any[]>([]); // ← para filtrado local

  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  const [categorias, setCategorias] = useState<
    { id: number; nombre: string }[]
  >([]);

  // ===========================
  // CARGAR CATEGORÍAS
  // ===========================
  async function loadCategorias() {
    try {
      const cats = await adminFetchCategorias();
      setCategorias(cats);
    } catch (err) {
      console.error(err);
    }
  }

  // ===========================
  // CARGA INICIAL O PAGINACIÓN
  // ===========================
  async function loadData() {
    setLoading(true);
    try {
      const data = await adminFetchProductos(page, perPage);

      setProductos(data.productos);
      setProductosBase(data.productos); // guardo copia para búsquedas locales
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
    loadCategorias();
  }, [page]);

  // ===========================
  // BORRAR PRODUCTO
  // ===========================
  async function handleDelete(id: number) {
    if (!confirm("¿Seguro que querés eliminar este producto?")) return;

    try {
      await adminDeleteProducto(id);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Error eliminando producto");
    }
  }

  async function handleSearch(e: any) {
    const value = e.target.value;
    setSearch(value);

    // BORRAR TODO → volver listado original
    if (value.trim() === "") {
      setPage(1);

      if (categoriaFiltro) {
        const data = await adminFiltrarProductos({
          categoria: categoriaFiltro,
          filtro: "",
          page: 1,
          perPage,
        });

        setProductosBase(data.productos);
        setProductos(data.productos);
        setTotal(data.total); // 👈 total real filtrado por categoría
        return;
      }

      // Sin categoría → listado base
      const data = await adminFetchProductos(1, perPage);
      setProductos(data.productos);
      setProductosBase(data.productos);
      setTotal(data.total); // 👈 total general
      return;
    }

    // SI MENOS DE 3 LETRAS → no buscar, mostrar base
    if (value.trim().length < 3) {
      setProductos(productosBase);
      setTotal(productosBase.length); // 👈 total filtrado local simple
      return;
    }

    // EXACTAMENTE 3 LETRAS → CONSULTA AL BACKEND
    if (value.trim().length === 3) {
      const data = await adminFiltrarProductos({
        filtro: value,
        categoria: categoriaFiltro,
        page: 1,
        perPage,
      });

      setProductosBase(data.productos);
      setProductos(data.productos);
      setTotal(data.total); // 👈 total real del backend
      return;
    }

    // 4+ LETRAS: FILTRADO LOCAL
    const filtrados = productosBase.filter((p: any) =>
      p.nombre.toLowerCase().includes(value.toLowerCase()) ||
      (p.slug || "").toLowerCase().includes(value.toLowerCase())
    );

    setProductos(filtrados);
    setTotal(filtrados.length); // 👈 total ajustado al filtrado local
  }



  // ===========================
  // FILTRO POR CATEGORÍA (siempre backend)
  // ===========================
  async function handleCategoria(e: any) {
    const value = e.target.value;
    setCategoriaFiltro(value);

    // Reset search
    setSearch("");

    if (value === "") {
      // vuelve a listado normal
      loadData();
      return;
    }

    // pedir al backend
    const data = await adminFiltrarProductos({
      categoria: value,
      filtro: "",
      page: 1,
      perPage,
    });

    setProductos(data.productos);
    setProductosBase(data.productos);
    setTotal(data.total)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Productos</h1>

        <Link href="/admin/productos/new">
          <Button className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
          </Button>
        </Link>
      </div>

      {/* FILTROS */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o slug..."
          value={search}
          onChange={handleSearch}
          className="border px-3 py-2 rounded w-1/2"
        />

        <select
          value={categoriaFiltro}
          onChange={handleCategoria}
          className="border px-3 py-2 rounded"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
        <div className="flex items-center">
          <span>Productos - {total}</span>
        </div>

      </div>

      {/* Tabla */}
      <div className="rounded-md border bg-white shadow">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Imagen</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Precio</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Vistas</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="p-4 text-center" colSpan={6}>
                  Cargando...
                </td>
              </tr>
            ) : productos.length === 0 ? (
              <tr>
                <td className="p-4 text-center" colSpan={6}>
                  No hay productos
                </td>
              </tr>
            ) : (
              productos.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">
                    <img
                      src={p.url_imagen_principal}
                      alt={p.nombre}
                      className="w-14 h-14 rounded object-cover"
                    />
                  </td>

                  <td className="p-3">{p.nombre}</td>
                  <td className="p-3">${p.precio}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3">{p.vistas}</td>

                  <td className="p-3 flex items-center justify-end gap-2">
                    <Link href={`/admin/productos/${p.id}`}>
                      <Button variant="outline" size="sm" className="cursor-pointer">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>

                    <Button
                      variant="destructive"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => handleDelete(p.id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      <div className="flex justify-between items-center mt-6">
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Anterior
        </Button>

        <span>Página {page}</span>


        <Button
          variant="outline"
          onClick={() => setPage((p) => (p * perPage < total ? p + 1 : p))}
          disabled={page * perPage >= total}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
