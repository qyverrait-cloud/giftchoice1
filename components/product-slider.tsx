"use client"

import { useRef, useEffect } from "react"
import type { Product } from "@/lib/types"
import { ProductCard } from "./product-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { createDominosSlide, gsapSlide } from "@/lib/gsap-animations"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface ProductSliderProps {
  title: string
  subtitle?: string
  products: Product[]
}

export function ProductSlider({ title, subtitle, products }: ProductSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const productsContainer = scrollRef.current
    if (!section || !productsContainer) return

    const productCards = productsContainer.querySelectorAll(".flex-shrink-0")

    // Initial reveal animation with ScrollTrigger
    gsap.fromTo(
      productCards,
      { opacity: 0, x: 50, scale: 0.9 },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      }
    )

    // Optional: Add Domino's-style infinite sliding (uncomment if needed)
    // createDominosSlide(productsContainer, Array.from(productCards), {
    //   direction: "left",
    //   speed: 30,
    //   gap: 24,
    //   pauseOnHover: true,
    // })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars && trigger.vars.trigger === section) {
          trigger.kill()
        }
      })
    }
  }, [products])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section ref={sectionRef} className="py-12">
      <div className="container mx-auto px-4">
        {title && (
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-foreground">{title}</h2>
            {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => scroll("left")} className="rounded-full">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scroll("right")} className="rounded-full">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        )}

        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 -mx-3 md:-mx-4 px-3 md:px-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          data-products-container
        >
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-[280px] sm:w-72 md:w-72">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
