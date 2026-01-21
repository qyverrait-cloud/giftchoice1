import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import type { ContactMessage } from "@/lib/types"

// GET /api/messages/[id] - Get a single message
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const rows = await query("SELECT * FROM contact_messages WHERE id = ?", [id])

    if (rows.length === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    const row: any = rows[0]
    const message: ContactMessage = {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone || undefined,
      message: row.message,
      isRead: Boolean(row.is_read),
      createdAt: new Date(row.created_at).toISOString(),
    }

    return NextResponse.json(message)
  } catch (error: any) {
    console.error("Error fetching message:", error)
    return NextResponse.json(
      { error: "Failed to fetch message", details: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/messages/[id] - Update a message (mainly mark as read)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await query("SELECT id FROM contact_messages WHERE id = ?", [id])
    if (existing.length === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    const updates: string[] = []
    const values: any[] = []

    if (body.isRead !== undefined) {
      updates.push("is_read = ?")
      values.push(Boolean(body.isRead))
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    values.push(id)
    await query(`UPDATE contact_messages SET ${updates.join(", ")} WHERE id = ?`, values)

    const rows = await query("SELECT * FROM contact_messages WHERE id = ?", [id])
    const row: any = rows[0]
    const message: ContactMessage = {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone || undefined,
      message: row.message,
      isRead: Boolean(row.is_read),
      createdAt: new Date(row.created_at).toISOString(),
    }

    return NextResponse.json(message)
  } catch (error: any) {
    console.error("Error updating message:", error)
    return NextResponse.json(
      { error: "Failed to update message", details: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/messages/[id] - Delete a message
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await query("SELECT id FROM contact_messages WHERE id = ?", [id])
    if (existing.length === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    await query("DELETE FROM contact_messages WHERE id = ?", [id])

    return NextResponse.json({ message: "Message deleted successfully" })
  } catch (error: any) {
    console.error("Error deleting message:", error)
    return NextResponse.json(
      { error: "Failed to delete message", details: error.message },
      { status: 500 }
    )
  }
}

