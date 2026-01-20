"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
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

interface Occasion {
  id: string
  name: string
  slug: string
  icon?: string
  image?: string
}

export function ShopByOccasion() {
  // TODO: Load from admin panel - these can be managed in admin
  const occasions: Occasion[] = [
    {
      id: "1",
      name: "Valentines Day",
      slug: "valentines-day",
      icon: "❤️",
    },
    {
      id: "2",
      name: "Wedding Gifts",
      slug: "wedding-gifts",
      icon: "💍",
    },
    {
      id: "3",
      name: "Engagement Gifts",
      slug: "engagement-gifts",
      icon: "💑",
    },
    {
      id: "4",
      name: "Birthday Gifts",
      slug: "birthday-gifts",
      icon: "🎂",
    },
    {
      id: "5",
      name: "Anniversary Gifts",
      slug: "anniversary-gifts",
      icon: "🎊",
    },
    {
      id: "6",
      name: "Retirement Gifts",
      slug: "retirement-gifts",
      icon: "🎁",
    },
    {
      id: "7",
      name: "Rakhi",
      slug: "rakhi",
      icon: "🧧",
    },
    {
      id: "8",
      name: "Diwali",
      slug: "diwali",
      icon: "🪔",
    },
  ]

  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const title = titleRef.current
    const items = itemsRef.current
    if (!section || !title || !items) return

    gsap.fromTo(
      title,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    )

    const occasionItems = items.querySelectorAll("a")
    gsap.fromTo(
      occasionItems,
      { opacity: 0, scale: 0.5, rotation: -15 },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.5)",
        stagger: 0.08,
        delay: 0.3,
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
  }, [])

  return (
    <section ref={sectionRef} className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-3 md:px-4">
        <div className="mb-6 md:mb-8">
          <h2 ref={titleRef} className="font-serif text-2xl md:text-3xl font-semibold text-foreground">Shop By Occasion</h2>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent ref={itemsRef} className="-ml-2 md:-ml-4">
            {occasions.map((occasion) => (
              <CarouselItem key={occasion.id} className="pl-2 md:pl-4 basis-auto">
                <Link href={`/shop?occasion=${occasion.slug}`} className="group flex flex-col items-center gap-2 md:gap-3">
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden bg-secondary/20 p-3 md:p-4 border-2 border-secondary/30 group-hover:border-primary/40 transition-all duration-300 group-hover:scale-105 shadow-sm">
                    <div className="w-full h-full rounded-full overflow-hidden bg-background flex items-center justify-center">
                      {occasion.image ? (
                        <img
                          src={occasion.image}
                          alt={occasion.name}
                          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <span className="text-5xl md:text-6xl">{occasion.icon || "🎁"}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs md:text-sm lg:text-base font-medium text-foreground text-center max-w-[120px] md:max-w-[150px] px-1">
                    {occasion.name}
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

