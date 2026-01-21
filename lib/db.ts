import mysql from "mysql2/promise"

// Database configuration from environment variables
// Support both individual variables and DATABASE_URL
const getDbConfig = () => {
  // If DATABASE_URL is provided, parse it
  if (process.env.DATABASE_URL) {
    try {
      const url = new URL(process.env.DATABASE_URL)
      return {
        host: url.hostname,
        port: parseInt(url.port) || 3306,
        user: url.username,
        password: url.password,
        database: url.pathname.slice(1), // Remove leading /
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      }
    } catch (error) {
      console.error("Error parsing DATABASE_URL:", error)
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

