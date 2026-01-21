import { query } from "../db"

// Initialize database tables with proper relationships
export const initializeTables = async () => {
  try {
    const connection = await import("../db").then((m) => m.getConnection())
    const conn = await connection.getConnection()

    try {
      // Admin users table
      await conn.execute(`
        CREATE TABLE IF NOT EXISTS admin_users (
          id VARCHAR(255) PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          phone VARCHAR(50),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_username (username)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)

      // Categories table (must be created first for foreign key)
      await conn.execute(`
        CREATE TABLE IF NOT EXISTS categories (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL UNIQUE,
          image VARCHAR(500),
          subcategories JSON,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_slug (slug),
          INDEX idx_name (name)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)

      // Products table with category_id foreign key
      await conn.execute(`
        CREATE TABLE IF NOT EXISTS products (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(500) NOT NULL,
          description TEXT,
          price DECIMAL(10, 2) NOT NULL,
          category_id VARCHAR(255),
          subcategory VARCHAR(255),
          sizes JSON,
          badge VARCHAR(100),
          in_stock BOOLEAN DEFAULT true,
          is_featured BOOLEAN DEFAULT false,
          is_new_arrival BOOLEAN DEFAULT false,
          is_festival BOOLEAN DEFAULT false,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_category_id (category_id),
          INDEX idx_featured (is_featured),
          INDEX idx_new_arrival (is_new_arrival),
          INDEX idx_festival (is_festival),
          INDEX idx_in_stock (in_stock),
          INDEX idx_name (name),
          FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)

      // Product images table (separate table for multiple images)
      await conn.execute(`
        CREATE TABLE IF NOT EXISTS product_images (
          id VARCHAR(255) PRIMARY KEY,
          product_id VARCHAR(255) NOT NULL,
          image_url VARCHAR(500) NOT NULL,
          display_order INT DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_product_id (product_id),
          INDEX idx_display_order (display_order),
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)

      // Sessions table for cart management (session-based carts)
      await conn.execute(`
        CREATE TABLE IF NOT EXISTS sessions (
          id VARCHAR(255) PRIMARY KEY,
          user_id VARCHAR(255),
          data JSON,
          expires_at DATETIME NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_user_id (user_id),
          INDEX idx_expires_at (expires_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)

      // Cart items table (session-based)
      await conn.execute(`
        CREATE TABLE IF NOT EXISTS cart_items (
          id VARCHAR(255) PRIMARY KEY,
          session_id VARCHAR(255) NOT NULL,
          product_id VARCHAR(255) NOT NULL,
          quantity INT NOT NULL DEFAULT 1,
          selected_size_name VARCHAR(100),
          selected_size_price DECIMAL(10, 2),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_session_id (session_id),
          INDEX idx_product_id (product_id),
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
          FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
          UNIQUE KEY unique_cart_item (session_id, product_id, selected_size_name)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)

      // Orders table
      await conn.execute(`
        CREATE TABLE IF NOT EXISTS orders (
          id VARCHAR(255) PRIMARY KEY,
          session_id VARCHAR(255),
          customer_name VARCHAR(255) NOT NULL,
          customer_phone VARCHAR(50) NOT NULL,
          customer_email VARCHAR(255),
          total DECIMAL(10, 2) NOT NULL,
          status ENUM('pending', 'confirmed', 'delivered', 'cancelled') DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_status (status),
          INDEX idx_customer_phone (customer_phone),
          INDEX idx_created_at (created_at),
          INDEX idx_session_id (session_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)

      // Order items table
      await conn.execute(`
        CREATE TABLE IF NOT EXISTS order_items (
          id VARCHAR(255) PRIMARY KEY,
          order_id VARCHAR(255) NOT NULL,
          product_id VARCHAR(255) NOT NULL,
          product_name VARCHAR(500) NOT NULL,
          quantity INT NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          selected_size_name VARCHAR(100),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_order_id (order_id),
          INDEX idx_product_id (product_id),
          FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
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
          is_read BOOLEAN DEFAULT false,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_is_read (is_read),
          INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)

      // Social media posts table
      await conn.execute(`
        CREATE TABLE IF NOT EXISTS social_media_posts (
          id VARCHAR(255) PRIMARY KEY,
          thumbnail VARCHAR(500),
          title VARCHAR(500),
          link VARCHAR(500),
          video_link VARCHAR(500),
          platform ENUM('instagram', 'youtube', 'facebook', 'tiktok'),
          is_active BOOLEAN DEFAULT true,
          display_order INT DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_is_active (is_active),
          INDEX idx_display_order (display_order)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)

      // Promotional banners table
      await conn.execute(`
        CREATE TABLE IF NOT EXISTS promotional_banners (
          id VARCHAR(255) PRIMARY KEY,
          image VARCHAR(500),
          title VARCHAR(500),
          link VARCHAR(500),
          is_active BOOLEAN DEFAULT true,
          display_order INT DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_is_active (is_active),
          INDEX idx_display_order (display_order)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)

      console.log("✅ Database tables initialized successfully with proper relationships")
    } finally {
      conn.release()
    }
  } catch (error) {
    console.error("❌ Error initializing database tables:", error)
    throw error
  }
}
