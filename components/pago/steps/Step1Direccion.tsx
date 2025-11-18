"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { BillingData } from "../useCheckout"

interface Step1DireccionProps {
    billingData: BillingData
    setBillingData: (data: BillingData) => void
}

export function Step1Direccion({ billingData, setBillingData }: Step1DireccionProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Dirección de entrega</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="nombre">Nombre y Apellido *</Label>
                        <Input
                            id="nombre"
                            value={billingData.name}
                            onChange={(e) => setBillingData({ ...billingData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="phone">Teléfono *</Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={billingData.phone}
                            onChange={(e) => setBillingData({ ...billingData, phone: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="address">Calle y numeración *</Label>
                        <Input
                            id="address"
                            value={billingData.address}
                            onChange={(e) => setBillingData({ ...billingData, address: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="city">Departamento / Partido</Label>
                        <Input
                            id="city"
                            value={billingData.city}
                            onChange={(e) => setBillingData({ ...billingData, city: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="province">Provincia *</Label>
                        <Input
                            id="province"
                            value={billingData.province}
                            onChange={(e) => setBillingData({ ...billingData, province: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="postalCode">Código Postal *</Label>
                        <Input
                            id="postalCode"
                            value={billingData.postalCode}
                            onChange={(e) => setBillingData({ ...billingData, postalCode: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <Label htmlFor="extra">Detalle extra para la entrega</Label>
                    <Input
                        id="extra"
                        placeholder="Ej: Tocar el timbre derecho / Llamar al llegar"
                        value={billingData.extra}
                        onChange={(e) => setBillingData({ ...billingData, extra: e.target.value })}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                        id="email"
                        type="email"
                        value={billingData.email}
                        onChange={(e) => setBillingData({ ...billingData, email: e.target.value })}
                        required
                    />
                </div>
            </CardContent>
        </Card>
    )
}
