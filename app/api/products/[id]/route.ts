import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { initializeTables } from "@/lib/db/schema"
import type { Product } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

let tablesInitialized = false

// GET /api/products/[id] - Get a single product with images and category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!tablesInitialized) {
      await initializeTables()
      tablesInitialized = true
    }

    const { id } = await params
    
    const rows = await query(
      `SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.category_id,
        p.subcategory,
        p.sizes,
        p.badge,
        p.in_stock as inStock,
        p.is_featured as isFeatured,
        p.is_new_arrival as isNewArrival,
        p.is_festival as isFestival,
        p.created_at as createdAt,
        c.name as category_name,
        c.slug as category_slug,
        GROUP_CONCAT(pi.image_url ORDER BY pi.display_order SEPARATOR ',') as images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE p.id = ?
      GROUP BY p.id`,
      [id]
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const row: any = rows[0]
    const images = row.images 
      ? row.images.split(',').filter((img: string) => img) 
      : ["/placeholder.svg"]

    const product: Product = {
      id: row.id,
      name: row.name,
      description: row.description || "",
      price: parseFloat(row.price),
      images: images,
      category: row.category_name || row.category_id || "",
      categoryId: row.category_id || undefined,
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
    if (!tablesInitialized) {
      await initializeTables()
      tablesInitialized = true
    }

    const { id } = await params
    const body = await request.json()

    // Check if product exists
    const existing = await query("SELECT id FROM products WHERE id = ?", [id])
    if (existing.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Get category_id from category slug/name if provided
    let categoryId = body.categoryId || body.category_id
    if (!categoryId && body.category) {
      const categoryRows = await query(
        "SELECT id FROM categories WHERE slug = ? OR name = ? LIMIT 1",
        [body.category, body.category]
      )
      if (categoryRows.length > 0) {
        categoryId = (categoryRows[0] as any).id
      }
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
    if (body.categoryId !== undefined || categoryId !== undefined) {
      updates.push("category_id = ?")
      values.push(categoryId || body.categoryId || null)
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
      updates.push("in_stock = ?")
      values.push(Boolean(body.inStock))
    }
    if (body.isFeatured !== undefined) {
      updates.push("is_featured = ?")
      values.push(Boolean(body.isFeatured))
    }
    if (body.isNewArrival !== undefined) {
      updates.push("is_new_arrival = ?")
      values.push(Boolean(body.isNewArrival))
    }
    if (body.isFestival !== undefined) {
      updates.push("is_festival = ?")
      values.push(Boolean(body.isFestival))
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    values.push(id)
    await query(`UPDATE products SET ${updates.join(", ")} WHERE id = ?`, values)

    // Update images if provided
    if (body.images && Array.isArray(body.images)) {
      // Delete existing images
      await query("DELETE FROM product_images WHERE product_id = ?", [id])
      
      // Insert new images
      for (let i = 0; i < body.images.length; i++) {
        await query(
          "INSERT INTO product_images (id, product_id, image_url, display_order) VALUES (?, ?, ?, ?)",
          [uuidv4(), id, body.images[i], i]
        )
      }
    }

    // Fetch updated product with images
    const productRows = await query(
      `SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        GROUP_CONCAT(pi.image_url ORDER BY pi.display_order SEPARATOR ',') as images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE p.id = ?
      GROUP BY p.id`,
      [id]
    )

    if (productRows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const row: any = productRows[0]
    const images = row.images 
      ? row.images.split(',').filter((img: string) => img) 
      : ["/placeholder.svg"]

    const product: Product = {
      id: row.id,
      name: row.name,
      description: row.description || "",
      price: parseFloat(row.price),
      images: images,
      category: row.category_name || row.category_id || "",
      categoryId: row.category_id || undefined,
      subcategory: row.subcategory || undefined,
      sizes: row.sizes ? JSON.parse(row.sizes) : undefined,
      badge: row.badge || undefined,
      inStock: Boolean(row.in_stock),
      isFeatured: Boolean(row.is_featured),
      isNewArrival: Boolean(row.is_new_arrival),
      isFestival: Boolean(row.is_festival),
      createdAt: new Date(row.created_at).toISOString(),
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
    if (!tablesInitialized) {
      await initializeTables()
      tablesInitialized = true
    }

    const { id } = await params

    // Check if product exists
    const existing = await query("SELECT id FROM products WHERE id = ?", [id])
    if (existing.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Delete product (images will be deleted automatically due to CASCADE)
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
