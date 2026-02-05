"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminCreateProducto, adminFetchCategorias } from "@/lib/services/api-admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EditorHTML } from "@/components/admin/EditorHtml";

export default function NewProductoPage() {
  const router = useRouter();

  // Campos del formulario
  const [nombre, setNombre] = useState("");
  const [slug, setSlug] = useState("");
  const [precio, setPrecio] = useState("");

  // ✅ MULTI CATEGORÍAS
  const [categoriaIds, setCategoriaIds] = useState<number[]>([]);
  const [categorias, setCategorias] = useState<{ id: number; nombre: string }[]>([]);

  const [stock, setStock] = useState("");
  const [peso, setPeso] = useState("");

  // ✅ EXTRA
  const [extra, setExtra] = useState("");

  const [descripcionCorta, setDescripcionCorta] = useState("<p></p>");
  const [descripcionLarga, setDescripcionLarga] = useState("<p></p>");

  // Archivos
  const [imagenPrincipal, setImagenPrincipal] = useState<File | null>(null);
  const [imagenesSecundarias, setImagenesSecundarias] = useState<File[]>([]);

  // Slug automático
  function generarSlug(value: string) {
    const s = value
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setSlug(s);
  }

  useEffect(() => {
    async function loadCategorias() {
      try {
        const cats = await adminFetchCategorias();
        setCategorias(cats);
      } catch (err) {
        console.error("Error cargando categorías", err);
      }
    }
    loadCategorias();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!imagenPrincipal) {
      alert("Debes seleccionar una imagen principal.");
      return;
    }

    if (categoriaIds.length === 0) {
      alert("Debes seleccionar al menos una categoría.");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("slug", slug);
    formData.append("precio", precio);

    // ✅ MULTI: CSV
    formData.append("categoria_ids", categoriaIds.join(","));

    formData.append("stock", stock);
    formData.append("peso", peso || "0");

    // ✅ EXTRA
    formData.append("extra", extra);

    formData.append("descripcion_corta", descripcionCorta);   // corta
    formData.append("descripcion_larga", descripcionLarga);   // larga

    // Imagen principal
    formData.append("imagen_principal", imagenPrincipal);

    // Imágenes secundarias
    imagenesSecundarias.forEach((img) => {
      formData.append("imagenes", img);
    });

    try {
      const resp = await adminCreateProducto(formData);

      alert("Producto creado correctamente");
      router.push(`/admin/productos/${resp.id}`); // redirige al edit
    } catch (err) {
      console.error(err);
      alert("Error creando el producto.");
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Nuevo Producto</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* NOMBRE */}
        <div>
          <Label>Nombre</Label>
          <Input
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              generarSlug(e.target.value);
            }}
            required
          />
        </div>

        {/* SLUG */}
        <div>
          <Label>Slug</Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>

        {/* PRECIO */}
        <div>
          <Label>Precio</Label>
          <Input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
        </div>

        {/* ✅ CATEGORÍAS MULTI (CHIPS + X) */}
        <div>
          <Label>Categorías</Label>

          <div className="flex flex-wrap gap-2 mb-2">
            {categoriaIds.map((cid) => {
              const cat = categorias.find((c) => c.id === cid);
              if (!cat) return null;

              return (
                <span
                  key={cid}
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm bg-background"
                >
                  {cat.nombre}
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => setCategoriaIds((prev) => prev.filter((x) => x !== cid))}
                    aria-label={`Quitar ${cat.nombre}`}
                  >
                    ✕
                  </button>
                </span>
              );
            })}
          </div>

          <select
            value=""
            onChange={(e) => {
              const cid = Number(e.target.value);
              if (!Number.isFinite(cid) || cid <= 0) return;
              setCategoriaIds((prev) => (prev.includes(cid) ? prev : [...prev, cid]));
            }}
            className="border rounded-md px-3 py-2 w-full"
            required={categoriaIds.length === 0}
          >
            <option value="">Agregar categoría...</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* STOCK */}
        <div>
          <Label>Stock</Label>
          <Input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>

        {/* PESO */}
        <div>
          <Label>Peso (opcional)</Label>
          <Input
            type="number"
            step="0.01"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
          />
        </div>

        {/* ✅ EXTRA */}
        <div>
          <Label>Extra</Label>
          <Input
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            placeholder="Ej: 10cm, Talle M, Alta potencia..."
          />
        </div>

        {/* DESCRIPCIÓN — EDITOR HTML */}
        <div>
          <Label>Descripción corta</Label>
          <EditorHTML value={descripcionCorta} onChange={setDescripcionCorta} />
        </div>

        <div>
          <Label>Descripción larga</Label>
          <EditorHTML value={descripcionLarga} onChange={setDescripcionLarga} />
        </div>

        {/* IMAGEN PRINCIPAL */}
        <div>
          <Label>Imagen principal</Label>
          <Input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setImagenPrincipal(e.target.files?.[0] || null)}
            className="cursor-pointer"
          />
        </div>

        {/* IMÁGENES SECUNDARIAS */}
        <div>
          <Label>Imágenes secundarias (opcional)</Label>
          <Input
            type="file"
            accept="image/*"
            multiple
            className="cursor-pointer"
            onChange={(e) => setImagenesSecundarias(Array.from(e.target.files || []))}
          />
        </div>

        <Button type="submit" className="w-full text-lg py-3 cursor-pointer">
          Crear producto
        </Button>
      </form>
    </div>
  );
}
