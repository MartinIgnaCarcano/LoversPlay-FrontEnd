"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  adminFetchUsuario,
  adminUpdateUsuario,
} from "@/lib/services/api-admin";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EditUsuarioPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const idParam = searchParams.get("id");
  const id = idParam ? Number(idParam) : NaN;

  const [loading, setLoading] = useState(true);

  // Campos principales
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rol, setRol] = useState("");

  // Dirección
  const [direccion, setDireccion] = useState<any | null>(null);

  // Favoritos
  const [favoritos, setFavoritos] = useState<number[]>([]);

  // Estado activo/desactivado
  const [activo, setActivo] = useState(true);

  useEffect(() => {
    async function load() {
      if (!idParam || Number.isNaN(id)) {
        setLoading(false);
        return;
      }

      try {
        const u = await adminFetchUsuario(id);

        setNombre(u.nombre || "");
        setEmail(u.email || "");
        setTelefono(u.telefono || "");
        setRol(u.rol || "");

        setFavoritos(u.favoritos || []);
        setActivo(u.activo !== false);

        if (u.direccion) {
          setDireccion({
            calle: u.direccion.calle || "",
            codigo_postal: u.direccion.codigo_postal || "",
            provincia: u.direccion.provincia || "",
            departamento: u.direccion.departamento || "",
            pais: u.direccion.pais || "",
            extra: u.direccion.extra || "",
          });
        } else {
          setDireccion({
            calle: "",
            codigo_postal: "",
            provincia: "",
            departamento: "",
            pais: "",
            extra: "",
          });
        }
      } catch (err) {
        console.error("Error cargando usuario", err);
      }

      setLoading(false);
    }

    load();
  }, [idParam, id]);

  if (loading) return <p>Cargando usuario...</p>;

  if (!idParam || Number.isNaN(id)) {
    return (
      <div className="max-w-4xl mx-auto pb-20">
        <h1 className="text-2xl font-bold mb-2">Editar usuario</h1>
        <p className="text-muted-foreground">
          Falta el parámetro <b>id</b>. Ej: <code>/admin/usuarios/editar?id=1</code>
        </p>

        <Button className="mt-6 cursor-pointer" onClick={() => router.push("/admin/usuarios")}>
          Volver
        </Button>
      </div>
    );
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    const payload: any = {
      nombre,
      email,
      telefono,
      rol,
      activo,
    };

    if (direccion) {
      payload.direccion = direccion;
    }

    try {
      await adminUpdateUsuario(id, payload);
      alert("Usuario actualizado correctamente");
      router.push("/admin/usuarios");
    } catch (err) {
      console.error(err);
      alert("Error actualizando usuario");
    }
  }

  async function removeFavorito(pid: number) {
    if (!confirm("¿Quitar de favoritos?")) return;

    const nuevos = favoritos.filter((f) => f !== pid);
    setFavoritos(nuevos);

    await adminUpdateUsuario(id, { favoritos: nuevos });
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <h1 className="text-3xl font-bold mb-6">Editar Usuario #{id}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre */}
        <div>
          <Label>Nombre</Label>
          <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>

        {/* Email */}
        <div>
          <Label>Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        {/* Telefono */}
        <div>
          <Label>Teléfono</Label>
          <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        </div>

        {/* ROL */}
        <div>
          <Label>Rol</Label>
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">Sin rol</option>
            <option value="ADMIN">ADMIN</option>
            <option value="cliente">Cliente</option>
            <option value="guest">Guest</option>
          </select>
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-3">Dirección</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Calle</label>
            <input
              className="border px-3 py-2 rounded w-full"
              value={direccion?.calle ?? ""}
              onChange={(e) => setDireccion({ ...direccion, calle: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-1">Código Postal</label>
            <input
              className="border px-3 py-2 rounded w-full"
              value={direccion?.codigo_postal ?? ""}
              onChange={(e) =>
                setDireccion({ ...direccion, codigo_postal: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block mb-1">Provincia</label>
            <input
              className="border px-3 py-2 rounded w-full"
              value={direccion?.provincia ?? ""}
              onChange={(e) => setDireccion({ ...direccion, provincia: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-1">Departamento</label>
            <input
              className="border px-3 py-2 rounded w-full"
              value={direccion?.departamento ?? ""}
              onChange={(e) =>
                setDireccion({ ...direccion, departamento: e.target.value })
              }
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-1">País</label>
            <input
              className="border px-3 py-2 rounded w-full"
              value={direccion?.pais ?? ""}
              onChange={(e) => setDireccion({ ...direccion, pais: e.target.value })}
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-1">Extra</label>
            <input
              className="border px-3 py-2 rounded w-full"
              value={direccion?.extra ?? ""}
              onChange={(e) => setDireccion({ ...direccion, extra: e.target.value })}
            />
          </div>
        </div>

        {/* FAVORITOS */}
        <div>
          <h2 className="font-semibold mb-2">Favoritos</h2>
          {favoritos.length === 0 ? (
            <p className="text-sm text-gray-600">No tiene productos favoritos.</p>
          ) : (
            favoritos.map((pid) => (
              <div
                key={pid}
                className="flex justify-between border rounded px-3 py-2 mb-2"
              >
                <span>Producto #{pid}</span>
                <Button
                  variant="destructive"
                  size="sm"
                  className="cursor-pointer"
                  type="button"
                  onClick={() => removeFavorito(pid)}
                >
                  Quitar
                </Button>
              </div>
            ))
          )}
        </div>

        {/* ACTIVAR O DESACTIVAR */}
        <div className="flex items-center justify-between border rounded p-4">
          <span className="font-semibold">
            Estado:{" "}
            {activo ? (
              <span className="text-green-600">Activo</span>
            ) : (
              <span className="text-red-600">Desactivado</span>
            )}
          </span>

          <Button
            variant={activo ? "destructive" : "default"}
            onClick={() => setActivo(!activo)}
            type="button"
            className="cursor-pointer"
          >
            {activo ? "Desactivar" : "Activar"}
          </Button>
        </div>

        {/* SUBMIT */}
        <Button type="submit" className="w-full text-lg py-3 cursor-pointer">
          Guardar cambios
        </Button>
      </form>
    </div>
  );
}
