import { NextRequest, NextResponse } from "next/server"
import { query, transaction } from "@/lib/db"
import { initializeTables } from "@/lib/db/schema"
import type { Product } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

// Initialize tables on first use
let tablesInitialized = false

// GET /api/products - Get all products
export async function GET(request: NextRequest) {
  try {
    if (!tablesInitialized) {
      await initializeTables()
      tablesInitialized = true
    }

    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const newArrival = searchParams.get("newArrival")
    const festival = searchParams.get("festival")
    const search = searchParams.get("search")

    let sql = "SELECT * FROM products WHERE 1=1"
    const params: any[] = []

    if (category) {
      sql += " AND category = ?"
      params.push(category)
    }

    if (featured === "true") {
      sql += " AND isFeatured = true"
    }

    if (newArrival === "true") {
      sql += " AND isNewArrival = true"
    }

    if (festival === "true") {
      sql += " AND isFestival = true"
    }

    if (search) {
      sql += " AND (name LIKE ? OR description LIKE ?)"
      params.push(`%${search}%`, `%${search}%`)
    }

    sql += " ORDER BY createdAt DESC"

    const rows = await query(sql, params)
    
    // Parse JSON fields
    const products: Product[] = rows.map((row: any) => ({
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
    }))

    return NextResponse.json(products)
  } catch (error: any) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message },
      { status: 500 }
    )
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    if (!tablesInitialized) {
      await initializeTables()
      tablesInitialized = true
    }

    const body = await request.json()
    const id = uuidv4()
    const now = new Date().toISOString()

    const product: Product = {
      id,
      name: body.name,
      description: body.description || "",
      price: parseFloat(body.price),
      images: body.images || [],
      category: body.category || "",
      subcategory: body.subcategory,
      sizes: body.sizes,
      badge: body.badge,
      inStock: body.inStock !== undefined ? Boolean(body.inStock) : true,
      isFeatured: Boolean(body.isFeatured),
      isNewArrival: Boolean(body.isNewArrival),
      isFestival: Boolean(body.isFestival),
      createdAt: now,
    }

    await query(
      `INSERT INTO products (
        id, name, description, price, images, category, subcategory,
        sizes, badge, inStock, isFeatured, isNewArrival, isFestival, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product.id,
        product.name,
        product.description,
        product.price,
        JSON.stringify(product.images),
        product.category,
        product.subcategory || null,
        product.sizes ? JSON.stringify(product.sizes) : null,
        product.badge || null,
        product.inStock,
        product.isFeatured,
        product.isNewArrival,
        product.isFestival,
        product.createdAt,
      ]
    )

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { error: "Failed to create product", details: error.message },
      { status: 500 }
    )
  }
}

