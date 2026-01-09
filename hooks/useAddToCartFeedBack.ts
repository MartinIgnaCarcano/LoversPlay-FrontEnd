// hooks/useAddToCartFeedback.ts
import { useState } from "react"

export function useAddToCartFeedback(duration = 800) {
  const [added, setAdded] = useState(false)

  const trigger = () => {
    setAdded(true)
    setTimeout(() => setAdded(false), duration)
  }

  return { added, trigger }
}
