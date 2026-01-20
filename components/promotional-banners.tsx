"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import type { PromotionalBanner } from "@/lib/types"
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

export function PromotionalBanners() {
  const [banners, setBanners] = useState<PromotionalBanner[]>([])

  // Load promotional banners from localStorage (managed in admin panel)
  useEffect(() => {
    const savedBanners = localStorage.getItem("adminPromotionalBanners")
    if (savedBanners) {
      try {
        const allBanners = JSON.parse(savedBanners) as PromotionalBanner[]
        const activeBanners = allBanners.filter((b) => b.isActive).sort((a, b) => a.order - b.order)
        setBanners(activeBanners)
      } catch (e) {
        console.error("Failed to parse promotional banners:", e)
      }
    } else {
      // Fallback to default banners
      setBanners([
        {
          id: "1",
          image: "/placeholder.svg?height=400&width=800",
          title: "Valentine's Special Offer",
          link: "/shop?festival=valentine",
          isActive: true,
          order: 1,
          createdAt: new Date().toISOString(),
        },
      ])
    }
  }, [])

  const sectionRef = useRef<HTMLElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const items = itemsRef.current
    if (!section || !items || banners.length === 0) return

    const bannerItems = items.querySelectorAll("div, a")
    gsap.fromTo(
      bannerItems,
      { opacity: 0, scale: 0.9, y: 30 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [banners])

  if (banners.length === 0) return null

  return (
    <section ref={sectionRef} className="py-6 bg-background">
      <div className="container mx-auto px-3 md:px-4">
        <Carousel
          opts={{
            align: "start",
            loop: banners.length > 1,
            slidesToScroll: 1,
          }}
          className="w-full"
        >
          <CarouselContent ref={itemsRef} className="-ml-2 md:-ml-4">
            {banners.map((banner) => (
              <CarouselItem key={banner.id} className="pl-2 md:pl-4 basis-full md:basis-2/3 lg:basis-1/2">
                {banner.link ? (
                  <Link href={banner.link} className="block group">
                    <div className="relative aspect-[16/6] md:aspect-[16/7] rounded-2xl overflow-hidden bg-secondary">
                      <img
                        src={banner.image || "/placeholder.svg"}
                        alt={banner.title || "Promotional banner"}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>
                ) : (
                  <div className="relative aspect-[16/6] md:aspect-[16/7] rounded-2xl overflow-hidden bg-secondary">
                    <img
                      src={banner.image || "/placeholder.svg"}
                      alt={banner.title || "Promotional banner"}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 md:left-0" />
          <CarouselNext className="right-2 md:right-0" />
        </Carousel>
      </div>
    </section>
  )
}

