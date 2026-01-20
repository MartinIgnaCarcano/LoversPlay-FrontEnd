"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminFetchEnvio, adminUpdateEnvio } from "@/lib/services/api-admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TIPOS_BASE = [
  { value: "correo", label: "Correo" },
  { value: "viacargo", label: "ViaCargo" },
  { value: "andesmar", label: "Andesmar" },
  { value: "cata", label: "Cata" },
];

export default function EditarEnvioPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = useMemo(() => {
    const raw = searchParams.get("id");
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [searchParams]);

  const [loading, setLoading] = useState(true);

  const [nombre, setNombre] = useState("");
  const [cpInicio, setCpInicio] = useState("");
  const [cpFin, setCpFin] = useState("");
  const [tipo, setTipo] = useState("correo");
  const [tipoCustom, setTipoCustom] = useState("");
  const [precio, setPrecio] = useState("");
  const [activa, setActiva] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const data = await adminFetchEnvio(id);
        setNombre(data.nombre ?? "");
        setCpInicio(String(data.cp_inicio ?? ""));
        setCpFin(String(data.cp_fin ?? ""));
        setTipo(String(data.tipo_envio ?? "correo").toLowerCase());
        setPrecio(String(data.precio ?? ""));
        setActiva(Boolean(data.activa));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (!id) {
      alert("Falta el id en la URL. Ej: /admin/zonas-envio/edit?id=29");
      return;
    }

    const tipoFinal =
      tipo === "__custom__"
        ? tipoCustom.trim().toLowerCase()
        : tipo;

    if (!tipoFinal) {
      alert("Ingresá un tipo de envío válido");
      return;
    }

    try {
      await adminUpdateEnvio(id, {
        nombre,
        cp_inicio: Number(cpInicio),
        cp_fin: Number(cpFin),
        tipo_envio: tipoFinal,
        precio: Number(precio),
        activa,
      });

      router.push("/admin/zonas-envio");
    } catch (err) {
      console.error(err);
      alert("Error actualizando zona");
    }
  }

  if (loading) return <p className="p-10">Cargando...</p>;

  if (!id) {
    return (
      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-3">Editar zona</h1>
        <p className="text-muted-foreground mb-6">
          Falta el <b>id</b> en la URL. Entrá desde el listado con el lápiz,
          o usá: <code>/admin/zonas-envio/edit?id=29</code>
        </p>
        <Button onClick={() => router.push("/admin/zonas-envio")} className="cursor-pointer">
          Volver al listado
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Editar zona #{id}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="font-medium">Nombre</label>
          <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>

        <div>
          <label className="font-medium">Código Postal Inicio</label>
          <Input type="number" value={cpInicio} onChange={(e) => setCpInicio(e.target.value)} />
        </div>

        <div>
          <label className="font-medium">Código Postal Fin</label>
          <Input type="number" value={cpFin} onChange={(e) => setCpFin(e.target.value)} />
        </div>

        {/* Tipo de envío */}
        <div>
          <label className="font-medium">Tipo de envío</label>

          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          >
            {TIPOS_BASE.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
            <option value="__custom__">Otro (personalizado)</option>
          </select>

          {tipo === "__custom__" && (
            <Input
              className="mt-2"
              placeholder="Ej: moto, retiro, expreso, etc."
              value={tipoCustom}
              onChange={(e) => setTipoCustom(e.target.value)}
              required
            />
          )}
        </div>

        <div>
          <label className="font-medium">Precio</label>
          <Input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={activa}
            onChange={(e) => setActiva(e.target.checked)}
          />
          <label>Activa</label>
        </div>

        <Button type="submit" className="w-full cursor-pointer">
          Guardar cambios
        </Button>
      </form>
    </div>
  );
}
