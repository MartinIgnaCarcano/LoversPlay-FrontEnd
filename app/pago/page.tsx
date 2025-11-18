"use client"

import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Button } from "@/components/ui/button"
import withAuth from "@/lib/withAuth"

import { useCheckout } from "@/components/pago/useCheckout"
import { CheckoutLayout } from "@/components/pago/CheckoutLayout"
import { Stepper } from "@/components/pago/Stepper"
import { SummaryCard } from "@/components/pago/SummaryCard"
import { NavigationButtons } from "@/components/pago/NavigationButtons"

import { Step1Direccion } from "@/components/pago/steps/Step1Direccion"
import { Step2MetodoEnvio } from "@/components/pago/steps/Step2MetodoEnvio"
import { Step3EnvioDetalle } from "@/components/pago/steps/Step3EnvioDetalle"
import { Step4Pago } from "@/components/pago/steps/Step4Pago"
import { Step5Review } from "@/components/pago/steps/Step5Review"

function PaymentPage() {
  const checkout = useCheckout()

  const {
    step,
    stepLabels,
    billingData,
    setBillingData,
    shippingType,
    setShippingType,
    shippingCarrier,
    setShippingCarrier,
    shippingCost,
    isCalculatingCost,
    paymentMethod,
    setPaymentMethod,
    isProcessing,
    orderComplete,
    cartItems,
    subtotal,
    shipping,
    total,
    calculateShipping,
    goNext,
    goBack,
    canGoNext,
  } = checkout

  const breadcrumbItems = [
    { label: "Carrito", href: "/carrito" },
    { label: "Pago" },
  ]

  // Pedido terminado
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center py-16">
            <CheckCircle className="h-24 w-24 mx-auto mb-6 text-green-500" />
            <h1 className="text-3xl font-bold text-foreground mb-4">¡Pago Exitoso!</h1>
            <p className="text-muted-foreground mb-8">
              Tu pedido ha sido procesado correctamente. Recibirás un email de confirmación en breve.
            </p>
            <p className="text-sm text-muted-foreground">Redirigiendo al inicio...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Carrito vacío
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center py-16">
            <h1 className="text-3xl font-bold text-foreground mb-4">No hay productos en el carrito</h1>
            <Button asChild>
              <Link href="/catalogo">Ir al Catálogo</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Contenido del paso actual
  let stepComponent = null
  if (step === 1) {
    stepComponent = (
      <Step1Direccion
        billingData={billingData}
        setBillingData={setBillingData}
      />
    )
  } else if (step === 2) {
    stepComponent = (
      <Step2MetodoEnvio
        shippingType={shippingType}
        setShippingType={setShippingType}
      />
    )
  } else if (step === 3) {
    stepComponent = (
      <Step3EnvioDetalle
        billingData={billingData}
        setBillingData={setBillingData}
        shippingType={shippingType}
        shippingCarrier={shippingCarrier}
        setShippingCarrier={setShippingCarrier}
        shippingCost={shippingCost}
        isCalculatingCost={isCalculatingCost}
        calculateShipping={calculateShipping}
      />
    )
  } else if (step === 4) {
    stepComponent = (
      <Step4Pago
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />
    )
  } else {
    stepComponent = (
      <Step5Review
        billingData={billingData}
        shippingType={shippingType}
        shippingCarrier={shippingCarrier}
        shipping={shipping}
        paymentMethod={paymentMethod}
      />
    )
  }

  // Step content centrado, con animación entre pasos
  const stepContent = (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
        className="w-full flex flex-col items-center"
      >
        <div className="w-full max-w-lg space-y-4">
          {stepComponent}

          <NavigationButtons
            step={step}
            isProcessing={isProcessing}
            canGoNext={canGoNext}
            total={total}
            onBack={goBack}
            onNext={goNext}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  )

  // Summary solo en el step 5
  const summary = step === 5 ? (
    <SummaryCard
      cartItems={cartItems}
      subtotal={subtotal}
      shipping={shipping}
      total={total}
    />
  ) : null

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pt-2 pb-4">

        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        <Stepper currentStep={step} labels={stepLabels} />

        <CheckoutLayout
          stepContent={stepContent}
          summary={summary}
        />
      </main>

    </div>
  )
}

export default (PaymentPage)
