"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  adminFetchCategoria,
  adminUpdateCategoria,
} from "@/lib/services/api-admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EditarCategoriaPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [slug, setSlug] = useState("");
  const [imagenActual, setImagenActual] = useState("");
  const [imagenNueva, setImagenNueva] = useState<File | null>(null);

  function generarSlug(value: string) {
    const s = value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setSlug(s);
  }

  useEffect(() => {
    async function load() {
      try {
        const data = await adminFetchCategoria(id);
        setNombre(data.nombre);
        setSlug(data.slug || "");
        setImagenActual(data.url_imagen || "");
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleSubmit(e: any) {
    e.preventDefault();

    const fd = new FormData();
    fd.append("nombre", nombre);
    fd.append("slug", slug);

    if (imagenNueva) fd.append("imagen", imagenNueva);

    try {
      await adminUpdateCategoria(id, fd);
      router.push("/admin/categorias");
    } catch (err) {
      console.error(err);
      alert("Error actualizando categoría");
    }
  }

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">
        Editar Categoría #{id}
      </h1>

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
          <label className="font-medium">Imagen actual</label>
          <img
            src={imagenActual || "/placeholder.svg"}
            className="w-32 h-32 rounded object-cover border"
          />
        </div>

        <div>
          <label className="font-medium">Cambiar imagen</label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImagenNueva(e.target.files?.[0] || null)}
          />
        </div>

        <Button type="submit" className="w-full cursor-pointer">
          Guardar cambios
        </Button>
      </form>
    </div>
  );
}
