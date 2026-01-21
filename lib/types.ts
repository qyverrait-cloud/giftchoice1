export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string // Category name (for backward compatibility)
  categoryId?: string // Category ID (for proper relationships)
  subcategory?: string
  sizes?: ProductSize[]
  badge?: string
  inStock: boolean
  isFeatured?: boolean
  isNewArrival?: boolean
  isFestival?: boolean
  createdAt: string
}

export interface ProductSize {
  name: string
  price: number
}

export interface CartItem {
  product: Product
  quantity: number
  selectedSize?: ProductSize
}

export interface Category {
  id: string
  name: string
  slug: string
  image: string
  subcategories?: { name: string; slug: string }[]
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  createdAt: string
  isRead: boolean
}

export interface Order {
  id: string
  items: CartItem[]
  customerName: string
  customerPhone: string
  total: number
  status: "pending" | "confirmed" | "delivered"
  createdAt: string
}

export interface ProductReview {
  id: string
  productId: string
  customerName: string
  rating: number
  comment: string
  createdAt: string
}

export interface SocialMediaPost {
  id: string
  thumbnail: string
  title: string
  link?: string
  videoLink?: string
  platform?: "instagram" | "youtube" | "facebook" | "tiktok"
  isActive: boolean
  createdAt: string
  order: number
}

export interface PromotionalBanner {
  id: string
  image: string
  title: string
  link?: string
  isActive: boolean
  order: number
  createdAt: string
}
