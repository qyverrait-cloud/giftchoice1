"use client"

import { use, useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { productsApi, categoriesApi } from "@/lib/api-client"
import type { Product, Category } from "@/lib/types"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params)
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [categoriesData, productsData] = await Promise.all([
          categoriesApi.getAll(),
          productsApi.getAll({ category: slug }),
        ])

        const foundCategory = categoriesData.find((c: Category) => c.slug === slug)
        setCategory(foundCategory || null)
        setProducts(productsData)
      } catch (error) {
        console.error("Error loading category data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [slug])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-foreground">Category not found</h1>
            <Link href="/categories" className="text-primary hover:underline mt-2 inline-block">
              Browse all categories
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-secondary py-4">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/categories" className="hover:text-foreground transition-colors">
                Categories
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">{category.name}</span>
            </nav>
          </div>
        </div>

        {/* Category Header */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img
            src={category.image || "/placeholder.svg"}
            alt={category.name}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-foreground/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h1 className="font-serif text-4xl md:text-5xl font-semibold text-primary-foreground">
                {category.name}
              </h1>
              <p className="text-primary-foreground/80 mt-2">{products.length} products</p>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="container mx-auto px-4 py-12">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">No products in this category yet.</p>
              <Link href="/shop" className="text-primary hover:underline mt-2 inline-block">
                Browse all products
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
