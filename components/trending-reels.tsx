"use client"

import { useEffect, useRef, useState } from "react"
import type { SocialMediaPost } from "@/lib/types"
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

export function TrendingReels() {
  const [socialMediaPosts, setSocialMediaPosts] = useState<SocialMediaPost[]>([])

  // Load social media posts from localStorage (managed in admin panel)
  useEffect(() => {
    const savedPosts = localStorage.getItem("adminSocialMediaPosts")
    if (savedPosts) {
      try {
        const posts = JSON.parse(savedPosts) as SocialMediaPost[]
        setSocialMediaPosts(posts)
      } catch (e) {
        console.error("Failed to parse social media posts:", e)
      }
    }
  }, [])
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const title = titleRef.current
    const items = itemsRef.current
    if (!section || !title || !items) return

    gsap.fromTo(
      title,
      { opacity: 0, y: -30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    )

    const reelItems = items.querySelectorAll("a")
    gsap.fromTo(
      reelItems,
      { opacity: 0, y: 40, rotationY: 15 },
      {
        opacity: 1,
        y: 0,
        rotationY: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.2,
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars && trigger.vars.trigger === section) {
          trigger.kill()
        }
      })
    }
  }, [])

  // Get active social media posts from admin panel
  const activePosts = socialMediaPosts.filter((p) => p.isActive).sort((a, b) => a.order - b.order)
  
  // Fallback to default posts if no admin posts exist
  const reels = activePosts.length > 0 
    ? activePosts.map((post) => ({
        id: post.id,
        thumbnail: post.thumbnail,
        title: post.title,
        link: post.videoLink || post.link, // Use videoLink if available, otherwise use link
      }))
    : [
        { id: "1", thumbnail: "/placeholder.svg?height=400&width=300", title: "Unboxing Surprise", link: undefined },
        { id: "2", thumbnail: "/placeholder.svg?height=400&width=300", title: "Gift Wrapping Ideas", link: undefined },
        { id: "3", thumbnail: "/placeholder.svg?height=400&width=300", title: "Birthday Surprise", link: undefined },
      ]

  return (
    <section ref={sectionRef} className="py-12 bg-secondary">
      <div className="container mx-auto px-4">
        <div ref={titleRef} className="text-center mb-8">
          <h2 className="font-serif text-3xl font-semibold text-foreground">Trending on Social</h2>
          <p className="text-muted-foreground mt-2">Follow us on Instagram & YouTube for gift inspiration</p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent ref={itemsRef} className="-ml-2 md:-ml-4">
            {reels.map((reel) => (
              <CarouselItem key={reel.id} className="pl-2 md:pl-4 basis-auto md:basis-1/3 lg:basis-1/4">
                <a 
                  href={reel.link || "#"} 
                  target={reel.link ? "_blank" : "_self"}
                  rel={reel.link ? "noopener noreferrer" : undefined}
                  className="group relative aspect-[3/4] rounded-lg overflow-hidden block"
                >
                  <img
                    src={reel.thumbnail || "/placeholder.svg"}
                    alt={reel.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-sm font-medium text-primary-foreground">{reel.title}</p>
                  </div>
                  {/* Play icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-card/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5 text-foreground ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Follow us{" "}
            <a href="#" className="text-primary hover:underline">
              @giftchoice
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
