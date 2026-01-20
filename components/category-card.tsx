import Link from "next/link"
import type { Category } from "@/lib/types"
import { ArrowRight } from "lucide-react"

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.slug}`} className="group">
      <div className="relative aspect-square rounded-xl overflow-hidden">
        <img
          src={category.image || "/placeholder.svg"}
          alt={category.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-semibold text-primary-foreground">{category.name}</h3>
          <div className="flex items-center gap-1 text-sm text-primary-foreground/80 group-hover:text-primary-foreground transition-colors">
            <span>Explore</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  )
}
