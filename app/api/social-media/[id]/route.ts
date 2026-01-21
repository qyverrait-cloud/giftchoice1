import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import type { SocialMediaPost } from "@/lib/types"

// GET /api/social-media/[id] - Get a single social media post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const rows = await query("SELECT * FROM social_media_posts WHERE id = ?", [id])

    if (rows.length === 0) {
      return NextResponse.json({ error: "Social media post not found" }, { status: 404 })
    }

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

    return NextResponse.json(post)
  } catch (error: any) {
    console.error("Error fetching social media post:", error)
    return NextResponse.json(
      { error: "Failed to fetch social media post", details: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/social-media/[id] - Update a social media post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await query("SELECT id FROM social_media_posts WHERE id = ?", [id])
    if (existing.length === 0) {
      return NextResponse.json({ error: "Social media post not found" }, { status: 404 })
    }

    const updates: string[] = []
    const values: any[] = []

    if (body.thumbnail !== undefined) {
      updates.push("thumbnail = ?")
      values.push(body.thumbnail)
    }
    if (body.title !== undefined) {
      updates.push("title = ?")
      values.push(body.title)
    }
    if (body.link !== undefined) {
      updates.push("link = ?")
      values.push(body.link || null)
    }
    if (body.videoLink !== undefined) {
      updates.push("video_link = ?")
      values.push(body.videoLink || null)
    }
    if (body.platform !== undefined) {
      updates.push("platform = ?")
      values.push(body.platform || null)
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
    await query(`UPDATE social_media_posts SET ${updates.join(", ")} WHERE id = ?`, values)

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

    return NextResponse.json(post)
  } catch (error: any) {
    console.error("Error updating social media post:", error)
    return NextResponse.json(
      { error: "Failed to update social media post", details: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/social-media/[id] - Delete a social media post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await query("SELECT id FROM social_media_posts WHERE id = ?", [id])
    if (existing.length === 0) {
      return NextResponse.json({ error: "Social media post not found" }, { status: 404 })
    }

    await query("DELETE FROM social_media_posts WHERE id = ?", [id])

    return NextResponse.json({ message: "Social media post deleted successfully" })
  } catch (error: any) {
    console.error("Error deleting social media post:", error)
    return NextResponse.json(
      { error: "Failed to delete social media post", details: error.message },
      { status: 500 }
    )
  }
}

