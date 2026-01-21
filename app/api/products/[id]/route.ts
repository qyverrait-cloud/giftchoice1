import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import type { Product } from "@/lib/types"

// GET /api/products/[id] - Get a single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const rows = await query("SELECT * FROM products WHERE id = ?", [id])

    if (rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const row: any = rows[0]
    const product: Product = {
      id: row.id,
      name: row.name,
      description: row.description || "",
      price: parseFloat(row.price),
      images: JSON.parse(row.images || "[]"),
      category: row.category || "",
      subcategory: row.subcategory || undefined,
      sizes: row.sizes ? JSON.parse(row.sizes) : undefined,
      badge: row.badge || undefined,
      inStock: Boolean(row.inStock),
      isFeatured: Boolean(row.isFeatured),
      isNewArrival: Boolean(row.isNewArrival),
      isFestival: Boolean(row.isFestival),
      createdAt: new Date(row.createdAt).toISOString(),
    }

    return NextResponse.json(product)
  } catch (error: any) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: "Failed to fetch product", details: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Update a product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Check if product exists
    const existing = await query("SELECT id FROM products WHERE id = ?", [id])
    if (existing.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Build update query dynamically
    const updates: string[] = []
    const values: any[] = []

    if (body.name !== undefined) {
      updates.push("name = ?")
      values.push(body.name)
    }
    if (body.description !== undefined) {
      updates.push("description = ?")
      values.push(body.description)
    }
    if (body.price !== undefined) {
      updates.push("price = ?")
      values.push(parseFloat(body.price))
    }
    if (body.images !== undefined) {
      updates.push("images = ?")
      values.push(JSON.stringify(body.images))
    }
    if (body.category !== undefined) {
      updates.push("category = ?")
      values.push(body.category)
    }
    if (body.subcategory !== undefined) {
      updates.push("subcategory = ?")
      values.push(body.subcategory || null)
    }
    if (body.sizes !== undefined) {
      updates.push("sizes = ?")
      values.push(body.sizes ? JSON.stringify(body.sizes) : null)
    }
    if (body.badge !== undefined) {
      updates.push("badge = ?")
      values.push(body.badge || null)
    }
    if (body.inStock !== undefined) {
      updates.push("inStock = ?")
      values.push(Boolean(body.inStock))
    }
    if (body.isFeatured !== undefined) {
      updates.push("isFeatured = ?")
      values.push(Boolean(body.isFeatured))
    }
    if (body.isNewArrival !== undefined) {
      updates.push("isNewArrival = ?")
      values.push(Boolean(body.isNewArrival))
    }
    if (body.isFestival !== undefined) {
      updates.push("isFestival = ?")
      values.push(Boolean(body.isFestival))
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    values.push(id)
    await query(`UPDATE products SET ${updates.join(", ")} WHERE id = ?`, values)

    // Fetch updated product
    const rows = await query("SELECT * FROM products WHERE id = ?", [id])
    const row: any = rows[0]
    const product: Product = {
      id: row.id,
      name: row.name,
      description: row.description || "",
      price: parseFloat(row.price),
      images: JSON.parse(row.images || "[]"),
      category: row.category || "",
      subcategory: row.subcategory || undefined,
      sizes: row.sizes ? JSON.parse(row.sizes) : undefined,
      badge: row.badge || undefined,
      inStock: Boolean(row.inStock),
      isFeatured: Boolean(row.isFeatured),
      isNewArrival: Boolean(row.isNewArrival),
      isFestival: Boolean(row.isFestival),
      createdAt: new Date(row.createdAt).toISOString(),
    }

    return NextResponse.json(product)
  } catch (error: any) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      { error: "Failed to update product", details: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if product exists
    const existing = await query("SELECT id FROM products WHERE id = ?", [id])
    if (existing.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    await query("DELETE FROM products WHERE id = ?", [id])

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error: any) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { error: "Failed to delete product", details: error.message },
      { status: 500 }
    )
  }
}

