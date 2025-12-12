"use client";

import { useEffect, useState } from "react";
import {
  adminFetchCategorias,
  adminDeleteCategoria,
} from "@/lib/services/api-admin";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Plus } from "lucide-react";

export default function AdminCategoriasPage() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [categoriaBase, setCategoriaBase] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // ============================
  // Cargar categorías
  // ============================
  async function loadData() {
    setLoading(true);
    try {
      const data = await adminFetchCategorias();
      setCategorias(data);
      setCategoriaBase(data);
      setTotal(data.length);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  // ============================
  // Buscador
  // ============================
  function handleSearch(e: any) {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      setCategorias(categoriaBase);
      setTotal(categoriaBase.length);
      return;
    }

    if (value.trim().length < 3) {
      setCategorias(categoriaBase);
      setTotal(categoriaBase.length);
      return;
    }

    const filtradas = categoriaBase.filter((c) =>
      c.nombre.toLowerCase().includes(value.toLowerCase())
    );

    setCategorias(filtradas);
    setTotal(filtradas.length);
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Seguro querés eliminar esta categoría?")) return;

    try {
      await adminDeleteCategoria(id);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Error eliminando categoría");
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-10">

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Categorías</h1>

        <Link href="/admin/categorias/new">
          <Button className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" /> Nueva Categoría
          </Button>
        </Link>
      </div>

      {/* Total */}
      <div className="mb-4 text-gray-600">
        Categorías — {total}
      </div>

      {/* Buscador */}
      <input
        value={search}
        onChange={handleSearch}
        placeholder="Buscar categoría..."
        className="border px-3 py-2 rounded w-1/2 mb-6"
      />

      <div className="rounded-md border bg-white shadow">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Imagen</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Productos</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="p-4 text-center" colSpan={4}>
                  Cargando...
                </td>
              </tr>
            ) : categorias.length === 0 ? (
              <tr>
                <td className="p-4 text-center" colSpan={4}>
                  No hay categorías
                </td>
              </tr>
            ) : (
              categorias.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3">
                    <img
                      src={c.url_imagen || "/placeholder.svg"}
                      className="w-14 h-14 rounded object-cover"
                    />
                  </td>

                  <td className="p-3">{c.nombre}</td>
                  <td className="p-3">{c.cantidad_productos}</td>

                  <td className="p-3 flex items-center justify-end gap-2">
                    <Link href={`/admin/categorias/${c.id}`}>
                      <Button variant="outline" size="sm" className="cursor-pointer">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>

                    <Button
                      variant="destructive"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => handleDelete(c.id)}
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
    </div>
  );
}
