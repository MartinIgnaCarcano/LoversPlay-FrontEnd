"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { BillingData, ShippingType, ShippingCarrier } from "../useCheckout"

interface Step5ReviewProps {
    billingData: BillingData
    shippingType: ShippingType
    shippingCarrier: ShippingCarrier
    shipping: number
    paymentMethod: string
    subtotal: number
    recargo: number
    total: number
}

export function Step5Review({
    billingData,
    shippingType,
    shippingCarrier,
    shipping,
    paymentMethod,
    subtotal,
    recargo,
    total,
}: Step5ReviewProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Revisá tu pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">

                {/* Dirección */}
                <div>
                    <h3 className="font-semibold mb-2 text-lg">Dirección de entrega</h3>
                    <p>{billingData.name}</p>
                    <p>
                        {billingData.address}
                        {billingData.city && `, ${billingData.city}`}
                    </p>
                    <p>
                        {billingData.province} {billingData.postalCode && `(${billingData.postalCode})`}
                    </p>
                    <p>Tel: {billingData.phone}</p>
                    <p>Email: {billingData.email}</p>
                    {billingData.extra && <p>Detalle: {billingData.extra}</p>}
                </div>

                <Separator />

                {/* Envío */}
                <div>
                    <h3 className="font-semibold mb-2 text-lg">Método de envío</h3>
                    <p>
                        {shippingType === "correo" && "Correo"}
                        {shippingType === "transporte" &&
                            `Transporte${shippingCarrier ? ` - ${shippingCarrier}` : ""}`}
                        {shippingType === "pickup" && "Retiro por el local"}
                        {shippingType === "arrange" && "A coordinar con el vendedor"}
                    </p>
                    <p>Costo envío: {shipping === 0 ? "-" : `$${shipping.toFixed(2)}`}</p>
                </div>

                <Separator />

                {/* Pago */}
                <div>
                    <h3 className="font-semibold mb-2 text-lg">Método de pago</h3>
                    <p>
                        {paymentMethod === "transferencia" && "Transferencia bancaria"}
                        {paymentMethod === "credito" && "Tarjeta de crédito (+10%)"}
                        {paymentMethod === "debito" && "Tarjeta de débito"}
                        {paymentMethod === "mercadopago" && "Mercado Pago"}
                    </p>

                    {paymentMethod === "transferencia" && (
                        <p className="text-500 font-medium">
                            Alias: loversplay.mp
                            <br />
                            CBU: 000000000000000123123123
                            <br />
                            <br />
                            - Realizá la transferencia por el monto indicado usando los datos de la cuenta que figuran debajo.
                            <br />
                            👉 Importante: incluí PEDIDO Nº "ID_PEDIDO" en el concepto para que podamos identificar el pago.
                            <br />
                            - Una vez recibida la transferencia, el pago será verificado y te avisaremos por email cuando el pedido cambie de estado.
                            <br />

                        </p>
                    )}

                    {paymentMethod === "credito" && (
                        <p className="text-red-500 font-medium">
                            Recargo por crédito: +${recargo.toFixed(2)}
                        </p>
                    )}
                </div>

                <Separator />

                {/* Total */}
                <div className="text-lg font-semibold">
                    Total final: ${total.toFixed(2)}
                </div>
            </CardContent>
        </Card>
    )
}
