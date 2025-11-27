"use client"

import { use, useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, MapPin, Package, Trash2, Settings, LogOut, Edit } from "lucide-react"
import { useAuthStore, useCartStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { fetchUsuario, fetchPedidosPorUsuario, actualizarUsuario, fetchFavorites, eliminarFavorito } from "@/lib/services/api"
import type { Pedido, Product } from "@/lib/types"
import withAuth from "@/lib/withAuth"
import { set } from "date-fns"
import { stringify } from "querystring"


function ProfilePage() {
  const { user, logout, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const addItem = useCartStore(state => state.addItem)
  const [isEditing, setIsEditing] = useState(false)
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [profileData, setProfileData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: {
      calle: "",
      departamento: "",
      provincia: "",
      codigo_postal: "",
      extra: "",
    }
  })

  // manejar agregar al carrito
  const handleAddToCart = (item: Product) => {
    addItem({
      productId: String(item.id),
      name: item.nombre,
      price: item.precio,
      image: item.url_imagen_principal || "/placeholder.svg",
      quantity: 1
    });
  };

  // manejar eliminar favorito
  const handleRemoveFavorite = async (id: number) => {
    try {
      await eliminarFavorito(id);
      setWishlist(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error eliminando favorito:", err);
    }
  };


  // Ajusta el estado inicial y el efecto para usar los nombres de propiedades del type Usuario
  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }
    const fetchData = async () => {
      if (user) {
        const dataUser = await fetchUsuario();

        if (!dataUser) return;

        const d = dataUser.direccion ?? {}
        setProfileData({
          nombre: dataUser.nombre || "",
          email: dataUser.email || "",
          telefono: dataUser.telefono || "",
          direccion: {
            calle: d.calle || "",
            departamento: d.departamento || "",
            provincia: d.provincia || "",
            codigo_postal: d.codigo_postal || "",
            extra: d.extra || "",
          }
        })

        const dataPedidos = await fetchPedidosPorUsuario();
        if (dataPedidos) {
          setPedidos(Array.isArray(dataPedidos) ? dataPedidos : []);
        }

        const favs = await fetchFavorites();
        if (favs) {
          setWishlist(favs);
        }
      }
    };
    fetchData();
  }, [user])


  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleSaveProfile = () => {
    // Mock save functionality
    setIsEditing(true)
    try {
      actualizarUsuario({
        nombre: profileData.nombre,
        email: profileData.email,
        telefono: profileData.telefono,
        direccion: profileData.direccion
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Error actualizando perfil:", error);
    }
  }


  const breadcrumbItems = [{ label: "Mi Perfil" }]



  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        <div className="max-w-4xl mx-auto">
          {/* Profile header */}
          <div className="bg-card rounded-xl border border-border p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-brand-foreground" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-card-foreground font-[family-name:var(--font-poppins)]">
                  {profileData.nombre || "Usuario"}
                </h1>
                <p className="text-muted-foreground font-[family-name:var(--font-inter)]">
                  {profileData.email || ""}
                </p>
              </div>
              <Button variant="outline" className="cursor-pointer" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="cursor-pointer">Perfil</TabsTrigger>
              <TabsTrigger value="pedidos" className="cursor-pointer">Pedidos</TabsTrigger>
              <TabsTrigger value="wishlist" className="cursor-pointer">Favoritos</TabsTrigger>
              <TabsTrigger value="settings" className="cursor-pointer">Configuración</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-[family-name:var(--font-poppins)]">Información Personal</CardTitle>
                      <CardDescription>Actualiza tu información personal y de contacto</CardDescription>
                    </div>
                    <Button variant="outline" className="cursor-pointer" onClick={() => setIsEditing(!isEditing)}>
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditing ? "Cancelar" : "Editar"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          value={profileData.nombre}
                          onChange={(e) => setProfileData({ ...profileData, nombre: e.target.value })}
                          className="pl-10"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="pl-10"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={profileData.telefono}
                          onChange={(e) => setProfileData({ ...profileData, telefono: e.target.value })}
                          className="pl-10"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    {/* Calle */}
                    <div className="space-y-2">
                      <Label htmlFor="calle">Calle y numeración</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="calle"
                          value={profileData.direccion.calle}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              direccion: { ...profileData.direccion, calle: e.target.value },
                            })
                          }
                          className="pl-10"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    {/* Departamento */}
                    <div className="space-y-2">
                      <Label htmlFor="departamento">Departamento / Partido</Label>
                      <Input
                        id="departamento"
                        value={profileData.direccion.departamento}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            direccion: { ...profileData.direccion, departamento: e.target.value },
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    {/* Provincia */}
                    <div className="space-y-2">
                      <Label htmlFor="provincia">Provincia</Label>
                      <Input
                        id="provincia"
                        value={profileData.direccion.provincia}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            direccion: { ...profileData.direccion, provincia: e.target.value },
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    {/* Código Postal */}
                    <div className="space-y-2">
                      <Label htmlFor="codigo_postal">Código Postal</Label>
                      <Input
                        id="codigo_postal"
                        value={profileData.direccion.codigo_postal}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            direccion: { ...profileData.direccion, codigo_postal: e.target.value },
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    {/* Extra */}
                    <div className="space-y-2">
                      <Label htmlFor="extra">Extra</Label>
                      <Input
                        id="extra"
                        value={profileData.direccion.extra}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            direccion: { ...profileData.direccion, extra: e.target.value },
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-4">
                      <Button onClick={handleSaveProfile} className="bg-primary cursor-pointer hover:bg-primary/70">
                        Guardar Cambios
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancelar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* pedidos Tab */}
            <TabsContent value="pedidos" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-[family-name:var(--font-poppins)]">Historial de Pedidos</CardTitle>
                  <CardDescription>Revisa el estado de tus pedidos anteriores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pedidos.map((pedido) => (
                      <div key={pedido.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-4">
                            <Package className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-semibold">Pedido</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(pedido.fecha).toLocaleDateString("es-ES")} • {pedido.items.length} producto
                                {pedido.items.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={pedido.estado === "ENTREGADO" ? "default" : "secondary"}>
                              {pedido.estado}
                            </Badge>
                            <p className="text-lg font-bold mt-1">${pedido.total}</p>
                          </div>
                        </div>

                        {/* Listado de productos dentro del pedido */}
                        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                          {pedido.items.map((item, idx) => (
                            <p key={idx}>
                              {item.producto} × {item.cantidad} — ${item.subtotal}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}

                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-[family-name:var(--font-poppins)]">Lista de Favoritos</CardTitle>
                  <CardDescription>Productos que has guardado para más tarde</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wishlist.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => router.push(`/producto/${item.id}`)}
                        className="border border-border rounded-lg p-4 cursor-pointer"
                      >
                        <div className="flex gap-4">
                          <img
                            src={item.url_imagen_principal || "/placeholder.svg"}
                            alt={item.nombre}
                            className="w-16 h-16 rounded-lg object-cover"
                          />

                          <div className="flex-1">
                            <h3 className="font-semibold">{item.nombre}</h3>
                            <p className="text-lg font-bold">${item.precio}</p>

                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(item);
                                }}
                              >
                                Agregar al Carrito
                              </Button>

                              <Button
                                variant="outline"
                                className="cursor-pointer"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFavorite(item.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-[family-name:var(--font-poppins)]">Configuración de Cuenta</CardTitle>
                  <CardDescription>Gestiona tus preferencias y configuración de privacidad</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-card-foreground mb-4 font-[family-name:var(--font-poppins)]">
                      Notificaciones
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-[family-name:var(--font-inter)]">Ofertas y promociones</span>
                        <Button variant="outline" size="sm">
                          Activado
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-[family-name:var(--font-inter)]">Actualizaciones de pedidos</span>
                        <Button variant="outline" size="sm">
                          Activado
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-[family-name:var(--font-inter)]">Newsletter del blog</span>
                        <Button variant="outline" size="sm">
                          Desactivado
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-card-foreground mb-4 font-[family-name:var(--font-poppins)]">
                      Privacidad
                    </h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Settings className="h-4 w-4 mr-2" />
                        Eliminar mi cuenta
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default withAuth(ProfilePage)