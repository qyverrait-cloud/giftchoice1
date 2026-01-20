"use client"

import { useState, useMemo, use } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { CartProvider } from "@/lib/cart-context"
import { products, categories } from "@/lib/mock-data"
import { searchProducts } from "@/lib/search"
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

  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : [])
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [showInStockOnly, setShowInStockOnly] = useState(false)

  const filteredProducts = useMemo(() => {
    let result = products

    // Apply search
    if (searchQuery) {
      result = searchProducts(result, searchQuery)
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category))
    }

    // Apply price filter
    result = result.filter((p) => {
      const price = p.sizes ? p.sizes[0].price : p.price
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
          const priceA = a.sizes ? a.sizes[0].price : a.price
          const priceB = b.sizes ? b.sizes[0].price : b.price
          return priceA - priceB
        })
        break
      case "price-high":
        result = [...result].sort((a, b) => {
          const priceA = a.sizes ? a.sizes[0].price : a.price
          const priceB = b.sizes ? b.sizes[0].price : b.price
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
  }, [searchQuery, selectedCategories, sortBy, priceRange, showInStockOnly])

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
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
      {/* Categories */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.slug}
                checked={selectedCategories.includes(category.slug)}
                onCheckedChange={() => toggleCategory(category.slug)}
              />
              <Label htmlFor={category.slug} className="text-sm text-muted-foreground cursor-pointer">
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Price Range</h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={priceRange[0] || ""}
            onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
            className="w-24"
          />
          <span className="text-muted-foreground">to</span>
          <Input
            type="number"
            placeholder="Max"
            value={priceRange[1] || ""}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 5000])}
            className="w-24"
          />
        </div>
      </div>

      {/* Stock */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="in-stock"
          checked={showInStockOnly}
          onCheckedChange={() => setShowInStockOnly(!showInStockOnly)}
        />
        <Label htmlFor="in-stock" className="text-sm text-muted-foreground cursor-pointer">
          In Stock Only
        </Label>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
          Clear All Filters
        </Button>
      )}
    </div>
  )

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          {/* Page Header */}
          <div className="bg-secondary py-8">
            <div className="container mx-auto px-4">
              <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">Shop All Gifts</h1>
              <p className="text-muted-foreground mt-2">
                Discover our complete collection of thoughtful gifts for every occasion
              </p>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            {/* Search and Sort Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for gifts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>

                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden gap-2 bg-transparent">
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters
                      {hasActiveFilters && (
                        <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                          {selectedCategories.length + (showInStockOnly ? 1 : 0)}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSidebar />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Active Filters */}
            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategories.map((cat) => (
                  <Button key={cat} variant="secondary" size="sm" onClick={() => toggleCategory(cat)} className="gap-1">
                    {categories.find((c) => c.slug === cat)?.name}
                    <X className="h-3 w-3" />
                  </Button>
                ))}
              </div>
            )}

            <div className="flex gap-8">
              {/* Desktop Sidebar */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <FilterSidebar />
              </aside>

              {/* Products Grid */}
              <div className="flex-1">
                {filteredProducts.length > 0 ? (
                  <>
                    <p className="text-sm text-muted-foreground mb-4">{filteredProducts.length} products found</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-lg text-muted-foreground">No products found matching your criteria.</p>
                    <Button variant="outline" onClick={clearFilters} className="mt-4 bg-transparent">
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </CartProvider>
  )
}
