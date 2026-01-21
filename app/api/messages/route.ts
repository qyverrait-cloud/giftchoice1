import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { initializeTables } from "@/lib/db/schema"
import type { ContactMessage } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

let tablesInitialized = false

// GET /api/messages - Get all messages
export async function GET(request: NextRequest) {
  try {
    if (!tablesInitialized) {
      await initializeTables()
      tablesInitialized = true
    }

    const searchParams = request.nextUrl.searchParams
    const isRead = searchParams.get("isRead")

    let sql = "SELECT * FROM contact_messages WHERE 1=1"
    const params: any[] = []

    if (isRead !== null) {
      sql += " AND isRead = ?"
      params.push(isRead === "true")
    }

    sql += " ORDER BY createdAt DESC"

    const rows = await query(sql, params)
    
    const messages: ContactMessage[] = rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone || undefined,
      message: row.message,
      isRead: Boolean(row.isRead),
      createdAt: new Date(row.createdAt).toISOString(),
    }))

    return NextResponse.json(messages)
  } catch (error: any) {
    console.error("Error fetching messages:", error)
    return NextResponse.json(
      { error: "Failed to fetch messages", details: error.message },
      { status: 500 }
    )
  }
}

// POST /api/messages - Create a new message
export async function POST(request: NextRequest) {
  try {
    if (!tablesInitialized) {
      await initializeTables()
      tablesInitialized = true
    }

    const body = await request.json()
    const id = uuidv4()
    const now = new Date().toISOString()

    const message: ContactMessage = {
      id,
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message,
      isRead: false,
      createdAt: now,
    }

    await query(
      `INSERT INTO contact_messages (id, name, email, phone, message, isRead, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        message.id,
        message.name,
        message.email,
        message.phone || null,
        message.message,
        message.isRead,
        message.createdAt,
      ]
    )

    return NextResponse.json(message, { status: 201 })
  } catch (error: any) {
    console.error("Error creating message:", error)
    return NextResponse.json(
      { error: "Failed to create message", details: error.message },
      { status: 500 }
    )
  }
}

