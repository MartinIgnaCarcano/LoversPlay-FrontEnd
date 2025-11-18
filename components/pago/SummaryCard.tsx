"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface SummaryCardProps {
    cartItems: any[]
    subtotal: number
    shipping: number
    total: number
}

export function SummaryCard({ cartItems, subtotal, shipping, total }: SummaryCardProps) {
    return (
        <Card className="sticky top-24">
            <CardHeader>
                <CardTitle>Resumen del pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    {cartItems.map((item: any) => (
                        <div key={item.productId} className="flex gap-3">
                            <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                                <p className="font-medium text-sm">{item.name}</p>
                                <p className="text-xs text-muted-foreground">Cantidad: {item.quantity}</p>
                            </div>
                            <div className="text-sm font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Envío</span>
                        <span>{shipping === 0 ? "-" : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
