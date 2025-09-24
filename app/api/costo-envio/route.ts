import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { postalCode } = await req.json()

  const res = await fetch("https://www.andreani.com/api/cotizador/prices", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      codigoPostalOrigen: "5519",
      codigoPostalDestino: postalCode,
      tipoDeEnvioId: "9c16612c-a916-48cf-9fbb-dbad2b097e9e",
      bultos: [
        {
          itemId: "b1a076ac-5b7b-4b16-aec1-e0b90bae7c6c",
          altoCm: "6",
          anchoCm: "30",
          largoCm: "50",
          peso: "1000",
          unidad: "grs",
          valorDeclarado: "4500",
        },
      ],
    }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: "Error calculando envío" }, { status: res.status })
  }

  const data = await res.json()

  // 👇 Mapeamos la respuesta para no depender de índices
  const branch = data.find((d: any) => d.type === "branch")?.price || null
  const home = data.find((d: any) => d.type === "home")?.price || null

  return NextResponse.json({
    branch,
    home,
  })
}
