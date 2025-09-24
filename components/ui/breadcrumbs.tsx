import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center space-x-2 text-sm ${className}`}>
      <Link
        href="/"
        className="flex items-center text-muted-foreground hover:text-brand transition-colors duration-200"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Inicio</span>
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          {item.href && index < items.length - 1 ? (
            <Link
              href={item.href}
              className="text-muted-foreground hover:text-brand transition-colors duration-200 font-[family-name:var(--font-inter)]"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium font-[family-name:var(--font-inter)]">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
