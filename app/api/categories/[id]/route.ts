import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import type { Category } from "@/lib/types"

// GET /api/categories/[id] - Get a single category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const rows = await query("SELECT * FROM categories WHERE id = ?", [id])

    if (rows.length === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    const row: any = rows[0]
    const category: Category = {
      id: row.id,
      name: row.name,
      slug: row.slug,
      image: row.image || "",
      subcategories: row.subcategories ? JSON.parse(row.subcategories) : undefined,
    }

    return NextResponse.json(category)
  } catch (error: any) {
    console.error("Error fetching category:", error)
    return NextResponse.json(
      { error: "Failed to fetch category", details: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/categories/[id] - Update a category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await query("SELECT id FROM categories WHERE id = ?", [id])
    if (existing.length === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    const updates: string[] = []
    const values: any[] = []

    if (body.name !== undefined) {
      updates.push("name = ?")
      values.push(body.name)
    }
    if (body.slug !== undefined) {
      updates.push("slug = ?")
      values.push(body.slug)
    }
    if (body.image !== undefined) {
      updates.push("image = ?")
      values.push(body.image)
    }
    if (body.subcategories !== undefined) {
      updates.push("subcategories = ?")
      values.push(body.subcategories ? JSON.stringify(body.subcategories) : null)
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    values.push(id)
    await query(`UPDATE categories SET ${updates.join(", ")} WHERE id = ?`, values)

    const rows = await query("SELECT * FROM categories WHERE id = ?", [id])
    const row: any = rows[0]
    const category: Category = {
      id: row.id,
      name: row.name,
      slug: row.slug,
      image: row.image || "",
      subcategories: row.subcategories ? JSON.parse(row.subcategories) : undefined,
    }

    return NextResponse.json(category)
  } catch (error: any) {
    console.error("Error updating category:", error)
    return NextResponse.json(
      { error: "Failed to update category", details: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await query("SELECT id FROM categories WHERE id = ?", [id])
    if (existing.length === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    await query("DELETE FROM categories WHERE id = ?", [id])

    return NextResponse.json({ message: "Category deleted successfully" })
  } catch (error: any) {
    console.error("Error deleting category:", error)
    return NextResponse.json(
      { error: "Failed to delete category", details: error.message },
      { status: 500 }
    )
  }
}

