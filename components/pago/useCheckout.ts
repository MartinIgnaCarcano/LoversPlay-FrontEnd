"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/lib/store"
import { fetchUsuario } from "@/lib/services/api"

export type ShippingType = "" | "correo" | "transporte" | "pickup" | "arrange"
export type ShippingCarrier = "" | "viacargo" | "cata" | "andesmar"

export type BillingData = {
    name: string
    address: string
    city: string
    province: string
    postalCode: string
    phone: string
    extra: string
    email: string
}

export const STEPS = [1, 2, 3, 4, 5] as const
export type Step = (typeof STEPS)[number]

export function useCheckout() {
    const router = useRouter()
    const { items, clearCart } = useCartStore()

    const [step, setStep] = useState<Step>(1)
    const [billingData, setBillingData] = useState<BillingData>({
        name: "",
        address: "",
        city: "",
        province: "",
        postalCode: "",
        phone: "",
        extra: "",
        email: "",
    })

    const [shippingType, setShippingType] = useState<ShippingType>("")
    const [shippingCarrier, setShippingCarrier] = useState<ShippingCarrier>("")
    const [shippingCost, setShippingCost] = useState(0)
    const [isCalculatingCost, setIsCalculatingCost] = useState(false)

    const [paymentMethod, setPaymentMethod] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    const [orderComplete, setOrderComplete] = useState(false)

    const cartItems = items
    const subtotal = cartItems.reduce((total, item: any) => total + item.price * item.quantity, 0)
    const shipping = shippingType === "pickup" || shippingType === "arrange" ? 0 : shippingCost
    const total = subtotal + shipping

    const stepLabels = ["Dirección", "Envío", "Datos de envío", "Pago", "Confirmación"] as const

    // Cargar usuario logueado
    useEffect(() => {
        const cargarUsuario = async () => {
            try {
                const user = await fetchUsuario()
                if (user) {
                    const direccion = user.direcciones?.[0]
                    setBillingData((prev) => ({
                        ...prev,
                        name: user.nombre || "",
                        email: user.email || "",
                        phone: user.telefono || "",
                        address: direccion?.calle || "",
                        city: direccion?.departamento || "",
                        province: direccion?.provincia || "",
                        postalCode: direccion?.codigo_postal || "",
                    }))
                }
            } catch (error) {
                console.error("❌ Error al cargar usuario:", error)
            }
        }
        cargarUsuario()
    }, [])

    // Cálculo de envío
    const calculateShipping = async () => {
        if (!billingData.postalCode) {
            alert("Por favor ingresa un código postal válido")
            return
        }

        if (shippingType === "pickup" || shippingType === "arrange") {
            setShippingCost(0)
            return
        }

        setIsCalculatingCost(true)
        setShippingCost(0)

        try {
            let endpoint = ""

            if (shippingType === "correo") {
                endpoint = "/api/envio-andreani"
            }

            if (shippingType === "transporte") {
                if (!shippingCarrier) {
                    alert("Seleccioná un transporte")
                    return
                }
                if (shippingCarrier === "viacargo") endpoint = "/api/envio-viacargo"
                if (shippingCarrier === "cata") endpoint = "/api/envio-cata"
                if (shippingCarrier === "andesmar") endpoint = "/api/envio-andesmar"
            }

            if (!endpoint) return

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postalCode: billingData.postalCode }),
            })

            const text = await res.text()
            let data
            try {
                data = JSON.parse(text)
            } catch {
                alert("⚠️ Error calculando el envío: " + text)
                return
            }

            if (data.error) {
                alert("❌ Error del servidor: " + (data.detalle || "Desconocido"))
                return
            }

            setShippingCost(parseFloat(data.precio) || 0)
        } catch (error) {
            console.error("❌ Error calculando el envío:", error)
            alert("Hubo un problema calculando el costo de envío")
        } finally {
            setIsCalculatingCost(false)
        }
    }

    // Validaciones por paso
    const canGoNext: boolean = (() => {
        if (step === 1) {
            return (
                !!billingData.name &&
                !!billingData.address &&
                !!billingData.postalCode &&
                !!billingData.phone &&
                !!billingData.email &&
                !!billingData.province
            )
        }
        if (step === 2) {
            return !!shippingType
        }
        if (step === 3) {
            if (shippingType === "correo" || shippingType === "transporte") {
                return shippingCost > 0
            }
            return true
        }
        if (step === 4) {
            return !!paymentMethod
        }
        return true
    })()

    const validateStep = (currentStep: Step): boolean => {
        if (currentStep === 1 && !canGoNext) {
            alert("Completá los datos obligatorios de la dirección")
            return false
        }
        if (currentStep === 2 && !canGoNext) {
            alert("Elegí un método de envío")
            return false
        }
        if (currentStep === 3 && !canGoNext) {
            alert("Calculá el costo de envío antes de continuar")
            return false
        }
        if (currentStep === 4 && !canGoNext) {
            alert("Elegí un método de pago")
            return false
        }
        return true
    }

    const handleProcessPayment = async () => {
        setIsProcessing(true)
        try {
            const detalles = cartItems.map((item: any) => ({
                producto_id: item.productId,
                cantidad: item.quantity,
            }))

            const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null

            const res = await fetch("/api/pagos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    detalles,
                    token,
                    billingData,
                    shippingType,
                    shippingCarrier,
                    shippingCost,
                    paymentMethod,
                }),
            })

            if (!res.ok) {
                throw new Error("Error creando pedido")
            }

            const data = await res.json()
            console.log("✅ Pedido creado:", data)

            clearCart()
            setOrderComplete(true)

            setTimeout(() => router.push("/"), 3000)
        } catch (error) {
            console.error("❌ Error en el pago:", error)
            alert("Hubo un error procesando el pago")
        } finally {
            setIsProcessing(false)
        }
    }

    const goNext = () => {
        if (!validateStep(step)) return

        if (step === 1) {
            setStep(2)
            return
        }

        if (step === 2) {
            if (shippingType === "pickup" || shippingType === "arrange") {
                setStep(4)
            } else {
                setStep(3)
            }
            return
        }

        if (step === 3) {
            setStep(4)
            return
        }

        if (step === 4) {
            setStep(5)
            return
        }

        if (step === 5) {
            handleProcessPayment()
            return
        }
    }

    const goBack = () => {
        if (step === 1) return

        if (step === 4 && (shippingType === "pickup" || shippingType === "arrange")) {
            setStep(2)
            return
        }

        setStep((prev) => {
            const index = STEPS.indexOf(prev)
            const newIndex = Math.max(0, index - 1)
            return STEPS[newIndex]
        })
    }

    return {
        // estado
        step,
        stepLabels,
        billingData,
        shippingType,
        shippingCarrier,
        shippingCost,
        isCalculatingCost,
        paymentMethod,
        isProcessing,
        orderComplete,
        cartItems,
        subtotal,
        shipping,
        total,
        // setters / acciones
        setBillingData,
        setShippingType,
        setShippingCarrier,
        setPaymentMethod,
        calculateShipping,
        goNext,
        goBack,
        canGoNext,
    }
}
