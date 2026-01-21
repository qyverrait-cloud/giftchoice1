"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductSlider } from "@/components/product-slider"
import { CategorySlider } from "@/components/category-slider"
import { CategoryHeaderSlider } from "@/components/category-header-slider"
import { PromotionalBanners } from "@/components/promotional-banners"
import { TrendingNow } from "@/components/trending-now"
import { ShopByOccasion } from "@/components/shop-by-occasion"
import { TrendingReels } from "@/components/trending-reels"
import { useEffect, useState } from "react"
import type { Product, Category } from "@/lib/types"
import { productsApi, categoriesApi } from "@/lib/api-client"

// Shuffle products function
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function HomePageContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  // Client-side mount check to prevent hydration errors
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Load products and categories from API
  useEffect(() => {
    if (!isMounted) return

    const loadData = async () => {
      try {
        setIsLoading(true)
        const [productsData, categoriesData] = await Promise.all([
          productsApi.getAll(),
          categoriesApi.getAll(),
        ])
        setProducts(productsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [isMounted])

  // Shuffle products for variety (client-side only to prevent hydration mismatch)
  const shuffledProducts = isMounted ? shuffleArray(products) : products
  const featuredProducts = isMounted
    ? shuffleArray(shuffledProducts.filter((p) => p.isFeatured))
    : shuffledProducts.filter((p) => p.isFeatured)
  const newArrivals = isMounted
    ? shuffleArray(shuffledProducts.filter((p) => p.isNewArrival))
    : shuffledProducts.filter((p) => p.isNewArrival)
  // Trending products - shuffled
  const trendingProducts = isMounted
    ? shuffleArray(shuffledProducts.filter((p) => p.isFeatured || p.isNewArrival)).slice(0, 10)
    : shuffledProducts.filter((p) => p.isFeatured || p.isNewArrival).slice(0, 10)

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Full-width category header slider */}
      <CategoryHeaderSlider categories={categories} />

      <main className="flex-1">

        <PromotionalBanners />

        <TrendingNow products={trendingProducts} />

        <ShopByOccasion />

        <ProductSlider title="" subtitle="" products={featuredProducts} />

        <ProductSlider title="" subtitle="" products={newArrivals} />

        <TrendingReels />
      </main>

      <Footer />
    </div>
  )
}

export default function HomePage() {
  return <HomePageContent />
}
