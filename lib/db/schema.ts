import { query } from "../db"
import type { Product, Category, Order, ContactMessage } from "../types"

// Initialize database tables
export const initializeTables = async () => {
  try {
    const connection = await import("../db").then((m) => m.getConnection())
    const conn = await connection.getConnection()

    try {
      // Products table
      await conn.execute(`
        CREATE TABLE IF NOT EXISTS products (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(500) NOT NULL,
          description TEXT,
          price DECIMAL(10, 2) NOT NULL,
          images JSON,
          category VARCHAR(255),
          subcategory VARCHAR(255),
          sizes JSON,
          badge VARCHAR(100),
          inStock BOOLEAN DEFAULT true,
          isFeatured BOOLEAN DEFAULT false,
          isNewArrival BOOLEAN DEFAULT false,
          isFestival BOOLEAN DEFAULT false,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_category (category),
          INDEX idx_featured (isFeatured),
          INDEX idx_new_arrival (isNewArrival),
          INDEX idx_festival (isFestival)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)

      // Categories table
      await conn.execute(`
        CREATE TABLE IF NOT EXISTS categories (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL UNIQUE,
          image VARCHAR(500),
          subcategories JSON,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_slug (slug)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)

      // Orders table
      await conn.execute(`
        CREATE TABLE IF NOT EXISTS orders (
          id VARCHAR(255) PRIMARY KEY,
          items JSON NOT NULL,
          customerName VARCHAR(255) NOT NULL,
          customerPhone VARCHAR(50) NOT NULL,
          total DECIMAL(10, 2) NOT NULL,
          status ENUM('pending', 'confirmed', 'delivered') DEFAULT 'pending',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_status (status),
          INDEX idx_customer_phone (customerPhone),
          INDEX idx_created (createdAt)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)

      // Contact messages table
      await conn.execute(`
        CREATE TABLE IF NOT EXISTS contact_messages (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(50),
          message TEXT NOT NULL,
          isRead BOOLEAN DEFAULT false,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_is_read (isRead),
          INDEX idx_created (createdAt)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)

      // Social media posts table
      await conn.execute(`
        CREATE TABLE IF NOT EXISTS social_media_posts (
          id VARCHAR(255) PRIMARY KEY,
          thumbnail VARCHAR(500),
          title VARCHAR(500),
          link VARCHAR(500),
          videoLink VARCHAR(500),
          platform ENUM('instagram', 'youtube', 'facebook', 'tiktok'),
          isActive BOOLEAN DEFAULT true,
          \`order\` INT DEFAULT 0,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_active (isActive),
          INDEX idx_order (\`order\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)

      // Promotional banners table
      await conn.execute(`
        CREATE TABLE IF NOT EXISTS promotional_banners (
          id VARCHAR(255) PRIMARY KEY,
          image VARCHAR(500),
          title VARCHAR(500),
          link VARCHAR(500),
          isActive BOOLEAN DEFAULT true,
          \`order\` INT DEFAULT 0,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_active (isActive),
          INDEX idx_order (\`order\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)

      console.log("✅ Database tables initialized successfully")
    } finally {
      conn.release()
    }
  } catch (error) {
    console.error("❌ Error initializing database tables:", error)
    throw error
  }
}

