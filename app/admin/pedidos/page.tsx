"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { adminFetchPedidos, adminDeletePedido } from "@/lib/services/api-admin";

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [pedidosBase, setPedidosBase] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const perPage = 10;
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  // ============================
  // CARGAR
  // ============================
  async function loadData(pag = page) {
    setLoading(true);
    try {
      const data = await adminFetchPedidos(pag, perPage);
      const info = Array.isArray(data) ? data[0] : data;

      setPedidos(info.pedidos);
      setPedidosBase(info.pedidos);
      setTotal(info.total);
    } catch (err) {
      console.error("Error cargando pedidos", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [page]);

  // ============================
  // BUSCADOR LOCAL
  // ============================
  function handleSearch(e: any) {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      setPedidos(pedidosBase);
      return;
    }

    const q = value.toLowerCase();

    const filtrados = pedidosBase.filter(
      (p) =>
        String(p.id).includes(q) ||
        p.estado.toLowerCase().includes(q)
    );

    setPedidos(filtrados);
  }

  // ============================
  // ELIMINAR
  // ============================
  async function handleDelete(id: number) {
    if (!confirm("¿Eliminar pedido?")) return;

    try {
      await adminDeletePedido(id);
      loadData();
    } catch (err) {
      alert("Error eliminando pedido");
      console.error(err);
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Pedidos ({total})</h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Buscar por ID o estado..."
          className="border px-3 py-2 rounded w-1/2"
        />
      </div>

      <div className="rounded-md border bg-white shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Fecha</th>
              <th className="p-3">Total</th>
              <th className="p-3">Estado</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center p-4">Cargando...</td>
              </tr>
            ) : pedidos.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4">No hay pedidos</td>
              </tr>
            ) : (
              pedidos.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">{p.id}</td>
                  <td className="p-3">{p.fecha.split("T")[0]}</td>
                  <td className="p-3">${p.total}</td>
                  <td className="p-3">{p.estado}</td>

                  <td className="p-3 flex justify-end gap-2">
                    <Link href={`/admin/pedidos/edit?id=${p.id}`}>
                      <Button variant="outline" size="sm" className="cursor-pointer">Ver</Button>
                    </Link>

                    {/* <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(p.id)}
                      className="cursor-pointer"
                    >
                      Eliminar
                    </Button> */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="cursor-pointer"
        >
          Anterior
        </Button>

        <span>Página {page}</span>

        <Button
          variant="outline"
          onClick={() => setPage((p) => p + 1)}
          disabled={page * perPage >= total}
          className="cursor-pointer"
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
