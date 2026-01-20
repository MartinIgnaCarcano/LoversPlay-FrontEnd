"use client";

import { useEffect, useState } from "react";
import { adminFetchUsuarios, adminDeleteUsuario } from "@/lib/services/api-admin";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";

type ActivoFilter = "all" | "true" | "false";

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [usuariosBase, setUsuariosBase] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [activoFilter, setActivoFilter] = useState<ActivoFilter>("all"); // all | true | false

  // =======================================
  // CARGAR USUARIOS (backend)
  // =======================================
  async function loadData(pagina = page, filtro = activoFilter) {
    setLoading(true);

    try {
      // Enviamos al back:
      // - "all" => null (sin filtro)
      // - "true"/"false" => boolean
      const activosParam =
        filtro === "all" ? null : filtro === "true";

      const data = await adminFetchUsuarios(pagina, perPage, activosParam);

      setUsuarios(data.usuarios);
      setUsuariosBase(data.usuarios);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData(page, activoFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, activoFilter]);

  // =======================================
  // BUSCADOR (local, sobre la página actual)
  // =======================================
  function handleSearch(e: any) {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "" || value.length < 3) {
      setUsuarios(usuariosBase);
      return;
    }

    const texto = value.toLowerCase();

    const filtrados = usuariosBase.filter(
      (u) =>
        u.nombre?.toLowerCase().includes(texto) ||
        u.email?.toLowerCase().includes(texto)
    );

    setUsuarios(filtrados);
  }

  // =======================================
  // DESACTIVAR
  // =======================================
  async function handleDelete(id: number) {
    if (!confirm("¿Desactivar usuario?")) return;

    try {
      await adminDeleteUsuario(id);
      loadData(1, activoFilter); // recargar desde página 1 para evitar inconsistencias
      setPage(1);
    } catch (err) {
      alert("Error desactivando usuario");
      console.error(err);
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Usuarios ({total})</h1>
      </div>

      {/* FILTROS */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={handleSearch}
          className="border px-3 py-2 rounded w-1/2"
        />

        <select
          value={activoFilter}
          onChange={(e) => {
            setSearch(""); // opcional: resetea búsqueda al cambiar filtro
            setPage(1);
            setActivoFilter(e.target.value as ActivoFilter);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="all">Todos</option>
          <option value="true">Activos</option>
          <option value="false">Desactivados</option>
        </select>
      </div>

      {/* TABLA */}
      <div className="rounded-md border bg-white shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Teléfono</th>
              <th className="p-3 text-left">Rol</th>
              <th className="p-3 text-left">Registro</th>
              <th className="p-3 text-left">Activo</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-4 text-center">
                  Cargando...
                </td>
              </tr>
            ) : usuarios.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center">
                  No hay usuarios
                </td>
              </tr>
            ) : (
              usuarios.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{u.nombre}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.telefono || "-"}</td>
                  <td className="p-3">{u.rol || "-"}</td>
                  <td className="p-3">{u.fecha_registro?.split("T")[0]}</td>

                  <td className="p-3">
                    {u.activo ? (
                      <span className="text-green-600 font-semibold">Sí</span>
                    ) : (
                      <span className="text-red-600 font-semibold">No</span>
                    )}
                  </td>

                  <td className="p-3 flex justify-end gap-2">
                    <Link href={`/admin/usuarios/editar?id=${u.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>

                    <Button
                      variant="destructive"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => handleDelete(u.id)}
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
