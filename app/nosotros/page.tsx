"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"

export default function NosotrosPage() {
  const breadcrumbItems = [{ label: "Nosotros" }]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />
        <h1 className="text-4xl font-bold text-foreground mb-8 font-[family-name:var(--font-poppins)]">
          Nosotros
        </h1>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground font-[family-name:var(--font-inter)] marker:text-foreground">
          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">
            Lovers Play Sex Shop
          </h2>
          <p>
            Somos una empresa constituida <strong>Desde 1997</strong> de trayectoria y experiencia en el rubro, dedicada a satisfacer las fantasías, el erotismo y la sexualidad a quienes desean disfrutarlo con total libertad.
          </p>
          <p>
            Lovers Play Sex Shop es una de las primeras tiendas de Sex Shop en Mendoza que instauró de forma exitosa la venta de juguetes y accesorios eróticos de una manera confiable y discreta. Nuestro compromiso está basado en entregar un excelente servicio a través de la atención personalizada y detallada para cada cliente. En Lovers Play Sex Shop destacamos por mantener en línea un catálogo renovado y fresco, ofreciendo precios imbatibles y gran variedad de producto entre la competencia.
          </p>
          <p>
            Contamos con atención personalizada en nuestro Sex Shop en Mendoza. En nuestra tienda erótica online encontrarás todos los productos sexuales que puedas imaginar. Tenemos un staff profesional y discreto que tiene amplia experiencia y formación en juguetes sexuales y sexualidad. Nuestro Sex Shop Online destaca por su perfecta funcionalidad y nuestro servicio de atención al cliente cortés y personal que, por chat o por teléfono, asesora profesionalmente todas las cuestiones relacionadas con nuestro rubro. Además, en Lovers Play Sex Shop le damos una gran importancia al envío discreto y a la protección de la privacidad de nuestros clientes, a través de un trato totalmente confidencial y privado. Los paquetes de nuestra tienda erótica son completamente discretos.
          </p>
          <p>
            No lo pienses más y sumate a nuestros clientes que han decidido darle un giro en 180 grados a su vida sexual, reinventado de buena forma el punto que tenían sobre la sexualidad y la vida en pareja. Contáctate con los profesionales de Lovers Play Sex Shop y resolveremos todas tus dudas acerca del uso, conservación y limpieza de todos tus juguetes eróticos.
          </p>
          <p>
            Somos una empresa que siempre piensa en vos. Encontrá en Lovers Play Sex Shop un lugar donde tus fantasías se convertirán en realidad.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
