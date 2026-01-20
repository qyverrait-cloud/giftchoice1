"use client"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Domino's-style infinite sliding animation
 * Creates a smooth, continuous sliding effect for carousel/slider items
 */
export function createDominosSlide(
  container: HTMLElement | null,
  items: NodeListOf<Element> | Element[],
  options: {
    direction?: "left" | "right"
    speed?: number
    gap?: number
    pauseOnHover?: boolean
  } = {}
) {
  if (!container || items.length === 0) return

  const { direction = "left", speed = 50, gap = 24, pauseOnHover = true } = options

  // Clone items for seamless loop
  items.forEach((item) => {
    const clone = item.cloneNode(true) as HTMLElement
    container.appendChild(clone)
  })

  const allItems = container.children
  const itemWidth = (items[0] as HTMLElement).offsetWidth + gap
  const totalWidth = itemWidth * items.length

  // Set initial position
  gsap.set(allItems, { x: (i) => i * itemWidth })

  // Create infinite animation
  const animation = gsap.to(allItems, {
    x: `+=${direction === "left" ? -totalWidth : totalWidth}`,
    duration: totalWidth / speed,
    ease: "none",
    repeat: -1,
  })

  // Pause on hover
  if (pauseOnHover) {
    container.addEventListener("mouseenter", () => animation.pause())
    container.addEventListener("mouseleave", () => animation.resume())
  }

  return animation
}

/**
 * Modern slide reveal animation for text/content
 * Slides content from a direction with smooth reveal
 */
export function slideReveal(
  element: HTMLElement | null,
  options: {
    direction?: "left" | "right" | "up" | "down"
    duration?: number
    delay?: number
    ease?: string
    useScrollTrigger?: boolean
    scrollTriggerOptions?: ScrollTrigger.Vars
  } = {}
) {
  if (!element) return

  const {
    direction = "left",
    duration = 0.8,
    delay = 0,
    ease = "power3.out",
    useScrollTrigger = false,
    scrollTriggerOptions = {},
  } = options

  const directionMap = {
    left: { from: { x: -100, opacity: 0 }, to: { x: 0, opacity: 1 } },
    right: { from: { x: 100, opacity: 0 }, to: { x: 0, opacity: 1 } },
    up: { from: { y: 100, opacity: 0 }, to: { y: 0, opacity: 1 } },
    down: { from: { y: -100, opacity: 0 }, to: { y: 0, opacity: 1 } },
  }

  const { from, to } = directionMap[direction]

  const animationProps: gsap.TweenVars = {
    ...to,
    duration,
    delay,
    ease,
  }

  if (useScrollTrigger) {
    animationProps.scrollTrigger = {
      trigger: element,
      start: "top 80%",
      toggleActions: "play none none none",
      ...scrollTriggerOptions,
    }
  }

  return gsap.fromTo(element, from, animationProps)
}

/**
 * Navbar slide-in animation from top
 */
export function navbarSlideIn(element: HTMLElement | null, delay: number = 0) {
  if (!element) return

  return gsap.fromTo(
    element,
    { y: -100, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.6,
      delay,
      ease: "power3.out",
    }
  )
}

/**
 * Hero text modern slide reveal with word-by-word animation
 */
export function heroTextReveal(
  container: HTMLElement | null,
  options: {
    wordSelector?: string
    charSelector?: string
    stagger?: number
    duration?: number
    direction?: "left" | "right" | "up" | "down"
  } = {}
) {
  if (!container) return

  const {
    wordSelector = "span",
    charSelector,
    stagger = 0.05,
    duration = 0.6,
    direction = "up",
  } = options

  const elements = charSelector
    ? container.querySelectorAll(charSelector)
    : container.querySelectorAll(wordSelector)

  const directionMap = {
    left: { from: { x: -50, opacity: 0 }, to: { x: 0, opacity: 1 } },
    right: { from: { x: 50, opacity: 0 }, to: { x: 0, opacity: 1 } },
    up: { from: { y: 50, opacity: 0 }, to: { y: 0, opacity: 1 } },
    down: { from: { y: -50, opacity: 0 }, to: { y: 0, opacity: 1 } },
  }

  const { from, to } = directionMap[direction]

  return gsap.fromTo(
    elements,
    from,
    {
      ...to,
      duration,
      stagger,
      ease: "power3.out",
    }
  )
}

/**
 * Search input animations - slide in, focus expand, smooth transitions
 */
export function searchInputAnimations(
  inputElement: HTMLElement | null,
  searchIconElement: HTMLElement | SVGElement | null,
  options: {
    initialDelay?: number
    expandOnFocus?: boolean
    expandWidth?: string
  } = {}
) {
  if (!inputElement) return

  const { initialDelay = 0.4, expandOnFocus = true, expandWidth = "400px" } = options

  // Initial slide-in animation
  gsap.fromTo(
    inputElement,
    { opacity: 0, x: 20, width: "200px" },
    {
      opacity: 1,
      x: 0,
      width: "256px", // w-64
      duration: 0.6,
      delay: initialDelay,
      ease: "power3.out",
    }
  )

  // Search icon animation
  if (searchIconElement) {
    gsap.fromTo(
      searchIconElement,
      { opacity: 0, scale: 0.8, rotation: -90 },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.5,
        delay: initialDelay + 0.1,
        ease: "back.out(1.7)",
      }
    )
  }

  // Focus expand animation
  if (expandOnFocus) {
    const originalWidth = "256px"
    inputElement.addEventListener("focus", () => {
      gsap.to(inputElement, {
        width: expandWidth,
        duration: 0.4,
        ease: "power2.out",
      })
      if (searchIconElement) {
        gsap.to(searchIconElement, {
          scale: 1.1,
          duration: 0.3,
          ease: "power2.out",
        })
      }
    })

    inputElement.addEventListener("blur", () => {
      gsap.to(inputElement, {
        width: originalWidth,
        duration: 0.4,
        ease: "power2.out",
      })
      if (searchIconElement) {
        gsap.to(searchIconElement, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        })
      }
    })
  }

  // Hover animation
  inputElement.addEventListener("mouseenter", () => {
    gsap.to(inputElement, {
      scale: 1.02,
      duration: 0.2,
      ease: "power2.out",
    })
  })

  inputElement.addEventListener("mouseleave", () => {
    gsap.to(inputElement, {
      scale: 1,
      duration: 0.2,
      ease: "power2.out",
    })
  })
}

/**
 * Reusable GSAP slide function with multiple variants
 */
export function gsapSlide(
  element: HTMLElement | null,
  variant: "slideIn" | "slideOut" | "slideLeft" | "slideRight" | "slideUp" | "slideDown",
  options: {
    duration?: number
    delay?: number
    ease?: string
    useScrollTrigger?: boolean
  } = {}
) {
  if (!element) return

  const { duration = 0.6, delay = 0, ease = "power3.out", useScrollTrigger = false } = options

  const variants = {
    slideIn: { from: { opacity: 0, scale: 0.9 }, to: { opacity: 1, scale: 1 } },
    slideOut: { from: { opacity: 1, scale: 1 }, to: { opacity: 0, scale: 0.9 } },
    slideLeft: { from: { x: 100, opacity: 0 }, to: { x: 0, opacity: 1 } },
    slideRight: { from: { x: -100, opacity: 0 }, to: { x: 0, opacity: 1 } },
    slideUp: { from: { y: 100, opacity: 0 }, to: { y: 0, opacity: 1 } },
    slideDown: { from: { y: -100, opacity: 0 }, to: { y: 0, opacity: 1 } },
  }

  const { from, to } = variants[variant]

  const animationProps: gsap.TweenVars = {
    ...to,
    duration,
    delay,
    ease,
  }

  if (useScrollTrigger) {
    animationProps.scrollTrigger = {
      trigger: element,
      start: "top 80%",
      toggleActions: "play none none none",
    }
  }

  return gsap.fromTo(element, from, animationProps)
}

