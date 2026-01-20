"use client"

import type React from "react"

import Link from "next/link"
import { useEffect, useRef } from "react"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import gsap from "gsap"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    // Hover animation
    const handleMouseEnter = () => {
      gsap.to(card, { scale: 1.02, duration: 0.3, ease: "power2.out" })
    }
    const handleMouseLeave = () => {
      gsap.to(card, { scale: 1, duration: 0.3, ease: "power2.out" })
    }

    card.addEventListener("mouseenter", handleMouseEnter)
    card.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter)
      card.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1, product.sizes?.[0])
  }

  return (
    <Link href={`/product/${product.id}`}>
      <Card ref={cardRef} className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow bg-card">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          {product.badge && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">{product.badge}</Badge>
          )}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="secondary" className="rounded-full h-8 w-8">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardContent className="p-3 md:p-4 space-y-2">
          <h3 className="font-medium text-sm md:text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between pt-2 gap-2">
            <p className="text-base md:text-lg font-semibold text-foreground">
              ₹{product.sizes ? product.sizes[0].price : product.price}
              {product.sizes && <span className="text-xs md:text-sm font-normal text-muted-foreground ml-1">onwards</span>}
            </p>
            <Button size="sm" onClick={handleAddToCart} className="gap-1 text-xs md:text-sm h-8 md:h-9 px-3 md:px-4">
              <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Add</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
