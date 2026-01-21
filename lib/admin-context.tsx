"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Product, ContactMessage, Order, Category, SocialMediaPost, PromotionalBanner } from "./types"
import { productsApi, categoriesApi } from "./api-client"

interface AdminContextType {
  products: Product[]
  categories: Category[]
  messages: ContactMessage[]
  orders: Order[]
  socialMediaPosts: SocialMediaPost[]
  promotionalBanners: PromotionalBanner[]
  isLoading: boolean
  addProduct: (product: Omit<Product, "id" | "createdAt">) => Promise<void>
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  addCategory: (category: Omit<Category, "id">) => Promise<void>
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  markMessageRead: (id: string) => void
  deleteMessage: (id: string) => void
  updateOrderStatus: (id: string, status: Order["status"]) => void
  addSocialMediaPost: (post: Omit<SocialMediaPost, "id" | "createdAt">) => void
  updateSocialMediaPost: (id: string, post: Partial<SocialMediaPost>) => void
  deleteSocialMediaPost: (id: string) => void
  addPromotionalBanner: (banner: Omit<PromotionalBanner, "id" | "createdAt">) => void
  updatePromotionalBanner: (id: string, banner: Partial<PromotionalBanner>) => void
  deletePromotionalBanner: (id: string) => void
  refreshProducts: () => Promise<void>
  refreshCategories: () => Promise<void>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [socialMediaPosts, setSocialMediaPosts] = useState<SocialMediaPost[]>([])
  const [promotionalBanners, setPromotionalBanners] = useState<PromotionalBanner[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load products and categories from API
  const loadProducts = async () => {
    try {
      const data = await productsApi.getAll()
      setProducts(data)
    } catch (error) {
      console.error("Error loading products:", error)
      setProducts([])
    }
  }

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getAll()
      setCategories(data)
    } catch (error) {
      console.error("Error loading categories:", error)
      setCategories([])
    }
  }

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await Promise.all([loadProducts(), loadCategories()])
      setIsLoading(false)
    }
    loadData()
  }, [])

  // Product operations - now using API
  const addProduct = async (product: Omit<Product, "id" | "createdAt">) => {
    try {
      const newProduct = await productsApi.create(product)
      setProducts((prev) => [...prev, newProduct])
    } catch (error) {
      console.error("Error adding product:", error)
      throw error
    }
  }

  const updateProduct = async (id: string, product: Partial<Product>) => {
    try {
      const updatedProduct = await productsApi.update(id, product)
      setProducts((prev) => prev.map((p) => (p.id === id ? updatedProduct : p)))
    } catch (error) {
      console.error("Error updating product:", error)
      throw error
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      await productsApi.delete(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (error) {
      console.error("Error deleting product:", error)
      throw error
    }
  }

  // Category operations - now using API
  const addCategory = async (category: Omit<Category, "id">) => {
    try {
      const newCategory = await categoriesApi.create(category)
      setCategories((prev) => [...prev, newCategory])
    } catch (error) {
      console.error("Error adding category:", error)
      throw error
    }
  }

  const updateCategory = async (id: string, category: Partial<Category>) => {
    try {
      const updatedCategory = await categoriesApi.update(id, category)
      setCategories((prev) => prev.map((c) => (c.id === id ? updatedCategory : c)))
    } catch (error) {
      console.error("Error updating category:", error)
      throw error
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      await categoriesApi.delete(id)
      setCategories((prev) => prev.filter((c) => c.id !== id))
    } catch (error) {
      console.error("Error deleting category:", error)
      throw error
    }
  }

  // Messages (still using localStorage for now, can be migrated to API later)
  const markMessageRead = (id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)))
    if (typeof window !== "undefined") {
      localStorage.setItem("contactMessages", JSON.stringify(messages))
    }
  }

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id))
    if (typeof window !== "undefined") {
      localStorage.setItem("contactMessages", JSON.stringify(messages))
    }
  }

  // Orders (still using localStorage for now)
  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
    if (typeof window !== "undefined") {
      localStorage.setItem("adminOrders", JSON.stringify(orders))
    }
  }

  // Social media posts (still using localStorage for now)
  const addSocialMediaPost = (post: Omit<SocialMediaPost, "id" | "createdAt">) => {
    const newPost: SocialMediaPost = {
      ...post,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setSocialMediaPosts((prev) => [...prev, newPost].sort((a, b) => a.order - b.order))
    if (typeof window !== "undefined") {
      localStorage.setItem("adminSocialMediaPosts", JSON.stringify(socialMediaPosts))
    }
  }

  const updateSocialMediaPost = (id: string, post: Partial<SocialMediaPost>) => {
    setSocialMediaPosts((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, ...post } : p))
        .sort((a, b) => a.order - b.order)
    )
    if (typeof window !== "undefined") {
      localStorage.setItem("adminSocialMediaPosts", JSON.stringify(socialMediaPosts))
    }
  }

  const deleteSocialMediaPost = (id: string) => {
    setSocialMediaPosts((prev) => prev.filter((p) => p.id !== id))
    if (typeof window !== "undefined") {
      localStorage.setItem("adminSocialMediaPosts", JSON.stringify(socialMediaPosts))
    }
  }

  // Promotional banners (still using localStorage for now)
  const addPromotionalBanner = (banner: Omit<PromotionalBanner, "id" | "createdAt">) => {
    const newBanner: PromotionalBanner = {
      ...banner,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setPromotionalBanners((prev) => [...prev, newBanner].sort((a, b) => a.order - b.order))
    if (typeof window !== "undefined") {
      localStorage.setItem("adminPromotionalBanners", JSON.stringify(promotionalBanners))
    }
  }

  const updatePromotionalBanner = (id: string, banner: Partial<PromotionalBanner>) => {
    setPromotionalBanners((prev) =>
      prev
        .map((b) => (b.id === id ? { ...b, ...banner } : b))
        .sort((a, b) => a.order - b.order)
    )
    if (typeof window !== "undefined") {
      localStorage.setItem("adminPromotionalBanners", JSON.stringify(promotionalBanners))
    }
  }

  const deletePromotionalBanner = (id: string) => {
    setPromotionalBanners((prev) => prev.filter((b) => b.id !== id))
    if (typeof window !== "undefined") {
      localStorage.setItem("adminPromotionalBanners", JSON.stringify(promotionalBanners))
    }
  }

  // Refresh functions
  const refreshProducts = async () => {
    await loadProducts()
  }

  const refreshCategories = async () => {
    await loadCategories()
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
        isLoading,
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
        refreshProducts,
        refreshCategories,
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
