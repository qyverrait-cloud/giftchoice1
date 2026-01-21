import { NextResponse } from "next/server"
import { getConnection } from "@/lib/db"

// Test database connection with detailed error info
export async function GET() {
  try {
    const connection = await getConnection()
    const conn = await connection.getConnection()
    
    try {
      // Test query
      const [rows] = await conn.execute("SELECT 1 as test, DATABASE() as db, USER() as user")
      
      return NextResponse.json({
        status: "success",
        message: "Database connection successful!",
        details: rows,
        config: {
          host: process.env.MYSQL_HOST || "from DATABASE_URL",
          database: process.env.MYSQL_DATABASE || "from DATABASE_URL",
          user: process.env.MYSQL_USER || "from DATABASE_URL",
          // Don't show password in response
        },
      })
    } finally {
      conn.release()
    }
  } catch (error: any) {
    console.error("Connection error details:", error)
    
    // Provide helpful error messages
    let errorMessage = error.message || "Unknown error"
    let suggestions: string[] = []
    
    if (errorMessage.includes("Access denied")) {
      suggestions.push("1. Verify username and password in Hostinger panel")
      suggestions.push("2. Reset MySQL password in Hostinger (avoid special characters like #)")
      suggestions.push("3. Check if user has remote access permissions")
      suggestions.push("4. Make sure Remote MySQL access is enabled with % or your IP")
    } else if (errorMessage.includes("ENOTFOUND") || errorMessage.includes("getaddrinfo")) {
      suggestions.push("1. Check MYSQL_HOST in .env.local")
      suggestions.push("2. Verify hostname is correct: srv2145.hstgr.io")
    } else if (errorMessage.includes("ECONNREFUSED")) {
      suggestions.push("1. Check if MySQL server is running")
      suggestions.push("2. Verify port 3306 is open")
    }
    
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: errorMessage,
        suggestions,
        config: {
          host: process.env.MYSQL_HOST || "not set",
          database: process.env.MYSQL_DATABASE || "not set",
          user: process.env.MYSQL_USER || "not set",
          port: process.env.MYSQL_PORT || "3306",
        },
      },
      { status: 500 }
    )
  }
}

