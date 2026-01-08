"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface Step4PagoProps {
    paymentMethod: string
    setPaymentMethod: (value: string) => void
}

export function Step4Pago({ paymentMethod, setPaymentMethod }: Step4PagoProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Método de pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="space-y-4"
                >
                    
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="mercadopago" id="mercadopago" />
                        <Label htmlFor="mercadopago" className="cursor-pointer">
                            Mercado Pago
                        </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="credito" id="credito" />
                        <Label htmlFor="credito" className="cursor-pointer">
                            Tarjeta de crédito (+10%)
                        </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="debito" id="debito" />
                        <Label htmlFor="debito" className="cursor-pointer">
                            Tarjeta de débito
                        </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="transferencia" id="transferencia" />
                        <Label htmlFor="transferencia" className="cursor-pointer">
                            Transferencia bancaria
                        </Label>
                    </div>
                </RadioGroup>
            </CardContent>
        </Card>
    )
}
