"use client"

import { useAuthStore } from "@/lib/store"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

// HOC (High Order Component) para proteger páginas privadas
export default function withAuth<T extends object>(
  Component: React.ComponentType<T>
) {
  return function ProtectedPage(props: T) {
    const { isAuthenticated } = useAuthStore()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
      const token = localStorage.getItem("access_token")

      if (!token || !isAuthenticated) {
        // 🚨 Mandamos al login con la ruta actual como parámetro
        router.push(`/auth?redirect=${encodeURIComponent(pathname)}`)
      }
    }, [isAuthenticated, router, pathname])

    return <Component {...props} />
  }
}


