"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle } from "lucide-react"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Mock form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    }, 2000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const breadcrumbItems = [{ label: "Contacto" }]

  const contactInfo = [
    {
      icon: Clock,
      title: "Horarios",
      details: ["Lun - Vie: 10:00 - 19:00", "Sáb: 10:00 - 14:00"],
      description: "Atención al cliente",
    },
    {
      icon: Phone,
      title: "Teléfono",
      details: ["+54 9 261 616 3377"],
      description: "Llámanos para consultas inmediatas",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["ventas @ loversplaysexshop.com"],
      description: "",
    },
    {
      icon: MapPin,
      title: "Dirección",
      details: ["Juan B. Alberdi 315, M5519, Mendoza, Argentina"],
      description: "Oficinas principales",
    },
    
  ]

  const subjects = [
    "Consulta sobre productos",
    "Problema con mi pedido",
    "Información de envío",
    "Devolución o cambio",
    "Sugerencias",
    "Otro",
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        {/* Page header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4 font-[family-name:var(--font-poppins)]">
            Contáctanos
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-[family-name:var(--font-inter)]">
            Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-[family-name:var(--font-poppins)]">
                  <MessageCircle className="h-5 w-5" />
                  Envíanos un mensaje
                </CardTitle>
                <CardDescription>Completa el formulario y nos pondremos en contacto contigo pronto</CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
                    <h3 className="text-xl font-semibold text-foreground mb-2 font-[family-name:var(--font-poppins)]">
                      ¡Mensaje enviado!
                    </h3>
                    <p className="text-muted-foreground mb-6 font-[family-name:var(--font-inter)]">
                      Gracias por contactarnos.
                    </p>
                    <Button className="bg-primary cursor-pointer" onClick={() => setIsSubmitted(false)} variant="outline">
                      Enviar otro mensaje
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre completo *</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Tu nombre completo"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="tu@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Asunto *</Label>
                        <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un asunto" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjects.map((subject) => (
                              <SelectItem key={subject} value={subject}>
                                {subject}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Mensaje *</Label>
                      <Textarea
                        id="message"
                        placeholder="Escribe tu mensaje aquí..."
                        rows={6}
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/70 cursor-pointer"
                      disabled={isSubmitting}
                      size="lg"
                    >
                      {isSubmitting ? (
                        "Enviando..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Enviar Mensaje
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
            {/* Map placeholder */}
            <section className="mt-16">
              <Card>
                <CardContent className="p-0">
                  <div className="bg-muted rounded-lg h-80 flex items-center justify-center">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d90147.25845334327!2d-68.82435112795741!3d-32.895060550260446!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e09207eca3a5b%3A0x832a5e393fda2e31!2sLovers%20Play!5e0!3m2!1ses!2sar!4v1758118740510!5m2!1ses!2sar" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade">
                    </iframe>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Contact information */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-brand/10 rounded-lg p-3">
                      <info.icon className="h-6 w-6 text-brand" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground mb-1 font-[family-name:var(--font-poppins)]">
                        {info.title}
                      </h3>
                      <div className="space-y-1 mb-2">
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-sm text-card-foreground font-[family-name:var(--font-inter)]">
                            {detail}
                          </p>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground font-[family-name:var(--font-inter)]">
                        {info.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>


      </main>

      <Footer />
    </div>
  )
}
