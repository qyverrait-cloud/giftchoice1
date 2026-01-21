"use client"

import { useState, useMemo, use, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { productsApi, categoriesApi } from "@/lib/api-client"
import type { Product, Category } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Search, SlidersHorizontal, X } from "lucide-react"

interface ShopPageProps {
  searchParams: Promise<{ search?: string; category?: string }>
}

export default function ShopPage({ searchParams }: ShopPageProps) {
  const params = use(searchParams)
  const initialSearch = params.search || ""
  const initialCategory = params.category || ""

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : [])
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [showInStockOnly, setShowInStockOnly] = useState(false)

  // Load products and categories from API
  useEffect(() => {
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
  }, [])

  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Apply search
    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply category filter - use categoryId or category name/slug
    if (selectedCategories.length > 0) {
      result = result.filter((p) => {
        const categoryMatch = selectedCategories.some((selected) => {
          // Match by category name, slug, or categoryId
          return (
            p.category === selected ||
            p.categoryId === selected ||
            categories.find((c) => c.slug === selected)?.id === p.categoryId
          )
        })
        return categoryMatch
      })
    }

    // Apply price filter
    result = result.filter((p) => {
      const price = p.sizes && p.sizes.length > 0 ? p.sizes[0].price : p.price
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Apply stock filter
    if (showInStockOnly) {
      result = result.filter((p) => p.inStock)
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        result = [...result].sort((a, b) => {
          const priceA = a.sizes && a.sizes.length > 0 ? a.sizes[0].price : a.price
          const priceB = b.sizes && b.sizes.length > 0 ? b.sizes[0].price : b.price
          return priceA - priceB
        })
        break
      case "price-high":
        result = [...result].sort((a, b) => {
          const priceA = a.sizes && a.sizes.length > 0 ? a.sizes[0].price : a.price
          const priceB = b.sizes && b.sizes.length > 0 ? b.sizes[0].price : b.price
          return priceB - priceA
        })
        break
      case "newest":
        result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "featured":
      default:
        result = [...result].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    }

    return result
  }, [products, searchQuery, selectedCategories, sortBy, priceRange, showInStockOnly, categories])

  const toggleCategory = (categorySlug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categorySlug) ? prev.filter((c) => c !== categorySlug) : [...prev, categorySlug]
    )
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategories([])
    setSortBy("featured")
    setPriceRange([0, 5000])
    setShowInStockOnly(false)
  }

  const hasActiveFilters = selectedCategories.length > 0 || showInStockOnly || priceRange[0] > 0 || priceRange[1] < 5000

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Categories */}
      <div>
        <Label className="mb-3 block">Categories</Label>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.slug) || selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.slug)}
              />
              <Label htmlFor={`category-${category.id}`} className="font-normal cursor-pointer">
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="mb-3 block">Price Range</Label>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="w-24"
            />
            <span>-</span>
            <Input
              type="number"
              placeholder="Max"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-24"
            />
          </div>
        </div>
      </div>

      {/* In Stock Only */}
      <div className="flex items-center space-x-2">
        <Checkbox id="in-stock" checked={showInStockOnly} onCheckedChange={(checked) => setShowInStockOnly(!!checked)} />
        <Label htmlFor="in-stock" className="font-normal cursor-pointer">
          In Stock Only
        </Label>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading products...</div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <FilterSidebar />
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="font-serif text-3xl font-semibold">Shop</h1>
                  <p className="text-muted-foreground mt-1">
                    {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                  {/* Mobile Filter Button */}
                  <Sheet>
                    <SheetTrigger asChild className="lg:hidden">
                      <Button variant="outline">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterSidebar />
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Search */}
                  <div className="relative flex-1 sm:flex-initial sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No products found</p>
                  {hasActiveFilters && (
                    <Button variant="outline" onClick={clearFilters} className="mt-4">
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
