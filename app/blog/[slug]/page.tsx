import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BlogList } from "@/components/blog/blog-list"
import { Calendar, Clock, Facebook, Twitter, LinkIcon, Tag } from "lucide-react"
import { mockBlogPosts } from "@/lib/services/mock-data"
import Link from "next/link"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = mockBlogPosts.find((p) => p.slug === params.slug)

  if (!post) {
    notFound()
  }

  // Find related posts (same tags, excluding current post)
  const relatedPosts = mockBlogPosts
    .filter((p) => p.id !== post.id && p.tags?.some((tag) => post.tags?.includes(tag)))
    .slice(0, 3)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const estimatedReadTime = Math.ceil(post.content.length / 1000)

  const breadcrumbItems = [{ label: "Blog", href: "/blog" }, { label: post.title }]

  // Mock table of contents based on content
  const tableOfContents = [
    { id: "introduccion", title: "Introducción" },
    { id: "conceptos-basicos", title: "Conceptos Básicos" },
    { id: "consejos-practicos", title: "Consejos Prácticos" },
    { id: "conclusion", title: "Conclusión" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        <div className="max-w-4xl mx-auto">
          {/* Hero image */}
          <div className="relative aspect-video mb-8 rounded-xl overflow-hidden">
            <img src={post.cover || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>

          {/* Article header */}
          <header className="mb-8">
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span className="font-[family-name:var(--font-inter)]">{formatDate(post.date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="font-[family-name:var(--font-inter)]">{estimatedReadTime} min lectura</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-[family-name:var(--font-poppins)] text-balance">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-muted-foreground mb-6 font-[family-name:var(--font-inter)] text-pretty">
              {post.excerpt}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-sm">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Share buttons */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground mr-2 font-[family-name:var(--font-inter)]">
                Compartir:
              </span>
              <Button variant="outline" size="sm">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Compartir en Facebook</span>
              </Button>
              <Button variant="outline" size="sm">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Compartir en Twitter</span>
              </Button>
              <Button variant="outline" size="sm">
                <LinkIcon className="h-4 w-4" />
                <span className="sr-only">Copiar enlace</span>
              </Button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Table of contents - Desktop */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24 bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold text-card-foreground mb-4 font-[family-name:var(--font-poppins)]">
                  Contenido
                </h3>
                <nav className="space-y-2">
                  {tableOfContents.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-sm text-muted-foreground hover:text-brand transition-colors duration-200 font-[family-name:var(--font-inter)]"
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Article content */}
            <article className="lg:col-span-3">
              <div className="prose prose-lg max-w-none">
                <div className="bg-card rounded-xl border border-border p-8">
                  {/* Mock content sections */}
                  <section id="introduccion" className="mb-8">
                    <h2 className="text-2xl font-bold text-card-foreground mb-4 font-[family-name:var(--font-poppins)]">
                      Introducción
                    </h2>
                    <p className="text-card-foreground leading-relaxed mb-4 font-[family-name:var(--font-inter)]">
                      El bienestar íntimo es un aspecto fundamental de la salud general que a menudo se pasa por alto.
                      En este artículo, exploraremos los conceptos básicos y proporcionaremos consejos prácticos para
                      mejorar tu bienestar íntimo de manera segura y saludable.
                    </p>
                    <p className="text-card-foreground leading-relaxed font-[family-name:var(--font-inter)]">
                      Es importante recordar que cada persona es única, y lo que funciona para una persona puede no
                      funcionar para otra. Siempre es recomendable consultar con profesionales de la salud cuando tengas
                      dudas o preocupaciones específicas.
                    </p>
                  </section>

                  <section id="conceptos-basicos" className="mb-8">
                    <h2 className="text-2xl font-bold text-card-foreground mb-4 font-[family-name:var(--font-poppins)]">
                      Conceptos Básicos
                    </h2>
                    <p className="text-card-foreground leading-relaxed mb-4 font-[family-name:var(--font-inter)]">
                      El bienestar íntimo abarca varios aspectos de la salud sexual y reproductiva. Incluye la
                      comprensión de tu propio cuerpo, la comunicación abierta con tu pareja, y el uso seguro de
                      productos diseñados para mejorar la experiencia íntima.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-card-foreground font-[family-name:var(--font-inter)]">
                      <li>Conocimiento anatómico básico</li>
                      <li>Importancia de la higiene personal</li>
                      <li>Comunicación efectiva con la pareja</li>
                      <li>Uso seguro de productos íntimos</li>
                    </ul>
                  </section>

                  <section id="consejos-practicos" className="mb-8">
                    <h2 className="text-2xl font-bold text-card-foreground mb-4 font-[family-name:var(--font-poppins)]">
                      Consejos Prácticos
                    </h2>
                    <p className="text-card-foreground leading-relaxed mb-4 font-[family-name:var(--font-inter)]">
                      Aquí tienes algunos consejos prácticos para mejorar tu bienestar íntimo:
                    </p>
                    <div className="bg-muted rounded-lg p-6 mb-4">
                      <h3 className="font-semibold text-card-foreground mb-2 font-[family-name:var(--font-poppins)]">
                        Consejo importante
                      </h3>
                      <p className="text-card-foreground font-[family-name:var(--font-inter)]">
                        Siempre prioriza la calidad sobre la cantidad. Es mejor invertir en productos de alta calidad
                        que usar múltiples productos de calidad inferior.
                      </p>
                    </div>
                  </section>

                  <section id="conclusion" className="mb-8">
                    <h2 className="text-2xl font-bold text-card-foreground mb-4 font-[family-name:var(--font-poppins)]">
                      Conclusión
                    </h2>
                    <p className="text-card-foreground leading-relaxed font-[family-name:var(--font-inter)]">
                      El bienestar íntimo es un viaje personal que requiere paciencia, autoconocimiento y, a veces, la
                      orientación de profesionales. Recuerda que no hay prisa y que cada paso hacia un mejor bienestar
                      íntimo es valioso.
                    </p>
                  </section>
                </div>
              </div>

              {/* CTA section */}
              <div className="mt-12 bg-gradient-to-br from-brand/10 to-brand/5 rounded-xl border border-brand/20 p-8 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-4 font-[family-name:var(--font-poppins)]">
                  ¿Te gustó este artículo?
                </h3>
                <p className="text-muted-foreground mb-6 font-[family-name:var(--font-inter)]">
                  Explora nuestra colección de productos de bienestar íntimo de alta calidad
                </p>
                <Button size="lg" className="bg-brand hover:bg-brand/90" asChild>
                  <Link href="/catalogo">Ver Catálogo</Link>
                </Button>
              </div>
            </article>
          </div>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center font-[family-name:var(--font-poppins)]">
              Artículos Relacionados
            </h2>
            <BlogList posts={relatedPosts} />
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
