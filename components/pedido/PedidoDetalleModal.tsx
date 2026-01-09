"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X } from "lucide-react"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  pedidoId: number | null
}

type Pago = {
  id?: number
  metodo_pago?: string
  estado?: string // "approved" | "pending" | "rechazado" | etc
  monto?: number
  fecha_creacion?: string
  url_checkout?: string // si tu back lo devuelve
}

type PedidoApi = {
  id: number
  fecha: string
  total: number
  estado: string
  costo_envio?: number
  detalles: { producto: string; cantidad: number; subtotal: number }[]
  // si tu amigo cambia el back, esto puede venir:
  pago?: Pago
  pagos?: Pago[]
}

function moneyARS(value: number) {
  try {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(value || 0)
  } catch {
    return `$${(value || 0).toFixed(2)}`
  }
}

function badgeVariantByEstadoPedido(estado: string) {
  const e = (estado || "").toUpperCase()
  if (e === "PAGADO") return "default"
  if (e === "RECHAZADO") return "destructive"
  return "secondary"
}

export function PedidoDetalleModal({ open, onOpenChange, pedidoId }: Props) {
  const [pedido, setPedido] = useState<PedidoApi | null>(null)
  const [loading, setLoading] = useState(false)
  const [isPaying, setIsPaying] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const close = () => onOpenChange(false)

  useEffect(() => {
    if (!open) return
    if (!pedidoId) return

    const loadPedido = async () => {
      setLoading(true)
      setErrorMsg(null)
      try {
        const res = await fetch(`http://localhost:5000/api/pedidos/unico/${pedidoId}`)
        const data = await res.json()

        // tu back devuelve el pedido directo
        setPedido(data)
      } catch (e) {
        console.error("Error cargando pedido", e)
        setPedido(null)
        setErrorMsg("No pudimos cargar el pedido. Intentá de nuevo.")
      } finally {
        setLoading(false)
      }
    }

    loadPedido()
  }, [open, pedidoId])

  // ✅ Estado pago: por ahora lo más confiable es el estado del pedido (PAGADO / PENDIENTE / RECHAZADO)
  const isPaid = useMemo(() => {
    const e = (pedido?.estado || "").toUpperCase()
    if (e === "PAGADO") return true
    // fallback si viene pago normalizado:
    const pagoEstado = (pedido?.pago?.estado || "").toLowerCase()
    if (pagoEstado === "approved" || pagoEstado === "confirmado") return true
    return false
  }, [pedido])

  // ✅ Link MP existente (si tu back lo devuelve en pedido.pago.url_checkout)
  const mpCheckoutUrl = pedido?.pago?.url_checkout || null

  const refresh = async () => {
    if (!pedidoId) return
    setLoading(true)
    setErrorMsg(null)
    try {
      const res = await fetch(`http://localhost:5000/api/pedidos/unico/${pedidoId}`)
      const data = await res.json()
      setPedido(data)
    } catch (e) {
      setErrorMsg("No pudimos actualizar el estado.")
    } finally {
      setLoading(false)
    }
  }

  const retryTransferencia = async () => {
    if (!pedidoId) return
    setIsPaying(true)
    setErrorMsg(null)

    try {
      const res = await fetch("http://localhost:5000/api/pagos/preferencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pedido_id: pedidoId,
          tipo_pago: "transferencia",
          items: [{ producto_id: 0, nombre: "placeholder", cantidad: 1, precio: 0 }], // NO se usa, pero tu back exige "items"
          costo_envio: 0,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || "Error creando pago")
      }

      // tu back devuelve instrucciones
      // por ahora no alert — lo mostramos en UI si querés después
      await refresh()
    } catch (e: any) {
      setErrorMsg(e?.message || "Error al generar el pago por transferencia.")
    } finally {
      setIsPaying(false)
    }
  }

  const payWithMercadoPago = async () => {
    if (!pedidoId) return
    setIsPaying(true)
    setErrorMsg(null)

    try {
      // 1) Si ya tenés url_checkout guardada → redirigimos
      if (mpCheckoutUrl) {
        window.location.href = mpCheckoutUrl
        return
      }

      // 2) Si NO hay url_checkout, intentamos crear preferencia.
      // ⚠️ Esto puede fallar hasta que el back arme items desde el pedido.
      const res = await fetch("http://localhost:5000/api/pagos/preferencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pedido_id: pedidoId,
          tipo_pago: "mercadopago",
          // hoy NO tenemos producto_id/precio desde /unico, así que mandamos vacío y dependerá del back
          items: [],
          costo_envio: pedido?.costo_envio || 0,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || "No se pudo iniciar Mercado Pago.")
      }

      if (data?.init_point) {
        window.location.href = data.init_point
        return
      }

      throw new Error("Mercado Pago no devolvió init_point.")
    } catch (e: any) {
      setErrorMsg(
        e?.message ||
          "No se pudo iniciar Mercado Pago. (Probablemente falta que el back pueda recrear items desde el pedido.)"
      )
    } finally {
      setIsPaying(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="w-full max-w-[760px] rounded-2xl bg-background shadow-2xl border border-border overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="space-y-0.5">
            <h2 className="text-lg font-semibold">Detalle del pedido</h2>
            <p className="text-sm text-muted-foreground">{pedidoId ? `Pedido #${pedidoId}` : "—"}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="cursor-pointer" onClick={refresh} disabled={loading}>
              Actualizar
            </Button>

            <button
              onClick={close}
              className="h-9 w-9 rounded-xl border border-border hover:bg-muted flex items-center justify-center cursor-pointer"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {loading && <p className="text-sm text-muted-foreground">Cargando...</p>}

          {!loading && errorMsg && (
            <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm">
              {errorMsg}
            </div>
          )}

          {!loading && pedido && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Left: Pedido */}
              <div className="md:col-span-3 rounded-2xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge variant={badgeVariantByEstadoPedido(pedido.estado)}>{pedido.estado}</Badge>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {new Date(pedido.fecha).toLocaleDateString("es-AR")}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-xl font-bold">{moneyARS(pedido.total)}</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <h3 className="font-semibold">Productos</h3>

                  {(pedido.detalles ?? []).map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.producto} × {item.cantidad}
                      </span>
                      <span className="font-medium">{moneyARS(item.subtotal)}</span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{moneyARS(pedido.total)}</span>
                </div>
              </div>

              {/* Right: Pago */}
              <div className="md:col-span-2 rounded-2xl border border-border bg-card p-4">
                <h3 className="font-semibold">Pago</h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  {isPaid ? "Tu pago está confirmado ✅" : "Tu pago todavía no está confirmado."}
                </p>

                <Separator className="my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Método</span>
                    <span className="font-medium">{pedido.pago?.metodo_pago || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estado</span>
                    <span className="font-medium">{pedido.pago?.estado || pedido.estado || "—"}</span>
                  </div>
                </div>

                {!isPaid && (
                  <>
                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <Button
                        className="w-full rounded-xl"
                        disabled={isPaying}
                        onClick={retryTransferencia}
                      >
                        Reintentar transferencia
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full rounded-xl"
                        disabled={isPaying}
                        onClick={payWithMercadoPago}
                      >
                        Pagar con Mercado Pago
                      </Button>

                      {!mpCheckoutUrl && (
                        <p className="text-xs text-muted-foreground">
                          Si Mercado Pago falla, falta que el back pueda recrear los items del pedido desde la BD.
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {!loading && !pedido && !errorMsg && (
            <p className="text-sm text-muted-foreground">Pedido no encontrado.</p>
          )}
        </div>
      </div>
    </div>
  )
}


