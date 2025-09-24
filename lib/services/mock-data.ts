import type { Product, Category, BlogPost, ShippingMethod } from "../types"

// export const mockCategories: Category[] = [
//   { id: "1", name: "Juguetes para Parejas", slug: "juguetes-parejas", count: 45 },
//   { id: "2", name: "Juguetes Femeninos", slug: "juguetes-femeninos", count: 78 },
//   { id: "3", name: "Juguetes Masculinos", slug: "juguetes-masculinos", count: 32 },
//   { id: "4", name: "Lubricantes", slug: "lubricantes", count: 24 },
//   { id: "5", name: "Lencería", slug: "lenceria", count: 56 },
//   { id: "6", name: "Accesorios", slug: "accesorios", count: 18 },
// ]

// export const mockProducts: Product[] = [
//   {
//     id: "1",
//     name: "Vibrador de Lujo Rosa",
//     slug: "vibrador-lujo-rosa",
//     images: ["/elegant-pink-luxury-vibrator.jpg"],
//     price: 89.99,
//     salePrice: 69.99,
//     rating: 4.8,
//     reviewsCount: 124,
//     categoryIds: ["2"],
//     tags: ["premium", "silicona", "recargable"],
//     stock: 15,
//     shortDesc: "Vibrador de silicona premium con múltiples velocidades",
//     description:
//       "Experimenta el placer definitivo con nuestro vibrador de lujo. Fabricado con silicona médica de alta calidad, este elegante dispositivo ofrece 10 patrones de vibración diferentes para una experiencia personalizada. Su diseño ergonómico y materiales seguros garantizan comodidad y satisfacción.",
//     specs: {
//       Material: "Silicona médica",
//       Velocidades: "10 patrones",
//       Batería: "Recargable USB",
//       Resistencia: "Sumergible",
//       Dimensiones: "18cm x 3cm",
//       Garantía: "1 año",
//     },
//     views: 1250,
//     featured: true,
//   },
//   {
//     id: "2",
//     name: "Anillo Vibrador para Parejas",
//     slug: "anillo-vibrador-parejas",
//     images: ["/couples-vibrating-ring-elegant.jpg"],
//     price: 34.99,
//     rating: 4.6,
//     reviewsCount: 89,
//     categoryIds: ["1"],
//     tags: ["parejas", "silicona", "estimulación"],
//     stock: 28,
//     shortDesc: "Anillo vibrador diseñado para el placer compartido",
//     description:
//       "Intensifica la intimidad con tu pareja con este elegante anillo vibrador. Diseñado para proporcionar estimulación adicional durante la intimidad, está fabricado con silicona suave y segura.",
//     specs: {
//       Material: "Silicona suave",
//       Velocidades: "3 intensidades",
//       Batería: "Incluida",
//       Tamaño: "Ajustable",
//       Resistencia: "Resistente al agua",
//     },
//     views: 890,
//     featured: true,
//   },
//   {
//     id: "3",
//     name: "Lubricante Premium Natural",
//     slug: "lubricante-premium-natural",
//     images: ["/premium-natural-lubricant-bottle-elegant.jpg"],
//     price: 24.99,
//     rating: 4.9,
//     reviewsCount: 156,
//     categoryIds: ["4"],
//     tags: ["natural", "base-agua", "hipoalergénico"],
//     stock: 42,
//     shortDesc: "Lubricante natural a base de agua, hipoalergénico",
//     description:
//       "Fórmula natural y suave que proporciona una experiencia cómoda y placentera. Elaborado con ingredientes naturales, es compatible con preservativos y juguetes.",
//     specs: {
//       Base: "Agua",
//       Volumen: "100ml",
//       Ingredientes: "Naturales",
//       Compatibilidad: "Preservativos y juguetes",
//       pH: "Balanceado",
//     },
//     views: 567,
//     featured: false,
//   },
// ]

export const mockProducts: any[] = []
export const mockCategories: any[] = []

export const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Guía Completa para Principiantes en Bienestar Íntimo",
    slug: "guia-completa-principiantes",
    cover: "/intimate-wellness-guide-elegant.jpg",
    excerpt:
      "Todo lo que necesitas saber para comenzar tu viaje hacia el bienestar íntimo de manera segura y saludable.",
    content: `El bienestar íntimo es un aspecto fundamental de la salud general que merece atención y cuidado. En esta guía completa, exploraremos los conceptos básicos, consejos prácticos y recomendaciones para principiantes que desean mejorar su bienestar íntimo de manera segura y saludable.

    Es importante recordar que cada persona es única, y lo que funciona para una persona puede no funcionar para otra. Siempre es recomendable consultar con profesionales de la salud cuando tengas dudas o preocupaciones específicas sobre tu bienestar íntimo.

    El primer paso hacia un mejor bienestar íntimo es el autoconocimiento. Esto incluye entender tu propio cuerpo, tus preferencias y tus límites. La comunicación abierta y honesta con tu pareja también es fundamental para una experiencia íntima satisfactoria y segura.

    Cuando se trata de productos íntimos, la calidad es primordial. Es mejor invertir en productos de alta calidad fabricados con materiales seguros que usar múltiples productos de calidad inferior. Siempre lee las instrucciones y sigue las recomendaciones de uso y cuidado.

    La higiene personal es otro aspecto crucial del bienestar íntimo. Mantener una rutina de higiene adecuada no solo es importante para la salud, sino que también puede aumentar la confianza y el bienestar general.

    Recuerda que el bienestar íntimo es un viaje personal que requiere paciencia, autoconocimiento y, a veces, la orientación de profesionales. No hay prisa y cada paso hacia un mejor bienestar íntimo es valioso.`,
    date: "2024-01-15",
    tags: ["guía", "principiantes", "bienestar", "salud"],
  },
  {
    id: "2",
    title: "Cuidado y Mantenimiento de Juguetes Íntimos",
    slug: "cuidado-mantenimiento-juguetes",
    cover: "/toy-care-maintenance-elegant.jpg",
    excerpt:
      "Aprende las mejores prácticas para mantener tus juguetes íntimos en perfectas condiciones y garantizar su durabilidad.",
    content: `El cuidado adecuado de los juguetes íntimos es esencial no solo para mantener su funcionalidad, sino también para garantizar la seguridad y la higiene. En este artículo, te proporcionaremos una guía completa sobre cómo cuidar y mantener tus juguetes íntimos correctamente.

    La limpieza es el aspecto más importante del cuidado de juguetes íntimos. Siempre limpia tus juguetes antes y después de cada uso. Utiliza agua tibia y un jabón suave sin fragancias, o un limpiador específico para juguetes íntimos.

    El almacenamiento adecuado es igualmente importante. Guarda tus juguetes en un lugar limpio, seco y fresco. Muchos juguetes vienen con bolsas de almacenamiento especiales que ayudan a protegerlos del polvo y otros contaminantes.

    Diferentes materiales requieren diferentes cuidados. Los juguetes de silicona médica son generalmente los más fáciles de limpiar y mantener, mientras que otros materiales pueden requerir cuidados especiales.

    La inspección regular de tus juguetes es importante para detectar cualquier signo de desgaste o daño. Si notas grietas, cambios en la textura o cualquier otro signo de deterioro, es hora de reemplazar el juguete.

    Siguiendo estas pautas simples pero importantes, puedes asegurar que tus juguetes íntimos se mantengan en excelentes condiciones durante mucho tiempo, proporcionándote experiencias seguras y satisfactorias.`,
    date: "2024-01-10",
    tags: ["cuidado", "mantenimiento", "higiene", "seguridad"],
  },
  {
    id: "3",
    title: "La Importancia de la Comunicación en las Relaciones Íntimas",
    slug: "comunicacion-relaciones-intimas",
    cover: "/placeholder.svg?height=400&width=600&text=Comunicación",
    excerpt:
      "Descubre cómo una comunicación efectiva puede transformar y mejorar significativamente tus relaciones íntimas.",
    content: `La comunicación es la base de cualquier relación saludable, y esto es especialmente cierto cuando se trata de intimidad. Una comunicación abierta, honesta y respetuosa puede transformar completamente la calidad de tus relaciones íntimas.

    Hablar sobre deseos, límites y preferencias puede parecer incómodo al principio, pero es fundamental para crear un ambiente de confianza y comprensión mutua. La comunicación efectiva no solo mejora la experiencia íntima, sino que también fortalece el vínculo emocional entre las parejas.

    Es importante crear un espacio seguro donde ambas partes se sientan cómodas expresando sus pensamientos y sentimientos sin temor al juicio. Esto incluye ser receptivo a los comentarios de tu pareja y estar dispuesto a hacer ajustes cuando sea necesario.

    La comunicación no verbal también juega un papel importante en la intimidad. Prestar atención a las señales corporales y responder apropiadamente es tan importante como las palabras que se dicen.

    Recuerda que la comunicación es una habilidad que se puede desarrollar con el tiempo y la práctica. No tengas miedo de buscar recursos adicionales o incluso terapia de pareja si sientes que necesitas ayuda para mejorar la comunicación en tu relación.`,
    date: "2024-01-05",
    tags: ["comunicación", "relaciones", "parejas", "bienestar"],
  },
]

export const mockShippingMethods: ShippingMethod[] = [
  {
    id: "1",
    name: "Correo Argentino",
    eta: "",
    regions: ["Nacional"],
    priceRules: "Gratis en compras mayores a $500000",
    icon: "📦",
  },
  {
    id: "2",
    name: "Envío Express",
    eta: "",
    regions: ["Gran Mendoza"],
    priceRules: "Arreglar con el vendedor",
    icon: "⚡",
  },
  {
    id: "3",
    name: "Retiro por el local",
    eta: "",
    regions: ["Mendoza"],
    priceRules: "Gratis",
    icon: "🔒",
  },
]
