"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

import {
  adminFetchPedido,
  adminUpdatePedidoEstado,
  adminDeletePedido,
} from "@/lib/services/api-admin";

export default function AdminPedidoDetallePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const idParam = searchParams.get("id");
  const id = idParam ? Number(idParam) : NaN;

  const [pedido, setPedido] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [estado, setEstado] = useState("");

  async function load() {
    if (!idParam || Number.isNaN(id)) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const p = await adminFetchPedido(id);
      setPedido(p);
      setEstado(p.estado);
    } catch (err) {
      console.error("Error obteniendo pedido", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idParam]);

  async function handleUpdateEstado() {
    if (!idParam || Number.isNaN(id)) {
      alert("Falta el id en la URL. Ej: /admin/pedidos/detalle?id=10");
      return;
    }

    try {
      await adminUpdatePedidoEstado(id, estado);
      alert("Estado actualizado");
      load();
    } catch (err) {
      alert("Error actualizando estado");
      console.error(err);
    }
  }

  async function handleDelete() {
    if (!idParam || Number.isNaN(id)) return;
    if (!confirm("¿Eliminar este pedido?")) return;

    try {
      await adminDeletePedido(id);
      router.push("/admin/pedidos");
    } catch (err) {
      alert("Error eliminando pedido");
      console.error(err);
    }
  }

  if (loading) return <p className="p-10">Cargando pedido...</p>;

  if (!idParam || Number.isNaN(id)) {
    return (
      <div className="max-w-4xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-2">Detalle de pedido</h1>
        <p className="text-muted-foreground">
          Falta el parámetro <b>id</b> en la URL.
        </p>

        <Button className="mt-6 cursor-pointer" onClick={() => router.push("/admin/pedidos")}>
          Volver
        </Button>
      </div>
    );
  }

  if (!pedido) return <p className="p-10">No se encontró el pedido.</p>;

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Pedido #{pedido.id}</h1>

      {/* INFO GENERAL */}
      <div className="mb-6 flex-1">
        <p><strong>Fecha:</strong> {pedido.fecha?.split("T")?.[0]}</p>
        <p><strong>Total:</strong> ${pedido.total}</p>

        <label className="block mt-4 mb-1 font-semibold">Estado:</label>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="w-xl border px-3 py-2 rounded"
        >
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="PAGADO">PAGADO</option>
          <option value="ENVIADO">ENVIADO</option>
          <option value="ENTREGADO">ENTREGADO</option>
          <option value="CANCELADO">CANCELADO</option>
        </select>

        <Button onClick={handleUpdateEstado} className="mt-3 cursor-pointer">
          Guardar estado
        </Button>
      </div>

      {/* DETALLES */}
      <div className="rounded-md border bg-white shadow p-4">
        <h2 className="text-xl font-bold mb-4">Productos del pedido</h2>

        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">Producto</th>
              <th className="p-3">Cantidad</th>
              <th className="p-3">Subtotal</th>
            </tr>
          </thead>

          <tbody>
            {pedido.detalles?.map((d: any, i: number) => (
              <tr key={i} className="border-t">
                <td className="p-3">{d.producto}</td>
                <td className="p-3">{d.cantidad}</td>
                <td className="p-3">${d.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ELIMINAR (si lo querés activar)
      <Button
        variant="destructive"
        className="mt-10 cursor-pointer"
        onClick={handleDelete}
      >
        Eliminar pedido
      </Button>
      */}
    </div>
  );
}

