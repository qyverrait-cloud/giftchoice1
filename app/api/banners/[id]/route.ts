import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import type { PromotionalBanner } from "@/lib/types"

// GET /api/banners/[id] - Get a single banner
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const rows = await query("SELECT * FROM promotional_banners WHERE id = ?", [id])

    if (rows.length === 0) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 })
    }

    const row: any = rows[0]
    const banner: PromotionalBanner = {
      id: row.id,
      image: row.image || "",
      title: row.title || "",
      link: row.link || undefined,
      isActive: Boolean(row.is_active),
      order: row.display_order || 0,
      createdAt: new Date(row.created_at).toISOString(),
    }

    return NextResponse.json(banner)
  } catch (error: any) {
    console.error("Error fetching banner:", error)
    return NextResponse.json(
      { error: "Failed to fetch banner", details: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/banners/[id] - Update a banner
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await query("SELECT id FROM promotional_banners WHERE id = ?", [id])
    if (existing.length === 0) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 })
    }

    const updates: string[] = []
    const values: any[] = []

    if (body.image !== undefined) {
      updates.push("image = ?")
      values.push(body.image)
    }
    if (body.title !== undefined) {
      updates.push("title = ?")
      values.push(body.title)
    }
    if (body.link !== undefined) {
      updates.push("link = ?")
      values.push(body.link || null)
    }
    if (body.isActive !== undefined) {
      updates.push("is_active = ?")
      values.push(Boolean(body.isActive))
    }
    if (body.order !== undefined) {
      updates.push("display_order = ?")
      values.push(body.order)
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    values.push(id)
    await query(`UPDATE promotional_banners SET ${updates.join(", ")} WHERE id = ?`, values)

    const rows = await query("SELECT * FROM promotional_banners WHERE id = ?", [id])
    const row: any = rows[0]
    const banner: PromotionalBanner = {
      id: row.id,
      image: row.image || "",
      title: row.title || "",
      link: row.link || undefined,
      isActive: Boolean(row.is_active),
      order: row.display_order || 0,
      createdAt: new Date(row.created_at).toISOString(),
    }

    return NextResponse.json(banner)
  } catch (error: any) {
    console.error("Error updating banner:", error)
    return NextResponse.json(
      { error: "Failed to update banner", details: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/banners/[id] - Delete a banner
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await query("SELECT id FROM promotional_banners WHERE id = ?", [id])
    if (existing.length === 0) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 })
    }

    await query("DELETE FROM promotional_banners WHERE id = ?", [id])

    return NextResponse.json({ message: "Banner deleted successfully" })
  } catch (error: any) {
    console.error("Error deleting banner:", error)
    return NextResponse.json(
      { error: "Failed to delete banner", details: error.message },
      { status: 500 }
    )
  }
}

