"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetchEnvios, adminDeleteEnvio } from "@/lib/services/api-admin";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Plus } from "lucide-react";
import { ZonaEnvio } from "@/lib/types";

type ActivaFilter = "all" | "activa" | "inactiva";
type TipoFilter = "all" | string;

function labelTipo(tipo: string) {
  const t = (tipo || "").toLowerCase();
  if (t === "correo") return "Correo";
  if (t === "viacargo") return "ViaCargo";
  if (t === "andesmar") return "Andesmar";
  if (t === "cata") return "Cata";
  return tipo; // fallback
}


export default function AdminEnviosPage() {
  const [enviosBase, setEnviosBase] = useState<ZonaEnvio[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [fActiva, setFActiva] = useState<ActivaFilter>("all");
  const [fTipo, setFTipo] = useState<TipoFilter>("all");

  // ============================
  // Cargar envíos
  // ============================
  async function loadData() {
    setLoading(true);
    try {
      const data = await adminFetchEnvios();
      setEnviosBase(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const tiposDisponibles = useMemo(() => {
    const set = new Set<string>();
    for (const z of enviosBase) {
      if (z?.tipo_envio) set.add(String(z.tipo_envio).toLowerCase());
    }
    return Array.from(set).sort(); // ["andesmar","cata","correo","viacargo",...]
  }, [enviosBase]);

  // ============================
  // Derivar envíos filtrados
  // ============================
  const envios = useMemo(() => {
    let list = [...enviosBase];

    // 1) filtro activa
    if (fActiva === "activa") list = list.filter((z) => z.activa === true);
    if (fActiva === "inactiva") list = list.filter((z) => z.activa === false);

    // 2) filtro tipo_envio
    if (fTipo !== "all") {
      list = list.filter((z) => String(z.tipo_envio).toLowerCase() === fTipo);
    }

    // 3) búsqueda
    const value = search.trim().toLowerCase();
    if (value.length >= 3) {
      list = list.filter(
        (z) =>
          z.nombre.toLowerCase().includes(value) ||
          String(z.cp_inicio).includes(value) ||
          String(z.cp_fin).includes(value) ||
          z.tipo_envio.toLowerCase().includes(value)
      );
    }

    return list;
  }, [enviosBase, search, fActiva, fTipo]);

  const total = envios.length;

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
      <div className="mb-4 text-gray-600">Zonas — {total}</div>

      <div className="flex gap-4 mb-6">
        {/* Buscador */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, tipo o CP (min 3 letras)..."
          className="border px-3 py-2 rounded w-1/2"
        />

        {/* Filtro Activa */}
        <select
          className="border px-3 h-10 rounded"
          value={fActiva}
          onChange={(e) => setFActiva(e.target.value as ActivaFilter)}
        >
          <option value="all">Todas</option>
          <option value="activa">Activas</option>
          <option value="inactiva">Desactivadas</option>
        </select>

        <select
          className="border px-3 h-10 rounded"
          value={fTipo}
          onChange={(e) => setFTipo(e.target.value)}
        >
          <option value="all">Todos los tipos</option>

          {tiposDisponibles.map((t) => (
            <option key={t} value={t}>
              {labelTipo(t)}
            </option>
          ))}
        </select>


        {/* Reset rápido */}
        <Button
          variant="outline"
          className="h-10"
          onClick={() => {
            setSearch("");
            setFActiva("all");
            setFTipo("all");
          }}
        >
          Limpiar
        </Button>
      </div>

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
