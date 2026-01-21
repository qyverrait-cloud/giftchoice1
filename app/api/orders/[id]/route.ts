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
    
    // Fetch order with items
    const orderRows = await query(
      `SELECT 
        o.*,
        GROUP_CONCAT(
          JSON_OBJECT(
            'id', oi.id,
            'product_id', oi.product_id,
            'product_name', oi.product_name,
            'quantity', oi.quantity,
            'price', oi.price,
            'selected_size_name', oi.selected_size_name
          ) SEPARATOR '|||'
        ) as order_items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = ?
      GROUP BY o.id`,
      [id]
    )

    if (orderRows.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const row: any = orderRows[0]
    let items: any[] = []
    if (row.order_items) {
      const itemStrings = row.order_items.split('|||')
      items = itemStrings.map((itemStr: string) => {
        const item = JSON.parse(itemStr)
        return {
          product: {
            id: item.product_id,
            name: item.product_name,
            price: parseFloat(item.price),
          },
          quantity: item.quantity,
          selectedSize: item.selected_size_name ? { name: item.selected_size_name, price: 0 } : undefined,
        }
      })
    }

    const order: Order = {
      id: row.id,
      items: items,
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      total: parseFloat(row.total),
      status: row.status as "pending" | "confirmed" | "delivered" | "cancelled",
      createdAt: new Date(row.created_at).toISOString(),
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
    if (body.total !== undefined) {
      updates.push("total = ?")
      values.push(parseFloat(body.total))
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    values.push(id)
    await query(`UPDATE orders SET ${updates.join(", ")} WHERE id = ?`, values)

    // Fetch updated order with items
    const orderRows = await query(
      `SELECT 
        o.*,
        GROUP_CONCAT(
          JSON_OBJECT(
            'id', oi.id,
            'product_id', oi.product_id,
            'product_name', oi.product_name,
            'quantity', oi.quantity,
            'price', oi.price,
            'selected_size_name', oi.selected_size_name
          ) SEPARATOR '|||'
        ) as order_items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = ?
      GROUP BY o.id`,
      [id]
    )

    if (orderRows.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const row: any = orderRows[0]
    let items: any[] = []
    if (row.order_items) {
      const itemStrings = row.order_items.split('|||')
      items = itemStrings.map((itemStr: string) => {
        const item = JSON.parse(itemStr)
        return {
          product: {
            id: item.product_id,
            name: item.product_name,
            price: parseFloat(item.price),
          },
          quantity: item.quantity,
          selectedSize: item.selected_size_name ? { name: item.selected_size_name, price: 0 } : undefined,
        }
      })
    }

    const order: Order = {
      id: row.id,
      items: items,
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      total: parseFloat(row.total),
      status: row.status as "pending" | "confirmed" | "delivered" | "cancelled",
      createdAt: new Date(row.created_at).toISOString(),
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

