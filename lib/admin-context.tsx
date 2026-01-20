"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Product, ContactMessage, Order, Category, SocialMediaPost, PromotionalBanner } from "./types"
import { products as initialProducts, categories as initialCategories } from "./mock-data"

interface AdminContextType {
  products: Product[]
  categories: Category[]
  messages: ContactMessage[]
  orders: Order[]
  socialMediaPosts: SocialMediaPost[]
  promotionalBanners: PromotionalBanner[]
  addProduct: (product: Omit<Product, "id" | "createdAt">) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  addCategory: (category: Omit<Category, "id">) => void
  updateCategory: (id: string, category: Partial<Category>) => void
  deleteCategory: (id: string) => void
  markMessageRead: (id: string) => void
  deleteMessage: (id: string) => void
  updateOrderStatus: (id: string, status: Order["status"]) => void
  addSocialMediaPost: (post: Omit<SocialMediaPost, "id" | "createdAt">) => void
  updateSocialMediaPost: (id: string, post: Partial<SocialMediaPost>) => void
  deleteSocialMediaPost: (id: string) => void
  addPromotionalBanner: (banner: Omit<PromotionalBanner, "id" | "createdAt">) => void
  updatePromotionalBanner: (id: string, banner: Partial<PromotionalBanner>) => void
  deletePromotionalBanner: (id: string) => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

const initialSocialMediaPosts: SocialMediaPost[] = [
  { id: "1", thumbnail: "/placeholder.svg?height=400&width=300", title: "Unboxing Surprise", isActive: true, createdAt: new Date().toISOString(), order: 1 },
  { id: "2", thumbnail: "/placeholder.svg?height=400&width=300", title: "Gift Wrapping Ideas", isActive: true, createdAt: new Date().toISOString(), order: 2 },
  { id: "3", thumbnail: "/placeholder.svg?height=400&width=300", title: "Birthday Surprise", isActive: true, createdAt: new Date().toISOString(), order: 3 },
  { id: "4", thumbnail: "/placeholder.svg?height=400&width=300", title: "Anniversary Special", isActive: true, createdAt: new Date().toISOString(), order: 4 },
  { id: "5", thumbnail: "/placeholder.svg?height=400&width=300", title: "Custom Gifts", isActive: true, createdAt: new Date().toISOString(), order: 5 },
  { id: "6", thumbnail: "/placeholder.svg?height=400&width=300", title: "Festival Decor", isActive: true, createdAt: new Date().toISOString(), order: 6 },
]

const initialPromotionalBanners: PromotionalBanner[] = [
  {
    id: "1",
    image: "/placeholder.svg?height=400&width=800",
    title: "Valentine's Special Offer",
    link: "/shop?festival=valentine",
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    image: "/placeholder.svg?height=400&width=800",
    title: "Birthday Celebration Sale",
    link: "/shop?category=birthday-gifts",
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString(),
  },
]

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [socialMediaPosts, setSocialMediaPosts] = useState<SocialMediaPost[]>(initialSocialMediaPosts)
  const [promotionalBanners, setPromotionalBanners] = useState<PromotionalBanner[]>(initialPromotionalBanners)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem("adminProducts")
    const savedCategories = localStorage.getItem("adminCategories")
    const savedMessages = localStorage.getItem("contactMessages")
    const savedOrders = localStorage.getItem("adminOrders")
    const savedSocialMediaPosts = localStorage.getItem("adminSocialMediaPosts")
    const savedPromotionalBanners = localStorage.getItem("adminPromotionalBanners")

    if (savedProducts) setProducts(JSON.parse(savedProducts))
    if (savedCategories) setCategories(JSON.parse(savedCategories))
    if (savedMessages) setMessages(JSON.parse(savedMessages))
    if (savedOrders) setOrders(JSON.parse(savedOrders))
    if (savedSocialMediaPosts) setSocialMediaPosts(JSON.parse(savedSocialMediaPosts))
    if (savedPromotionalBanners) setPromotionalBanners(JSON.parse(savedPromotionalBanners))

    setIsLoaded(true)
  }, [])

  // Save data to localStorage when it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("adminProducts", JSON.stringify(products))
      localStorage.setItem("adminCategories", JSON.stringify(categories))
      localStorage.setItem("contactMessages", JSON.stringify(messages))
      localStorage.setItem("adminOrders", JSON.stringify(orders))
      localStorage.setItem("adminSocialMediaPosts", JSON.stringify(socialMediaPosts))
      localStorage.setItem("adminPromotionalBanners", JSON.stringify(promotionalBanners))
    }
  }, [products, categories, messages, orders, socialMediaPosts, promotionalBanners, isLoaded])

  const addProduct = (product: Omit<Product, "id" | "createdAt">) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setProducts((prev) => [...prev, newProduct])
  }

  const updateProduct = (id: string, product: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...product } : p)))
  }

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    }
    setCategories((prev) => [...prev, newCategory])
  }

  const updateCategory = (id: string, category: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...category } : c)))
  }

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  const markMessageRead = (id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)))
  }

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id))
  }

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
  }

  const addSocialMediaPost = (post: Omit<SocialMediaPost, "id" | "createdAt">) => {
    const newPost: SocialMediaPost = {
      ...post,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setSocialMediaPosts((prev) => [...prev, newPost].sort((a, b) => a.order - b.order))
  }

  const updateSocialMediaPost = (id: string, post: Partial<SocialMediaPost>) => {
    setSocialMediaPosts((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, ...post } : p))
        .sort((a, b) => a.order - b.order)
    )
  }

  const deleteSocialMediaPost = (id: string) => {
    setSocialMediaPosts((prev) => prev.filter((p) => p.id !== id))
  }

  const addPromotionalBanner = (banner: Omit<PromotionalBanner, "id" | "createdAt">) => {
    const newBanner: PromotionalBanner = {
      ...banner,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setPromotionalBanners((prev) => [...prev, newBanner].sort((a, b) => a.order - b.order))
  }

  const updatePromotionalBanner = (id: string, banner: Partial<PromotionalBanner>) => {
    setPromotionalBanners((prev) =>
      prev
        .map((b) => (b.id === id ? { ...b, ...banner } : b))
        .sort((a, b) => a.order - b.order)
    )
  }

  const deletePromotionalBanner = (id: string) => {
    setPromotionalBanners((prev) => prev.filter((b) => b.id !== id))
  }

  return (
    <AdminContext.Provider
      value={{
        products,
        categories,
        messages,
        orders,
        socialMediaPosts,
        promotionalBanners,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        markMessageRead,
        deleteMessage,
        updateOrderStatus,
        addSocialMediaPost,
        updateSocialMediaPost,
        deleteSocialMediaPost,
        addPromotionalBanner,
        updatePromotionalBanner,
        deletePromotionalBanner,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
