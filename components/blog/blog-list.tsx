import { BlogCard } from "./blog-card"
import type { BlogPost } from "@/lib/types"

interface BlogListProps {
  posts: BlogPost[]
  className?: string
}

export function BlogList({ posts, className = "" }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-foreground mb-2 font-[family-name:var(--font-poppins)]">
          No hay artículos disponibles
        </h3>
        <p className="text-muted-foreground font-[family-name:var(--font-inter)]">
          Pronto publicaremos contenido interesante sobre bienestar íntimo
        </p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}>
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  )
}
