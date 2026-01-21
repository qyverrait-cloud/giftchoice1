"use client"

import { use, useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { ProductReviews } from "@/components/product-reviews"
import { useCart } from "@/lib/cart-context"
import { productsApi, categoriesApi } from "@/lib/api-client"
import type { Product, ProductSize, Category } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ChevronRight, Minus, Plus, ShoppingCart, Heart, Truck, Shield, RefreshCw } from "lucide-react"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

function ProductContent({ productId }: { productId: string }) {
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<ProductSize | undefined>(undefined)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true)
        const productData = await productsApi.getById(productId)
        setProduct(productData)
        setSelectedSize(productData.sizes?.[0])

        // Load category
        if (productData.categoryId) {
          const categoriesData = await categoriesApi.getAll()
          const foundCategory = categoriesData.find((c: Category) => c.id === productData.categoryId)
          setCategory(foundCategory || null)
        }

        // Load related products
        if (productData.categoryId) {
          const allProducts = await productsApi.getAll({ categoryId: productData.categoryId })
          const related = allProducts.filter((p: Product) => p.id !== productId).slice(0, 4)
          setRelatedProducts(related)
        }
      } catch (error) {
        console.error("Error loading product:", error)
        setProduct(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [productId])

  if (isLoading) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Product not found</h1>
          <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/shop" className="text-primary hover:underline inline-block">
            Browse all products
          </Link>
        </div>
      </main>
    )
  }

  const currentPrice = selectedSize?.price || product.price

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize)
  }

  return (
    <main className="flex-1">
      {/* Breadcrumb */}
      <div className="bg-secondary py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/shop" className="hover:text-foreground transition-colors">
              Shop
            </Link>
            <ChevronRight className="h-4 w-4" />
            {category && (
              <>
                <Link href={`/category/${category.slug}`} className="hover:text-foreground transition-colors">
                  {category.name}
                </Link>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
            <span className="text-foreground truncate max-w-48">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-muted">
              <img
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={image || "/placeholder.svg"} alt="" className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {product.badge && <Badge className="mb-3 bg-primary text-primary-foreground">{product.badge}</Badge>}
              <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">{product.name}</h1>
              <p className="text-2xl font-semibold text-foreground mt-3">₹{currentPrice}</p>
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Size Selection */}
            {product.sizes && (
              <div className="space-y-3">
                <h3 className="font-medium text-foreground">Select Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.name}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        selectedSize?.name === size.name
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span className="font-medium">{size.name}</span>
                      <span className="text-muted-foreground ml-2">₹{size.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <h3 className="font-medium text-foreground">Quantity</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="bg-transparent"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium text-foreground">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="bg-transparent"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button size="lg" onClick={handleAddToCart} className="flex-1 gap-2">
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">Fast Delivery</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">Secure Payment</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <RefreshCw className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <ProductReviews productId={product.id} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ProductContent productId={id} />
      <Footer />
    </div>
  )
}
