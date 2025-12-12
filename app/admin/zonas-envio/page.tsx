"use client";

import { useEffect, useState } from "react";
import {
  adminFetchEnvios,
  adminDeleteEnvio,
} from "@/lib/services/api-admin";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Plus } from "lucide-react";

export default function AdminEnviosPage() {
  const [envios, setEnvios] = useState<any[]>([]);
  const [enviosBase, setEnviosBase] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // ============================
  // Cargar envíos
  // ============================
  async function loadData() {
    setLoading(true);
    try {
      const data = await adminFetchEnvios();
      setEnvios(data);
      setEnviosBase(data);
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
  // Buscador local
  // ============================
  function handleSearch(e: any) {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      setEnvios(enviosBase);
      setTotal(enviosBase.length);
      return;
    }

    if (value.trim().length < 3) {
      setEnvios(enviosBase);
      setTotal(enviosBase.length);
      return;
    }

    const buscado = value.toLowerCase();

    const filtrados = enviosBase.filter((e) =>
      e.nombre.toLowerCase().includes(buscado) ||
      e.tipo_envio.toLowerCase().includes(buscado)
    );

    setEnvios(filtrados);
    setTotal(filtrados.length);
  }

  // ============================
  // Eliminar
  // ============================
  async function handleDelete(id: number) {
    if (!confirm("¿Seguro que querés eliminar esta zona?")) return;

    try {
      await adminDeleteEnvio(id);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Error eliminando zona");
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-10">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Zonas de Envío</h1>

        <Link href="/admin/zonas-envio/new">
          <Button className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" /> Nueva Zona
          </Button>
        </Link>
      </div>

      {/* Total */}
      <div className="mb-4 text-gray-600">
        Zonas — {total}
      </div>

      {/* Buscador */}
      <input
        value={search}
        onChange={handleSearch}
        placeholder="Buscar por nombre o tipo..."
        className="border px-3 py-2 rounded w-1/2 mb-6"
      />

      {/* Tabla */}
      <div className="rounded-md border bg-white shadow">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">CP Inicio</th>
              <th className="p-3">CP Fin</th>
              <th className="p-3">Precio</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Activa</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="p-4 text-center" colSpan={7}>
                  Cargando...
                </td>
              </tr>
            ) : envios.length === 0 ? (
              <tr>
                <td className="p-4 text-center" colSpan={7}>
                  No hay zonas de envío
                </td>
              </tr>
            ) : (
              envios.map((z) => (
                <tr key={z.id} className="border-t">
                  <td className="p-3">{z.nombre}</td>
                  <td className="p-3">{z.cp_inicio}</td>
                  <td className="p-3">{z.cp_fin}</td>
                  <td className="p-3">${z.precio}</td>
                  <td className="p-3">{z.tipo_envio}</td>
                  <td className="p-3">{z.activa ? "Sí" : "No"}</td>

                  <td className="p-3 flex items-center justify-end gap-2">
                    <Link href={`/admin/zonas-envio/${z.id}`}>
                      <Button variant="outline" size="sm" className="cursor-pointer">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>

                    <Button
                      variant="destructive"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => handleDelete(z.id)}
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
