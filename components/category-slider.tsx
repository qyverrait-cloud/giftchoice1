"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import type { Category } from "@/lib/types"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface CategorySliderProps {
  categories: Category[]
}

export function CategorySlider({ categories }: CategorySliderProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const items = itemsRef.current
    if (!section || !items) return

    const categoryItems = items.querySelectorAll("a")

    gsap.fromTo(
      categoryItems,
      { opacity: 0, scale: 0.8, rotation: -10 },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
        stagger: 0.1,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [categories])

  return (
    <section ref={sectionRef} className="py-4 md:py-6 bg-background">
      <div className="container mx-auto px-3 md:px-4">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent ref={itemsRef} className="-ml-2 md:-ml-4">
            {categories.map((category) => (
              <CarouselItem key={category.id} className="pl-2 md:pl-4 basis-auto">
                <Link href={`/category/${category.slug}`} className="group flex flex-col items-center gap-2 md:gap-3">
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden p-3 md:p-4 bg-[oklch(0.95_0.05_340)] group-hover:bg-[oklch(0.92_0.06_340)] transition-all duration-300 group-hover:scale-105 shadow-sm">
                    <div className="w-full h-full rounded-full overflow-hidden bg-background">
                      <img
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  <span className="text-xs md:text-sm lg:text-base font-medium text-foreground text-center max-w-[120px] md:max-w-[140px] px-1">
                    {category.name}
                  </span>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      </div>
    </section>
  )
}

