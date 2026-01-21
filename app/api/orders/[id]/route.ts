import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import type { Order } from "@/lib/types"

// GET /api/orders/[id] - Get a single order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const rows = await query("SELECT * FROM orders WHERE id = ?", [id])

    if (rows.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const row: any = rows[0]
    const order: Order = {
      id: row.id,
      items: JSON.parse(row.items || "[]"),
      customerName: row.customerName,
      customerPhone: row.customerPhone,
      total: parseFloat(row.total),
      status: row.status as "pending" | "confirmed" | "delivered",
      createdAt: new Date(row.createdAt).toISOString(),
    }

    return NextResponse.json(order)
  } catch (error: any) {
    console.error("Error fetching order:", error)
    return NextResponse.json(
      { error: "Failed to fetch order", details: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/orders/[id] - Update an order (mainly status)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await query("SELECT id FROM orders WHERE id = ?", [id])
    if (existing.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const updates: string[] = []
    const values: any[] = []

    if (body.status !== undefined) {
      updates.push("status = ?")
      values.push(body.status)
    }
    if (body.items !== undefined) {
      updates.push("items = ?")
      values.push(JSON.stringify(body.items))
    }
    if (body.total !== undefined) {
      updates.push("total = ?")
      values.push(parseFloat(body.total))
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    values.push(id)
    await query(`UPDATE orders SET ${updates.join(", ")} WHERE id = ?`, values)

    const rows = await query("SELECT * FROM orders WHERE id = ?", [id])
    const row: any = rows[0]
    const order: Order = {
      id: row.id,
      items: JSON.parse(row.items || "[]"),
      customerName: row.customerName,
      customerPhone: row.customerPhone,
      total: parseFloat(row.total),
      status: row.status as "pending" | "confirmed" | "delivered",
      createdAt: new Date(row.createdAt).toISOString(),
    }

    return NextResponse.json(order)
  } catch (error: any) {
    console.error("Error updating order:", error)
    return NextResponse.json(
      { error: "Failed to update order", details: error.message },
      { status: 500 }
    )
  }
}

