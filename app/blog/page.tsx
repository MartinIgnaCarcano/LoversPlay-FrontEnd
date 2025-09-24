"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { BlogList } from "@/components/blog/blog-list"
import { mockBlogPosts } from "@/lib/services/mock-data"

export default function BlogPage() {
  const breadcrumbItems = [{ label: "Blog" }]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4 font-[family-name:var(--font-poppins)]">
            Nuestro Blog
          </h1>
          <p className="text-muted-foreground font-[family-name:var(--font-inter)]">
            Consejos, guías y novedades sobre bienestar íntimo
          </p>
        </div>

        {/* Lista de posts */}
        <BlogList posts={mockBlogPosts} />
      </main>

      <Footer />
    </div>
  )
}

