"use client"

import { useAuthStore } from "@/lib/store"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

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
        router.push(`/auth?redirect=${encodeURIComponent(pathname)}`)
      }
    }, [isAuthenticated, router, pathname])

    if (!isAuthenticated) return null

    return <Component {...props} />
  }
}
