import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { initializeTables } from "@/lib/db/schema"
import type { Product } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

// Initialize tables on first use
let tablesInitialized = false

// GET /api/products - Get all products with proper category relationships
export async function GET(request: NextRequest) {
  try {
    if (!tablesInitialized) {
      await initializeTables()
      tablesInitialized = true
    }

    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category") // Can be category slug or category_id
    const categoryId = searchParams.get("categoryId")
    const featured = searchParams.get("featured")
    const newArrival = searchParams.get("newArrival")
    const festival = searchParams.get("festival")
    const search = searchParams.get("search")
    const inStock = searchParams.get("inStock")

    // Build query with JOIN to get category info
    let sql = `
      SELECT 
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
      WHERE 1=1
    `
    const params: any[] = []

    if (categoryId) {
      sql += " AND p.category_id = ?"
      params.push(categoryId)
    } else if (category) {
      // Support both slug and category name
      sql += " AND (c.slug = ? OR c.name = ? OR p.category_id = ?)"
      params.push(category, category, category)
    }

    if (featured === "true") {
      sql += " AND p.is_featured = true"
    }

    if (newArrival === "true") {
      sql += " AND p.is_new_arrival = true"
    }

    if (festival === "true") {
      sql += " AND p.is_festival = true"
    }

    if (inStock === "true") {
      sql += " AND p.in_stock = true"
    }

    if (search) {
      sql += " AND (p.name LIKE ? OR p.description LIKE ?)"
      params.push(`%${search}%`, `%${search}%`)
    }

    sql += " GROUP BY p.id ORDER BY p.created_at DESC"

    const rows = await query(sql, params)
    
    // Parse JSON fields and format response
    const products: Product[] = rows.map((row: any) => {
      const images = row.images 
        ? row.images.split(',').filter((img: string) => img) 
        : []
      
      return {
        id: row.id,
        name: row.name,
        description: row.description || "",
        price: parseFloat(row.price),
        images: images.length > 0 ? images : ["/placeholder.svg"],
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
    })

    return NextResponse.json(products)
  } catch (error: any) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message },
      { status: 500 }
    )
  }
}

// POST /api/products - Create a new product (Admin only)
export async function POST(request: NextRequest) {
  try {
    if (!tablesInitialized) {
      await initializeTables()
      tablesInitialized = true
    }

    const body = await request.json()
    const id = uuidv4()
    const now = new Date().toISOString()

    // Validate required fields
    if (!body.name || !body.price) {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 }
      )
    }

    // Get category_id from category slug/name if provided
    let categoryId = body.categoryId || body.category_id
    if (!categoryId && body.category) {
      // Try to find category by slug or name
      const categoryRows = await query(
        "SELECT id FROM categories WHERE slug = ? OR name = ? LIMIT 1",
        [body.category, body.category]
      )
      if (categoryRows.length > 0) {
        categoryId = (categoryRows[0] as any).id
      }
    }

    // Insert product
    await query(
      `INSERT INTO products (
        id, name, description, price, category_id, subcategory,
        sizes, badge, in_stock, is_featured, is_new_arrival, is_festival, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        body.name,
        body.description || null,
        parseFloat(body.price),
        categoryId || null,
        body.subcategory || null,
        body.sizes ? JSON.stringify(body.sizes) : null,
        body.badge || null,
        body.inStock !== undefined ? Boolean(body.inStock) : true,
        Boolean(body.isFeatured),
        Boolean(body.isNewArrival),
        Boolean(body.isFestival),
        now,
      ]
    )

    // Insert product images
    if (body.images && Array.isArray(body.images) && body.images.length > 0) {
      const imageInserts = body.images.map((imageUrl: string, index: number) => [
        uuidv4(),
        id,
        imageUrl,
        index,
      ])
      
      for (const imageData of imageInserts) {
        await query(
          "INSERT INTO product_images (id, product_id, image_url, display_order) VALUES (?, ?, ?, ?)",
          imageData
        )
      }
    }

    // Fetch created product with images
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
      return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
    }

    const row: any = productRows[0]
    const images = row.images 
      ? row.images.split(',').filter((img: string) => img) 
      : []

    const product: Product = {
      id: row.id,
      name: row.name,
      description: row.description || "",
      price: parseFloat(row.price),
      images: images.length > 0 ? images : ["/placeholder.svg"],
      category: row.category_name || "",
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

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { error: "Failed to create product", details: error.message },
      { status: 500 }
    )
  }
}
