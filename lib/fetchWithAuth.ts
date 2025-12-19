import { useAuthStore } from "@/lib/store"

export async function fetchWithAuth(
  input: RequestInfo,
  init: RequestInit = {}
) {
  const token = localStorage.getItem("access_token")

  const headers = new Headers(init.headers || {})
  if (token) headers.set("Authorization", `Bearer ${token}`)

  // No romper multipart
  if (!(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json")
  }

  const res = await fetch(input, { ...init, headers })

  if (res.status === 401 || res.status === 403) {
    // 🔥 una sola fuente de verdad
    useAuthStore.getState().logout()
    window.location.href = "/auth"
    throw new Error("Unauthorized")
  }

  return res
}
