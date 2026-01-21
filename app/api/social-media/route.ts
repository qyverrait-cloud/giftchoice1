import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { initializeTables } from "@/lib/db/schema"
import type { SocialMediaPost } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

let tablesInitialized = false

// GET /api/social-media - Get all social media posts
export async function GET() {
  try {
    if (!tablesInitialized) {
      await initializeTables()
      tablesInitialized = true
    }

    const rows = await query(
      "SELECT * FROM social_media_posts ORDER BY display_order ASC, created_at DESC"
    )
    
    const posts: SocialMediaPost[] = rows.map((row: any) => ({
      id: row.id,
      thumbnail: row.thumbnail || "",
      title: row.title || "",
      link: row.link || undefined,
      videoLink: row.video_link || undefined,
      platform: row.platform || undefined,
      isActive: Boolean(row.is_active),
      order: row.display_order || 0,
      createdAt: new Date(row.created_at).toISOString(),
    }))

    return NextResponse.json(posts)
  } catch (error: any) {
    console.error("Error fetching social media posts:", error)
    return NextResponse.json(
      { error: "Failed to fetch social media posts", details: error.message },
      { status: 500 }
    )
  }
}

// POST /api/social-media - Create a new social media post
export async function POST(request: NextRequest) {
  try {
    if (!tablesInitialized) {
      await initializeTables()
      tablesInitialized = true
    }

    const body = await request.json()
    const id = uuidv4()

    await query(
      `INSERT INTO social_media_posts (id, thumbnail, title, link, video_link, platform, is_active, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        body.thumbnail || "",
        body.title || "",
        body.link || null,
        body.videoLink || null,
        body.platform || null,
        body.isActive !== undefined ? Boolean(body.isActive) : true,
        body.order || 0,
      ]
    )

    const rows = await query("SELECT * FROM social_media_posts WHERE id = ?", [id])
    const row: any = rows[0]

    const post: SocialMediaPost = {
      id: row.id,
      thumbnail: row.thumbnail || "",
      title: row.title || "",
      link: row.link || undefined,
      videoLink: row.video_link || undefined,
      platform: row.platform || undefined,
      isActive: Boolean(row.is_active),
      order: row.display_order || 0,
      createdAt: new Date(row.created_at).toISOString(),
    }

    return NextResponse.json(post, { status: 201 })
  } catch (error: any) {
    console.error("Error creating social media post:", error)
    return NextResponse.json(
      { error: "Failed to create social media post", details: error.message },
      { status: 500 }
    )
  }
}

