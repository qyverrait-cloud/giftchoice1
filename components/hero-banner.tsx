"use client"

import { useEffect, useRef } from "react"
import { slideReveal, heroTextReveal } from "@/lib/gsap-animations"
import gsap from "gsap"

export function HeroBanner() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Hero image slide reveal
    if (imageRef.current) {
      slideReveal(imageRef.current, {
        direction: "up",
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
        useScrollTrigger: false,
      })
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-secondary">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="flex items-center justify-center">
          <div
            ref={imageRef}
            className="aspect-square relative rounded-2xl overflow-hidden max-w-2xl w-full"
          >
              <img
                src="/placeholder.svg?height=600&width=600"
                alt="Beautiful gift boxes"
                className="object-cover w-full h-full"
              />
          </div>
        </div>
      </div>
    </section>
  )
}
