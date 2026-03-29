"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"

export default function PrivacidadPage() {
  const breadcrumbItems = [{ label: "Políticas de Privacidad" }]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />
        <h1 className="text-4xl font-bold text-foreground mb-8 font-[family-name:var(--font-poppins)]">
          Políticas de Privacidad
        </h1>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground font-[family-name:var(--font-inter)] marker:text-foreground md:pl-4">
          
          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">1. Uso y tratamiento de datos de carácter personal</h2>
          <p>Lovers Play Sex Shop informa que los datos de carácter personal proporcionados, a través del sitio web, así como los que pudiera facilitar en el futuro en el marco de su relación jurídica con esta entidad, son archivados bajo seguridad en nuestros servidores.</p>
          <p>El almacenamiento de esta información tiene la finalidad de gestionar, administrar, prestarle los servicios o facilitarle los productos que solicite, facilitar el cumplimiento y ejecución de los contratos que pudiera celebrar, conocer mejor sus gustos y adecuar los servicios a sus preferencias, así como poder ofrecerle nuevos servicios o productos y enviarle información administrativa, técnica, organizativa y/o comercial de forma documental y/o electrónica relacionada con las actividades de Lovers Play Sex Shop. Los destinatarios de la información recogida serán, principalmente, los empleados de Lovers Play Sex Shop.</p>
          <p>Salvo en los campos en que expresamente se determine lo contrario, las respuestas a las preguntas sobre datos personales son voluntarias. La falta de contestación no implica una merma en la calidad de los servicios. Sin embargo, la falta de cumplimentación de campos obligatorios imposibilitará a Lovers Play Sex Shop prestar los servicios solicitados.</p>
          <p>Los usuarios garantizan la veracidad, exactitud, vigencia y autenticidad de la información personal facilitada y se comprometen a mantenerla actualizada.</p>

          <h3 className="text-xl font-medium text-foreground mt-6 mb-3 font-[family-name:var(--font-poppins)]">¿Qué datos personales recogemos y por qué los recogemos?</h3>
          <p>Cuando los visitantes dejan comentarios en la web, recopilamos los datos que se muestran en el formulario, así como la dirección IP del visitante y la cadena de agentes de usuario del navegador para ayudar a la detección de spam. Después de la aprobación de un comentario, la imagen de perfil de servicios asociados puede ser visible contextualmente.</p>
          <p>Si dejas un comentario o llenas formularios, guardamos de forma segura tu información personal. Todos los usuarios pueden ver, editar o eliminar su información en ciertos plazos y medios estipulados.</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">2. Ejercicio de derechos: acceso, rectificación, cancelación y oposición</h2>
          <p>Aquellas personas físicas que hayan facilitado sus datos a Lovers Play Sex Shop podrán dirigirse a esta entidad para ejercitar gratuitamente sus derechos de acceso, rectificación, cancelación y oposición. Conforme se establece en el artículo 14, inciso 3 de la Ley Nº 25.326, el titular de los datos personales tiene la facultad de ejercer el derecho de acceso en forma gratuita a intervalos no inferiores a seis meses.</p>
          <p>Dado el carácter confidencial de la información, usted deberá solicitarlo por cualquier medio comprobable (como correo electrónico ventas@loversplaysexshop.com) y remitir copia de documento de identidad.</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">3. Medidas de seguridad</h2>
          <p>Lovers Play Sex Shop está obligada a cumplir con toda la normativa aplicable en materia de medidas de seguridad a la información y datos de carácter personal.</p>
          <p>Contamos con las medidas de índole técnica y organizativas necesarias para evitar la alteración, pérdida y acceso no autorizado, de acuerdo al estado de la tecnología. No obstante, el usuario debe ser consciente de que las medidas en Internet no son inexpugnables.</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">4. Uso de Cookies</h2>
          <p>Las «cookies» constituyen una herramienta empleada para almacenar y recuperar información sobre la navegación. Ayudan a identificar a los Usuarios para agilizar los procesos en visitas repetidas.</p>
          <p>La finalidad de estas es personalizar servicios, y no proporcionan por sí solas datos personales. Se puede restringir su uso a través de la configuración de navegadores.</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">5. Menores de edad</h2>
          <p>Lovers Play Sex Shop no admite suscripciones ni compras por parte de menores de edad y no se responsabiliza de cuentas creadas con datos falsos por parte de mismos.</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">6. Modificación de la política de privacidad</h2>
          <p>Lovers Play Sex Shop se reserva el derecho a modificar su Política de Privacidad, publicándose debidamente en esta misma página antes de su aplicación.</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">7. Legislación aplicable</h2>
          <p>Cualquier controversia derivada del uso del sitio web será interpretada bajo las leyes vigentes en Argentina.</p>

        </div>
      </main>
      <Footer />
    </div>
  )
}
