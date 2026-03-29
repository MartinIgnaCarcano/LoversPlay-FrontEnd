"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"

export default function TerminosPage() {
  const breadcrumbItems = [{ label: "Términos y Condiciones" }]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />
        <h1 className="text-4xl font-bold text-foreground mb-8 font-[family-name:var(--font-poppins)]">
          Términos y Condiciones
        </h1>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground font-[family-name:var(--font-inter)] marker:text-foreground md:pl-4">

          <p>Los términos y condiciones se aplicarán para la navegación del sitio de Internet www.mdz.loversplaysexshop.com (en adelante el "sitio web") y los servicios ofrecidos en él.</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">Aceptación y conocimiento</h2>
          <p>Los presentes Términos y Condiciones tienen carácter obligatorio y vinculante. Se aplican a todas las compras y actividades realizadas mediante el sitio web. El uso del sitio implica el conocimiento y la aceptación de ellos. Si usted no está de acuerdo con los Términos y Condiciones, deberá abstenerse de utilizar el sitio web y/o los servicios por él ofrecidos. Por "Usuario" del sitio web se entiende tanto a los registrados como a los visitantes.</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">Modificación</h2>
          <p>Los Términos y Condiciones podrán ser sustituidos o sufrir modificaciones en cualquier momento y a exclusivo criterio de Lovers Play Sex Shop y no se requerirá a los Usuarios su consentimiento. Para las transacciones en curso que hayan comenzado con anterioridad a dichas modificaciones, subsistirán las condiciones vigentes al momento de su concertación, a menos que las nuevas modificaciones introducidas fueran más convenientes para el Usuario.</p>
          <p>Sin perjuicio de lo anterior, los Usuarios son responsables de leer estos Términos y Condiciones cada vez que ingresen al sitio web para ver si han sufrido modificaciones.</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">Interrupción del Servicio – Exclusión de responsabilidad</h2>
          <p>Lovers Play Sex Shop se reserva el derecho de interrumpir, suspender o modificar en cualquier momento los servicios ofrecidos en el presente sitio web, ya sea en forma permanente o transitoria. No se requerirá la conformidad de los Usuarios, ni será necesario aviso previo alguno.</p>
          <p>Asimismo, Lovers Play Sex Shop no garantiza el acceso o uso permanente del sitio web, ya que éste podría interrumpirse por cuestiones técnicas ajenas a Lovers Play Sex Shop.</p>
          <p>No obstante lo mencionado anteriormente, si la suspensión o interrupción mencionada no obedeciere a razones de fuerza mayor o caso fortuito, Lovers Play Sex Shop se compromete a cumplir con la atención de pedidos que estuvieran pendientes al momento de la suspensión o interrupción.</p>
          <p>Lovers Play Sex Shop no garantiza que el sitio web se encuentre libre de virus, gusanos o cualquier otro elemento que pueda llegar a dañar o alterar el normal funcionamiento de un ordenador. Es responsabilidad y obligación exclusiva del Usuario contar con las herramientas adecuadas para detectar, desinfectar y/o prevenir cualquier tipo de elementos y/o posibles daños de esta naturaleza.</p>
          <p>Lovers Play Sex Shop no se responsabiliza por cualquier daño que pueda producirse en los equipos informáticos de los Usuarios o de terceros como consecuencia de la navegación del presente sitio web.</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">Registración</h2>
          <p>Los Usuarios pueden navegar libremente por el sitio web, pero deberán estar registrados para poder realizar alguna compra o utilizar los servicios ofrecidos en él.</p>
          <p>La registración de los Usuarios se realiza ingresando al sitio web, y no tiene costo alguno.</p>
          <p>Es obligatorio completar el formulario en todos los campos con datos válidos y verdaderos, de manera exacta y precisa. Para un correcto funcionamiento del sistema, es necesario que los Usuarios mantengan sus datos actualizados. Lovers Play Sex Shop podrá proceder a verificar la identidad del Usuario y/o de los datos consignados por éste.</p>
          <p>Lovers Play Sex Shop no se responsabiliza por la veracidad o certeza de los datos provistos por los Usuarios. Asimismo, Lovers Play Sex Shop se reserva el derecho de suspender temporal o definitivamente a los Usuarios en caso de incumplimiento de los Términos y Condiciones, como así también de rechazar solicitudes.</p>
          <p>Los Usuarios accederán a su Cuenta Personal (la "Cuenta") mediante un nombre de Usuario y una clave personal que deberán escoger. En caso de que estos datos sean olvidados por el Usuario, Lovers Play Sex Shop cuenta con un servicio de ayuda para recuperarlos. Para esto se deberá hacer "click" en la opción correspondiente e ingresar el e-mail que se proporcionó al momento de la registración. Al finalizar, el sistema le enviará de manera confidencial a esa cuenta su nombre de Usuario y la clave personal.</p>
          <p>Así como Lovers Play Sex Shop se compromete a mantener la confidencialidad de los datos aportados por los Usuarios para su registro, los Usuarios se comprometen a mantener la confidencialidad de su nombre y clave de acceso. Los Usuarios son responsables del uso que se haga de su clave. El Usuario se compromete a notificar inmediatamente y de manera fehaciente a Lovers Play Sex Shop cualquier uso no autorizado de su Cuenta de Usuario.</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">Capacidad</h2>
          <p>Para utilizar los servicios del sitio web se requiere tener capacidad legal y/o financiera para comprar. No podrán acceder a los productos quienes carezcan de ella, los que hayan sido suspendidos o inhabilitados, ni los menores de edad. Los padres, tutores o responsables de los menores de edad o incapaces que utilicen el sitio web serán responsables por dicho uso, incluyendo cualquier cargo, facturación o daño que se derive de él.</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">Seguridad y tratamiento de datos personales</h2>
          <p>Para poder utilizar el sitio web de manera eficiente y segura, los Usuarios deberán aportar ciertos datos, entre ellos, su Nombre o Apodo y Apellido, domicilio, cuenta de e-mail, sin los cuales se tornaría imposible avanzar con la compra. Por eso se requiere que éstos sean verdaderos y exactos.</p>
          <p>La información personal que los Usuarios ingresan en el sitio web es totalmente confidencial y Lovers Play Sex Shop hará su mejor esfuerzo para proteger la privacidad de los mismos, de conformidad con lo dispuesto en la Ley 25.326. Para esto se utilizará el sistema de seguridad que posee Lovers Play Sex Shop, que encripta los datos suministrados y evita su uso desautorizado, garantizando una operación segura.</p>
          <p>Cuando se ingresan datos y números correspondientes a tarjetas de crédito estos son encriptados, asegurando así que se mantengan en total confidencialidad y no puedan ser vistos por otras personas.</p>
          <p>Los Usuarios tienen el derecho de acceder a la información de su Cuenta, y podrán modificar los datos ingresados cuando lo deseen. Cualquier Usuario del sitio web tendrá derecho a solicitar y obtener información sobre los datos personales que Lovers Play Sex Shop tenga en su base, quedando la Empresa obligada a proporcionar la información solicitada dentro de los diez días corridos de haber sido intimada fehacientemente. Los Usuarios también podrán ejercer el derecho de rectificación, cuando los datos que se posean fueran incorrectos.</p>
          <p>Asimismo, los Usuarios podrán requerir en cualquier momento la baja de su solicitud y la eliminación de su Cuenta de la base de datos.</p>
          <p>Lovers Play Sex Shop garantiza a sus Usuarios que utilizará los datos dentro de las pautas establecidas por la Ley 25.326 de Protección de los Datos Personales.</p>
          <p>En caso de que los datos sean requeridos por la vía legal, administrativa o judicial correspondiente, Lovers Play Sex Shop se verá compelida a revelar los mismos a la autoridad solicitante.</p>
          <p>Por el sólo hecho de registrarse en el sitio web, los Usuarios aceptan que Lovers Play Sex Shop tiene derecho a comunicarse con ellos por vía postal, telefónica o electrónica y enviar información que la Empresa considere, a su exclusivo criterio, que pueda ser de su interés, incluyendo publicidad e información sobre ofertas y promociones. En caso de que los Usuarios no deseen ser contactados con estos fines, podrán manifestárselo fehacientemente a Lovers Play Sex Shop.</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">Veracidad de la Información suministrada</h2>
          <p>En caso de que la información o los datos suministrados por el Usuario no sea verdadera, éste será responsable por los daños que este hecho pudiera ocasionar.</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">Sugerencias y comentarios</h2>
          <p>Todas las sugerencias y comentarios que realice el Usuario podrán ser tenidas en cuenta, implementadas o adaptadas por Lovers Play Sex Shop sin que ello genere derecho alguno a favor de tal Usuario.</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">Cookies</h2>
          <p>El sitio web puede utilizar un sistema de seguimiento mediante "cookies", para que el acceso a la información, al pasar de página en página, se realice con mayor rapidez. También ayuda en algunos casos a identificar a los Usuarios, sin necesidad de solicitarles la clave de acceso una y otra vez.</p>
          <p>Estas cookies son pequeños archivos que envía la página visitada y se alojan en el disco duro del ordenador, ocupando poco espacio.</p>
          <p>Se hace saber a los Usuarios que utilizando las opciones de su navegador podrán limitar o restringir según su voluntad el alojamiento de estas "cookies", aunque es desaconsejable restringirlas totalmente.</p>
          <p>El sistema podrá recoger información sobre sus preferencias e intereses con fines estadísticos para mejorar los servicios que se prestan en el sitio. Lovers Play Sex Shop aplicará, en la mayor medida en que sea posible, procedimientos de disociación de la información de modo que los titulares de los datos sean inidentificables.</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">Disponibilidad y precio de los productos ofrecidos</h2>
          <p>Antes de comprar, el Usuario deberá tener en cuenta que los productos seleccionados pueden no encontrarse en stock. Toda compra se encuentra sujeta a disponibilidad. Lovers Play Sex Shop no solo opera vía Internet. Por este motivo, puede ocurrir que, por más que sea posible ordenar la compra del producto en el sitio web, no haya existencias de éste, por una cuestión de movimiento diario en los locales de las firmas que proveen los productos a Lovers Play Sex Shop.</p>
          <p>Del mismo modo, el precio de los productos que ofrecemos en el sitio web puede no coincidir con el de los distintos locales o proveedores. Lovers Play Sex Shop puede en cualquier momento modificar la lista de precios de los productos a su solo criterio, sin necesidad de contar con el consentimiento de los usuarios.</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">Opciones del Usuario ante productos agotados o demorados</h2>
          <p>En caso de que el o los productos seleccionados se encontraren agotados o demorados, Lovers Play Sex Shop se comunicará con el Usuario y lo invitará a que elija una de las siguientes opciones:</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>Continuar esperando la entrega del producto elegido (en caso de demora).</li>
            <li>Cancelación de la compra y devolución del importe por el medio de pago original.</li>
            <li>Optar por un producto alternativo que Lovers Play Sex Shop le pueda ofrecer para el caso particular.</li>
          </ul>
          <p>Cuando el Usuario opte por cancelar la compra, se devolverá el importe abonado según el medio de pago que se haya elegido oportunamente.</p>
          <p>En el caso de que el Usuario opte por el producto alternativo que le ofrece Lovers Play Sex Shop, éste deberá contener características similares y se cubrirá solo el valor abonado. En caso de ser un producto de mayor valor, la diferencia debe ser cancelada por el Usuario.</p>
          <p><strong>IMPORTANTE:</strong> para las situaciones contempladas en este apartado, el Usuario tendrá un plazo de diez días para elegir una de las opciones mencionadas. En caso de que el Usuario guarde silencio al respecto, Lovers Play Sex Shop podrá presumir que ha optado por la cancelación de la compra, y procederá a la devolución del importe abonado por el medio de pago original.</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">Devolución del importe abonado</h2>
          <p>En los casos en que el Usuario haya optado por la devolución del importe abonado, deberá tener en cuenta que el reintegro puede demorar algunos días, debido a plazos y cuestiones administrativas de Mercado Pago.</p>
          <p>Para los casos de devolución vía depósito bancario, la cuenta bancaria deberá estar a nombre del titular de la Cuenta de Usuario desde donde se haya realizado la operación. En caso de que no coincidan las titularidades, se requerirá la expresa autorización del titular de la Cuenta de Usuario como condición indispensable previa al depósito.</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">Validez de las promociones</h2>
          <p>En el caso de que se realicen ofertas y promociones de productos, éstas tendrán validez para las compras efectuadas desde la fecha de comienzo de las mismas, hasta la de finalización de la oferta. Los términos y condiciones de las mismas serán comunicados en el sitio web, y estarán siempre sujetas a la existencia en stock de los productos ofrecidos.</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">Devoluciones de productos</h2>
          <p><strong>Los productos de uso íntimo NO TIENEN CAMBIO</strong>, por cuestiones Higiénicas y de Salud. Si por algún motivo el Usuario, habiendo recibido el producto de su compra, intenta su devolución, esta NO será admitida, ya que los mismos poseen un embalaje de seguridad que normalmente se abren al recibirlos los usuarios, implicando la apertura de los mismos, por tal motivo NO se admiten devoluciones de productos.</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">Problemas con la recepción de producto/s</h2>
          <p>Si por algún motivo, al momento de recibir el Usuario su encomienda, con el o los producto/s nota que el paquete fue violado, o abierto, o posee un faltante, ponerse en contacto en forma urgente con Lovers Play Sex Shop por mail <strong>ventas@loversplaysexshop.com</strong> o bien por Tel. <strong>54 261 4324672</strong> (chequear bien el número antes de llamar, un error en el discado no permitirá tener el llamado).</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">Moneda</h2>
          <p>Todos los precios en el sitio web están expresados en pesos argentinos, moneda de curso legal de la República Argentina.</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">Medios de pago</h2>
          <p>Los pagos podrán realizarse con tarjeta contado o en cuotas, cupón de pago Rapi Pago, Pago Fácil, a través de la plataforma de pago Mercado Pago.</p>
          <p>También se puede pagar a través de Transferencia Bancaria, o a contra-entrega. <strong>Importante:</strong> el pago contraentrega no incluye el costo de envío.</p>
          <p>Lovers Play Sex Shop podrá habilitar otras opciones para facilitar las compras de sus clientes, mediante un contacto directo por mail a <strong>ventas@loversplaysexshop.com</strong> o bien por Tel. <strong>54 261 4324672</strong>.</p>
          <p>Todos los medios de pago están sujetos a que el importe sea debidamente acreditado y/o verificado.</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">Envío de productos dentro del país. Tiempo de entrega</h2>
          <p>Las entregas se realizarán en la dirección que el Usuario indique. La validez de la misma es de su exclusiva responsabilidad. No se entregarán órdenes a casillas de correo.</p>
          <p>El tiempo de entrega depende de la disponibilidad del producto, del tiempo de envío y de la aprobación del medio de pago. Los días que se indiquen son estimativos. Los envíos se realizan en toda la República Argentina, sin excepción.</p>
          <p>Al realizar una compra, el Usuario recibe en su casilla de correo electrónico una confirmación de que la orden de pedido ha sido aceptada, junto a un número de pedido.</p>
          <p>Para asegurar la máxima eficacia en las entregas, éstas se realizan mediante empresas especializadas.</p>
          <p>Si se selecciona la opción de contra-entrega, el valor abonado no incluye el envío, ya que el cliente lo debe pagar cuando le llegue el producto.</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">Gastos de envío</h2>
          <p>El Usuario será claramente informado de los costos de entrega antes de realizar la compra. Estos costos son calculados en función del peso total y/o el volumen total del envío, y también dependen de la zona del domicilio de entrega.</p>
          <p>Si el cliente elige la opción de envío pago a contra-entrega, el valor no incluirá el costo de envío. El costo de envío lo debe pagar el cliente cuando le llegue el producto a su domicilio/lugar de entrega.</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">Dirección de la entrega</h2>
          <p>La dirección en donde se entregará el producto será la que el Usuario indique. Podrá no coincidir con su domicilio. Es responsabilidad del Usuario completar y revisar cuidadosamente la información relacionada con la entrega, para que el envío de la compra se haga de manera efectiva y puntual. No se realizan envíos a casillas de correo.</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">Utilización del servicio "Recomienda este producto a un amigo"</h2>
          <p>En el marco de su Política de Privacidad, Lovers Play Sex Shop se compromete a mantener la absoluta confidencialidad de los datos personales enviados por los Usuarios. El envío de comentarios de nuestros productos por e-mail se realiza a partir del expreso consentimiento del remitente, y bajo ningún concepto podrá ser considerado como "spam".</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">Prohibiciones</h2>
          <p>Se les prohíbe terminantemente a los usuarios:</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>Enviar archivos o cualquier tipo de información cuyo contenido sea ilegal, obsceno, abusivo, difamatorio, injurioso o contrario a las buenas costumbres.</li>
            <li>Enviar archivos que contengan virus o cualquier otra característica capaz de dañar el funcionamiento de una computadora, del sitio web o del sistema.</li>
            <li>Utilizar el sitio web para violar cualquier tipo de norma vigente.</li>
            <li>Consignar datos falsos al momento de registrarse o realizar una compra, o cualquier otro momento en que les sea requerida cualquier tipo de información o datos personales.</li>
            <li>Ofrecer productos o servicios.</li>
            <li>Usar programas, software o aparatos automáticos o manuales para monitorear o copiar la información o cualquier tipo de contenido del sitio sin previo consentimiento de Lovers Play Sex Shop.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">Declaraciones</h2>
          <p>Lovers Play Sex Shop no se hace responsable por la veracidad de la información incorporada al sitio web por terceros. Tampoco se hace responsable en cuanto haya sido reproducida o comunicada directamente por los Usuarios del sitio web sin verificación por parte de Lovers Play Sex Shop.</p>
          <p>Si algún Usuario se viera afectado por la información a la que se alude en el párrafo anterior, deberá comunicárselo a Lovers Play Sex Shop por mail a fin de que se proceda a la supresión de la misma.</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">Derechos reservados. Propiedad intelectual</h2>
          <p>Todos los derechos del presente sitio web están reservados y corresponden a Lovers Play Sex Shop.</p>
          <p>El contenido del presente Website, incluyendo aunque no limitado al texto, logos, gráficos, y todo el diseño en general, así como su base de datos y software, es de propiedad de Lovers Play Sex Shop o tiene derecho a usarlo en virtud de licencias de uso otorgadas y se encuentra protegido por las legislación nacional e internacional vigente sobre propiedad intelectual.</p>
          <p>Si el Usuario considera que en el sitio web se viola o atenta de algún modo contra derechos de propiedad intelectual de terceros deberá notificarlo a Lovers Play Sex Shop en la dirección indicada en los presentes Términos y Condiciones Generales, acompañando toda la información y documentación necesaria que respalde la mencionada consideración.</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">Razón social y domicilio</h2>
          <p>La razón social de la empresa es: <strong>Elisa Ines Gramage</strong></p>
          <p>Domicilio: <strong>Alberdi 315 – San Jose – Gllen – Mendoza – Argentina</strong></p>
          <p>CUIT: <strong>27-20917215-7</strong></p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">Notificaciones</h2>
          <p>Todas las notificaciones y/o comunicaciones que deban efectuarse por el uso de sitio web bajo estos Términos y Condiciones Generales, deberán realizarse por escrito: al Usuario mediante correo electrónico, a la cuenta de correo consignada por éste.</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 font-[family-name:var(--font-poppins)]">Avisos publicitarios y links</h2>
          <p>Cuando el Usuario hace "click" en avisos publicitarios o links de terceros e ingresa en otros sitios que no pertenecen a Lovers Play Sex Shop, estará sujeto a los términos y condiciones de dichos sitios.</p>
          <p>Lovers Play Sex Shop no garantiza la legalidad, actualidad, calidad ni utilidad de los contenidos, operaciones e informaciones que se comuniquen, reproduzcan y/o realicen en sitios enlazados de terceros ni la ausencia de nocividad de tales contenidos o servicios, por lo que el Usuario exime de toda responsabilidad a Lovers Play Sex Shop por los contenidos incluidos en los referidos sitios o los servicios que en ellos se brindan o promocionan.</p>

        </div>
      </main>
      <Footer />
    </div>
  )
}