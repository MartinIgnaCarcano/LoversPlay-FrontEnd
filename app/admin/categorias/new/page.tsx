"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminCreateCategoria } from "@/lib/services/api-admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NuevaCategoriaPage() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [slug, setSlug] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);

  function generarSlug(value: string) {
    const s = value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setSlug(s);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    const fd = new FormData();
    fd.append("nombre", nombre);
    fd.append("slug", slug);
    if (imagen) fd.append("imagen", imagen);

    try {
      await adminCreateCategoria(fd);
      router.push("/admin/categorias");
    } catch (err) {
      console.error(err);
      alert("Error creando categoría");
    }
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Nueva Categoría</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="font-medium">Nombre</label>
          <Input
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              generarSlug(e.target.value);
            }}
            required
          />
        </div>

        <div>
          <label className="font-medium">Slug</label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
        </div>

        <div>
          <label className="font-medium">Imagen (opcional)</label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files?.[0] || null)}
          />
        </div>

        <Button type="submit" className="w-full cursor-pointer">
          Crear categoría
        </Button>
      </form>
    </div>
  );
}
