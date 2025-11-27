import type { Product, Category, ShippingMethod } from "../types"

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
