"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"

// WhatsApp number for checkout
const WHATSAPP_NUMBER = "919799964364" // Format: country code + number (91 for India)

function CartContent() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()

  const generateWhatsAppMessage = () => {
    let message = "Hi! I would like to order the following items:\n\n"

    items.forEach((item, index) => {
      const price = item.selectedSize?.price || item.product.price
      message += `${index + 1}. ${item.product.name}`
      if (item.selectedSize) {
        message += ` (${item.selectedSize.name})`
      }
      message += `\n   Qty: ${item.quantity} × ₹${price} = ₹${price * item.quantity}\n\n`
    })

    message += `Total Amount: ₹${totalPrice}\n\n`
    message += "Please confirm my order. Thank you!"

    return encodeURIComponent(message)
  }

  const handleCheckout = () => {
    const message = generateWhatsAppMessage()
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank")
  }

  if (items.length === 0) {
    return (
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="font-serif text-2xl font-semibold text-foreground mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">
              Looks like you haven&#39;t added anything to your cart yet. Start shopping to fill it up!
            </p>
            <Link href="/shop">
              <Button size="lg" className="gap-2">
                Start Shopping
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1">
      <div className="bg-secondary py-8">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">Shopping Cart</h1>
          <p className="text-muted-foreground mt-2">{items.length} item(s) in your cart</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const price = item.selectedSize?.price || item.product.price

              return (
                <div
                  key={`${item.product.id}-${item.selectedSize?.name}`}
                  className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-xl border border-border"
                >
                  <Link href={`/product/${item.product.id}`} className="flex-shrink-0 mx-auto sm:mx-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={item.product.images[0] || "/placeholder.svg"}
                        alt={item.product.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.product.id}`}>
                      <h3 className="font-medium text-foreground hover:text-primary transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>
                    {item.selectedSize && (
                      <p className="text-sm text-muted-foreground mt-1">Size: {item.selectedSize.name}</p>
                    )}
                    <p className="font-semibold text-foreground mt-2">₹{price}</p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive h-8 w-8"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex sm:hidden items-center justify-between pt-2 border-t border-border sm:border-0">
                    <span className="text-sm text-muted-foreground">Total:</span>
                    <p className="font-semibold text-foreground">₹{price * item.quantity}</p>
                  </div>
                  <div className="hidden sm:block text-right">
                    <p className="font-semibold text-foreground">₹{price * item.quantity}</p>
                  </div>
                </div>
              )
            })}

            <Button
              variant="outline"
              onClick={clearCart}
              className="text-destructive hover:text-destructive bg-transparent"
            >
              Clear Cart
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-4 md:p-6 sticky top-20 md:top-24">
              <h2 className="font-semibold text-lg text-foreground mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-border my-4" />

              <div className="flex justify-between font-semibold text-lg mb-6">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">₹{totalPrice}</span>
              </div>

              {/* Promo Code */}
              <div className="flex gap-2 mb-6">
                <Input placeholder="Promo code" className="flex-1" />
                <Button variant="outline" className="bg-transparent">
                  Apply
                </Button>
              </div>

              <Button size="lg" className="w-full gap-2 text-base md:text-lg py-6 md:py-7" onClick={handleCheckout}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Checkout via WhatsApp
                <ArrowRight className="h-4 w-4" />
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Your order details will be sent to WhatsApp for confirmation
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function CartPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CartContent />
      <Footer />
    </div>
  )
}
