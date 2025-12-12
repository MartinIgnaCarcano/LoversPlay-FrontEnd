"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminCreateEnvio } from "@/lib/services/api-admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CrearEnvioPage() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [cpInicio, setCpInicio] = useState("");
  const [cpFin, setCpFin] = useState("");
  const [tipo, setTipo] = useState("correo");
  const [precio, setPrecio] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();

    try {
      await adminCreateEnvio({
        nombre,
        cp_inicio: Number(cpInicio),
        cp_fin: Number(cpFin),
        tipo_envio: tipo,
        precio: Number(precio),
      });

      router.push("/admin/zonas-envio");
    } catch (err) {
      console.error(err);
      alert("Error creando zona de envío");
    }
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Nueva Zona de Envío</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label className="font-medium">Nombre</label>
          <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>

        <div>
          <label className="font-medium">Código Postal Inicio</label>
          <Input type="number" value={cpInicio} onChange={(e) => setCpInicio(e.target.value)} required />
        </div>

        <div>
          <label className="font-medium">Código Postal Fin</label>
          <Input type="number" value={cpFin} onChange={(e) => setCpFin(e.target.value)} required />
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
          <Input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
        </div>

        <Button type="submit" className="w-full cursor-pointer">Crear zona</Button>
      </form>
    </div>
  );
}
