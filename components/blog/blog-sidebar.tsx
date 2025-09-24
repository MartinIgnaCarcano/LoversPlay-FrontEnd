"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Tag } from "lucide-react"
import { mockBlogPosts } from "@/lib/services/mock-data"

interface BlogSidebarProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  onSearch: (query: string) => void
  className?: string
}

export function BlogSidebar({ selectedTags, onTagsChange, onSearch, className = "" }: BlogSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Extract all unique tags from blog posts
  const allTags = Array.from(new Set(mockBlogPosts.flatMap((post) => post.tags || []))).sort()

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag]
    onTagsChange(newTags)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  const clearFilters = () => {
    setSearchQuery("")
    onTagsChange([])
    onSearch("")
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold text-card-foreground mb-4 font-[family-name:var(--font-poppins)]">
          Buscar Artículos
        </h3>
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar en el blog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" className="w-full bg-brand hover:bg-brand/90">
            Buscar
          </Button>
        </form>
      </div>

      {/* Tags filter */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-card-foreground font-[family-name:var(--font-poppins)]">
            Filtrar por Tema
          </h3>
          {selectedTags.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Limpiar
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`flex items-center gap-2 w-full p-2 rounded-lg text-left transition-colors duration-200 ${
                selectedTags.includes(tag)
                  ? "bg-brand/10 text-brand border border-brand/20"
                  : "hover:bg-muted text-card-foreground"
              }`}
            >
              <Tag className="h-4 w-4" />
              <span className="font-[family-name:var(--font-inter)] capitalize">{tag}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent posts */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold text-card-foreground mb-4 font-[family-name:var(--font-poppins)]">
          Artículos Recientes
        </h3>
        <div className="space-y-4">
          {mockBlogPosts.slice(0, 3).map((post) => (
            <div key={post.id} className="group">
              <a
                href={`/blog/${post.slug}`}
                className="flex gap-3 p-2 rounded-lg hover:bg-muted transition-colors duration-200"
              >
                <img
                  src={post.cover || "/placeholder.svg"}
                  alt={post.title}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-card-foreground line-clamp-2 group-hover:text-brand transition-colors duration-200 font-[family-name:var(--font-inter)]">
                    {post.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(post.date).toLocaleDateString("es-ES")}
                  </p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter signup */}
      <div className="bg-gradient-to-br from-brand/10 to-brand/5 rounded-xl border border-brand/20 p-6">
        <h3 className="font-semibold text-foreground mb-2 font-[family-name:var(--font-poppins)]">
          Suscríbete al Blog
        </h3>
        <p className="text-sm text-muted-foreground mb-4 font-[family-name:var(--font-inter)]">
          Recibe los últimos artículos sobre bienestar íntimo directamente en tu email
        </p>
        <div className="space-y-3">
          <Input type="email" placeholder="Tu email" />
          <Button className="w-full bg-brand hover:bg-brand/90">Suscribirse</Button>
        </div>
      </div>
    </div>
  )
}
