import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { initializeTables } from "@/lib/db/schema"
import type { PromotionalBanner } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

let tablesInitialized = false

// GET /api/banners - Get all banners
export async function GET() {
  try {
    if (!tablesInitialized) {
      await initializeTables()
      tablesInitialized = true
    }

    const rows = await query(
      "SELECT * FROM promotional_banners ORDER BY display_order ASC, created_at DESC"
    )
    
    const banners: PromotionalBanner[] = rows.map((row: any) => ({
      id: row.id,
      image: row.image || "",
      title: row.title || "",
      link: row.link || undefined,
      isActive: Boolean(row.is_active),
      order: row.display_order || 0,
      createdAt: new Date(row.created_at).toISOString(),
    }))

    return NextResponse.json(banners)
  } catch (error: any) {
    console.error("Error fetching banners:", error)
    return NextResponse.json(
      { error: "Failed to fetch banners", details: error.message },
      { status: 500 }
    )
  }
}

// POST /api/banners - Create a new banner
export async function POST(request: NextRequest) {
  try {
    if (!tablesInitialized) {
      await initializeTables()
      tablesInitialized = true
    }

    const body = await request.json()
    const id = uuidv4()

    await query(
      `INSERT INTO promotional_banners (id, image, title, link, is_active, display_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id,
        body.image || "",
        body.title || "",
        body.link || null,
        body.isActive !== undefined ? Boolean(body.isActive) : true,
        body.order || 0,
      ]
    )

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

    return NextResponse.json(banner, { status: 201 })
  } catch (error: any) {
    console.error("Error creating banner:", error)
    return NextResponse.json(
      { error: "Failed to create banner", details: error.message },
      { status: 500 }
    )
  }
}

