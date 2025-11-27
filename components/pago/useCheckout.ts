"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/lib/store"
import { fetchUsuario, calcularEnvio, crearPreferenciaPago, crearPedido } from "@/lib/services/api"

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

    //Para cuando hacen hacia atras y cambia el metodo de envio
    const handleShippingTypeChange = (value: ShippingType) => {
        setShippingType(value)
        setShippingCost(0)              // ← resetea el precio
        setShippingCarrier("")          // ← opcional: limpia el transporte elegido
    }


    // Cargar usuario logueado
    useEffect(() => {
        const cargarUsuario = async () => {
            try {
                const user = await fetchUsuario()
                if (user) {
                    const direccion = user.direccion
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
            alert("Por favor ingresa un código postal válido");
            return;
        }

        if (shippingType === "pickup" || shippingType === "arrange") {
            setShippingCost(0);
            return;
        }

        // Transporte requiere carrier
        if (shippingType === "transporte" && !shippingCarrier) {
            alert("Seleccioná un transporte antes de calcular.");
            return;
        }

        setIsCalculatingCost(true);
        setShippingCost(0);

        const tipo =
            shippingType === "correo"
                ? "correo"
                : shippingCarrier; // viacargo/cata/andesmar

        const data = await calcularEnvio(
            Number(billingData.postalCode),
            tipo
        );

        if (!data || !data.precio) {
            alert("No se pudo calcular el envío.");
            setShippingCost(0);
        } else {
            setShippingCost(Number(data.precio));
        }

        setIsCalculatingCost(false);
    };


    // Validaciones por paso
    const canGoNext: boolean = (() => {
        if (step === 1) {
            return !!shippingType
        }
        if (step === 2) {
            if (shippingType === "correo" || shippingType === "transporte") {
                return shippingCost > 0
            }
            return true
        }
        if (step === 3) {
            if (shippingType === "pickup" || shippingType === "arrange") {
                return (
                    !!billingData.name &&
                    !!billingData.phone &&
                    !!billingData.email
                )
            }

            // envío normal → validar todo
            return (
                !!billingData.name &&
                !!billingData.address &&
                !!billingData.postalCode &&
                !!billingData.phone &&
                !!billingData.email &&
                !!billingData.province
            )
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
            if (shippingType === "pickup" || shippingType === "arrange") {
                alert("Completá nombre, teléfono y email")
            } else {
                alert("Completá todos los datos de dirección obligatorios")
            }
            return false
        }
        if (currentStep === 4 && !canGoNext) {
            alert("Elegí un método de pago")
            return false
        }
        return true
    }

    const handleProcessPayment = async () => {
        setIsProcessing(true);

        try {
            // 1) Crear orden en BD
            const pedidoPayload = {
                nombre: billingData.name,
                email: billingData.email,
                telefono: billingData.phone,
                costo_envio: shipping,
                detalles: cartItems.map((item: any) => ({
                    producto_id: item.productId,
                    cantidad: item.quantity,
                })),
            };

            const pedido = await crearPedido(pedidoPayload);
            if (!pedido) {
                alert("No se pudo crear el pedido.");
                setIsProcessing(false);
                return;
            }

            const pedidoId = pedido.id;

            // 2) Crear preferencia MP
            const preferenciaPayload = {
                pedido_id: pedidoId,
                tipo_pago: paymentMethod,
                costo_envio: shipping,
                items: cartItems.map((item: any) => ({
                    producto_id: item.productId,
                    nombre: item.name || item.nombre,
                    cantidad: item.quantity,
                    precio: item.price,
                })),
            };

            const pref = await crearPreferenciaPago(preferenciaPayload);
            if (!pref || !pref.init_point) {
                alert("No se pudo iniciar el pago.");
                return;
            }

            // 3) Abrir MP Checkout Pro en nueva pestaña
            window.open(pref.init_point, "_blank");

            // 4) Limpio carrito local
            clearCart();
            setOrderComplete(true);

            // 5) Paso 5 → success visual
            setStep(5);

        } catch (err) {
            console.error("❌ Error procesando pago:", err);
            alert("Error procesando el pago.");
        } finally {
            setIsProcessing(false);
        }
    };


    const goNext = () => {
        if (!validateStep(step)) return

        if (step === 1) {
            setStep(2)
            return
        }

        if (step === 2) {
            setStep(3)
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
        setShippingType: handleShippingTypeChange,
        setShippingCarrier,
        setPaymentMethod,
        calculateShipping,
        goNext,
        goBack,
        canGoNext,
    }
}
