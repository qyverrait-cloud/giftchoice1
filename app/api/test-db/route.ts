import { NextResponse } from "next/server"
import { getConnection } from "@/lib/db"
import { initializeTables } from "@/lib/db/schema"

// Test database connection endpoint
// GET /api/test-db
export async function GET() {
  try {
    // Test connection
    const connection = await getConnection()
    const conn = await connection.getConnection()
    
    try {
      // Test query
      await conn.execute("SELECT 1 as test")
      
      // Initialize tables
      await initializeTables()
      
      return NextResponse.json({
        status: "success",
        message: "Database connected successfully and tables initialized",
        timestamp: new Date().toISOString(),
      })
    } finally {
      conn.release()
    }
  } catch (error: any) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to connect to database",
        error: error.message,
        details: process.env.DATABASE_URL
          ? "DATABASE_URL is set (but connection failed)"
          : "DATABASE_URL is not set. Please check your .env.local file",
      },
      { status: 500 }
    )
  }
}

