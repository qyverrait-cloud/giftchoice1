"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductSlider } from "@/components/product-slider"
import { CategorySlider } from "@/components/category-slider"
import { PromotionalBanners } from "@/components/promotional-banners"
import { TrendingNow } from "@/components/trending-now"
import { ShopByOccasion } from "@/components/shop-by-occasion"
import { TrendingReels } from "@/components/trending-reels"
import { CartProvider } from "@/lib/cart-context"
import { AdminProvider, useAdmin } from "@/lib/admin-context"
import { products as initialProducts, categories as initialCategories } from "@/lib/mock-data"
import { useEffect, useState } from "react"
import type { Product, Category } from "@/lib/types"

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
  const { products: adminProducts, categories: adminCategories } = useAdmin()
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [isMounted, setIsMounted] = useState(false)

  // Client-side mount check to prevent hydration errors
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Load products and categories from admin context or localStorage (client-side only)
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const savedProducts = localStorage.getItem("adminProducts")
      const savedCategories = localStorage.getItem("adminCategories")

      if (savedProducts) {
        try {
          const parsed = JSON.parse(savedProducts)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed)
          }
        } catch (e) {
          console.error("Failed to parse products:", e)
        }
      } else if (adminProducts.length > 0) {
        setProducts(adminProducts)
      }

      if (savedCategories) {
        try {
          const parsed = JSON.parse(savedCategories)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCategories(parsed)
          }
        } catch (e) {
          console.error("Failed to parse categories:", e)
        }
      } else if (adminCategories.length > 0) {
        setCategories(adminCategories)
      }
    } catch (e) {
      console.error("Error loading data:", e)
    }
  }, [adminProducts, adminCategories])

  // Shuffle products for variety (client-side only to prevent hydration mismatch)
  const shuffledProducts = isMounted ? shuffleArray(products) : products
  const featuredProducts = isMounted ? shuffleArray(shuffledProducts.filter((p) => p.isFeatured)) : shuffledProducts.filter((p) => p.isFeatured)
  const newArrivals = isMounted ? shuffleArray(shuffledProducts.filter((p) => p.isNewArrival)) : shuffledProducts.filter((p) => p.isNewArrival)
  // Trending products - shuffled
  const trendingProducts = isMounted 
    ? shuffleArray(shuffledProducts.filter((p) => p.isFeatured || p.isNewArrival)).slice(0, 10)
    : shuffledProducts.filter((p) => p.isFeatured || p.isNewArrival).slice(0, 10)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <CategorySlider categories={categories} />

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
  return (
    <CartProvider>
      <AdminProvider>
        <HomePageContent />
      </AdminProvider>
    </CartProvider>
  )
}
