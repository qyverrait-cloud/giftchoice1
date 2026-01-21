"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import type { Product, Category, Order, ContactMessage, SocialMediaPost, PromotionalBanner } from "@/lib/types"
import { productsApi, categoriesApi, ordersApi, messagesApi, bannersApi, socialMediaApi } from "@/lib/api-client"

interface AdminContextType {
  // Data
  products: Product[]
  categories: Category[]
  orders: Order[]
  messages: ContactMessage[]
  banners: PromotionalBanner[]
  socialMediaPosts: SocialMediaPost[]
  
  // Loading states
  isLoading: boolean
  
  // Product operations
  addProduct: (product: Partial<Product>) => Promise<Product>
  updateProduct: (id: string, product: Partial<Product>) => Promise<Product>
  deleteProduct: (id: string) => Promise<void>
  refreshProducts: () => Promise<void>
  
  // Category operations
  addCategory: (category: Partial<Category>) => Promise<Category>
  updateCategory: (id: string, category: Partial<Category>) => Promise<Category>
  deleteCategory: (id: string) => Promise<void>
  refreshCategories: () => Promise<void>
  
  // Order operations
  updateOrderStatus: (id: string, status: Order["status"]) => Promise<Order>
  refreshOrders: () => Promise<void>
  
  // Message operations
  markMessageAsRead: (id: string) => Promise<void>
  deleteMessage: (id: string) => Promise<void>
  refreshMessages: () => Promise<void>
  
  // Banner operations
  addBanner: (banner: Partial<PromotionalBanner>) => Promise<PromotionalBanner>
  updateBanner: (id: string, banner: Partial<PromotionalBanner>) => Promise<PromotionalBanner>
  deleteBanner: (id: string) => Promise<void>
  refreshBanners: () => Promise<void>
  
  // Social Media operations
  addSocialMediaPost: (post: Partial<SocialMediaPost>) => Promise<SocialMediaPost>
  updateSocialMediaPost: (id: string, post: Partial<SocialMediaPost>) => Promise<SocialMediaPost>
  deleteSocialMediaPost: (id: string) => Promise<void>
  refreshSocialMediaPosts: () => Promise<void>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [banners, setBanners] = useState<PromotionalBanner[]>([])
  const [socialMediaPosts, setSocialMediaPosts] = useState<SocialMediaPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load all data on mount
  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      setIsLoading(true)
      const [productsData, categoriesData, ordersData, messagesData, bannersData, socialMediaData] = await Promise.all([
        productsApi.getAll().catch(() => []),
        categoriesApi.getAll().catch(() => []),
        ordersApi.getAll().catch(() => []),
        messagesApi.getAll().catch(() => []),
        bannersApi.getAll().catch(() => []),
        socialMediaApi.getAll().catch(() => []),
      ])
      
      setProducts(productsData)
      setCategories(categoriesData)
      setOrders(ordersData)
      setMessages(messagesData)
      setBanners(bannersData)
      setSocialMediaPosts(socialMediaData)
    } catch (error) {
      console.error("Error loading admin data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Product operations
  const addProduct = async (product: Partial<Product>): Promise<Product> => {
    const newProduct = await productsApi.create(product)
    setProducts((prev) => [newProduct, ...prev])
    return newProduct
  }

  const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
    const updated = await productsApi.update(id, product)
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)))
    return updated
  }

  const deleteProduct = async (id: string): Promise<void> => {
    await productsApi.delete(id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const refreshProducts = async (): Promise<void> => {
    const data = await productsApi.getAll()
    setProducts(data)
  }

  // Category operations
  const addCategory = async (category: Partial<Category>): Promise<Category> => {
    const newCategory = await categoriesApi.create(category)
    setCategories((prev) => [newCategory, ...prev])
    return newCategory
  }

  const updateCategory = async (id: string, category: Partial<Category>): Promise<Category> => {
    const updated = await categoriesApi.update(id, category)
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)))
    return updated
  }

  const deleteCategory = async (id: string): Promise<void> => {
    await categoriesApi.delete(id)
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  const refreshCategories = async (): Promise<void> => {
    const data = await categoriesApi.getAll()
    setCategories(data)
  }

  // Order operations
  const updateOrderStatus = async (id: string, status: Order["status"]): Promise<Order> => {
    const updated = await ordersApi.update(id, { status })
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)))
    return updated
  }

  const refreshOrders = async (): Promise<void> => {
    const data = await ordersApi.getAll()
    setOrders(data)
  }

  // Message operations
  const markMessageAsRead = async (id: string): Promise<void> => {
    await messagesApi.update(id, { isRead: true })
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)))
  }

  const deleteMessage = async (id: string): Promise<void> => {
    await messagesApi.delete(id)
    setMessages((prev) => prev.filter((m) => m.id !== id))
  }

  const refreshMessages = async (): Promise<void> => {
    const data = await messagesApi.getAll()
    setMessages(data)
  }

  // Banner operations
  const addBanner = async (banner: Partial<PromotionalBanner>): Promise<PromotionalBanner> => {
    const newBanner = await bannersApi.create(banner)
    setBanners((prev) => [newBanner, ...prev])
    return newBanner
  }

  const updateBanner = async (id: string, banner: Partial<PromotionalBanner>): Promise<PromotionalBanner> => {
    const updated = await bannersApi.update(id, banner)
    setBanners((prev) => prev.map((b) => (b.id === id ? updated : b)))
    return updated
  }

  const deleteBanner = async (id: string): Promise<void> => {
    await bannersApi.delete(id)
    setBanners((prev) => prev.filter((b) => b.id !== id))
  }

  const refreshBanners = async (): Promise<void> => {
    const data = await bannersApi.getAll()
    setBanners(data)
  }

  // Social Media operations
  const addSocialMediaPost = async (post: Partial<SocialMediaPost>): Promise<SocialMediaPost> => {
    const newPost = await socialMediaApi.create(post)
    setSocialMediaPosts((prev) => [newPost, ...prev])
    return newPost
  }

  const updateSocialMediaPost = async (id: string, post: Partial<SocialMediaPost>): Promise<SocialMediaPost> => {
    const updated = await socialMediaApi.update(id, post)
    setSocialMediaPosts((prev) => prev.map((p) => (p.id === id ? updated : p)))
    return updated
  }

  const deleteSocialMediaPost = async (id: string): Promise<void> => {
    await socialMediaApi.delete(id)
    setSocialMediaPosts((prev) => prev.filter((p) => p.id !== id))
  }

  const refreshSocialMediaPosts = async (): Promise<void> => {
    const data = await socialMediaApi.getAll()
    setSocialMediaPosts(data)
  }

  return (
    <AdminContext.Provider
      value={{
        products,
        categories,
        orders,
        messages,
        banners,
        socialMediaPosts,
        isLoading,
        addProduct,
        updateProduct,
        deleteProduct,
        refreshProducts,
        addCategory,
        updateCategory,
        deleteCategory,
        refreshCategories,
        updateOrderStatus,
        refreshOrders,
        markMessageAsRead,
        deleteMessage,
        refreshMessages,
        addBanner,
        updateBanner,
        deleteBanner,
        refreshBanners,
        addSocialMediaPost,
        updateSocialMediaPost,
        deleteSocialMediaPost,
        refreshSocialMediaPosts,
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

