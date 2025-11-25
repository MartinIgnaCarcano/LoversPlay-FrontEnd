"use client"

import { useState, useEffect, useCallback, memo } from "react"
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
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const show = mounted ? totalItems > 0 : false

  return (
    <span
      className={
        show
          ? "absolute -top-1 -right-1 bg-brand text-brand-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center"
          : "absolute -top-1 -right-1 h-5 w-5"
      }
    >
      {show ? (totalItems > 99 ? "99+" : totalItems) : ""}
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

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])


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
            <div className="flex items-center space-x-4">

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
                  className="hidden sm:block h-8 w-auto group-hover:scale-105 transition-transform duration-200"
                />
                {/* Logo para mobile */}
                <img
                  src="/loversplay-logo-mobile.png"
                  alt="LoversPlay"
                  className="block sm:hidden h-12 w-auto group-hover:scale-105 transition-transform duration-200"
                />
              </Link>
            </div>

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
            <div className="flex items-center space-x-1">
              {/* Search */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSearchOpen}
                className="hidden sm:flex hover:bg-brand/10 transition-colors border border-border rounded-md px-2"
                aria-label="Abrir búsqueda"
              >
                <input type="text" className="w-20 h-5" placeholder="Buscar..." />
                <Search className="h-5 w-5" aria-hidden="true" />
              </Button>

              {/* Auth */}
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-brand/10 transition-colors"
                asChild
              >
                <Link
                  href={isAuthenticated ? "/perfil" : "/auth"}
                  aria-label={isAuthenticated ? `Perfil de ${user?.name}` : "Ingresar"}
                >
                  <User className="h-5 w-5" aria-hidden="true" />

                  {/* Texto estable en SSR — dinámico solo después del mount */}
                  <span className="hidden sm:ml-2 sm:block truncate max-w-20">
                    {mounted ? (isAuthenticated ? user?.name : "Ingresar") : "Ingresar"}
                  </span>
                </Link>
              </Button>
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
