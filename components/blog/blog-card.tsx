import Link from "next/link"
import { Calendar, Clock, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { BlogPost } from "@/lib/types"

interface BlogCardProps {
  post: BlogPost
  className?: string
}

export function BlogCard({ post, className = "" }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const estimatedReadTime = Math.ceil(post.content.length / 1000) // Rough estimate: 1000 chars per minute

  return (
    <article
      className={`group bg-card rounded-xl border border-border shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden ${className}`}
    >
      <Link href={`/blog/${post.slug}`}>
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={post.cover || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Meta info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
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
          <h2 className="text-xl font-bold text-card-foreground mb-3 line-clamp-2 group-hover:text-brand transition-colors duration-200 font-[family-name:var(--font-poppins)]">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-muted-foreground mb-4 line-clamp-3 font-[family-name:var(--font-inter)]">{post.excerpt}</p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Read more */}
          <div className="flex items-center justify-between">
            <span className="text-brand font-medium text-sm group-hover:underline font-[family-name:var(--font-inter)]">
              Leer más →
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
