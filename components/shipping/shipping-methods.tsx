import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockShippingMethods } from "@/lib/services/mock-data"

interface ShippingMethodsProps {
  className?: string
}

export function ShippingMethods({ className = "" }: ShippingMethodsProps) {
  return (
    <section className={className}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 font-[family-name:var(--font-poppins)]">
          Formas de Envío
        </h2>
        <p className="text-muted-foreground font-[family-name:var(--font-inter)]">
          Elige la opción que mejor se adapte a tus necesidades
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockShippingMethods.map((method) => (
          <Card key={method.id} className="text-center hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="text-4xl mb-4">{method.icon}</div>
              <CardTitle className="font-[family-name:var(--font-poppins)]">{method.name}</CardTitle>
              <CardDescription>{method.eta}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Badge variant="outline" className="mb-2">
                  {method.regions.join(", ")}
                </Badge>
                <p className="text-sm text-muted-foreground font-[family-name:var(--font-inter)]">
                  {method.priceRules}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
