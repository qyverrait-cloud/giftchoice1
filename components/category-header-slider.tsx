"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import type { Category } from "@/lib/types"
import Image from "next/image"

interface CategoryHeaderSliderProps {
  categories: Category[]
}

export function CategoryHeaderSlider({ categories }: CategoryHeaderSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  // Debug: Log categories
  useEffect(() => {
    console.log("CategoryHeaderSlider - Categories received:", categories.length, categories)
  }, [categories])

  useEffect(() => {
    if (!sliderRef.current || categories.length === 0) return

    const slider = sliderRef.current
    const container = slider.querySelector(".category-container") as HTMLElement
    if (!container) return

    // Duplicate items for infinite loop
    const items = container.children
    const itemWidth = items[0]?.getBoundingClientRect().width || 0
    const gap = 16 // gap-4 = 16px
    const scrollAmount = itemWidth + gap

    let scrollPosition = 0
    let animationId: number

    const scroll = () => {
      if (isPaused) {
        animationId = requestAnimationFrame(scroll)
        return
      }

      scrollPosition += 0.5 // Smooth scroll speed
      
      // Reset when scrolled past all items
      if (scrollPosition >= container.scrollWidth / 2) {
        scrollPosition = 0
      }

      container.style.transform = `translateX(-${scrollPosition}px)`
      animationId = requestAnimationFrame(scroll)
    }

    animationId = requestAnimationFrame(scroll)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [categories, isPaused])

  // Show loading state or empty state
  if (categories.length === 0) {
    return (
      <section className="w-full bg-gradient-to-b from-background via-secondary/30 to-background py-4 md:py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">No categories available</p>
        </div>
      </section>
    )
  }

  return (
    <section 
      ref={sliderRef}
      className="w-full bg-gradient-to-b from-background via-secondary/30 to-background py-4 md:py-6 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative">
        <div className="category-container flex gap-4 will-change-transform" style={{ width: 'max-content' }}>
          {/* Render categories twice for infinite loop */}
          {[...categories, ...categories].map((category, index) => (
            <Link
              key={`${category.id}-${index}`}
              href={`/category/${category.slug || category.id}`}
              className="group flex flex-col items-center gap-2 md:gap-3 flex-shrink-0 min-w-[120px] md:min-w-[140px]"
            >
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden p-2 md:p-3 bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300 group-hover:scale-110 shadow-md group-hover:shadow-lg">
                <div className="w-full h-full rounded-full overflow-hidden bg-background">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              </div>
              <span className="text-xs md:text-sm font-medium text-foreground text-center px-2 group-hover:text-primary transition-colors">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

