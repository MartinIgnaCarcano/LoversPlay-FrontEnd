import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "LoversPlay - Tienda de Bienestar Íntimo",
  description:
    "Descubre nuestra colección de productos de bienestar íntimo de alta calidad. Envío discreto y atención personalizada.",
  generator: "v0.app",
  keywords: "bienestar íntimo, juguetes adultos, lubricantes, lencería, parejas",
  authors: [{ name: "LoversPlay" }],
  metadataBase: new URL("https://loversplay.com"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "LoversPlay - Tienda de Bienestar Íntimo",
    description: "Descubre nuestra colección de productos de bienestar íntimo de alta calidad.",
    type: "website",
    locale: "es_ES",
    url: "https://loversplay.com",
    siteName: "LoversPlay",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LoversPlay - Bienestar Íntimo Premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LoversPlay - Tienda de Bienestar Íntimo",
    description: "Descubre nuestra colección de productos de bienestar íntimo de alta calidad.",
    images: ["/og-image.jpg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`font-sans antialiased ${GeistSans.variable} ${GeistMono.variable} ${spaceGrotesk.variable} ${dmSans.variable}`}
      >
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
