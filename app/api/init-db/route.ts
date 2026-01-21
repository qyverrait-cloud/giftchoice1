import { NextResponse } from "next/server"
import { getConnection, query } from "@/lib/db"
import { initializeTables } from "@/lib/db/schema"

// Initialize database tables
// GET /api/init-db - Create all required tables
export async function GET() {
  try {
    // Test connection first
    const connection = await getConnection()
    const conn = await connection.getConnection()
    
    try {
      // Test query
      await conn.execute("SELECT 1 as test")
      console.log("✅ Database connection successful")
    } catch (error: any) {
      conn.release()
      return NextResponse.json(
        {
          status: "error",
          message: "Failed to connect to database",
          error: error.message,
        },
        { status: 500 }
      )
    } finally {
      conn.release()
    }

    // Initialize all tables
    await initializeTables()
    
    // Verify tables were created
    const tables = await query(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE()"
    )
    
    const tableNames = tables.map((t: any) => t.TABLE_NAME)
    const requiredTables = [
      "products",
      "categories",
      "orders",
      "contact_messages",
      "social_media_posts",
      "promotional_banners",
    ]
    
    const createdTables = requiredTables.filter((t) => tableNames.includes(t))
    const missingTables = requiredTables.filter((t) => !tableNames.includes(t))

    return NextResponse.json({
      status: "success",
      message: "Database initialized successfully",
      tablesCreated: createdTables,
      missingTables: missingTables.length > 0 ? missingTables : undefined,
      allTables: tableNames,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Error initializing database:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to initialize database",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}

