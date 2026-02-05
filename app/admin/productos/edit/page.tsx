"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  adminFetchProducto,
  adminUpdateProducto,
  adminFetchCategorias,
} from "@/lib/services/api-admin";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EditorHTML } from "@/components/admin/EditorHtml";

export default function EditProductoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const idParam = searchParams.get("id");
  const id = idParam ? Number(idParam) : NaN;

  const [loading, setLoading] = useState(true);

  // Campos del producto
  const [nombre, setNombre] = useState("");
  const [slug, setSlug] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");

  // ✅ MULTI CATEGORÍAS
  const [categoriaIds, setCategoriaIds] = useState<number[]>([]);
  const [categorias, setCategorias] = useState<{ id: number; nombre: string }[]>([]);

  const [peso, setPeso] = useState("");

  // ✅ EXTRA
  const [extra, setExtra] = useState("");

  const [descripcion, setDescripcion] = useState("<p></p>");
  const [descripcionCorta, setDescripcionCorta] = useState("<p></p>");

  // Imágenes actuales
  const [imgPrincipalActual, setImgPrincipalActual] = useState("");
  const [imgSecundariasActuales, setImgSecundariasActuales] = useState<string[]>([]);

  // Imágenes nuevas
  const [imgPrincipalNueva, setImgPrincipalNueva] = useState<File | null>(null);
  const [imgSecundariasNuevas, setImgSecundariasNuevas] = useState<File[]>([]);

  // Slug automático
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
    async function loadAll() {
      if (!idParam || Number.isNaN(id)) {
        setLoading(false);
        return;
      }

      try {
        // 1) Cargar categorías primero
        const cats = await adminFetchCategorias();
        setCategorias(cats);

        // 2) Ahora cargar el producto
        const p = await adminFetchProducto(id);

        setNombre(p.nombre || "");
        setSlug(p.slug || "");
        setPrecio(String(p.precio || ""));
        setStock(String(p.stock || ""));

        // ✅ Si el backend trae categorias: [{id,...}]
        const idsFromCats = Array.isArray(p.categorias) ? p.categorias.map((c: any) => Number(c.id)) : [];
        // fallback si llegara categoria_ids (por las dudas)
        const idsFromIds = Array.isArray(p.categoria_ids) ? p.categoria_ids.map((x: any) => Number(x)) : [];
        setCategoriaIds(idsFromCats.length ? idsFromCats : idsFromIds);

        setPeso(String(p.peso || "0"));

        // ✅ EXTRA
        setExtra(p.extra || "");

        setDescripcion(p.descripcion_larga || "");
        setDescripcionCorta(p.descripcion_corta || "");

        setImgPrincipalActual(
          p.url_imagen_principal || p.imagenes?.[0] || "/placeholder.svg"
        );

        setImgSecundariasActuales(p.imagenes || []);
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    }

    loadAll();
  }, [idParam, id]);

  if (loading) return <p>Cargando producto...</p>;

  if (!idParam || Number.isNaN(id)) {
    return (
      <div className="max-w-4xl mx-auto pb-20">
        <h1 className="text-2xl font-bold mb-2">Editar producto</h1>
        <p className="text-muted-foreground">
          Falta el parámetro <b>id</b>. Ej: <code>/admin/productos/editar?id=123</code>
        </p>

        <Button className="mt-6 cursor-pointer" onClick={() => router.push("/admin/productos")}>
          Volver
        </Button>
      </div>
    );
  }

  // SUBMIT PATCH
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();

    formData.append("nombre", nombre);
    formData.append("slug", slug);
    formData.append("precio", precio);

    // ✅ MULTI: se manda como CSV
    formData.append("categoria_ids", categoriaIds.join(","));

    formData.append("stock", stock);
    formData.append("peso", peso);

    // ✅ EXTRA
    formData.append("extra", extra);

    formData.append("descripcion_larga", descripcion);
    formData.append("descripcion_corta", descripcionCorta);

    // Nueva imagen principal
    if (imgPrincipalNueva) {
      formData.append("imagen_principal", imgPrincipalNueva);
    }

    // Nuevas imágenes secundarias
    imgSecundariasNuevas.forEach((img) => {
      formData.append("imagenes", img);
    });

    try {
      await adminUpdateProducto(id, formData);
      alert("Producto actualizado correctamente");
      router.push("/admin/productos");
    } catch (err) {
      console.error(err);
      alert("Error actualizando producto");
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <h1 className="text-3xl font-bold mb-6">Editar Producto #{id}</h1>

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
              <option key={c.id} value={c.id} className="cursor-pointer">
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
          <Label>Peso</Label>
          <Input
            type="number"
            step="0.1"
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

        {/* DESCRIPCIÓN CORTA */}
        <div>
          <Label>Descripción corta (HTML)</Label>
          <EditorHTML value={descripcionCorta} onChange={setDescripcionCorta} />
        </div>

        {/* DESCRIPCIÓN LARGA */}
        <div>
          <Label>Descripción larga (HTML)</Label>
          <EditorHTML value={descripcion} onChange={setDescripcion} />
        </div>

        {/* IMAGEN PRINCIPAL ACTUAL */}
        <div>
          <Label>Imagen principal actual</Label>
          <img
            src={imgPrincipalActual}
            className="w-32 h-32 object-cover rounded border"
          />
        </div>

        {/* IMAGEN PRINCIPAL NUEVA */}
        <div>
          <Label>Cambiar imagen principal</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImgPrincipalNueva(e.target.files?.[0] || null)}
          />
        </div>

        {/* IMÁGENES SECUNDARIAS ACTUALES */}
        <div>
          <Label>Imágenes secundarias actuales</Label>
          <div className="flex gap-3 flex-wrap">
            {imgSecundariasActuales.map((img, i) => (
              <img key={i} src={img} className="w-20 h-20 object-cover rounded border" />
            ))}
          </div>
        </div>

        {/* IMÁGENES SECUNDARIAS NUEVAS */}
        <div>
          <Label>Agregar nuevas imágenes secundarias</Label>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImgSecundariasNuevas(Array.from(e.target.files || []))}
          />
        </div>

        {/* BOTÓN */}
        <Button type="submit" className="w-full text-lg py-3 cursor-pointer">
          Guardar cambios
        </Button>
      </form>
    </div>
  );
}


