import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { initializeTables } from "@/lib/db/schema"
import type { Category } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

let tablesInitialized = false

// GET /api/categories - Get all categories
export async function GET() {
  try {
    if (!tablesInitialized) {
      await initializeTables()
      tablesInitialized = true
    }

    const rows = await query("SELECT * FROM categories ORDER BY name ASC")
    
    const categories: Category[] = rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      image: row.image || "",
      subcategories: row.subcategories ? JSON.parse(row.subcategories) : undefined,
    }))

    return NextResponse.json(categories)
  } catch (error: any) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories", details: error.message },
      { status: 500 }
    )
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    if (!tablesInitialized) {
      await initializeTables()
      tablesInitialized = true
    }

    const body = await request.json()
    const id = uuidv4()

    const category: Category = {
      id,
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, "-"),
      image: body.image || "",
      subcategories: body.subcategories,
    }

    await query(
      `INSERT INTO categories (id, name, slug, image, subcategories) VALUES (?, ?, ?, ?, ?)`,
      [
        category.id,
        category.name,
        category.slug,
        category.image,
        category.subcategories ? JSON.stringify(category.subcategories) : null,
      ]
    )

    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      { error: "Failed to create category", details: error.message },
      { status: 500 }
    )
  }
}

