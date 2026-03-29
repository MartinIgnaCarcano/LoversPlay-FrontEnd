import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Truck, Package, Shield, Clock } from "lucide-react"
import { mockShippingMethods } from "@/lib/services/mock-data"

export default function ShippingPage() {
  const breadcrumbItems = [{ label: "Información de Envíos" }]

  const faqItems = [
    {
      question: "¿Cómo garantizan la discreción en el envío?",
      answer:
        "Todos nuestros productos se envían en cajas neutras sin ningún logo o referencia al contenido. El remitente aparece como 'LP Commerce' y no hay indicación externa del tipo de productos que contiene el paquete.",
    },
    {
      question: "¿Puedo rastrear mi pedido?",
      answer:
        "Sí, una vez que tu pedido sea enviado, recibirás un número de seguimiento por email. Podrás rastrear tu paquete en tiempo real a través del sitio de la paquetería.",
    },
    {
      question: "¿Entregan en fines de semana?",
      answer:
        "Las entregas estándar se realizan de lunes a viernes. Sin embargo, con nuestro servicio express, también realizamos entregas los sábados por la mañana en zonas metropolitanas.",
    },
    {
      question: "¿Qué medidas de seguridad toman durante el envío?",
      answer:
        "Todos los productos están asegurados durante el transporte. Utilizamos empaques resistentes y seguros. En caso de daño o pérdida, reemplazamos el producto sin costo adicional.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        {/* Page header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4 font-[family-name:var(--font-poppins)]">
            Envíos a Mendoza y a todo el País
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-[family-name:var(--font-inter)]">
            El costo del envío se calcula automáticamente en el carrito según tu ubicación y el total de tu compra.
          </p>
        </div>

        {/* Shipping methods */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center font-[family-name:var(--font-poppins)]">
            Métodos de Envío
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockShippingMethods.map((method) => (
              <Card key={method.id} className="relative overflow-hidden">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-4">{method.icon}</div>
                  <CardTitle className="font-[family-name:var(--font-poppins)]">{method.name}</CardTitle>
                  <CardDescription>{method.eta}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-4">
                    <Badge variant="outline" className="mb-2">
                      {method.regions.join(", ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-[family-name:var(--font-inter)]">
                    {method.priceRules}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Shipping zones table */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center font-[family-name:var(--font-poppins)]">
            Zonas de Entrega
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Mendoza Coverage Map */}
            <Card>
              <CardHeader>
                <CardTitle className="font-[family-name:var(--font-poppins)] text-center">
                  Cobertura Gran Mendoza
                </CardTitle>
                <CardDescription className="text-center">
                  Mensajería en Ciudad, Godoy Cruz, Guaymallén y Las Heras (arreglar con el vendedor)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54703.44421142197!2d-68.8456!3d-32.8908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e093ec45179bf%3A0x205a78f6d20efa3a!2sGran%20Mendoza%2C%20Argentina!5e0!3m2!1ses!2sus!4v1699999999999!5m2!1ses!2sus&z=11"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Cobertura Gran Mendoza - Luján, Godoy Cruz, Maipú, Guaymallén, Las Heras"
                  />
                </div>
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-green-800">
                    <div className="w-3 h-3 bg-green-500 rounded-full opacity-60"></div>
                    <span className="font-medium">Área de cobertura con mensajería propia</span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">Entrega en 24-48 horas en toda el área metropolitana</p>
                </div>
              </CardContent>
            </Card>

            {/* Argentina Coverage Map */}
            <Card>
              <CardHeader>
                <CardTitle className="font-[family-name:var(--font-poppins)] text-center">Cobertura Nacional</CardTitle>
                <CardDescription className="text-center">Correo Argentino - Todo el país</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14168475.533325285!2d-65.9875!3d-38.4161!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xb09dff882a7809e1%3A0xb708e77c684786c2!2sArgentina!5e0!3m2!1ses!2sus!4v1699999999999!5m2!1ses!2sus&z=4"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Cobertura Nacional Argentina - Correo Argentino"
                  />
                </div>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-blue-800">
                    <div className="w-3 h-3 bg-blue-500 rounded-full opacity-60"></div>
                    <span className="font-medium">Cobertura nacional completa</span>
                  </div>
                  <p className="text-xs text-blue-700 mt-1">Entrega en 3-7 días hábiles según destino</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8 bg-gradient-to-r from-brand/10 to-background border border-border shadow-md">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-brand/20 rounded-full flex items-center justify-center shadow-sm border border-brand/30">
                    <Shield className="h-10 w-10 text-brand" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-foreground mb-6 font-[family-name:var(--font-poppins)] flex items-center gap-3">
                    🔒 Envío 100% Confidencial
                  </h3>

                  <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <p className="text-muted-foreground leading-relaxed font-[family-name:var(--font-inter)] text-lg">
                      <span className="text-2xl font-bold text-brand block mb-2">IMPORTANTE:</span>
                      Sólo usted y nosotros estaremos al tanto del contenido de sus encomiendas, las cuales se encuentran selladas
                      y se envían sólo con su nombre y dirección, nunca habrá alguna alusión a nuestra tienda o a su compra en
                      específico.
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-green-700 bg-green-100/70 px-4 py-2 rounded-full border border-green-200">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      Empaque neutro
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-700 bg-blue-100/70 px-4 py-2 rounded-full border border-blue-200">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      Sin referencias externas
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-purple-700 bg-purple-100/70 px-4 py-2 rounded-full border border-purple-200">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      Máxima discreción
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>



        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center font-[family-name:var(--font-poppins)]">
            ¿Por qué elegir nuestro servicio de envío?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 mx-auto mb-4 text-brand" />
                <h3 className="font-semibold text-card-foreground mb-2 font-[family-name:var(--font-poppins)]">
                  100% Discreto
                </h3>
                <p className="text-sm text-muted-foreground font-[family-name:var(--font-inter)]">
                  Empaque neutro sin referencias al contenido
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Package className="h-12 w-12 mx-auto mb-4 text-brand" />
                <h3 className="font-semibold text-card-foreground mb-2 font-[family-name:var(--font-poppins)]">
                  Empaque Seguro
                </h3>
                <p className="text-sm text-muted-foreground font-[family-name:var(--font-inter)]">
                  Protección completa durante el transporte
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Clock className="h-12 w-12 mx-auto mb-4 text-brand" />
                <h3 className="font-semibold text-card-foreground mb-2 font-[family-name:var(--font-poppins)]">
                  Entrega Rápida
                </h3>
                <p className="text-sm text-muted-foreground font-[family-name:var(--font-inter)]">
                  Tiempos de entrega garantizados
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Truck className="h-12 w-12 mx-auto mb-4 text-brand" />
                <h3 className="font-semibold text-card-foreground mb-2 font-[family-name:var(--font-poppins)]">
                  Seguimiento
                </h3>
                <p className="text-sm text-muted-foreground font-[family-name:var(--font-inter)]">
                  Rastrea tu pedido en tiempo real
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section id="preguntas-envios">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center font-[family-name:var(--font-poppins)]">
            Preguntas Frecuentes sobre Envíos
          </h2>
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-[family-name:var(--font-poppins)]">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground font-[family-name:var(--font-inter)]">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  )
}
