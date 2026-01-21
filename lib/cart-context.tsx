"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { CartItem, Product, ProductSize } from "./types"
import { cartApi } from "./api-client"

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, quantity?: number, selectedSize?: ProductSize) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  totalItems: number
  totalPrice: number
  isLoading: boolean
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load cart from API
  const loadCart = async () => {
    try {
      setIsLoading(true)
      const data = await cartApi.get()
      setItems(data.items || [])
    } catch (error) {
      console.error("Error loading cart:", error)
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }

  // Load cart on mount
  useEffect(() => {
    loadCart()
  }, [])

  const addToCart = async (product: Product, quantity = 1, selectedSize?: ProductSize) => {
    try {
      await cartApi.add(product.id, quantity, selectedSize)
      await loadCart() // Refresh cart after adding
    } catch (error) {
      console.error("Error adding to cart:", error)
      throw error
    }
  }

  const removeFromCart = async (itemId: string) => {
    try {
      await cartApi.remove(itemId)
      await loadCart() // Refresh cart after removing
    } catch (error) {
      console.error("Error removing from cart:", error)
      throw error
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      await cartApi.update(itemId, quantity)
      await loadCart() // Refresh cart after updating
    } catch (error) {
      console.error("Error updating cart:", error)
      throw error
    }
  }

  const clearCart = async () => {
    try {
      await cartApi.clear()
      await loadCart() // Refresh cart after clearing
    } catch (error) {
      console.error("Error clearing cart:", error)
      throw error
    }
  }

  const refreshCart = async () => {
    await loadCart()
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const totalPrice = items.reduce((sum, item) => {
    const price = item.selectedSize?.price || item.product.price
    return sum + price * item.quantity
  }, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isLoading,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
