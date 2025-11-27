"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { ShippingType } from "../useCheckout"

interface Step1MetodoEnvioProps {
    shippingType: ShippingType
    setShippingType: (value: ShippingType) => void
}


export function Step1MetodoEnvio({ shippingType, setShippingType }: Step1MetodoEnvioProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Método de entrega</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <RadioGroup
                    value={shippingType}
                    onValueChange={(value: ShippingType) => setShippingType(value)}
                    className="space-y-2"
                >
                    <div className="flex items-center space-x-4 p-3 border rounded-lg">
                        <RadioGroupItem value="correo" id="correo" />
                        <Label htmlFor="correo" className="flex flex-col items-start cursor-pointer">
                            <span className="font-medium">Correo</span>
                            <span className="text-xs text-muted-foreground">3 a 5 días hábiles</span>
                        </Label>
                    </div>

                    <div className="flex items-center space-x-4 p-3 border rounded-lg">
                        <RadioGroupItem value="transporte" id="transporte" />
                        <Label htmlFor="transporte" className="flex flex-col items-start cursor-pointer">
                            <span className="font-medium">Transporte</span>
                            <span className="text-xs text-muted-foreground">Depende del transporte elegido</span>
                        </Label>
                    </div>

                    <div className="flex items-center space-x-4 p-3 border rounded-lg">
                        <RadioGroupItem value="pickup" id="pickup" />
                        <Label htmlFor="pickup" className="flex flex-col items-start cursor-pointer">
                            <span className="font-medium">Retirar por el local</span>
                            <span className="text-xs text-muted-foreground">Sin costo de envío</span>
                        </Label>
                    </div>

                    <div className="flex items-center space-x-4 p-3 border rounded-lg">
                        <RadioGroupItem value="arrange" id="arrange" />
                        <Label htmlFor="arrange" className="flex flex-col items-start cursor-pointer">
                            <span className="font-medium">Arreglar con el vendedor</span>
                        </Label>
                    </div>
                </RadioGroup>
            </CardContent>
        </Card>
    )
}
