import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { initializeTables } from "@/lib/db/schema"
import { v4 as uuidv4 } from "uuid"
import { cookies } from "next/headers"

// Initialize tables on first use
let tablesInitialized = false

// Get or create session ID
async function getSessionId(): Promise<string> {
  const cookieStore = await cookies()
  let sessionId = cookieStore.get("session_id")?.value

  if (!sessionId) {
    sessionId = uuidv4()
    // Set cookie for 30 days
    cookieStore.set("session_id", sessionId, {
      maxAge: 30 * 24 * 60 * 60,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })
    
    // Create session in database
    if (!tablesInitialized) {
      await initializeTables()
      tablesInitialized = true
    }
    
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)
    
    await query(
      "INSERT INTO sessions (id, expires_at) VALUES (?, ?)",
      [sessionId, expiresAt.toISOString()]
    )
  }

  return sessionId
}

// GET /api/cart - Get cart items for current session
export async function GET() {
  try {
    if (!tablesInitialized) {
      await initializeTables()
      tablesInitialized = true
    }

    const sessionId = await getSessionId()

    const cartItems = await query(
      `SELECT 
        ci.id,
        ci.quantity,
        ci.selected_size_name,
        ci.selected_size_price,
        p.id as product_id,
        p.name,
        p.description,
        p.price,
        p.badge,
        p.in_stock,
        p.is_featured,
        p.is_new_arrival,
        p.is_festival,
        p.created_at,
        GROUP_CONCAT(pi.image_url ORDER BY pi.display_order SEPARATOR ',') as images,
        c.name as category_name,
        c.slug as category_slug
      FROM cart_items ci
      INNER JOIN products p ON ci.product_id = p.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ci.session_id = ?
      GROUP BY ci.id, p.id
      ORDER BY ci.created_at DESC`,
      [sessionId]
    )

    const items = cartItems.map((row: any) => {
      const images = row.images 
        ? row.images.split(',').filter((img: string) => img) 
        : ["/placeholder.svg"]

      return {
        id: row.id,
        product: {
          id: row.product_id,
          name: row.name,
          description: row.description || "",
          price: parseFloat(row.price),
          images: images,
          category: row.category_name || "",
          categoryId: row.category_name ? undefined : undefined,
          badge: row.badge || undefined,
          inStock: Boolean(row.in_stock),
          isFeatured: Boolean(row.is_featured),
          isNewArrival: Boolean(row.is_new_arrival),
          isFestival: Boolean(row.is_festival),
          createdAt: new Date(row.created_at).toISOString(),
        },
        quantity: row.quantity,
        selectedSize: row.selected_size_name
          ? {
              name: row.selected_size_name,
              price: parseFloat(row.selected_size_price),
            }
          : undefined,
      }
    })

    return NextResponse.json({ items })
  } catch (error: any) {
    console.error("Error fetching cart:", error)
    return NextResponse.json(
      { error: "Failed to fetch cart", details: error.message },
      { status: 500 }
    )
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    if (!tablesInitialized) {
      await initializeTables()
      tablesInitialized = true
    }

    const body = await request.json()
    const { productId, quantity = 1, selectedSize } = body

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    const sessionId = await getSessionId()

    // Check if product exists
    const products = await query("SELECT id, price FROM products WHERE id = ?", [productId])
    if (products.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Check if item already exists in cart
    const existingItems = await query(
      `SELECT id, quantity FROM cart_items 
       WHERE session_id = ? AND product_id = ? AND selected_size_name = ?`,
      [sessionId, productId, selectedSize?.name || null]
    )

    if (existingItems.length > 0) {
      // Update quantity
      const newQuantity = (existingItems[0] as any).quantity + quantity
      await query(
        "UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE id = ?",
        [newQuantity, (existingItems[0] as any).id]
      )
    } else {
      // Insert new cart item
      const sizePrice = selectedSize?.price || parseFloat((products[0] as any).price)
      await query(
        `INSERT INTO cart_items (id, session_id, product_id, quantity, selected_size_name, selected_size_price)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          uuidv4(),
          sessionId,
          productId,
          quantity,
          selectedSize?.name || null,
          selectedSize ? sizePrice : null,
        ]
      )
    }

    return NextResponse.json({ success: true, message: "Item added to cart" })
  } catch (error: any) {
    console.error("Error adding to cart:", error)
    return NextResponse.json(
      { error: "Failed to add to cart", details: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/cart - Remove item from cart or clear cart
export async function DELETE(request: NextRequest) {
  try {
    if (!tablesInitialized) {
      await initializeTables()
      tablesInitialized = true
    }

    const sessionId = await getSessionId()
    const searchParams = request.nextUrl.searchParams
    const itemId = searchParams.get("itemId")
    const clearAll = searchParams.get("clearAll") === "true"

    if (clearAll) {
      // Clear entire cart
      await query("DELETE FROM cart_items WHERE session_id = ?", [sessionId])
      return NextResponse.json({ success: true, message: "Cart cleared" })
    }

    if (itemId) {
      // Remove specific item
      await query("DELETE FROM cart_items WHERE id = ? AND session_id = ?", [itemId, sessionId])
      return NextResponse.json({ success: true, message: "Item removed from cart" })
    }

    return NextResponse.json(
      { error: "itemId or clearAll parameter required" },
      { status: 400 }
    )
  } catch (error: any) {
    console.error("Error removing from cart:", error)
    return NextResponse.json(
      { error: "Failed to remove from cart", details: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/cart - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    if (!tablesInitialized) {
      await initializeTables()
      tablesInitialized = true
    }

    const body = await request.json()
    const { itemId, quantity } = body

    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        { error: "itemId and quantity are required" },
        { status: 400 }
      )
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      const sessionId = await getSessionId()
      await query("DELETE FROM cart_items WHERE id = ? AND session_id = ?", [itemId, sessionId])
      return NextResponse.json({ success: true, message: "Item removed from cart" })
    }

    const sessionId = await getSessionId()
    await query(
      "UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE id = ? AND session_id = ?",
      [quantity, itemId, sessionId]
    )

    return NextResponse.json({ success: true, message: "Cart updated" })
  } catch (error: any) {
    console.error("Error updating cart:", error)
    return NextResponse.json(
      { error: "Failed to update cart", details: error.message },
      { status: 500 }
    )
  }
}

