"use client"

import { useState, useCallback, memo } from "react"
import Link from "next/link"
import { Search, ShoppingCart, Menu, User, Phone, Mail, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore, useAuthStore } from "@/lib/store"
import { MobileMenu } from "./mobile-menu"
import { SearchBar } from "./search-bar"
import { ErrorBoundary } from "@/components/ui/error-boundary"

const navigation = [
  { name: "Inicio", href: "/" },
  { name: "Catálogo", href: "/catalogo" },
  { name: "Envíos", href: "/envios" },
  { name: "Contacto", href: "/contacto" },
]

const CartBadge = memo(({ totalItems }: { totalItems: number }) => {
  if (totalItems === 0) return null

  return (
    <span
      className="absolute -top-1 -right-1 bg-brand text-brand-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center animate-in fade-in-0 zoom-in-75 duration-200"
      aria-label={`${totalItems} artículos en el carrito`}
    >
      {totalItems > 99 ? "99+" : totalItems}
    </span>
  )
})

CartBadge.displayName = "CartBadge"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { getTotalItems } = useCartStore()
  const { isAuthenticated, user } = useAuthStore()
  const totalItems = getTotalItems()

  const handleMobileMenuOpen = useCallback(() => setIsMobileMenuOpen(true), [])
  const handleMobileMenuClose = useCallback(() => setIsMobileMenuOpen(false), [])
  const handleSearchOpen = useCallback(() => setIsSearchOpen(true), [])
  const handleSearchClose = useCallback(() => setIsSearchOpen(false), [])

  return (
    <ErrorBoundary>
      
      

      {/* Main header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={handleMobileMenuOpen}
              aria-label="Abrir menú de navegación"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </Button>

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <img
                src="/loversplay-logo.png"
                alt="LoversPlay"
                className="h-8 w-auto group-hover:scale-105 transition-transform duration-200"
              />
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex items-center space-x-8" role="navigation" aria-label="Navegación principal">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-brand transition-colors duration-200 font-medium font-[family-name:var(--font-inter)] relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand transition-all duration-200 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {/* Search */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSearchOpen}
                className="hidden sm:flex hover:bg-brand/10 transition-colors"
                aria-label="Abrir búsqueda"
              >
                <Search className="h-5 w-5" aria-hidden="true" />
              </Button>

              <Button variant="ghost" size="sm" className="hover:bg-brand/10 transition-colors" asChild>
                <a
                  href="https://wa.me/5491123456789?text=Hola,%20tengo%20una%20consulta%20sobre%20los%20productos"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contactar por WhatsApp"
                >
                  <MessageCircle className="h-5 w-5 text-green-600" aria-hidden="true" />
                </a>
              </Button>

              {/* Auth */}
              {isAuthenticated ? (
                <Button variant="ghost" size="sm" className="hover:bg-brand/10 transition-colors" asChild>
                  <Link href="/perfil" aria-label={`Perfil de ${user?.name}`}>
                    <User className="h-5 w-5" aria-hidden="true" />
                    <span className="hidden sm:ml-2 sm:block truncate max-w-20">{user?.name}</span>
                  </Link>
                </Button>
              ) : (
                <Button variant="ghost" size="sm" className="hover:bg-brand/10 transition-colors" asChild>
                  <Link href="/auth">
                    <User className="h-5 w-5" aria-hidden="true" />
                    <span className="hidden sm:ml-2 sm:block">Ingresar</span>
                  </Link>
                </Button>
              )}

              {/* Cart */}
              <Button variant="ghost" size="sm" className="relative hover:bg-brand/10 transition-colors" asChild>
                <Link href="/carrito" aria-label={`Carrito de compras con ${totalItems} artículos`}>
                  <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                  <CartBadge totalItems={totalItems} />
                </Link>
              </Button>

              {/* Mobile search */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSearchOpen}
                className="sm:hidden hover:bg-brand/10 transition-colors"
                aria-label="Abrir búsqueda"
              >
                <Search className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={handleMobileMenuClose} navigation={navigation} />

      {/* Search overlay */}
      <SearchBar isOpen={isSearchOpen} onClose={handleSearchClose} />
    </ErrorBoundary>
  )
}
