"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { BillingData, ShippingType } from "../useCheckout"

interface Step3DireccionProps {
    billingData: BillingData
    setBillingData: (data: BillingData) => void
    shippingType: ShippingType
}

export function Step3Direccion({ billingData, setBillingData, shippingType }: Step3DireccionProps) {

    const simpleMode = shippingType === "pickup" || shippingType === "arrange"

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Datos para el pedido</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">

                {/* Nombre y Teléfono */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="nombre">Nombre y Apellido *</Label>
                        <Input
                            id="nombre"
                            className="placeholder:text-muted-foreground/50"
                            value={billingData.name}
                            onChange={(e) => setBillingData({ ...billingData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label htmlFor="phone">Teléfono *</Label>
                        <Input
                            id="phone"
                            className="placeholder:text-muted-foreground/50"
                            type="tel"
                            value={billingData.phone}
                            onChange={(e) => setBillingData({ ...billingData, phone: e.target.value })}
                            required
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                        id="email"
                        className="placeholder:text-muted-foreground/50"
                        type="email"
                        value={billingData.email}
                        onChange={(e) => setBillingData({ ...billingData, email: e.target.value })}
                        required
                    />
                </div>
                {!simpleMode && (
                    <>
                        {/* Dirección — disabled si pickup/arrange */}
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${simpleMode ? "opacity-50" : ""}`}>
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="address">Calle y numeración *</Label>
                                <Input
                                    id="address"
                                    className="placeholder:text-muted-foreground/50"
                                    disabled={simpleMode}
                                    value={billingData.address}
                                    onChange={(e) => setBillingData({ ...billingData, address: e.target.value })}
                                    required={!simpleMode}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label htmlFor="city">Departamento / Partido</Label>
                                <Input
                                    id="city"
                                    className="placeholder:text-muted-foreground/50"
                                    disabled={simpleMode}
                                    value={billingData.city}
                                    onChange={(e) => setBillingData({ ...billingData, city: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${simpleMode ? "opacity-50" : ""}`}>
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="province">Provincia *</Label>
                                <Input
                                    id="province"
                                    className="placeholder:text-muted-foreground/50"
                                    disabled={simpleMode}
                                    value={billingData.province}
                                    onChange={(e) => setBillingData({ ...billingData, province: e.target.value })}
                                    required={!simpleMode}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label htmlFor="postalCode">Código Postal *</Label>
                                <Input
                                    id="postalCode"
                                    className="placeholder:text-muted-foreground/50"
                                    disabled={simpleMode}
                                    value={billingData.postalCode}
                                    onChange={(e) => setBillingData({ ...billingData, postalCode: e.target.value })}
                                    required={!simpleMode}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label htmlFor="extra">Detalle extra para la entrega</Label>
                            <Input
                                id="extra"
                                placeholder="Ej: Tocar timbre / Llamar al llegar"
                                className="placeholder:text-muted-foreground/50"
                                value={billingData.extra}
                                onChange={(e) => setBillingData({ ...billingData, extra: e.target.value })}
                            />
                        </div>
                    </>
                )}

            </CardContent>
        </Card>
    )
}
