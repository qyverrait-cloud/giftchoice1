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

    let sql = `
      SELECT 
        o.id,
        o.session_id,
        o.customer_name,
        o.customer_phone,
        o.customer_email,
        o.total,
        o.status,
        o.created_at,
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
      WHERE 1=1
    `
    const params: any[] = []

    if (status) {
      sql += " AND o.status = ?"
      params.push(status)
    }

    if (phone) {
      sql += " AND o.customer_phone = ?"
      params.push(phone)
    }

    sql += " GROUP BY o.id ORDER BY o.created_at DESC"

    const rows = await query(sql, params)
    
    const orders: Order[] = await Promise.all(rows.map(async (row: any) => {
      // Parse order items
      let items: any[] = []
      if (row.order_items) {
        const itemStrings = row.order_items.split('|||')
        items = itemStrings.map((itemStr: string) => {
          const item = JSON.parse(itemStr)
          // Fetch product details for each item
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

      return {
        id: row.id,
        items: items,
        customerName: row.customer_name,
        customerPhone: row.customer_phone,
        total: parseFloat(row.total),
        status: row.status as "pending" | "confirmed" | "delivered" | "cancelled",
        createdAt: new Date(row.created_at).toISOString(),
      }
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

    // Insert order
    await query(
      `INSERT INTO orders (id, session_id, customer_name, customer_phone, customer_email, total, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        body.sessionId || null,
        body.customerName,
        body.customerPhone,
        body.customerEmail || null,
        parseFloat(body.total),
        "pending",
        now,
      ]
    )

    // Insert order items
    if (body.items && Array.isArray(body.items)) {
      for (const item of body.items) {
        const itemId = uuidv4()
        await query(
          `INSERT INTO order_items (id, order_id, product_id, product_name, quantity, price, selected_size_name)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            itemId,
            id,
            item.product?.id || item.productId,
            item.product?.name || item.productName,
            item.quantity,
            item.product?.price || item.price || 0,
            item.selectedSize?.name || null,
          ]
        )
      }
    }

    // Fetch created order with items
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
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
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

    return NextResponse.json(order, { status: 201 })
  } catch (error: any) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      { error: "Failed to create order", details: error.message },
      { status: 500 }
    )
  }
}

