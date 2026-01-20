"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminFetchCategoria, adminUpdateCategoria } from "@/lib/services/api-admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EditarCategoriaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const idParam = searchParams.get("id");
  const id = idParam ? Number(idParam) : NaN;

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
      if (!idParam || Number.isNaN(id)) {
        setLoading(false);
        return;
      }

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
  }, [idParam, id]);

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (!idParam || Number.isNaN(id)) {
      alert("Falta el id en la URL. Ej: /admin/categorias/edit?id=3");
      return;
    }

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

  if (!idParam || Number.isNaN(id)) {
    return (
      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-2">Editar categoría</h1>
        <p className="text-muted-foreground">
          Falta el parámetro <b>id</b> en la URL.
        </p>

        <Button className="mt-6 cursor-pointer" onClick={() => router.push("/admin/categorias")}>
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Editar Categoría #{id}</h1>

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

