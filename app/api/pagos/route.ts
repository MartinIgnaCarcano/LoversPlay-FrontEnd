import { NextResponse } from "next/server"
// import { MercadoPagoConfig, Preference } from "mercadopago";

// const mercadopago = new MercadoPagoConfig({
//   accessToken: "APP_USR-6608167090676875-091814-964957d986e21eee913f06709c51abeb-2611950632", // 👈 tu token real
// });

// export async function POST(req: Request) {
//   try {
//     const { items, total, orderId } = await req.json()

//     const preference = {
//       items: [
//         {
//           id: orderId || "order-123",
//           title: "Compra en Lovers Play",
//           quantity: 1,
//           currency_id: "ARS",
//           unit_price: Number(total), // 👈 asegurar que es número
//         },
//       ],
//       back_urls: {
//         success: "http://localhost:3000/pagos/success", // 👈 asegurate que esta exista
//         failure: "http://localhost:3000/pagos/failure",
//         pending: "http://localhost:3000/pagos/pending",
//       },
//       auto_return: "approved", // 👈 solo funciona si success está bien definido
//       notification_url: "http://localhost:3000/api/pagos/notificacion",
//       external_reference: orderId || "order-123",
//     }

//     const preferenceClient = new Preference(mercadopago);
//     const response = await preferenceClient.create({ body: preference });
//     return NextResponse.json(response)
//   } catch (error: any) {
//     console.error("❌ Error de MercadoPago:", error)
//     return NextResponse.json({ error: "Error creando preferencia", details: error }, { status: 500 })
//   }
// }

export async function POST(req: Request) {
  try {
    // Recibir body del cliente
    const body = await req.json();

    const detalles = body.detalles; // detalles: [{ productId, quantity, price }, ...]
    const token = body.token; // token JWT del usuario autenticado


    const response = await fetch("http://localhost:5000/api/pedidos/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // ⚠️ si usas JWT
      },
      body: JSON.stringify({ detalles }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err);
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    console.error("❌ Error al crear pedido:", error);
    return NextResponse.json({ error: "Error al crear pedido", details: error.message }, { status: 500 });
  }
}
