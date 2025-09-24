"use client"
import Link from "next/link"
import { X, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/store"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  navigation: Array<{ name: string; href: string }>
}

export function MobileMenu({ isOpen, onClose, navigation }: MobileMenuProps) {
  const { isAuthenticated, user, logout } = useAuthStore()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      {/* Menu panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-card border-l border-border shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-card-foreground font-[family-name:var(--font-poppins)]">Menú</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
              <span className="sr-only">Cerrar menú</span>
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className="block py-3 text-lg font-medium text-card-foreground hover:text-brand transition-colors duration-200 font-[family-name:var(--font-inter)]"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Contact info */}
          <div className="px-4 py-6 border-t border-border space-y-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>info@loversplay.com</span>
            </div>
          </div>

          {/* Auth section */}
          <div className="px-4 py-4 border-t border-border">
            {isAuthenticated ? (
              <div className="space-y-3">
                <p className="text-sm text-card-foreground">Hola, {user?.name}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                    <Link href="/perfil" onClick={onClose}>
                      Mi Perfil
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={logout} className="flex-1 bg-transparent">
                    Salir
                  </Button>
                </div>
              </div>
            ) : (
              <Button className="w-full" asChild>
                <Link href="/auth" onClick={onClose}>
                  Iniciar Sesión
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
