import mysql from "mysql2/promise"

// Database configuration from environment variables
// Support both individual variables and DATABASE_URL
const getDbConfig = () => {
  // If DATABASE_URL is provided, parse it
  if (process.env.DATABASE_URL) {
    try {
      // Parse mysql:// URL manually to handle special characters like # in password
      const dbUrl = process.env.DATABASE_URL
      
      // Remove mysql:// prefix
      const withoutProtocol = dbUrl.replace(/^mysql:\/\//, "")
      
      // Find @ to separate credentials from host
      const atIndex = withoutProtocol.lastIndexOf("@")
      if (atIndex === -1) {
        throw new Error("Invalid DATABASE_URL format: missing @")
      }
      
      const credentials = withoutProtocol.substring(0, atIndex)
      const hostAndPath = withoutProtocol.substring(atIndex + 1)
      
      // Split credentials into user and password
      const colonIndex = credentials.indexOf(":")
      const user = colonIndex !== -1 
        ? decodeURIComponent(credentials.substring(0, colonIndex))
        : decodeURIComponent(credentials)
      const password = colonIndex !== -1 
        ? decodeURIComponent(credentials.substring(colonIndex + 1))
        : ""
      
      // Parse host, port, and database
      const [hostPart, ...pathParts] = hostAndPath.split("/")
      const [host, portStr] = hostPart.split(":")
      const port = portStr ? parseInt(portStr) : 3306
      const database = pathParts.join("/").split("?")[0] // Remove query params if any
      
      return {
        host: host || "localhost",
        port: port || 3306,
        user: user,
        password: password,
        database: database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      }
    } catch (error) {
      console.error("Error parsing DATABASE_URL:", error)
      // Fall through to individual variables
    }
  }

  // Fallback to individual environment variables
  return {
    host: process.env.MYSQL_HOST || process.env.DB_HOST || "localhost",
    port: parseInt(process.env.MYSQL_PORT || process.env.DB_PORT || "3306"),
    user: process.env.MYSQL_USER || process.env.DB_USER || "root",
    password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || process.env.DB_NAME || "giftchoice",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  }
}

// Create connection pool
let pool: mysql.Pool | null = null

export const getConnection = async (): Promise<mysql.Pool> => {
  if (!pool) {
    const config = getDbConfig()
    
    // Validate that we have at least host and database
    if (!config.host || !config.database) {
      throw new Error(
        "Database configuration is missing. Please set DATABASE_URL or MYSQL_HOST, MYSQL_DATABASE environment variables."
      )
    }

    pool = mysql.createPool(config)
    
    // Test connection
    try {
      const connection = await pool.getConnection()
      console.log("✅ Database connected successfully")
      connection.release()
    } catch (error) {
      console.error("❌ Database connection failed:", error)
      throw error
    }
  }

  return pool
}

// Helper function to execute queries
export const query = async <T = any>(
  sql: string,
  params?: any[]
): Promise<T[]> => {
  const connection = await getConnection()
  const [rows] = await connection.execute(sql, params || [])
  return rows as T[]
}

// Helper function for transactions
export const transaction = async <T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> => {
  const connection = await getConnection()
  const conn = await connection.getConnection()
  
  await conn.beginTransaction()
  
  try {
    const result = await callback(conn)
    await conn.commit()
    return result
  } catch (error) {
    await conn.rollback()
    throw error
  } finally {
    conn.release()
  }
}

// Close all connections (useful for cleanup)
export const closeConnection = async (): Promise<void> => {
  if (pool) {
    await pool.end()
    pool = null
    console.log("Database connection closed")
  }
}

