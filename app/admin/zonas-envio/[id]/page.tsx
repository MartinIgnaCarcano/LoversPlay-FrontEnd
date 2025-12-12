"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  adminFetchEnvio,
  adminUpdateEnvio
} from "@/lib/services/api-admin";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EditarEnvioPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [loading, setLoading] = useState(true);

  const [nombre, setNombre] = useState("");
  const [cpInicio, setCpInicio] = useState("");
  const [cpFin, setCpFin] = useState("");
  const [tipo, setTipo] = useState("");
  const [precio, setPrecio] = useState("");
  const [activa, setActiva] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await adminFetchEnvio(id);
        setNombre(data.nombre);
        setCpInicio(String(data.cp_inicio));
        setCpFin(String(data.cp_fin));
        setTipo(data.tipo_envio);
        setPrecio(String(data.precio));
        setActiva(data.activa);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleSubmit(e: any) {
    e.preventDefault();

    try {
      await adminUpdateEnvio(id, {
        nombre,
        cp_inicio: Number(cpInicio),
        cp_fin: Number(cpFin),
        tipo_envio: tipo,
        precio: Number(precio),
        activa,
      });

      router.push("/admin/zonas-envio");
    } catch (err) {
      console.error(err);
      alert("Error actualizando zona");
    }
  }

  if (loading) return <p>Cargando...</p>;

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

        <div>
          <label className="font-medium">Tipo de envío</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="correo">Correo</option>
            <option value="viacargo">ViaCargo</option>
            <option value="andesmar">Andesmar</option>
            <option value="cata">Cata</option>
          </select>
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
