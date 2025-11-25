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
}

export function Step5Review({
    billingData,
    shippingType,
    shippingCarrier,
    shipping,
    paymentMethod,
}: Step5ReviewProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Revisá tu pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div>
                    <h3 className="font-semibold mb-2">Dirección de entrega</h3>
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

                <div>
                    <h3 className="font-semibold mb-2">Método de envío</h3>
                    <p>
                        {shippingType === "correo" && "Correo"}
                        {shippingType === "transporte" &&
                            `Transporte${shippingCarrier ? ` - ${shippingCarrier}` : ""}`}
                        {shippingType === "pickup" && "Retiro por el local"}
                        {shippingType === "arrange" && "A coordinar con el vendedor"}
                    </p>
                    <p>
                        Costo envío:{" "}
                        {shipping === 0 ? "-" : `$${shipping.toFixed(2)}`}
                    </p>
                </div>

                <Separator />

                <div>
                    <h3 className="font-semibold mb-2">Método de pago</h3>
                    <p>
                        {paymentMethod === "transferencia" && "Transferencia bancaria"}
                        {paymentMethod === "credito" && "Tarjeta de crédito (+10%)"}
                        {paymentMethod === "debito" && "Tarjeta de débito"}
                        {paymentMethod === "mercadopago" && "Mercado Pago"}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
