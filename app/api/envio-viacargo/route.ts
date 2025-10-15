import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { postalCode } = await req.json()

    const payload = {
      IdClienteRemitente: "00000511",
      IdCentroRemitente: "02",
      CodigoPostalRemitente: "5500",
      CodigoPostalDestinatario: postalCode,
      NumeroBultos: "1", // ✅ corregido
      Kilos: "1",
      Largo: "50",
      Ancho: "30",
      Alto: "6",
      ImporteValorDeclarado: "50000",
    }

    console.log("📦 Payload enviado a ViaCargo:", payload)

    const res = await fetch("https://ws.busplus.com.ar/alerce/cotizar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const text = await res.text()
    console.log("📨 Respuesta cruda ViaCargo:", res.status, text)

    if (!res.ok) {
      return NextResponse.json(
        { error: "Error calculando envío", detalle: text },
        { status: res.status }
      )
    }

    const data = JSON.parse(text)
    const precio = data?.Cotizacion?.[0]?.TOTAL || null
    const descripcion = data?.Cotizacion?.[0]?.PRODUCTO_DESCRIPCION || "Sin descripción"

    return NextResponse.json({
      precio,
      descripcion,
      tiempo_entrega: data?.Cotizacion?.[0]?.TIEMPO_ENTREGA || null,
    })
  } catch (error: any) {
    console.error("❌ Error interno en envio-viacargo:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
