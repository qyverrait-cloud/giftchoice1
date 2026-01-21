import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { initializeTables } from "@/lib/db/schema"
import type { Order } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

let tablesInitialized = false

// GET /api/orders - Get all orders
export async function GET(request: NextRequest) {
  try {
    if (!tablesInitialized) {
      await initializeTables()
      tablesInitialized = true
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const phone = searchParams.get("phone")

    let sql = "SELECT * FROM orders WHERE 1=1"
    const params: any[] = []

    if (status) {
      sql += " AND status = ?"
      params.push(status)
    }

    if (phone) {
      sql += " AND customerPhone = ?"
      params.push(phone)
    }

    sql += " ORDER BY createdAt DESC"

    const rows = await query(sql, params)
    
    const orders: Order[] = rows.map((row: any) => ({
      id: row.id,
      items: JSON.parse(row.items || "[]"),
      customerName: row.customerName,
      customerPhone: row.customerPhone,
      total: parseFloat(row.total),
      status: row.status as "pending" | "confirmed" | "delivered",
      createdAt: new Date(row.createdAt).toISOString(),
    }))

    return NextResponse.json(orders)
  } catch (error: any) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders", details: error.message },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    if (!tablesInitialized) {
      await initializeTables()
      tablesInitialized = true
    }

    const body = await request.json()
    const id = uuidv4()
    const now = new Date().toISOString()

    const order: Order = {
      id,
      items: body.items || [],
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      total: parseFloat(body.total),
      status: "pending",
      createdAt: now,
    }

    await query(
      `INSERT INTO orders (id, items, customerName, customerPhone, total, status, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        order.id,
        JSON.stringify(order.items),
        order.customerName,
        order.customerPhone,
        order.total,
        order.status,
        order.createdAt,
      ]
    )

    return NextResponse.json(order, { status: 201 })
  } catch (error: any) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      { error: "Failed to create order", details: error.message },
      { status: 500 }
    )
  }
}

