"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { BillingData, ShippingType, ShippingCarrier } from "../useCheckout"

interface Step2EnvioDetalleProps {
    billingData: BillingData
    setBillingData: (data: BillingData) => void
    shippingType: ShippingType
    shippingCarrier: ShippingCarrier
    setShippingCarrier: (value: ShippingCarrier) => void
    shippingCost: number
    isCalculatingCost: boolean
    calculateShipping: () => void
}

export function Step2EnvioDetalle({
    billingData,
    setBillingData,
    shippingType,
    shippingCarrier,
    setShippingCarrier,
    shippingCost,
    isCalculatingCost,
    calculateShipping,
}: Step2EnvioDetalleProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Detalles del envío</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {(shippingType === "correo" || shippingType === "transporte") && (
                    <>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="postalCode3">Código Postal *</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="postalCode3"
                                    className="placeholder:text-muted-foreground/50"
                                    value={billingData.postalCode}
                                    onChange={(e) => setBillingData({ ...billingData, postalCode: e.target.value })}
                                    placeholder="Ej: 5500"
                                />
                                <Button
                                    variant="outline"
                                    onClick={calculateShipping}
                                    disabled={isCalculatingCost}
                                >
                                    {isCalculatingCost ? "Calculando..." : "Calcular envío"}
                                </Button>
                            </div>
                        </div>

                        {shippingType === "transporte" && (
                            <div>
                                <Label>Elegí el transporte</Label>
                                <RadioGroup
                                    value={shippingCarrier}
                                    onValueChange={(value: ShippingCarrier) => setShippingCarrier(value)}
                                    className="space-y-3 mt-2"
                                >
                                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                                        <RadioGroupItem value="viacargo" id="viacargo" />
                                        <Label htmlFor="viacargo" className="cursor-pointer">
                                            ViaCargo
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                                        <RadioGroupItem value="cata" id="cata" />
                                        <Label htmlFor="cata" className="cursor-pointer">
                                            Cata
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                                        <RadioGroupItem value="andesmar" id="andesmar" />
                                        <Label htmlFor="andesmar" className="cursor-pointer">
                                            Andesmar
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        )}

                        {shippingCost > 0 && (
                            <div className="p-3 bg-muted rounded-lg">
                                <p className="text-sm font-medium">
                                    Costo de envío calculado: ${shippingCost.toFixed(2)}
                                </p>
                            </div>
                        )}
                    </>
                )}

                {shippingType === "pickup" && (
                    <p className="text-sm text-muted-foreground">
                        Elegiste retirar por el local. Te enviaremos la dirección exacta por WhatsApp o email.
                    </p>
                )}

                {shippingType === "arrange" && (
                    <p className="text-sm text-muted-foreground">
                        Elegiste arreglar el envío directamente con el vendedor. Nos vamos a contactar con vos
                        luego de confirmar el pedido.
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
